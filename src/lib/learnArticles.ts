import fs from "node:fs";
import path from "node:path";

export type LearnArticle = {
  title: string;
  slug: string;
  summary: string;
  relatedFilters: string[];
  body: string;
};

const contentDir = path.join(process.cwd(), "content", "learn");

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) return { fields: new Map<string, string>(), body: raw };
  const fields = new Map<string, string>();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (field) fields.set(field[1], field[2].trim());
  }
  return { fields, body: match[2] };
}

function readArticle(fileName: string): LearnArticle {
  const raw = fs.readFileSync(path.join(contentDir, fileName), "utf8");
  const { fields, body: rawBody } = parseFrontmatter(raw);
  const relatedFilters = raw
    .split(/\r?\n/)
    .slice(0, raw.indexOf("---", 4))
    .map((line) => line.match(/^\s+-\s+(.+)$/)?.[1]?.trim())
    .filter((value): value is string => Boolean(value));

  // The source notes contain old internal record IDs. Keep article guidance
  // useful to readers while preventing implementation IDs from leaking into
  // public copy.
  const body = rawBody
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/HL-(?:[AB]\d{6}|\d{3,6})/g, "示例记录")
    .replace(/^#\s+[^\n]+\n+/, "");

  return {
    title: fields.get("title") ?? fileName.replace(/\.md$/, ""),
    slug: fields.get("slug") ?? fileName.replace(/\.md$/, ""),
    summary: fields.get("summary") ?? "",
    relatedFilters,
    body,
  };
}

export const learnArticles: LearnArticle[] = fs
  .readdirSync(contentDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .sort()
  .map(readArticle);

export function getLearnArticle(slug: string) {
  return learnArticles.find((article) => article.slug === slug);
}
