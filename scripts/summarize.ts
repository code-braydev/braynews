import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { venusConfig } from "@braydev/venus";
import { fetchAllNews } from "../src/lib/rss";
import type { NewsItem } from "../src/config/newsConfig";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SNAPSHOT_PATH = join(ROOT, "src", "data", "news-snapshot.json");

let GEMINI_MODEL = "gemini-3.5-flash";
let GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const BATCH_SIZE = 8;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type Provider = { name: "gemini" | "groq"; apiKey: string; delayMs: number };

class QuotaError extends Error {
  constructor(provider: string) {
    super(`Cuota agotada en ${provider}`);
    this.name = "QuotaError";
  }
}

const loadEnv = () => {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) {
      const value = match[2].replace(/^["']|["']$/g, "").trim();
      if (!(match[1] in process.env)) process.env[match[1]] = value;
    }
  }
};

const readSnapshot = (): { generatedAt?: string; items: NewsItem[] } => {
  if (!existsSync(SNAPSHOT_PATH)) return { items: [] };
  try {
    return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
  } catch {
    return { items: [] };
  }
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SYSTEM_PROMPT =
  "Eres el editor de BrayNews, un portal de noticias en español. " +
  "Para cada noticia escribe contenido ORIGINAL que aporte valor editorial. " +
  "REGLAS: no copies ni parafrasees el extracto de la fuente; escribe con tus palabras; responde solo con JSON.";

const buildPayload = (batch: NewsItem[]) =>
  JSON.stringify(
    batch.map((n, i) => ({ id: i, title: n.title, snippet: n.contentSnippet })),
  );

const OUTPUT_SCHEMA =
  '{"id":number,"resumen":"2 o 3 oraciones que resumen y dan contexto propio","porQueImporta":"1 oración: por qué importa al lector","tags":["3 a 5 palabras clave en minúscula"]}';

type ProviderResult = {
  resumen?: string;
  porQueImporta?: string;
  tags?: string[];
};

const parseProviderResult = (
  text: string,
): Array<{ id?: number; resumen?: string; porQueImporta?: string; tags?: string[] }> | null => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.replace(/```(?:json)?/g, "").trim());
  } catch {
    return null;
  }
  if (Array.isArray(parsed)) return parsed as Array<{ id?: number; resumen?: string; porQueImporta?: string; tags?: string[] }>;
  if (parsed && typeof parsed === "object") {
    const arr = Object.values(parsed as Record<string, unknown>).find((v) =>
      Array.isArray(v),
    );
    if (Array.isArray(arr)) return arr as Array<{ id?: number; resumen?: string; porQueImporta?: string; tags?: string[] }>;
  }
  return null;
};

const estimateTokens = (batch: NewsItem[]) => {
  let tokens = 600;
  for (const n of batch) {
    tokens += Math.ceil((n.title.length + (n.contentSnippet?.length ?? 0)) / 4);
    tokens += 120;
  }
  return tokens;
};

const groqDelayMs = (batch: NewsItem[]) => {
  const safePerMin = 4_500;
  const ms = Math.ceil((estimateTokens(batch) * 60_000) / safePerMin);
  return Math.min(Math.max(ms, 10_000), 120_000);
};

const applyResults = (
  batch: NewsItem[],
  results: Array<ProviderResult | null>,
  merged: NewsItem[],
): { ok: number; fail: number } => {
  let ok = 0;
  let fail = 0;
  results.forEach((r, idx) => {
    if (r?.resumen) {
      const found = merged.find((m) => m.link === batch[idx].link);
      if (found) {
        found.resumen = r.resumen;
        found.porQueImporta = r.porQueImporta;
        found.tags = r.tags;
        ok++;
      }
    } else {
      fail++;
    }
  });
  return { ok, fail };
};

const generateBatchGemini = async (
  provider: Provider,
  batch: NewsItem[],
): Promise<Array<ProviderResult | null>> => {
  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${provider.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: [
                    SYSTEM_PROMPT,
                    "\n\nNOTICIAS:",
                    buildPayload(batch),
                    `\n\nResponde un array JSON con exactamente un objeto por noticia (mismo orden), con este esquema: ${OUTPUT_SCHEMA}`,
                  ].join(""),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      },
    );
  } catch (err) {
    console.error(`[Gemini] Error de red: ${(err as Error).message}`);
    return batch.map(() => null);
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(`[Gemini] HTTP ${res.status}: ${body.slice(0, 200)}`);
    if (res.status === 429 || res.status === 404) {
      throw new QuotaError("gemini");
    }
    return batch.map(() => null);
  }

  const json = (await res.json()) as any;
  const text: string | undefined =
    json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return batch.map(() => null);

  const parsed = parseProviderResult(text);
  if (!parsed) {
    console.error("[Gemini] No se pudo parsear la respuesta JSON");
    return batch.map(() => null);
  }

  return batch.map((_, index) => {
    const match = parsed.find((p) => p.id === index) ?? parsed[index];
    if (!match) return null;
    return {
      resumen: match.resumen?.trim(),
      porQueImporta: match.porQueImporta?.trim(),
      tags: Array.isArray(match.tags)
        ? match.tags.map((t) => t.trim())
        : undefined,
    };
  });
};

const mapResults = (
  batch: NewsItem[],
  parsed: Array<{ id?: number; resumen?: string; porQueImporta?: string; tags?: string[] }>,
): Array<ProviderResult | null> =>
  batch.map((_, index) => {
    const match = parsed.find((p) => p.id === index) ?? parsed[index];
    if (!match) return null;
    return {
      resumen: match.resumen?.trim(),
      porQueImporta: match.porQueImporta?.trim(),
      tags: Array.isArray(match.tags)
        ? match.tags.map((t) => t.trim())
        : undefined,
    };
  });

const generateBatchGroq = async (
  provider: Provider,
  batch: NewsItem[],
): Promise<Array<ProviderResult | null>> => {
  const attempts = 3;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    let res: Response;
    try {
      res = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                "Procesa las siguientes noticias:",
                buildPayload(batch),
                `\nResponde un array JSON con exactamente un objeto por noticia (mismo orden). Esquema por objeto: ${OUTPUT_SCHEMA}`,
              ].join("\n"),
            },
          ],
        }),
      });
    } catch (err) {
      console.error(`[Groq] Error de red: ${(err as Error).message}`);
      return batch.map(() => null);
    }

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Groq] HTTP ${res.status}: ${body.slice(0, 200)}`);
      if (res.status === 429) {
        const isDaily = /tokens per day/i.test(body);
        if (isDaily) throw new QuotaError("groq");
        if (attempt <= attempts) {
          const waitMs = 30_000 * attempt;
          console.log(
            `[Groq] Rate limit temporal. Esperando ${waitMs / 1000}s y reintentando...`,
          );
          await sleep(waitMs);
          continue;
        }
        throw new QuotaError("groq");
      }
      if (res.status === 400) {
        try {
          const failed = (JSON.parse(body) as any)?.error?.failed_generation;
          if (typeof failed === "string") {
            const recovered = parseProviderResult(failed);
            if (recovered) {
              console.log(
                `[Groq] Recuperado JSON del failed_generation (${recovered.length} items).`,
              );
              return mapResults(batch, recovered);
            }
          }
        } catch {
          /* seguir con reintento */
        }
        if (attempt < attempts) {
          console.log(`[Groq] JSON inválido. Reintentando (${attempt}/${attempts - 1})...`);
          await sleep(2_000 * attempt);
          continue;
        }
      }
      return batch.map(() => null);
    }

    const json = (await res.json()) as any;
    const text: string | undefined = json?.choices?.[0]?.message?.content;

    if (!text) return batch.map(() => null);

    const parsed = parseProviderResult(text);
    if (!parsed) {
      if (attempt < attempts) {
        console.log(`[Groq] Respuesta no parseable. Reintentando (${attempt}/${attempts - 1})...`);
        await sleep(2_000 * attempt);
        continue;
      }
      console.error("[Groq] No se pudo parsear la respuesta JSON");
      return batch.map(() => null);
    }

    return mapResults(batch, parsed);
  }

  return batch.map(() => null);
};

