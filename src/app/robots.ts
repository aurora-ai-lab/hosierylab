import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/archive/" },
    sitemap: "https://hosierylab.com/sitemap.xml",
  };
}
