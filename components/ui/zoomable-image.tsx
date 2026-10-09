"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ZoomableImage — drop-in replacement for next/image that opens a fullscreen
// lightbox on click. The lightbox shows the original file, locks body scroll,
// closes on backdrop click, close button, or Escape. Respects prefers-reduced-
// motion (no scale-fade, just opacity). Used by all 6 product screenshots on
// the landing page so the visitor can read the UI at full resolution.

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  className?: string;
  // Show a small "tap to enlarge" hint badge in the corner. The button is
  // already tappable on touch devices, but the cursor-zoom-in affordance
  // is invisible on mobile — a permanent badge makes the tap target
  // discoverable. Defaults to false; turn it on for the screenshots that
  // are most likely to be opened fullscreen (the library grid, the
  // dashboard, etc.).
  showEnlargeHint?: boolean;
};

export function ZoomableImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
  loading,
  className,
  showEnlargeHint = false,
}: Props) {
  const [open, setOpen] = useState(false);
  // next/image treats `priority` and `loading="lazy"` as mutually exclusive.
  // When priority is set we omit `loading` (Next implies eager). Otherwise
  // we default to lazy.
  const effectiveLoading: "eager" | "lazy" | undefined = priority
    ? undefined
    : (loading ?? "lazy");
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className={
          "group relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-action/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-[inherit] " +
          (className ?? "")
        }
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={effectiveLoading}
          className="block w-full h-auto"
        />
        {showEnlargeHint ? <EnlargeHint /> : null}
      </button>
      <AnimatePresence>
        {open && (
          <Lightbox
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function EnlargeHint() {
  // Small badge in the bottom-right corner of the image. Always visible
  // on mobile (no hover, no cursor change) and on hover/focus on desktop.
  // Uses a magnifier-with-plus glyph so it stays small in the corner.
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-bg/80 text-text/80 ring-1 ring-border backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 transition-opacity"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </span>
  );
}

function Lightbox({
  src,
  alt,
  width,
  height,
  onClose,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.18, ease: "easeOut" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: reduce ? 0.1 : 0.22, ease: "easeOut" }}
        className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
        draggable={false}
      />
    </motion.div>
  );
}
