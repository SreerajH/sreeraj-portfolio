"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** How long the loading screen holds: the length of the logo animation. */
const SHOW_MS = 3800;

/**
 * Full-screen intro shown once per page load: the logo animation, small and
 * centred, then a fade into the site. It is in the server HTML, so it covers
 * the page from the first paint rather than flashing in after hydration.
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);

  // Timed rather than tied to the video ending, so a blocked autoplay or a
  // slow download can't hold the visitor on the loader.
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), SHOW_MS);
    return () => window.clearTimeout(timer);
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
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
