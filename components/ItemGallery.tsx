"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ItemGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const gallery = images.length > 0 ? images : [];

  function next() {
    setActive((i) => (i + 1) % gallery.length);
  }
  function prev() {
    setActive((i) => (i - 1 + gallery.length) % gallery.length);
  }

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-card bg-cta-tint/40">
        <span className="aura-ring" />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="block w-full overflow-hidden rounded-card border border-border bg-cta-tint/30"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gallery[active]}
          alt={title}
          className="aspect-[4/3] w-full object-cover"
        />
      </button>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-field border-2 transition-standard ${
                i === active ? "border-cta" : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="btn btn-circle btn-sm absolute right-4 top-4"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="btn btn-circle btn-sm absolute left-4 top-1/2 -translate-y-1/2"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery[active]}
            alt={title}
            className="max-h-[85vh] max-w-[90vw] rounded-card object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="btn btn-circle btn-sm absolute right-4 top-1/2 -translate-y-1/2"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