const generateBatch = async (
  provider: Provider,
  batch: NewsItem[],
): Promise<Array<ProviderResult | null>> =>
  provider.name === "groq"
    ? generateBatchGroq(provider, batch)
    : generateBatchGemini(provider, batch);

const persist = (items: NewsItem[], label = "") => {
  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
  const capped = items.slice(0, 300);
  writeFileSync(
    SNAPSHOT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), items: capped }, null, 2),
    "utf8",
  );
  if (label) console.log(`[Summarize] Snapshot guardado (${label}): ${capped.length} items.`);
};

const run = async () => {
  loadEnv();

  venusConfig.setGlobalHeaders({
    "User-Agent":
      "Mozilla/5.0 (compatible; BrayNewsBot/1.0; +https://news.braydev.xyz)",
  });

  if (process.env.GEMINI_MODEL) GEMINI_MODEL = process.env.GEMINI_MODEL;
  if (process.env.GROQ_MODEL) GROQ_MODEL = process.env.GROQ_MODEL;

  const providers: Provider[] = [];
  if (process.env.GEMINI_API_KEY) {
    providers.push({ name: "gemini", apiKey: process.env.GEMINI_API_KEY, delayMs: 3_000 });
  }
  if (process.env.GROQ_API_KEY) {
    providers.push({ name: "groq", apiKey: process.env.GROQ_API_KEY, delayMs: 20_000 });
  }

  if (providers.length === 0) {
    console.warn(
      "[Summarize] No GEMINI_API_KEY ni GROQ_API_KEY. Generating snapshot without AI summaries.",
    );
  } else {
    console.log(
      `[Summarize] Proveedores de IA: ${providers.map((p) => p.name).join(" -> ")}`,
    );
  }

  console.time("[Summarize] fetchRSS");
  const fresh = await fetchAllNews();
  console.timeEnd("[Summarize] fetchRSS");
  console.log(`[Summarize] ${fresh.length} noticias frescas obtenidas.`);

  const previous = readSnapshot();
  const now = Date.now();

  const freshByLink = new Map<string, NewsItem>();
  for (const item of fresh) freshByLink.set(item.link, item);

  const prevByLink = new Map<string, NewsItem>();
  for (const item of previous.items) {
    const age = now - new Date(item.pubDate).getTime();
    if (age <= MAX_AGE_MS && !freshByLink.has(item.link)) {
      prevByLink.set(item.link, item);
    }
  }

  const merged = [...freshByLink.values(), ...prevByLink.values()];

  const pending = merged.filter((item) => !item.resumen);
  console.log(
    `[Summarize] ${merged.length} totales, ${pending.length} sin resumen.`,
  );

  let ok = 0;
  let fail = 0;
  let providerIdx = 0;

  if (providers.length > 0 && pending.length > 0) {
    const sorted = [...pending]
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
      )
      .slice(0, 300);

    for (let i = 0; i < sorted.length && providerIdx < providers.length; i += BATCH_SIZE) {
      const batch = sorted.slice(i, i + BATCH_SIZE);
      let results: Array<ProviderResult | null>;

      try {
        results = await generateBatch(providers[providerIdx], batch);
      } catch (err) {
        if (err instanceof QuotaError && providerIdx < providers.length - 1) {
          providerIdx++;
          console.log(
            `[Summarize] ${err.message}. Cambiando a ${providers[providerIdx].name}...`,
          );
          try {
            results = await generateBatch(providers[providerIdx], batch);
          } catch (err2) {
            console.error(
              `[Summarize] ${err2 instanceof QuotaError ? err2.message : String(err2)}. Deteniendo.`,
            );
            break;
          }
        } else {
          console.error(
            `[Summarize] ${err instanceof QuotaError ? err.message : String(err)}. Deteniendo.`,
          );
          break;
        }
      }

      const counts = applyResults(batch, results, merged);
      ok += counts.ok;
      fail += counts.fail;

      console.log(
        `[Summarize] ${Math.min(i + BATCH_SIZE, sorted.length)}/${sorted.length} procesadas (${ok} ok, ${fail} fail).`,
      );
      persist(merged, "progreso parcial");
      if (i + BATCH_SIZE < sorted.length) {
        const provider = providers[providerIdx];
        const delay =
          provider.name === "groq"
            ? groqDelayMs(batch)
            : provider.delayMs;
        await sleep(delay);
      }
    }
  }

  merged.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  const capped = merged.slice(0, 300);
  const snapshot = { generatedAt: new Date().toISOString(), items: capped };

  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(
    `[Summarize] Snapshot escrito en src/data/news-snapshot.json (${capped.length} items).`,
  );
};

run().catch((err) => {
  console.error("[Summarize] Error fatal:", err);
  process.exit(1);
});
