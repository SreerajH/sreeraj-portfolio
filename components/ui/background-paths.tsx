"use client";

import { motion } from "framer-motion";

function Path({ d, delay, opacity }: { d: string; delay: number; opacity: number }) {
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth="0.5"
      strokeOpacity={opacity}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{
        pathLength: { duration: 3.5, delay, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 1.2, delay },
      }}
    />
  );
}

export function BackgroundPaths({ className = "" }: { className?: string }) {
  const paths = Array.from({ length: 28 }).map((_, i) => {
    const y = 60 + i * 14;
    const k = i * 0.6;
    return `M -200 ${y} Q 240 ${y - 120 + k} 720 ${y - 40} T 1640 ${y - 80}`;
  });

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden text-[var(--text-muted)] ${className}`}
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {paths.map((d, i) => (
          <Path
            key={i}
            d={d}
            delay={i * 0.05}
            opacity={0.08 + (i % 5) * 0.03}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_90%)]" />
    </div>
  );
}
