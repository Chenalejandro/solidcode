import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings/", "/subscription/", "/unsubscribe/"],
    },
    sitemap: "https://solidcode.pro/sitemap.xml",
  };
}
