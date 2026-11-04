"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, [data-cursor='hover']";

function subscribeFineCursor(cb: () => void) {
  const pointer = window.matchMedia("(pointer: fine)");
  const wide = window.matchMedia("(min-width: 1024px)");
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
  pointer.addEventListener("change", cb);
  wide.addEventListener("change", cb);
  motionOk.addEventListener("change", cb);
  return () => {
    pointer.removeEventListener("change", cb);
    wide.removeEventListener("change", cb);
    motionOk.removeEventListener("change", cb);
  };
}

function getFineCursor() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(min-width: 1024px)").matches &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  );
}

export function Cursor() {
  const enabled = useSyncExternalStore(
    subscribeFineCursor,
    getFineCursor,
    () => false,
  );

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });
  const [hover, setHover] = useState(false);
  // Regions with their own cursor (the contact form's name tag) hide the dot.
  const [hidden, setHidden] = useState(false);
  // Over a project (`data-cursor="view"`) the dot opens into a labelled button.
  const [view, setView] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none-all");

    let last: { x: number; y: number } | null = null;

    function read(t: Element | null) {
      setHover(!!t?.closest(INTERACTIVE));
      setHidden(!!t?.closest("[data-hide-cursor]"));
      setView(!!t?.closest("[data-cursor='view']"));
    }

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      last = { x: e.clientX, y: e.clientY };
      read(e.target as Element | null);
    }

    // Scrolling slides the page under a still pointer, so re-check what is
    // beneath it; otherwise the cursor keeps the state of where it last moved.
    function onScroll() {
      if (last) read(document.elementFromPoint(last.x, last.y));
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("cursor-none-all");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <style jsx global>{`
        .cursor-none-all,
        .cursor-none-all * {
          cursor: none !important;
        }
      `}</style>
      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        // The difference blend keeps the dot visible on any background; the
        // labelled state is solid lime instead, so its text stays readable.
        className={`pointer-events-none fixed left-0 top-0 z-[100] ${view ? "" : "mix-blend-difference"}`}
      >
        <motion.div
          animate={{
            width: view ? 96 : hover ? 48 : 12,
            height: view ? 96 : hover ? 48 : 12,
            opacity: hidden ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${view ? "bg-accent" : "bg-white"}`}
        >
          <motion.span
            animate={{ opacity: view ? 1 : 0, scale: view ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
            className="font-condensed text-lg uppercase tracking-wide text-[#0A0A0A]"
          >
            View
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}
