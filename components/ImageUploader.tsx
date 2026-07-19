"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { Star, X, ImagePlus, Loader2 } from "lucide-react";
import { uploadItemImageToCloudinary } from "@/lib/api";

const MAX_IMAGES = 7; // 1 cover + up to 6 additional
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageSlot {
  id: string;
  previewUrl: string;
  url: string | null;
  uploading: boolean;
  error: string | null;
}

interface ImageUploaderProps {
  onChange: (urls: string[]) => void;
  error?: string;
  initialUrls?: string[];
}

let slotIdCounter = 0;
function nextSlotId() {
  slotIdCounter += 1;
  return `existing-${slotIdCounter}`;
}

export default function ImageUploader({ onChange, error, initialUrls }: ImageUploaderProps) {
  const [slots, setSlots] = useState<ImageSlot[]>(() =>
    (initialUrls || []).map((url) => ({
      id: nextSlotId(),
      previewUrl: url,
      url,
      uploading: false,
      error: null,
    }))
  );
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip firing onChange on mount when initialUrls are just being
    // loaded in — the parent already knows about them.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const uploadedUrls = slots.filter((s) => s.url).map((s) => s.url as string);
    onChange(uploadedUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  async function addFiles(files: FileList | File[]) {
    const remaining = MAX_IMAGES - slots.length;
    const incoming = Array.from(files).slice(0, remaining);

    for (const file of incoming) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      if (!ALLOWED_TYPES.includes(file.type)) {
        setSlots((s) => [
          ...s,
          { id, previewUrl: "", url: null, uploading: false, error: "Only JPG/PNG/WEBP allowed" },
        ]);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setSlots((s) => [
          ...s,
          { id, previewUrl: "", url: null, uploading: false, error: "Must be under 2MB" },
        ]);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      setSlots((s) => [...s, { id, previewUrl, url: null, uploading: true, error: null }]);

      try {
        const url = await uploadItemImageToCloudinary(file);
        setSlots((s) => s.map((slot) => (slot.id === id ? { ...slot, url, uploading: false } : slot)));
      } catch {
        setSlots((s) =>
          s.map((slot) =>
            slot.id === id ? { ...slot, uploading: false, error: "Upload failed" } : slot
          )
        );
      }
    }
  }

  function removeSlot(id: string) {
    setSlots((s) => s.filter((slot) => slot.id !== id));
  }

  function setCover(id: string) {
    setSlots((s) => {
      const target = s.find((slot) => slot.id === id);
      if (!target) return s;
      return [target, ...s.filter((slot) => slot.id !== id)];
    });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  const canAddMore = slots.length < MAX_IMAGES;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {slots.map((slot, index) => (
          <div
            key={slot.id}
            className="group relative aspect-square overflow-hidden rounded-field border border-border bg-cta-tint/30"
          >
            {slot.previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slot.previewUrl} alt="" className="h-full w-full object-cover" />
            )}

            {slot.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                <Loader2 size={18} className="animate-spin text-white" />
              </div>
            )}

            {slot.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-error/80 p-1 text-center text-[10px] text-white">
                {slot.error}
              </div>
            )}

            {index === 0 && slot.url && (
              <span className="badge badge-primary badge-sm absolute left-1 top-1 gap-1">
                <Star size={10} fill="currentColor" /> Cover
              </span>
            )}

            <button
              type="button"
              onClick={() => removeSlot(slot.id)}
              className="btn btn-circle btn-neutral btn-xs absolute right-1 top-1 opacity-0 shadow-soft transition-standard group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>

            {index !== 0 && slot.url && (
              <button
                type="button"
                onClick={() => setCover(slot.id)}
                className="btn btn-xs absolute bottom-1 left-1 right-1 opacity-0 shadow-soft transition-standard group-hover:opacity-100"
              >
                Set as cover
              </button>
            )}
          </div>
        ))}

        {canAddMore && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-field border-2 border-dashed transition-standard ${
              dragActive ? "border-cta bg-cta-tint/50" : "border-lavender bg-cta-tint/20 hover:bg-cta-tint/40"
            }`}
          >
            <ImagePlus size={20} className="text-cta" />
            <span className="px-2 text-center text-[11px] text-ink-muted">
              {slots.length === 0 ? "Add cover image" : "Add image"}
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />

      <p className="mt-2 text-xs text-ink-faint">
        First image is the cover. Up to {MAX_IMAGES} images, 2MB each (JPG, PNG, WEBP).
      </p>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
