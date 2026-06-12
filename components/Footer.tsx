"use client";
import { useI18n } from "@/lib/i18n";
import ScrambleText from "./ScrambleText";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--border)",
        marginTop: 80,
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <ScrambleText
          as="p"
          text={t.footer.built}
          style={{ color: "var(--text-muted)", fontSize: 13 }}
        />
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ScrambleText text={t.footer.by} />{" "}
          <a
            href="https://gustavo-mejia-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: "var(--text)",
              textDecoration: "none",
              borderBottom: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderColor =
                "color-mix(in srgb, var(--accent) 45%, transparent)";
            }}
          >
            Gustavo Mejia Fuentes
          </a>
        </p>
      </div>
    </footer>
  );
}
