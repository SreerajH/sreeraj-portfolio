"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** How long the loading screen holds: the length of the logo animation. */
const SHOW_MS = 3800;

/** Fast at first, settling in towards the end, the way a real load reads. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2);

/**
 * Full-screen intro shown once per page load: the logo animation, small and
 * centred, with a progress bar counting up to 100%, then a fade into the
 * site. It is in the server HTML, so it covers the page from the first paint
 * rather than flashing in after hydration.
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  // Timed rather than tied to the video ending, so a blocked autoplay or a
  // slow download can't hold the visitor on the loader.
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // The bar and the number are written straight to the DOM each frame;
  // running them through state would re-render the loader 60 times a second.
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (SHOW_MS - 200));
      const pct = Math.round(easeOut(t) * 100);
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      if (countRef.current) countRef.current.textContent = String(pct);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Hold the page still underneath while the loader is up.
  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="site-loader"
          role="status"
          aria-label="Loading"
          // Pure black to match the video's own background, so its edges
          // vanish. Above the navbar (z-40), below the custom cursor (z-100).
          className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            src="/loader.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="w-[min(80vw,420px)]"
          />
          <div className="mt-6 w-[min(64vw,300px)]">
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                ref={barRef}
                className="absolute inset-0 origin-left rounded-full bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
              {/* A light glint that runs along the bar while it fills. */}
              <div className="loader-glint absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
            <p className="mt-3 text-center font-condensed text-2xl tabular-nums text-accent">
              <span ref={countRef}>0</span>%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
