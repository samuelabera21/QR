"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Copy, Download, Share2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import QRCode from "qrcode";

function SharePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageUrl = searchParams.get("imageUrl");
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      router.replace("/");
    }
  }, [imageUrl, router]);

  useEffect(() => {
    let isMounted = true;

    const createQr = async () => {
      if (!imageUrl) {
        setQrDataUrl(null);
        return;
      }

      const dataUrl = await QRCode.toDataURL(imageUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 320,
        color: { dark: "#050816", light: "#ffffff" },
      });

      if (isMounted) {
        setQrDataUrl(dataUrl);
      }
    };

    void createQr();

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  const downloadQr = async () => {
    if (!qrDataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "qr-image-sharing.png";
    link.click();
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <button type="button" onClick={() => router.push("/")} className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              Share view
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-[240px_1fr] sm:items-center">
            <div className="flex items-center justify-center rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR code" className="h-[220px] w-[220px] rounded-2xl bg-white p-2" />
              ) : (
                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-2xl bg-white text-sm text-slate-500">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Ready to scan</p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">Your image link is ready</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">Open the QR below on another phone. It goes straight to the Cloudinary image.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Image URL</p>
                <p className="mt-2 break-all text-sm leading-6 text-slate-100">{imageUrl}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" className="glow-button" onClick={downloadQr}>
                  <Download className="h-4 w-4" />
                  Download QR
                </button>
                <button type="button" className="ghost-button" onClick={copyUrl}>
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy image URL"}
                </button>
              </div>

              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
                Open image directly
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816]" />}>
      <SharePageInner />
    </Suspense>
  );
}
