"use client";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <header
      style={{
        paddingTop: 56,
        paddingBottom: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 14px",
          borderRadius: 20,
          border: "1px solid color-mix(in srgb, var(--accent-3) 30%, transparent)",
          background: "color-mix(in srgb, var(--accent-3) 8%, transparent)",
          color: "var(--accent-3)",
          fontSize: 12,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent-3)",
            boxShadow: "0 0 8px var(--accent-3)",
            flexShrink: 0,
          }}
        />
        {t.hero.badge}
      </div>

      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(34px, 6vw, 60px)",
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 1.08,
          textAlign: "center",
          maxWidth: 720,
        }}
      >
        {t.hero.titleA}{" "}
        <span
          style={{
            background:
              "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t.hero.highlight}
        </span>{" "}
        {t.hero.titleB}
      </h1>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: 16,
          textAlign: "center",
          maxWidth: 480,
          lineHeight: 1.65,
        }}
      >
        {t.hero.subtitle}
      </p>
    </header>
  );
}
