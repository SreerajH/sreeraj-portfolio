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

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none-all");

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest(INTERACTIVE));
    }

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
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
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      >
        <motion.div
          animate={{
            width: hover ? 48 : 12,
            height: hover ? 48 : 12,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </motion.div>
    </>
  );
}
