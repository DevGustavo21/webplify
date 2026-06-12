import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://webplify.vercel.app";

// Required because the app is built with `output: export` (static export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "en-US": SITE_URL,
          "es-ES": SITE_URL,
          "x-default": SITE_URL,
        },
      },
    },
  ];
}
