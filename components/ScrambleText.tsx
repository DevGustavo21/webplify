"use client";
import { createElement, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&@$01";

interface ScrambleTextProps {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  /** Higher = slower / longer scramble. Default 1. */
  intensity?: number;
}

interface Cell {
  from: string;
  to: string;
  start: number;
  end: number;
  glyph: string;
}

/**
 * Renders text that "decodes" with a hacker-style scramble whenever the UI
 * language switches. Other text changes (e.g. drag-and-drop prompts) update
 * instantly. Spaces are kept stable so word boundaries don't jump around
 * during the animation.
 */
export default function ScrambleText({
  text,
  as = "span",
  className,
  style,
  intensity = 1,
}: ScrambleTextProps) {
  const { locale } = useI18n();
  const [output, setOutput] = useState(text);
  const prevText = useRef(text);
  const prevLocale = useRef(locale);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevText.current;
    const to = text;
    const localeChanged = prevLocale.current !== locale;
    prevText.current = to;
    prevLocale.current = locale;

    // Only run the scramble when the language actually changed.
    if (!localeChanged || from === to) {
      setOutput(to);
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setOutput(to);
      return;
    }

    const length = Math.max(from.length, to.length);
    const cells: Cell[] = [];
    for (let i = 0; i < length; i++) {
      const start = Math.floor(Math.random() * 16 * intensity);
      const end = start + Math.floor(Math.random() * 16 * intensity) + 8;
      cells.push({
        from: from[i] ?? "",
        to: to[i] ?? "",
        start,
        end,
        glyph: "",
      });
    }

    let frame = 0;
    const tick = () => {
      let out = "";
      let done = 0;
      for (const cell of cells) {
        if (cell.to === " ") {
          out += " ";
          done++;
        } else if (frame >= cell.end) {
          out += cell.to;
          done++;
        } else if (frame >= cell.start) {
          if (!cell.glyph || Math.random() < 0.3) {
            cell.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          out += cell.glyph;
        } else {
          out += cell.from;
        }
      }
      setOutput(out);
      if (done === cells.length) {
        rafRef.current = null;
        return;
      }
      frame++;
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    tick();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, locale, intensity]);

  return createElement(as, { className, style }, output);
}
