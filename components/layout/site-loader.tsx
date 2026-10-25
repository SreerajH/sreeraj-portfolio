"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingLines from "@/components/ui/loading-lines";

/** How long the loading screen holds before it fades away. */
const SHOW_MS = 2000;

/**
 * Full-screen intro shown once per page load: the logo over the Loading
 * lines, then a fade into the site. It is in the server HTML, so it covers
 * the page from the first paint rather than flashing in after hydration.
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);

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
          // Above the navbar (z-40), below the custom cursor (z-100).
          className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/logo.png"
              alt=""
              width={207}
              height={206}
              priority
              className="float-slow h-20 w-20 md:h-24 md:w-24"
            />
          </motion.div>
          <LoadingLines className="mt-6" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
