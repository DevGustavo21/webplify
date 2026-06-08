"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "es";

export interface Dictionary {
  meta: { title: string; description: string };
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
  },
  hero: {
    badge:
      "100% in your browser · Zero servers · Your files never leave your device",
    titleA: "Convert images to",
    highlight: "WebP",
    titleB: "instantly",
    subtitle:
      "Drag, drop, done. Upload up to 50 PNG/JPG images and get optimized WebP files with live compression stats.",
  },
  dropzone: {
    idle: "Drop images or click to browse",
    active: "Drop your images here",
    hint: "PNG, JPG, JPEG, WEBP · Up to 50 images",
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
      "Webplify — Convertidor de imágenes WebP gratis | Optimiza imágenes online",
    description:
      "Webplify es un convertidor de imágenes gratuito que transforma PNG y JPG a WebP optimizado directamente en tu navegador. Sin subidas, sin servidores, 100% privado — comprime y descarga imágenes al instante.",
  },
  hero: {
    badge:
      "100% en tu navegador · Sin servidores · Tus archivos nunca salen de tu dispositivo",
    titleA: "Convierte imágenes a",
    highlight: "WebP",
    titleB: "al instante",
    subtitle:
      "Arrastra, suelta y listo. Sube hasta 50 imágenes PNG/JPG y obtén archivos WebP optimizados con estadísticas de compresión en vivo.",
  },
  dropzone: {
    idle: "Suelta imágenes o haz clic para explorar",
    active: "Suelta tus imágenes aquí",
    hint: "PNG, JPG, JPEG, WEBP · Hasta 50 imágenes",
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

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.title = dictionaries[locale].meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", dictionaries[locale].meta.description);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    let stored: Locale | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "en" || raw === "es") stored = raw;
    } catch {}

    const next = stored ?? detectLocale();
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
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
