"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type StackTool = {
  name: string;
  /** A Simple Icons path (24x24 viewBox) and its brand colour... */
  path?: string;
  hex?: string;
  /** ...or a two-letter tile, the way Adobe apps are drawn. */
  tile?: { letters: string; bg: string; fg: string };
  /** ...or a full-colour logo image from /public. */
  img?: string;
};

const SIZE = 46; // resting icon diameter, px
const PEAK = 1.5; // scale of the icon under the pointer
const REACH = 130; // px either side the swell spreads

/** Near-black brand colours vanish on the dark page; lift them to off-white. */
function inkFor(hex?: string) {
  if (!hex) return "#EDEDED";
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.3 ? "#EDEDED" : `#${hex}`;
}

function DockIcon({
  tool,
  pointerX,
  hovered,
  onHover,
}: {
  tool: StackTool;
  pointerX: MotionValue<number>;
  hovered: boolean;
  onHover: (on: boolean) => void;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  // Distance from the pointer to this icon's centre drives its size, so the
  // row swells around the pointer like a dock rather than one icon popping.
  const distance = useTransform(pointerX, (x) => {
    const el = ref.current;
    if (!el || x === Infinity) return REACH;
    const r = el.getBoundingClientRect();
    return x - (r.left + r.width / 2);
  });
  const target = useTransform(distance, [-REACH, 0, REACH], [1, PEAK, 1]);
  const scale = useSpring(target, { stiffness: 320, damping: 22, mass: 0.4 });
  const lift = useTransform(scale, [1, PEAK], [0, -10]);

  return (
    <li
      ref={ref}
      className="relative -ml-2"
      style={{ zIndex: hovered ? 20 : 1 }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <AnimatePresence>
        {hovered ? (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-5 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-text px-3 py-1.5 font-condensed text-sm uppercase tracking-wide text-[#0A0A0A]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_1.5px_#0A0A0A]" />
            {tool.name}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <motion.span
        style={{ scale, y: lift, width: SIZE, height: SIZE }}
        className="flex origin-bottom items-center justify-center rounded-full border border-border-hair bg-[#161616] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.9)]"
        // Image logos carry their own alt; drawn ones are labelled here.
        aria-label={tool.img ? undefined : tool.name}
        role={tool.img ? undefined : "img"}
      >
        {tool.img ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny static logo, no optimiser needed
          <img
            src={tool.img}
            alt={tool.name}
            width={24}
            height={24}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-6 w-6 object-contain"
          />
        ) : tool.tile ? (
          <span
            className="flex h-6 min-w-6 items-center justify-center rounded-[5px] px-0.5 text-[0.62rem] font-bold leading-none"
            style={{ background: tool.tile.bg, color: tool.tile.fg }}
          >
            {tool.tile.letters}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true">
            <path d={tool.path} fill={inkFor(tool.hex)} />
          </svg>
        )}
      </motion.span>
    </li>
  );
}

/**
 * A row of tool icons that swells under the pointer, with a pill naming the
 * one you are on. Touch gets the names on tap.
 */
export function StackDock({ tools }: { tools: StackTool[] }) {
  const pointerX = useMotionValue(Infinity);
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <ul
      className="flex flex-wrap items-end gap-y-4 pl-2 pt-10"
      onPointerMove={(e) => pointerX.set(e.clientX)}
      onPointerLeave={() => pointerX.set(Infinity)}
    >
      {tools.map((tool, i) => (
        <DockIcon
          key={tool.name}
          tool={tool}
          pointerX={pointerX}
          hovered={hovered === i}
          onHover={(on) => setHovered((cur) => (on ? i : cur === i ? null : cur))}
        />
      ))}
    </ul>
  );
}
