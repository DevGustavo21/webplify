import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { I18nProvider } from "@/lib/i18n";
import MotionProvider from "@/components/MotionProvider";
import {
  SEO_KEYWORDS_ALL,
  SEO_KEYWORDS_EN_TEXT,
  SEO_KEYWORDS_ES_TEXT,
} from "@/lib/seo-keywords";
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
const TITLE_ES =
  "Convertidor WebP Gratis | Convierte PNG y JPG Online — Webplify";
const DESCRIPTION_ES =
  "Convierte PNG y JPG a WebP gratis con Webplify. Optimiza y comprime imágenes en tu navegador, sin servidores ni límites. Tus archivos nunca salen de tu dispositivo.";
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
  keywords: SEO_KEYWORDS_ALL,
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
  verification: {
    google: "YSBke5a_qSKB8y0xNuQmHUNLPsH_OfAtz-4Qm1TobdI",
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

// Runs before React hydrates so Spanish users get the correct <title> immediately.
const localeInitScript = `(function(){
var meta={
  en:{title:${JSON.stringify(TITLE)},desc:${JSON.stringify(DESCRIPTION)},kw:${JSON.stringify(SEO_KEYWORDS_EN_TEXT)},lang:"en",locale:"en_US"},
  es:{title:${JSON.stringify(TITLE_ES)},desc:${JSON.stringify(DESCRIPTION_ES)},kw:${JSON.stringify(SEO_KEYWORDS_ES_TEXT)},lang:"es",locale:"es_ES"}
};
function upsert(key,val,attr){
  attr=attr||"name";
  var sel=attr+'="'+key+'"';
  var el=document.querySelector("meta["+sel+"]");
  if(!el){el=document.createElement("meta");el.setAttribute(attr,key);document.head.appendChild(el);}
  el.content=val;
}
try{
  var stored=localStorage.getItem("locale");
  var loc=(stored==="en"||stored==="es")?stored:(function(){
    var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
    for(var i=0;i<langs.length;i++){if(langs[i]&&String(langs[i]).toLowerCase().indexOf("es")===0)return"es";}
    return"en";
  })();
  var d=meta[loc];
  document.documentElement.lang=d.lang;
  document.title=d.title;
  var titleEl=document.querySelector("title");
  if(titleEl)titleEl.textContent=d.title;
  upsert("description",d.desc);
  upsert("keywords",d.kw);
  upsert("og:title",d.title,"property");
  upsert("og:description",d.desc,"property");
  upsert("og:locale",d.locale,"property");
  upsert("twitter:title",d.title);
  upsert("twitter:description",d.desc);
}catch(e){}
})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: [
        "Webplify",
        "Webplify Image Converter",
        "Webplify WebP Converter",
        "Convertidor WebP Webplify",
        "Convertidor de imágenes WebP gratis",
      ],
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: ["en", "es"],
      publisher: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage-es`,
      url: SITE_URL,
      name: TITLE_ES,
      description: DESCRIPTION_ES,
      inLanguage: "es",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#app` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: "Gustavo Mejia Fuentes",
      url: "https://gustavo-mejia-portfolio.vercel.app/",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser with Canvas support",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Convert PNG and JPG to WebP",
        "Unlimited batch conversion",
        "Live compression statistics",
        "100% client-side, no uploads",
        "Download all as a ZIP",
        "Convierte PNG y JPG a WebP sin límite",
        "Optimiza y comprime imágenes en el navegador",
        "100% privado, sin subir archivos a servidores",
      ],
      author: { "@id": `${SITE_URL}/#author` },
      inLanguage: ["en", "es"],
    },
  ],
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
      <body className="grain" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Script id="locale-init" strategy="beforeInteractive">
          {localeInitScript}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <I18nProvider>
          <MotionProvider>{children}</MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
