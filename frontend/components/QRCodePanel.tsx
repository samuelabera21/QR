"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface QRCodePanelProps {
  imageUrl: string | null;
}

export function QRCodePanel({ imageUrl }: QRCodePanelProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const createQrCode = async () => {
      if (!imageUrl) {
        setQrDataUrl(null);
        return;
      }

      setIsGenerating(true);

      try {
        const dataUrl = await QRCode.toDataURL(imageUrl, {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 240,
          color: {
            dark: "#050816",
            light: "#ffffff",
          },
        });

        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      } catch {
        if (isMounted) {
          setQrDataUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    void createQrCode();

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const handleDownload = () => {
    if (!qrDataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "qr-image-sharing.png";
    link.click();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-300/5" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">QR Output</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Your QR is ready instantly
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Scanning this code opens the Cloudinary image directly. No redirect page, no extra steps.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200 sm:block">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center">
          <div className="relative mx-auto flex w-full max-w-[320px] flex-col items-center gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 shadow-glass">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="rounded-[1.5rem] bg-white p-4 shadow-2xl shadow-cyan-500/10">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Generated QR code" className="h-[240px] w-[240px] rounded-2xl" />
              ) : (
                <div className="flex h-[240px] w-[240px] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
                  {isGenerating ? "Generating QR..." : "QR unavailable"}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Scan to open image</p>
              <p className="mt-1 text-xs text-slate-400">Cloudinary secure URL</p>
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-300">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Upload complete</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Copy the image URL, download the QR, or share the code directly with anyone who needs to view the file.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Image URL</p>
              <p className="mt-2 break-all text-sm leading-6 text-slate-100">{imageUrl}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className="glow-button" onClick={handleDownload} disabled={!qrDataUrl}>
                <Download className="h-4 w-4" />
                Download QR
              </button>
              <button type="button" className="ghost-button" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
                {copyState === "copied" ? "Copied" : "Copy image URL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
