"use client";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SEO_KEYWORDS_EN_TEXT,
  SEO_KEYWORDS_ES_TEXT,
} from "@/lib/seo-keywords";

export type Locale = "en" | "es";

export interface Dictionary {
  meta: { title: string; description: string; keywords: string };
  hero: {
    badge: string;
    titleA: string;
    highlight: string;
    titleB: string;
    subtitle: string;
  };
  dropzone: {
    idle: string;
    active: string;
    hint: string;
    selectFiles: string;
  };
  converter: {
    youSaved: string;
    smaller: (percent: number) => string;
    images: string;
    original: string;
    webp: string;
    reduction: string;
    clear: string;
    clearAll: string;
    downloadAll: string;
    zipping: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  card: {
    alreadyWebp: string;
    original: string;
    webp: string;
    saves: (size: string) => string;
    gain: (size: string) => string;
    waiting: string;
    converting: string;
    done: string;
    failed: string;
    save: string;
    remove: string;
  };
  footer: { built: string; by: string };
  theme: string;
  quality: {
    label: string;
    hint: string;
    smaller: string;
    sharper: string;
  };
}

const en: Dictionary = {
  meta: {
    title: "Webplify — Free WebP Image Converter | Optimize Images Online",
    description:
      "Webplify is a free online image converter that turns PNG and JPG into optimized WebP right in your browser. No uploads, no servers, 100% private — compress and download images instantly.",
    keywords: SEO_KEYWORDS_EN_TEXT,
  },
  hero: {
    badge:
      "100% in your browser · Zero servers · Your files never leave your device",
    titleA: "Convert images to",
    highlight: "WebP",
    titleB: "instantly",
    subtitle:
      "Drag, drop, done. Upload unlimited PNG/JPG images and get optimized WebP files with live compression stats.",
  },
  dropzone: {
    idle: "Drop images or click to browse",
    active: "Drop your images here",
    hint: "PNG, JPG, JPEG, WEBP · Unlimited images",
    selectFiles: "Select Files",
  },
  converter: {
    youSaved: "You saved",
    smaller: (p) => `−${p}% smaller than the originals`,
    images: "Images",
    original: "Original",
    webp: "WebP",
    reduction: "Reduction",
    clear: "Clear",
    clearAll: "Clear all images",
    downloadAll: "Download All (.zip)",
    zipping: "Zipping…",
    emptyTitle: "Your converted images appear here",
    emptyDesc:
      "Drop images on the left to start converting them to optimized WebP.",
  },
  card: {
    alreadyWebp: "Already WebP",
    original: "Original",
    webp: "WebP",
    saves: (s) => `saves ${s}`,
    gain: (s) => `+${s}`,
    waiting: "Waiting…",
    converting: "Converting…",
    done: "Done",
    failed: "Failed",
    save: "Save",
    remove: "Remove image",
  },
  footer: {
    built: "Built with Next.js · Canvas API · JSZip · No uploads, no tracking.",
    by: "Made by",
  },
  theme: "Toggle color theme",
  quality: {
    label: "Output quality",
    hint: "Lower quality means smaller files. Changes re-compress your images.",
    smaller: "Smaller",
    sharper: "Sharper",
  },
};

const es: Dictionary = {
  meta: {
    title:
      "Convertidor WebP Gratis | Convierte PNG y JPG Online — Webplify",
    description:
      "Convierte PNG y JPG a WebP gratis con Webplify. Optimiza y comprime imágenes en tu navegador, sin servidores ni límites. Tus archivos nunca salen de tu dispositivo.",
    keywords: SEO_KEYWORDS_ES_TEXT,
  },
  hero: {
    badge:
      "100% en tu navegador · Sin servidores · Tus archivos nunca salen de tu dispositivo",
    titleA: "Convierte imágenes a",
    highlight: "WebP",
    titleB: "al instante",
    subtitle:
      "Arrastra, suelta y listo. Sube imágenes PNG/JPG sin límite y obtén archivos WebP optimizados con estadísticas de compresión en vivo.",
  },
  dropzone: {
    idle: "Suelta imágenes o haz clic para explorar",
    active: "Suelta tus imágenes aquí",
    hint: "PNG, JPG, JPEG, WEBP · Imágenes ilimitadas",
    selectFiles: "Seleccionar archivos",
  },
  converter: {
    youSaved: "Ahorraste",
    smaller: (p) => `−${p}% más pequeñas que las originales`,
    images: "Imágenes",
    original: "Original",
    webp: "WebP",
    reduction: "Reducción",
    clear: "Limpiar",
    clearAll: "Eliminar todas las imágenes",
    downloadAll: "Descargar todo (.zip)",
    zipping: "Comprimiendo…",
    emptyTitle: "Aquí aparecerán tus imágenes convertidas",
    emptyDesc:
      "Suelta imágenes a la izquierda para empezar a convertirlas a WebP optimizado.",
  },
  card: {
    alreadyWebp: "Ya es WebP",
    original: "Original",
    webp: "WebP",
    saves: (s) => `ahorra ${s}`,
    gain: (s) => `+${s}`,
    waiting: "En espera…",
    converting: "Convirtiendo…",
    done: "Listo",
    failed: "Error",
    save: "Guardar",
    remove: "Eliminar imagen",
  },
  footer: {
    built: "Hecho con Next.js · Canvas API · JSZip · Sin subidas, sin rastreo.",
    by: "Hecho por",
  },
  theme: "Cambiar tema de color",
  quality: {
    label: "Calidad de salida",
    hint: "Menor calidad significa archivos más pequeños. Los cambios recomprimen tus imágenes.",
    smaller: "Más liviano",
    sharper: "Más nítido",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, es };

interface I18nValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

const STORAGE_KEY = "locale";

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const isSpanish = langs.some((l) => l?.toLowerCase().startsWith("es"));
  return isSpanish ? "es" : "en";
}

function upsertMeta(
  key: string,
  content: string,
  type: "name" | "property" = "name"
) {
  const selector = `${type}="${key}"`;
  let el = document.querySelector<HTMLMetaElement>(`meta[${selector}]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(type, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function applyLocale(locale: Locale) {
  const dict = dictionaries[locale];
  document.documentElement.lang = locale === "es" ? "es" : "en";
  document.title = dict.meta.title;
  const titleEl = document.querySelector("title");
  if (titleEl) titleEl.textContent = dict.meta.title;
  upsertMeta("description", dict.meta.description);
  upsertMeta("keywords", dict.meta.keywords);
  upsertMeta("og:title", dict.meta.title, "property");
  upsertMeta("og:description", dict.meta.description, "property");
  upsertMeta("og:locale", locale === "es" ? "es_ES" : "en_US", "property");
  upsertMeta("twitter:title", dict.meta.title);
  upsertMeta("twitter:description", dict.meta.description);
}

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "en" || raw === "es") return raw;
  } catch {}
  return detectLocale();
}

/** Keeps document title/meta in sync — Next.js re-applies English metadata after hydration. */
function LocaleMetaSync({ locale }: { locale: Locale }) {
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useLayoutEffect(() => {
    applyLocale(locale);
  }, [locale]);

  useEffect(() => {
    const expected = () => dictionaries[localeRef.current].meta.title;

    const syncIfNeeded = () => {
      if (document.title !== expected()) applyLocale(localeRef.current);
    };

    // Next metadata often wins right after hydration — re-apply once more.
    syncIfNeeded();
    const t1 = window.setTimeout(syncIfNeeded, 0);
    const t2 = window.setTimeout(syncIfNeeded, 50);

    const observer = new MutationObserver(syncIfNeeded);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      observer.disconnect();
    };
  }, [locale]);

  return null;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useLayoutEffect(() => {
    const next = readInitialLocale();
    setLocaleState(next);
    applyLocale(next);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    applyLocale(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      <LocaleMetaSync locale={locale} />
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
