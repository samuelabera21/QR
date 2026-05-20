"use client";

import { motion } from "framer-motion";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

interface UploadCardProps {
  onSelectFile: (file: File) => void;
  isUploading: boolean;
  previewUrl: string | null;
  error: string | null;
}

const MAX_PREVIEW_LABEL_LENGTH = 42;

export function UploadCard({ onSelectFile, isUploading, previewUrl, error }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }

      onSelectFile(files[0]);
    },
    [onSelectFile],
  );

  const label = useMemo(() => {
    if (!previewUrl) {
      return "Drop an image here or click to browse";
    }

    return "Image selected. Upload starts automatically.";
  }, [previewUrl]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-violet-500/5" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Upload</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Share an image with a QR in one step
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              The moment you choose a file, it is sent to Flask, stored in Cloudinary, and converted into a downloadable QR code.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200 sm:block">
            <UploadCloud className="h-6 w-6" />
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`group relative flex min-h-[240px] w-full flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed px-6 py-8 text-center transition-all duration-300 ${
            isDragging ? "border-cyan-300/80 bg-cyan-300/10 shadow-glow" : "border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/[0.08]"
          }`}
        >
          {previewUrl ? (
            <div className="flex w-full max-w-[520px] flex-col gap-4">
              <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 shadow-glass sm:h-44 sm:w-44">
                <img src={previewUrl} alt="Selected preview" className="h-full w-full object-cover" />
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
                    <Loader2 className="h-9 w-9 animate-spin text-cyan-300" />
                  </div>
                ) : null}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                  {previewUrl.length > MAX_PREVIEW_LABEL_LENGTH ? `${previewUrl.slice(0, MAX_PREVIEW_LABEL_LENGTH)}...` : "Ready for upload"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200 transition-transform duration-300 group-hover:scale-105">
                {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
              </div>
              <div>
                <p className="text-base font-medium text-white">{label}</p>
                <p className="mt-2 text-sm text-slate-400">PNG, JPG, WEBP, GIF and more</p>
              </div>
            </div>
          )}
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            <p>Automatic upload, automatic QR generation.</p>
            {error ? <p className="mt-1 text-rose-300">{error}</p> : null}
          </div>
          <button type="button" className="ghost-button w-full sm:w-auto" onClick={() => inputRef.current?.click()}>
            <UploadCloud className="h-4 w-4" />
            Choose file
          </button>
        </div>
      </div>
    </motion.section>
  );
}
