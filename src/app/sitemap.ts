import type { MetadataRoute } from "next";
import { allHosiery } from "@/lib/data";

const baseUrl = "https://hosierylab.com";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/hosiery", "/compare", "/history", "/about/sources"].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const records = allHosiery.map((item) => ({
    url: `${baseUrl}/hosiery/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...records];
}
