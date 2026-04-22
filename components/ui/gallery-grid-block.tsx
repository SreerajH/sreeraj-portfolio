"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  items: Item[];
  className?: string;
};

export function GalleryGridBlock({ items, className }: Props) {
  const [open, setOpen] = React.useState<number | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6",
          className,
        )}
      >
        {items.map((item, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: (i % 6) * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative flex items-center justify-center overflow-hidden rounded-xl border border-border-hair"
            style={{ background: "#111111", minHeight: "500px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              style={{ objectFit: "contain", background: "#111111" }}
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-bg/95 to-transparent p-4 text-left text-xs text-text-muted transition-transform duration-300 group-hover:translate-y-0">
                {item.caption}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-6 backdrop-blur-md"
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute right-6 top-6 rounded-full border border-border-hair p-2 text-text hover:bg-bg-elev"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.img
              key={open}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={items[open].src}
              alt={items[open].alt}
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
