import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const GTM_ID = "GTM-M7TM6J8R";
const SITE_NAME = "Webplify";
const TITLE = "Webplify — Free WebP Image Converter | Optimize Images Online";
const DESCRIPTION =
  "Webplify is a free online image converter that turns PNG and JPG into optimized WebP right in your browser. No uploads, no servers, 100% private — compress and download images instantly.";
// Production origin. Override with NEXT_PUBLIC_SITE_URL when deploying.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webplify.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Webplify",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Gustavo Mejia Fuentes" }],
  creator: "Gustavo Mejia Fuentes",
  publisher: SITE_NAME,
  keywords: [
    "webp converter",
    "convert to webp",
    "png to webp",
    "jpg to webp",
    "image optimizer",
    "compress images",
    "online image converter",
    "free webp converter",
    "browser image converter",
    "optimize images for web",
    "convertidor webp",
    "convertir a webp",
    "optimizar imágenes",
    "comprimir imágenes",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "es-ES": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: DESCRIPTION,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires a modern web browser with Canvas support",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Convert PNG and JPG to WebP",
    "Batch convert up to 50 images",
    "Live compression statistics",
    "100% client-side, no uploads",
    "Download all as a ZIP",
  ],
  author: { "@type": "Person", name: "Gustavo Mejia Fuentes" },
  inLanguage: ["en", "es"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId={GTM_ID} />
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain" suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
