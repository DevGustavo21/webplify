"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DropZone from "./DropZone";
import ImageCard from "./ImageCard";
import { Download, Trash2, Zap, ImageIcon, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ScrambleText from "./ScrambleText";

export interface ConvertedImage {
  id: string;
  file: File;
  originalSize: number;
  convertedSize?: number;
  convertedBlob?: Blob;
  previewUrl?: string;
  status: "pending" | "converting" | "done" | "error";
}

function makeFolderName(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const rand = Math.random().toString(36).slice(2, 6);
  return `webpify-${stamp}-${rand}`;
}

function uniqueName(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot) : "";
  let i = 1;
  let candidate = `${base}-${i}${ext}`;
  while (used.has(candidate)) {
    i += 1;
    candidate = `${base}-${i}${ext}`;
  }
  used.add(candidate);
  return candidate;
}

async function convertToWebP(file: File, quality = 0.85): Promise<{ blob: Blob; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve({ blob, size: blob.size });
          else reject(new Error("Conversion failed"));
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load error")); };
    img.src = url;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function Converter() {
  const { t } = useI18n();
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [converting, setConverting] = useState(false);
  const [zipping, setZipping] = useState(false);
  // Quality is 0.1–1.0 (WebP encoder quality). Default 0.85.
  const [quality, setQuality] = useState(0.85);
  const qualityRef = useRef(quality);
  const imagesRef = useRef<ConvertedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const onFiles = useCallback(async (files: File[]) => {
    const newImages: ConvertedImage[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      originalSize: file.size,
      previewUrl: undefined,
      status: "pending",
    }));

    // Generate previews
    newImages.forEach((img) => {
      const url = URL.createObjectURL(img.file);
      img.previewUrl = url;
    });

    setImages((prev) => [...prev, ...newImages]);
    setConverting(true);

    // Convert one by one
    for (const img of newImages) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: "converting" } : i))
      );

      const isAlreadyWebP =
        img.file.type === "image/webp" ||
        img.file.name.toLowerCase().endsWith(".webp");

      try {
        let blob: Blob;
        let convertedSize: number;

        if (isAlreadyWebP) {
          blob = img.file;
          convertedSize = img.file.size;
        } else {
          const result = await convertToWebP(img.file, qualityRef.current);
          blob = result.blob;
          convertedSize = result.size;
        }

        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, status: "done", convertedBlob: blob, convertedSize }
              : i
          )
        );
      } catch {
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, status: "error" } : i))
        );
      }
    }

    setConverting(false);
  }, []);

  const downloadSingle = (img: ConvertedImage) => {
    if (!img.convertedBlob) return;
    const name = img.file.name.replace(/\.(png|jpg|jpeg)$/i, "") + ".webp";
    saveAs(img.convertedBlob, name);
  };

  const downloadAll = async () => {
    const done = images.filter((i) => i.status === "done" && i.convertedBlob);
    if (done.length === 0) return;
    setZipping(true);

    const zip = new JSZip();

    // When more than 3 images, nest them inside a uniquely-named folder.
    const useFolder = done.length > 3;
    const folderName = useFolder ? makeFolderName() : "";
    const target = useFolder ? zip.folder(folderName)! : zip;

    const usedNames = new Set<string>();
    for (const img of done) {
      const base = img.file.name.replace(/\.(png|jpg|jpeg|webp)$/i, "");
      const name = uniqueName(`${base}.webp`, usedNames);
      target.file(name, img.convertedBlob!);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${useFolder ? folderName : "webpify-converted"}.zip`);
    setZipping(false);
  };

  const clearAll = () => {
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
    setConverting(false);
    setZipping(false);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // Re-compress every non-WebP image with the chosen quality.
  const reconvertAll = useCallback(async (q: number) => {
    const targets = imagesRef.current.filter((i) => {
      const isWebP =
        i.file.type === "image/webp" ||
        i.file.name.toLowerCase().endsWith(".webp");
      return !isWebP;
    });
    if (targets.length === 0) return;

    setConverting(true);
    const ids = new Set(targets.map((t) => t.id));
    setImages((prev) =>
      prev.map((i) => (ids.has(i.id) ? { ...i, status: "converting" } : i))
    );

    for (const img of targets) {
      try {
        const { blob, size } = await convertToWebP(img.file, q);
        setImages((prev) =>
          prev.map((i) =>
            i.id === img.id
              ? { ...i, status: "done", convertedBlob: blob, convertedSize: size }
              : i
          )
        );
      } catch {
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, status: "error" } : i))
        );
      }
    }
    setConverting(false);
  }, []);

  const onQualityInput = (value: number) => {
    setQuality(value);
    qualityRef.current = value;
  };

  const commitQuality = () => {
    if (imagesRef.current.length > 0) reconvertAll(qualityRef.current);
  };

  // Stats
  const done = images.filter((i) => i.status === "done");
  const totalOriginal = done.reduce((s, i) => s + i.originalSize, 0);
  const totalConverted = done.reduce((s, i) => s + (i.convertedSize ?? 0), 0);
  const totalSaving = totalOriginal - totalConverted;
  const totalPercent = totalOriginal > 0 ? Math.round((totalSaving / totalOriginal) * 100) : 0;

  return (
    <div className="converter-layout" style={{ position: "relative", zIndex: 1 }}>
      {/* LEFT: drop zone + savings summary */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <DropZone onFiles={onFiles} disabled={converting} />

        {/* Quality control */}
        <AnimatePresence>
          {images.length > 0 && (
            <m.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SlidersHorizontal size={15} style={{ color: "var(--accent)" }} />
                    <ScrambleText
                      text={t.quality.label}
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--accent)",
                      minWidth: 42,
                      textAlign: "right",
                    }}
                  >
                    {Math.round(quality * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={Math.round(quality * 100)}
                  disabled={converting}
                  onChange={(e) => onQualityInput(Number(e.target.value) / 100)}
                  onPointerUp={commitQuality}
                  onKeyUp={commitQuality}
                  aria-label={t.quality.label}
                  style={{
                    width: "100%",
                    accentColor: "var(--accent)",
                    cursor: converting ? "not-allowed" : "pointer",
                    opacity: converting ? 0.5 : 1,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  <ScrambleText text={t.quality.smaller} />
                  <ScrambleText text={t.quality.sharper} />
                </div>

                <p
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  <ScrambleText text={t.quality.hint} />
                </p>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {done.length > 0 && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: 22,
                borderRadius: 18,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* Headline savings */}
              {totalSaving > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 4,
                    }}
                  >
                    <ScrambleText text={t.converter.youSaved} />
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 32,
                      fontWeight: 700,
                      lineHeight: 1.1,
                      background:
                        "linear-gradient(90deg, var(--accent-3), var(--accent-2))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {formatBytes(totalSaving)}
                  </p>
                  <ScrambleText
                    as="p"
                    text={t.converter.smaller(totalPercent)}
                    style={{ fontSize: 13, color: "var(--accent-3)", fontWeight: 600 }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                }}
              >
                <Stat label={t.converter.images} value={`${done.length}`} color="var(--text)" />
                <Stat label={t.converter.original} value={formatBytes(totalOriginal)} color="var(--text-muted)" />
                <Stat label={t.converter.webp} value={formatBytes(totalConverted)} color="var(--accent-2)" />
                <Stat label={t.converter.reduction} value={`−${totalPercent}%`} color="var(--accent-3)" />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={clearAll}
                  disabled={converting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "11px 16px",
                    borderRadius: 11,
                    border: "1px solid rgba(255,107,107,0.25)",
                    background: "rgba(255,107,107,0.08)",
                    color: "#FF5C5C",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    opacity: converting ? 0.5 : 1,
                  }}
                >
                  <Trash2 size={14} /> <ScrambleText text={t.converter.clear} />
                </m.button>

                <m.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 0 30px color-mix(in srgb, var(--accent) 40%, transparent)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={downloadAll}
                  disabled={zipping || done.length === 0}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "11px 20px",
                    borderRadius: 11,
                    border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)",
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--accent-2) 18%, transparent))",
                    color: "var(--text)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: done.length === 0 ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-heading)",
                    opacity: done.length === 0 ? 0.5 : 1,
                  }}
                >
                  {zipping ? (
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-flex" }}>
                      <Zap size={14} />
                    </span>
                  ) : (
                    <Download size={14} />
                  )}
                  <ScrambleText text={zipping ? t.converter.zipping : t.converter.downloadAll} />
                </m.button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: uploaded images */}
      <div>
        {images.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              {images.length}{" "}
              <ScrambleText text={t.converter.images.toLowerCase()} />
            </p>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearAll}
              disabled={converting || zipping}
              aria-label={t.converter.clearAll}
              title={t.converter.clearAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,107,107,0.25)",
                background: "rgba(255,107,107,0.08)",
                color: "#FF5C5C",
                fontSize: 13,
                fontWeight: 500,
                cursor: converting || zipping ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                opacity: converting || zipping ? 0.5 : 1,
              }}
            >
              <Trash2 size={14} />
              <ScrambleText text={t.converter.clearAll} />
            </m.button>
          </div>
        )}
        {images.length === 0 ? (
          <div
            style={{
              height: "100%",
              minHeight: 280,
              borderRadius: 18,
              border: "1px dashed var(--border)",
              background: "var(--surface)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={22} style={{ color: "var(--accent)" }} />
            </div>
            <ScrambleText
              as="p"
              text={t.converter.emptyTitle}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text)",
              }}
            />
            <ScrambleText
              as="p"
              text={t.converter.emptyDesc}
              style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 280 }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 16,
            }}
          >
            <AnimatePresence>
              {images.map((img, i) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  index={i}
                  onDownload={downloadSingle}
                  onRemove={removeImage}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <ScrambleText
        as="p"
        text={label}
        style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}
      />
      <p style={{ fontSize: 15, fontWeight: 600, color, fontFamily: "var(--font-heading)" }}>{value}</p>
    </div>
  );
}
