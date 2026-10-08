import type { MetadataRoute } from "next";
import { allHosiery } from "@/lib/data";
import { learnArticles } from "@/lib/learnArticles";

const baseUrl = "https://hosierylab.com";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/hosiery", "/learn", "/guide", "/looks", "/mcp", "/account", "/changelog", "/history", "/about/sources", "/privacy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const records = allHosiery.map((item) => ({
    url: `${baseUrl}/hosiery/${item.code.toLowerCase()}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const articles = learnArticles.map((article) => ({
    url: `${baseUrl}/learn/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const englishRecords = allHosiery.map((item) => ({
    url: `${baseUrl}/en/hosiery/${item.code.toLowerCase()}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const englishPages = ["/en", "/en/hosiery", "/en/learn", "/en/guide", "/en/looks", "/en/mcp", "/en/account", "/en/changelog", "/en/history", "/en/about/sources", "/en/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/en" ? 1 : 0.7,
  }));
  return [...pages, ...englishPages, ...articles, ...records, ...englishRecords];
}

