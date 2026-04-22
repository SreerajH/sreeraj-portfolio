"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const GLOW_COLORS: Record<string, string> = {
  lime: "200 255 0",
  orange: "255 160 60",
  green: "130 255 170",
  purple: "180 140 255",
  red: "255 110 110",
  blue: "120 180 255",
};

type Props = React.HTMLAttributes<HTMLDivElement> & {
  glowColor?: keyof typeof GLOW_COLORS | string;
  size?: number;
  customSize?: boolean;
  children: React.ReactNode;
};

export function GlowCard({
  glowColor = "lime",
  size = 380,
  customSize = false,
  className,
  children,
  ...rest
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const rgb = GLOW_COLORS[glowColor as string] ?? GLOW_COLORS.lime;

  const onMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      {...rest}
      style={
        {
          "--glow-rgb": rgb,
          "--glow-size": `${size}px`,
          ...(rest.style ?? {}),
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] transition-colors",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[radial-gradient(var(--glow-size)_circle_at_var(--mx,50%)_var(--my,50%),rgb(var(--glow-rgb)/0.18),transparent_60%)]",
        "hover:before:opacity-100 hover:border-[rgb(var(--glow-rgb)/0.35)]",
        !customSize && "aspect-[16/10]",
        className,
      )}
    >
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
