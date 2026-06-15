import type { MetadataRoute } from "next";

// Required because the app is built with `output: export` (static export).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Webplify — Free WebP Image Converter",
    short_name: "Webplify",
    description:
      "Free online image converter that turns PNG and JPG into optimized WebP right in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5fa",
    theme_color: "#6c4dff",
    lang: "en",
    categories: ["utilities", "productivity", "photo"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
