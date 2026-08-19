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
let GROQ_MODEL = "openai/gpt-oss-20b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const BATCH_SIZE = 5;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const COOLDOWN_RATE_MS = 60_000;
const COOLDOWN_ERROR_MS = 15_000;

type ProviderName = "gemini" | "groq";

type Provider = {
  name: ProviderName;
  apiKey: string;
  delayMs: number;
  cooldownUntil: number;
  quotaExhausted: boolean;
};

class QuotaError extends Error {
  constructor(provider: string) {
    super(`Cuota agotada en ${provider}`);
    this.name = "QuotaError";
  }
}

class RateLimitError extends Error {
  constructor(provider: string) {
    super(`Rate limit en ${provider}`);
    this.name = "RateLimitError";
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
  "Eres el editor jefe y redactor senior de BrayNews, un portal de noticias en español.\n" +
  "Para cada noticia debes producir un análisis periodístico EXTENSO, PROFUNDO, NARRATIVO y 100% ORIGINAL.\n" +
  "PROHIBIDO TAJANTEMENTE: resúmenes perezosos, superficiales o telegráficos de pocas líneas " +
  "(por ejemplo, limitarse a mencionar un marcador, un ganador o un dato suelto en dos frases). " +
  "Ese tipo de salida se considera un error grave y será rechazada.\n" +
  "REGLAS INVIOLABLES:\n" +
  "1) Cada 'resumen' debe ser un texto narrativo de mínimo 120-180 palabras que desarrolle, con hilo conductor y lenguaje editorial: " +
  "el trasfondo y el contexto de la noticia, los detalles y datos clave, y el impacto o las implicaciones para el lector.\n" +
  "2) 'porQueImporta' debe tener 2-3 oraciones elaboradas que expliquen por qué esta noticia es relevante hoy, " +
  "idealmente conectando con el panorama colombiano o global.\n" +
  "3) 'tags' debe incluir 4 a 6 palabras clave en minúscula, relevantes y específicas.\n" +
  "4) No copies ni parafrasees el extracto de la fuente: escribe con tus palabras y aporta valor editorial propio.\n" +
  "Responde SOLO con JSON válido: exactamente un objeto por noticia, en el mismo orden de entrada.";

const buildPayload = (batch: NewsItem[]) =>
  JSON.stringify(
    batch.map((n, i) => ({ id: i, title: n.title, snippet: n.contentSnippet })),
  );

const OUTPUT_SCHEMA =
  '{"id":number,"resumen":"Análisis extenso y narrativo de 120-180+ palabras con trasfondo, detalles e impacto","porQueImporta":"2-3 oraciones elaboradas sobre la relevancia","tags":["4 a 6 palabras clave en minúscula"]}';

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

const providerDelayMs = (batch: NewsItem[]) => {
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
            temperature: 0.8,
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
    if (res.status === 429) {
      if (/quota|QUOTA|RESOURCE_EXHAUSTED|tokens per day/i.test(body)) {
        throw new QuotaError("gemini");
      }
      throw new RateLimitError("gemini");
    }
    if (res.status === 404) {
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

const generateBatchOpenAI = async (
  provider: Provider,
  batch: NewsItem[],
  endpoint: string,
  model: string,
  allowFailedRecovery: boolean,
): Promise<Array<ProviderResult | null>> => {
  const attempts = 3;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.8,
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
      console.error(`[${provider.name}] Error de red: ${(err as Error).message}`);
      return batch.map(() => null);
    }

    if (!res.ok) {
      const body = await res.text();
      console.error(`[${provider.name}] HTTP ${res.status}: ${body.slice(0, 200)}`);
      if (res.status === 429) {
        if (/tokens per day|quota/i.test(body)) {
          throw new QuotaError(provider.name);
        }
        throw new RateLimitError(provider.name);
      }
      if (res.status === 400) {
        try {
          const failed = (JSON.parse(body) as any)?.error?.failed_generation;
          if (typeof failed === "string" && allowFailedRecovery) {
            const recovered = parseProviderResult(failed);
            if (recovered) {
              console.log(
                `[${provider.name}] Recuperado JSON del failed_generation (${recovered.length} items).`,
              );
              return mapResults(batch, recovered);
            }
          }
        } catch {
          /* seguir con reintento */
        }
        if (attempt < attempts) {
          console.log(`[${provider.name}] JSON inválido. Reintentando (${attempt}/${attempts - 1})...`);
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
        console.log(`[${provider.name}] Respuesta no parseable. Reintentando (${attempt}/${attempts - 1})...`);
        await sleep(2_000 * attempt);
        continue;
      }
      console.error(`[${provider.name}] No se pudo parsear la respuesta JSON`);
      return batch.map(() => null);
    }

    return mapResults(batch, parsed);
  }

  return batch.map(() => null);
};

const generateBatch = async (
  provider: Provider,
  batch: NewsItem[],
): Promise<Array<ProviderResult | null>> => {
  switch (provider.name) {
    case "groq":
      return generateBatchOpenAI(provider, batch, GROQ_ENDPOINT, GROQ_MODEL, true);
    default:
      return generateBatchGemini(provider, batch);
  }
};

const loadProviderKeys = (prefix: string): string[] => {
  const keys: string[] = [];
  const csv = process.env[`${prefix}_API_KEYS`]
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  if (csv) keys.push(...csv);
  const single = process.env[`${prefix}_API_KEY`]?.trim();
  if (single) keys.push(single);
  for (let i = 1; i <= 20; i++) {
    const k = process.env[`${prefix}_API_KEY_${i}`]?.trim();
    if (k) keys.push(k);
  }
  return [...new Set(keys)].filter(Boolean);
};

const buildProviders = (): Provider[] => {
  const providers: Provider[] = [];
  for (const apiKey of loadProviderKeys("GEMINI")) {
    providers.push({
      name: "gemini",
      apiKey,
      delayMs: 3_000,
      cooldownUntil: 0,
      quotaExhausted: false,
    });
  }
  for (const apiKey of loadProviderKeys("GROQ")) {
    providers.push({
      name: "groq",
      apiKey,
      delayMs: 20_000,
      cooldownUntil: 0,
      quotaExhausted: false,
    });
  }
  return providers;
};

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

  const providers = buildProviders();

  if (providers.length === 0) {
    console.warn(
      "[Summarize] Sin API keys (GEMINI/GROQ). Generating snapshot without AI summaries.",
    );
  } else {
    const summary = new Map<string, number>();
    for (const p of providers) summary.set(p.name, (summary.get(p.name) ?? 0) + 1);
    console.log(
      `[Summarize] Pool de IA: ${[...summary.entries()]
        .map(([name, count]) => `${name} x${count}`)
        .join(" + ")} (${providers.length} llaves rotativas).`,
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
  let poolIdx = 0;

  if (providers.length > 0 && pending.length > 0) {
    const sorted = [...pending]
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
      )
      .slice(0, 300);

    const nextAvailable = (): Provider | null => {
      const now = Date.now();
      for (let i = 0; i < providers.length; i++) {
        const p = providers[(poolIdx + i) % providers.length];
        if (!p.quotaExhausted && p.cooldownUntil <= now) {
          poolIdx = (poolIdx + i + 1) % providers.length;
          return p;
        }
      }
      return null;
    };

    for (let i = 0; i < sorted.length; i += BATCH_SIZE) {
      const batch = sorted.slice(i, i + BATCH_SIZE);
      let results: Array<ProviderResult | null> | null = null;
      let usedProvider: Provider | null = null;

      while (results === null) {
        const provider = nextAvailable();
        if (!provider) {
          const cooling = providers.filter(
            (p) => !p.quotaExhausted && p.cooldownUntil > Date.now(),
          );
          if (cooling.length > 0) {
            const waitMs = Math.min(...cooling.map((p) => p.cooldownUntil)) - Date.now();
            console.log(
              `[Summarize] Todas las llaves en cooldown. Esperando ${Math.ceil(waitMs / 1000)}s...`,
            );
            await sleep(waitMs);
            continue;
          }
          console.error("[Summarize] Sin proveedores disponibles. Deteniendo.");
          break;
        }

        usedProvider = provider;
        try {
          results = await generateBatch(provider, batch);
        } catch (err) {
          if (err instanceof RateLimitError) {
            provider.cooldownUntil = Date.now() + COOLDOWN_RATE_MS;
            console.log(
              `[Summarize] ${err.message}. Enfriando llave de ${provider.name} 60s y saltando a la siguiente...`,
            );
            continue;
          }
          if (err instanceof QuotaError) {
            provider.quotaExhausted = true;
            console.error(
              `[Summarize] ${err.message}. Proveedor ${provider.name} agotado para esta ejecución.`,
            );
            continue;
          }
          provider.cooldownUntil = Date.now() + COOLDOWN_ERROR_MS;
          console.error(
            `[Summarize] Error inesperado en ${provider.name}: ${String(err)}. Saltando a la siguiente llave...`,
          );
          continue;
        }
      }

      if (results === null) break;

      const counts = applyResults(batch, results, merged);
      ok += counts.ok;
      fail += counts.fail;

      console.log(
        `[Summarize] ${Math.min(i + BATCH_SIZE, sorted.length)}/${sorted.length} procesadas (${ok} ok, ${fail} fail).`,
      );
      persist(merged, "progreso parcial");
      if (i + BATCH_SIZE < sorted.length) {
        const delay = usedProvider
          ? usedProvider.name === "groq"
            ? providerDelayMs(batch)
            : usedProvider.delayMs
          : 3_000;
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
