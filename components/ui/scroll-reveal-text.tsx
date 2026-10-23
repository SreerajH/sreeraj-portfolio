"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type RevealSegment = {
  text: string;
  /** Set in the accent colour. */
  accent?: boolean;
};

type Token = {
  text: string;
  accent: boolean;
  /** Index of the token's first character across the whole passage. */
  start: number;
  space: boolean;
};

/** Words and the runs of space between them, each knowing where it starts. */
function tokenize(segments: RevealSegment[]) {
  const tokens: Token[] = [];
  let at = 0;
  for (const seg of segments) {
    for (const text of seg.text.split(/(\s+)/)) {
      if (!text) continue;
      tokens.push({
        text,
        accent: Boolean(seg.accent),
        start: at,
        space: /^\s+$/.test(text),
      });
      at += Array.from(text).length;
    }
  }
  return { tokens, total: at };
}

function Char({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const at = index / total;
  const opacity = useTransform(
    progress,
    [Math.max(0, at - 0.1), Math.min(1, at + 0.05)],
    [0.2, 1],
  );
  // The invisible copy holds the character's width; the lit one sits on top.
  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

/**
 * A paragraph that lights up character by character, left to right, as it
 * scrolls through the middle of the viewport.
 */
export function ScrollRevealText({
  segments,
  className,
  style,
}: {
  segments: RevealSegment[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const reduced = useReducedMotion();
  const { tokens, total } = tokenize(segments);

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{segments.map((s) => s.text).join("")}</span>
      {/* Each word is a no-wrap run, and the spaces between words are real
          spaces, so lines only ever break between words. */}
      <span aria-hidden="true">
        {tokens.map((token) =>
          token.space ? (
            " "
          ) : (
            <span
              key={token.start}
              className={cn(
                "inline-block whitespace-nowrap",
                token.accent && "text-accent",
              )}
            >
              {reduced
                ? token.text
                : Array.from(token.text).map((char, i) => (
                    <Char
                      key={i}
                      char={char}
                      index={token.start + i}
                      total={total}
                      progress={scrollYProgress}
                    />
                  ))}
            </span>
          ),
        )}
      </span>
    </p>
  );
}
