"use client";
import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Zap, Sun, Moon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Theme = "light" | "dark";

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(16px)",
        background: "color-mix(in srgb, var(--bg) 78%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 35%, transparent)",
            }}
          >
            <Zap size={16} fill="white" strokeWidth={0} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            Webplify
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language switch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 3,
              borderRadius: 11,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
            }}
          >
            {(["en", "es"] as const).map((lng) => {
              const active = mounted && locale === lng;
              return (
                <button
                  key={lng}
                  onClick={() => setLocale(lng)}
                  aria-label={lng === "en" ? "English" : "Español"}
                  aria-pressed={active}
                  style={{
                    minWidth: 34,
                    height: 30,
                    padding: "0 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-heading)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    transition: "all 0.2s ease",
                    background: active
                      ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
                      : "transparent",
                    color: active ? "#fff" : "var(--text-muted)",
                  }}
                >
                  {lng}
                </button>
              );
            })}
          </div>

          {/* Theme toggle */}
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggle}
            aria-label={t.theme}
            title={t.theme}
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--shadow)",
            }}
          >
            {mounted && theme === "dark" ? (
              <Sun size={18} style={{ color: "var(--accent-2)" }} />
            ) : (
              <Moon size={18} style={{ color: "var(--accent)" }} />
            )}
          </m.button>
        </div>
      </div>
    </nav>
  );
}
