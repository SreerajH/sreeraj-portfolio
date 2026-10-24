"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface PointerProps {
  children: React.ReactNode;
  className?: string;
  /** Shown in the tag that trails the arrow. */
  name: string;
}

/**
 * Swaps the cursor for a collaborator-style arrow with a name tag while the
 * pointer is inside. Mouse only: a tap on a touch screen leaves it alone.
 * Marked `data-hide-cursor` so the site-wide cursor dot steps aside.
 */
export function Pointer({ children, className, name }: PointerProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isInside, setIsInside] = useState(false);

  // Measured on every move rather than once on mount, so the arrow stays
  // under the pointer after the page scrolls or the window resizes.
  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      data-hide-cursor
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        track(e);
        setIsInside(true);
      }}
      onPointerLeave={() => setIsInside(false)}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") track(e);
      }}
      className={cn(
        "relative",
        isInside && "cursor-none [&_*]:cursor-none",
        className,
      )}
    >
      <AnimatePresence>
        {isInside && <FollowPointer x={x} y={y} name={name} />}
      </AnimatePresence>
      {children}
    </div>
  );
}

function FollowPointer({
  x,
  y,
  name,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  name: string;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute z-50 h-4 w-4"
      style={{ top: y, left: x }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-[#0A0A0A] text-accent"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>
      <div className="w-fit whitespace-nowrap rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-[#0A0A0A] shadow-[0_6px_20px_-6px_rgba(200,255,0,0.6)]">
        {name}
      </div>
    </motion.div>
  );
}
