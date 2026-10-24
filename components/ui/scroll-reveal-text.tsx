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

export type RevealStyle =
  /** Set in the accent colour. */
  | "accent"
  /** Hand-lettered: the brush script, a touch larger and tilted. */
  | "script"
  /** Each letter in a different colour. */
  | "rainbow";

export type RevealSegment = {
  text: string;
  style?: RevealStyle;
};

const RAINBOW = ["#FF5C5C", "#FFB547", "#C8FF00", "#4FD1FF", "#B98CFF"];

/** A stretch of one word in one style, and where it starts in the passage. */
type Run = { text: string; style?: RevealStyle; start: number };
type Token = { runs: Run[] } | " ";

/**
 * Words and the spaces between them. A word can span several segments
 * (`com{pos}ition`, `Typography,`), so it is built up character by character
 * and only ends at whitespace - never at a change of style.
 */
function tokenize(segments: RevealSegment[]) {
  const tokens: Token[] = [];
  let word: Run[] | null = null;
  let at = 0;
  for (const seg of segments) {
    for (const char of Array.from(seg.text)) {
      if (/\s/.test(char)) {
        if (word) tokens.push({ runs: word });
        word = null;
        if (tokens.at(-1) !== " ") tokens.push(" ");
      } else {
        word ??= [];
        const last = word.at(-1);
        if (last && last.style === seg.style) last.text += char;
        else word.push({ text: char, style: seg.style, start: at });
      }
      at++;
    }
  }
  if (word) tokens.push({ runs: word });
  return { tokens, total: at };
}

const STYLE_CLASS: Record<RevealStyle, string> = {
  accent: "text-accent",
  script:
    "mx-[0.06em] -rotate-3 font-script text-[1.3em] font-normal leading-[0.8] text-text",
  rainbow: "",
};

/** One unit of the reveal: dim at 0.2, fully lit once the scroll passes it. */
function Lit({
  at,
  progress,
  className,
  style,
  children,
}: {
  /** Position in the passage, 0 to 1. */
  at: number;
  progress: MotionValue<number>;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const opacity = useTransform(
    progress,
    [Math.max(0, at - 0.1), Math.min(1, at + 0.05)],
    [0.2, 1],
  );
  // The invisible copy holds the space; the lit one sits on top.
  return (
    <span className={cn("relative inline-block", className)} style={style}>
      <span className="invisible">{children}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

function RunView({
  run,
  total,
  progress,
  reduced,
}: {
  run: Run;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const chars = Array.from(run.text);
  const className = run.style ? STYLE_CLASS[run.style] : undefined;
  const colour = (i: number) =>
    run.style === "rainbow" ? { color: RAINBOW[i % RAINBOW.length] } : undefined;

  // A script word lights up as one piece: split into separate boxes its
  // letters lose their joins and kerning.
  if (run.style === "script") {
    const middle = (run.start + chars.length / 2) / total;
    return reduced ? (
      <span className={cn("inline-block", className)}>{run.text}</span>
    ) : (
      <Lit at={middle} progress={progress} className={className}>
        {run.text}
      </Lit>
    );
  }

  if (reduced) {
    return (
      <span className={className}>
        {chars.map((c, i) => (
          <span key={i} style={colour(i)}>
            {c}
          </span>
        ))}
      </span>
    );
  }

  return chars.map((c, i) => (
    <Lit
      key={i}
      at={(run.start + i) / total}
      progress={progress}
      className={className}
      style={colour(i)}
    >
      {c}
    </Lit>
  ));
}

/**
 * A paragraph that lights up character by character, left to right, as it
 * scrolls into view.
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
  // Starts as the paragraph enters at the bottom of the screen and is fully
  // lit once its last line is 80% of the way down - i.e. before the reader
  // has scrolled the section into place, never half-revealed at rest.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 1", "end 0.8"],
  });
  const reduced = Boolean(useReducedMotion());
  const { tokens, total } = tokenize(segments);

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{segments.map((s) => s.text).join("")}</span>
      {/* Each word is a no-wrap run and the spaces between words are real
          spaces, so lines only ever break between words. */}
      <span aria-hidden="true">
        {tokens.map((token, i) =>
          token === " " ? (
            " "
          ) : (
            <span key={i} className="inline-block whitespace-nowrap">
              {token.runs.map((run) => (
                <RunView
                  key={run.start}
                  run={run}
                  total={total}
                  progress={scrollYProgress}
                  reduced={reduced}
                />
              ))}
            </span>
          ),
        )}
      </span>
    </p>
  );
}
