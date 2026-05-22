"use client";

import { motion } from "framer-motion";
import { Sparkles, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { QRCodePanel } from "@/components/QRCodePanel";
import { UploadCard } from "@/components/UploadCard";
import { uploadImage } from "@/lib/api";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareHref = useMemo(() => {
    if (!imageUrl) {
      return "";
    }

    return `/share?imageUrl=${encodeURIComponent(imageUrl)}`;
  }, [imageUrl]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setError(null);
    setImageUrl(null);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    let isMounted = true;

    const performUpload = async () => {
      setIsUploading(true);
      setError(null);

      try {
        const uploadedUrl = await uploadImage(selectedFile);
        if (isMounted) {
          setImageUrl(uploadedUrl);
        }
      } catch (uploadError) {
        if (isMounted) {
          const message = uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.";
          setError(message);
          setImageUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsUploading(false);
        }
      }
    };

    void performUpload();

    return () => {
      isMounted = false;
    };
  }, [selectedFile]);

  const handleSelectFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setSelectedFile(file);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="absolute inset-0 bg-radial-glow opacity-85" />
      <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-pulseGlow" />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-5">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-2xl sm:px-5"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-cyan-200/70">Cloudinary QR sharing</p>
            <h1 className="mt-1 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              Upload once, share a QR.
            </h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            Ready
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="glass-panel rounded-[1.75rem] p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Share mode</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">Drop an image and get a QR instantly.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Choose a file, wait for the upload, then copy the share link or QR image. No extra steps.
                </p>
              </div>
              <Sparkles className="mt-1 hidden h-5 w-5 text-cyan-200 sm:block" />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <UploadCard onSelectFile={handleSelectFile} isUploading={isUploading} previewUrl={previewUrl} error={error} />

              {imageUrl ? (
                <div className="flex h-full flex-col gap-3">
                  <QRCodePanel imageUrl={imageUrl} />
                  <a href={shareHref} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                    <Share2 className="h-4 w-4" />
                    Open clean share page
                  </a>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                  Pick an image to generate the QR.
                </div>
            )}
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
