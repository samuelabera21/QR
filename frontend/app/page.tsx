"use client";

import { motion } from "framer-motion";
import { AlertCircle, Cloud, ShieldCheck, Smartphone } from "lucide-react";
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

  const features = useMemo(
    () => [
      { label: "Instant upload", value: "Auto-sends to Flask + Cloudinary", icon: Cloud },
      { label: "Secure delivery", value: "Returns the Cloudinary secure URL", icon: ShieldCheck },
      { label: "Mobile ready", value: "QR opens the image on any device", icon: Smartphone },
    ],
    [],
  );

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
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-90" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl animate-pulseGlow" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl animate-pulseGlow" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl sm:px-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Cloudinary QR sharing</p>
            <h1 className="mt-2 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Upload once, share everywhere.
            </h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            Backend connected
          </div>
        </motion.header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="glass-panel rounded-[2rem] p-6 sm:p-8"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Overview</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A production-style QR pipeline for image sharing.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Choose an image once, let Flask upload it to Cloudinary, and let the frontend react instantly with a QR code that points straight to the secure image URL.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <Icon className="h-5 w-5 text-cyan-200" />
                      <p className="mt-3 text-sm font-semibold text-white">{feature.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{feature.value}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <UploadCard onSelectFile={handleSelectFile} isUploading={isUploading} previewUrl={previewUrl} error={error} />
          </div>

          <div className="flex flex-col gap-6">
            {imageUrl ? (
              <QRCodePanel imageUrl={imageUrl} />
            ) : (
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="glass-panel rounded-[2rem] p-6 sm:p-8"
              >
                <div className="flex items-start gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">QR appears after upload</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      No generate button is needed. Select an image, wait for the Cloudinary upload to finish, and this area will update automatically.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
                    <p className="mt-2 text-sm text-slate-100">Waiting for an image upload</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Output</p>
                    <p className="mt-2 text-sm text-slate-100">The QR remains hidden until a valid URL exists</p>
                  </div>
                </div>
              </motion.section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
