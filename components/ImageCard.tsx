"use client";
import { motion } from "framer-motion";
import { CheckCircle, Loader, AlertCircle, Download, X } from "lucide-react";
import { ConvertedImage } from "./Converter";
import { useI18n } from "@/lib/i18n";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

interface ImageCardProps {
  img: ConvertedImage;
  index: number;
  onDownload: (img: ConvertedImage) => void;
  onRemove: (id: string) => void;
}

export default function ImageCard({ img, index, onDownload, onRemove }: ImageCardProps) {
  const { t } = useI18n();
  const saving = img.originalSize - (img.convertedSize ?? 0);
  const percent = img.convertedSize
    ? Math.round((1 - img.convertedSize / img.originalSize) * 100)
    : 0;
  const isGain = percent > 0;
  const alreadyWebP = img.file.type === "image/webp" || img.file.name.toLowerCase().endsWith(".webp");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Delete button */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(img.id)}
        aria-label={t.card.remove}
        title={t.card.remove}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 3,
          width: 28,
          height: 28,
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--surface) 70%, transparent)",
          backdropFilter: "blur(6px)",
          color: "#FF5C5C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={15} />
      </motion.button>

      {/* Image preview */}
      <div style={{ position: "relative", height: 160, background: "var(--surface-2)", overflow: "hidden" }}>
        {img.previewUrl ? (
          <>
            {/* Blurred backdrop fills empty space */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.previewUrl}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(18px) saturate(1.1)",
                transform: "scale(1.15)",
                opacity: 0.45,
              }}
            />
            {/* Full image, never cropped */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.previewUrl}
              alt={img.file.name}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: 8,
              }}
            />
          </>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(123,97,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          </div>
        )}

        {/* Status overlay */}
        {img.status === "converting" && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(6,6,10,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ animation: "spin 1s linear infinite" }}>
              <Loader size={24} style={{ color: "var(--accent)" }} />
            </div>
          </div>
        )}

        {/* Reduction badge */}
        {img.status === "done" && !alreadyWebP && (
          <motion.div
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
            style={{
              position: "absolute", top: 10, right: 10,
              padding: "4px 10px",
              borderRadius: 20,
              background: isGain ? "rgba(0,229,160,0.15)" : "rgba(255,180,0,0.15)",
              border: `1px solid ${isGain ? "rgba(0,229,160,0.3)" : "rgba(255,180,0,0.3)"}`,
              color: isGain ? "var(--accent-3)" : "#FFB400",
              fontFamily: "var(--font-heading)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {isGain ? `−${percent}%` : `+${Math.abs(percent)}%`}
          </motion.div>
        )}

        {/* Already webp badge */}
        {alreadyWebP && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            padding: "4px 10px",
            borderRadius: 20,
            background: "rgba(123,97,255,0.15)",
            border: "1px solid rgba(123,97,255,0.3)",
            color: "var(--accent)",
            fontSize: 11,
            fontWeight: 600,
          }}>
            {t.card.alreadyWebp}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px 16px" }}>
        {/* Filename */}
        <p style={{
          fontFamily: "var(--font-heading)",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: 8,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {img.file.name}
        </p>

        {/* Progress bar */}
        {img.status === "converting" && (
          <div style={{ height: 3, background: "var(--surface-2)", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
            <div className="progress-shimmer" style={{ height: "100%", width: "60%", borderRadius: 2 }} />
          </div>
        )}

        {/* Size stats */}
        {img.status === "done" && !alreadyWebP && (
          <div style={{ marginBottom: 10 }}>
            {/* Progress fill */}
            <div style={{ height: 3, background: "var(--surface-2)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(10, 100 - percent)}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{
                  height: "100%",
                  background: isGain
                    ? "linear-gradient(90deg, var(--accent-3), var(--accent-2))"
                    : "linear-gradient(90deg, #FFB400, #FF6B00)",
                  borderRadius: 2,
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 1 }}>{t.card.original}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{formatBytes(img.originalSize)}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: isGain ? "rgba(0,229,160,0.1)" : "rgba(255,180,0,0.1)",
                  color: isGain ? "var(--accent-3)" : "#FFB400",
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {isGain ? t.card.saves(formatBytes(saving)) : t.card.gain(formatBytes(-saving))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 1 }}>{t.card.webp}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: isGain ? "var(--accent-3)" : "#FFB400" }}>
                  {formatBytes(img.convertedSize!)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {img.status === "pending" && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.card.waiting}</span>
            )}
            {img.status === "converting" && (
              <span style={{ fontSize: 11, color: "var(--accent)" }}>{t.card.converting}</span>
            )}
            {img.status === "done" && (
              <>
                <CheckCircle size={14} style={{ color: "var(--accent-3)" }} />
                <span style={{ fontSize: 11, color: "var(--accent-3)", fontWeight: 500 }}>{t.card.done}</span>
              </>
            )}
            {img.status === "error" && (
              <>
                <AlertCircle size={14} style={{ color: "#FF6B6B" }} />
                <span style={{ fontSize: 11, color: "#FF6B6B" }}>{t.card.failed}</span>
              </>
            )}
          </div>

          {img.status === "done" && img.convertedBlob && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownload(img)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid rgba(123,97,255,0.3)",
                background: "rgba(123,97,255,0.1)",
                color: "var(--text)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              <Download size={12} /> {t.card.save}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
