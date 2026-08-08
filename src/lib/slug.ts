import { createHash } from "node:crypto";

const slugify = (title: string): string =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "noticia";

export const slugForItem = (title: string, link: string): string => {
  const hash = createHash("sha1").update(link).digest("hex").slice(0, 6);
  return `${slugify(title)}-${hash}`;
};
