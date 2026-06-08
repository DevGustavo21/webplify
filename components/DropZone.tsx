"use client";
import { useRef, useState, useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/jpg"];
const ACCEPTED_EXT = [".png", ".jpg", ".jpeg", ".webp"];

function isAccepted(file: File) {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  return ACCEPTED.includes(file.type) || ACCEPTED_EXT.includes(ext);
}

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled: boolean;
}

export default function DropZone({ onFiles, disabled }: DropZoneProps) {
  const { t } = useI18n();
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((rawFiles: File[]) => {
    const valid = rawFiles.filter(isAccepted).slice(0, 50);
    if (valid.length > 0) onFiles(valid);
  }, [onFiles]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`drop-zone-idle relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none ${
        dragging ? "drag-over" : ""
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      style={{
        background: dragging
          ? "color-mix(in srgb, var(--accent) 7%, transparent)"
          : "var(--dropzone-bg)",
        backdropFilter: "blur(20px)",
        boxShadow: "var(--shadow)",
        padding: "clamp(40px, 6vw, 64px) 24px",
      }}
      onClick={() => !disabled && fileRef.current?.click()}
    >
      {/* Animated icon */}
      <motion.div
        animate={dragging ? { scale: 1.2, y: -8 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-5"
      >
        <div
          className="relative"
          style={{
            width: 80,
            height: 80,
            background: "linear-gradient(135deg, rgba(123,97,255,0.2), rgba(0,200,255,0.1))",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: dragging
              ? "0 0 40px rgba(123,97,255,0.3)"
              : "0 0 20px rgba(123,97,255,0.1)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <Upload
            size={36}
            style={{ color: dragging ? "var(--accent-2)" : "var(--accent)" }}
          />
          {/* Corner dots */}
          {[0,1,2,3].map(i => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--accent)",
                top: i < 2 ? -3 : "auto",
                bottom: i >= 2 ? -3 : "auto",
                left: i % 2 === 0 ? -3 : "auto",
                right: i % 2 === 1 ? -3 : "auto",
              }}
              animate={{ opacity: dragging ? 1 : 0.3 }}
            />
          ))}
        </div>

        <div className="text-center">
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            {dragging ? t.dropzone.active : t.dropzone.idle}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            {t.dropzone.hint}
          </p>
        </div>

        {/* Action buttons */}
        <div
          className="flex gap-3 flex-wrap justify-center"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(123,97,255,0.3)",
              background: "rgba(123,97,255,0.1)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(123,97,255,0.2)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,97,255,0.6)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(123,97,255,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,97,255,0.3)";
            }}
          >
            <ImageIcon size={15} /> {t.dropzone.selectFiles}
          </button>
        </div>
      </motion.div>

      {/* Hidden input */}
      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.webp"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
