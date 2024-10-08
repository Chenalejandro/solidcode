import { type MetadataRoute } from "next";

export const dynamic = "error";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://solidcode.pro",
      lastModified: new Date(),
      alternates: {
        languages: {
          es: "https://solidcode.pro/es",
        },
      },
    },
  ];
}
