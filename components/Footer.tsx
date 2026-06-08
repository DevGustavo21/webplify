"use client";
import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{t.footer.built}</p>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {t.footer.crafted}
          <Heart size={13} fill="var(--accent)" stroke="var(--accent)" />
          {t.footer.by}{" "}
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            Gustavo Mejia Fuentes
          </span>
        </p>
      </div>
    </footer>
  );
}
