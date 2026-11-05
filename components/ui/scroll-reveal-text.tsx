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

/**
 * The visible letters are drawn by CSS (`.glyph::before` reads
 * `data-char`), not text nodes. The passage itself is in the DOM exactly
 * once, as the screen-reader copy in ScrollRevealText, so crawlers and
 * assistive tech read clean text instead of one span per letter.
 */
function glyph(text: string) {
  return { "data-char": text } as const;
}

/** One unit of the reveal: dim at 0.2, fully lit once the scroll passes it. */
function Lit({
  at,
  progress,
  text,
  className,
  style,
}: {
  /** Position in the passage, 0 to 1. */
  at: number;
  progress: MotionValue<number>;
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const opacity = useTransform(
    progress,
    [Math.max(0, at - 0.1), Math.min(1, at + 0.05)],
    [0.2, 1],
  );
  return (
    <motion.span
      {...glyph(text)}
      className={cn("glyph inline-block", className)}
      style={{ ...style, opacity }}
    />
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
      <span {...glyph(run.text)} className={cn("glyph inline-block", className)} />
    ) : (
      <Lit at={middle} progress={progress} text={run.text} className={className} />
    );
  }

  if (reduced) {
    return (
      <span className={className}>
        {chars.map((c, i) => (
          <span key={i} {...glyph(c)} className="glyph" style={colour(i)} />
        ))}
      </span>
    );
  }

  return chars.map((c, i) => (
    <Lit
      key={i}
      at={(run.start + i) / total}
      progress={progress}
      text={c}
      className={className}
      style={colour(i)}
    />
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
      {/* The one real copy of the text. */}
      <span className="sr-only">{segments.map((s) => s.text).join("")}</span>
      {/* The drawn copy: no text nodes, only data-char glyphs. Each word is a
          no-wrap run and the gaps between words are real spaces, so lines
          only ever break between words. */}
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
