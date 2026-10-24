"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type ColorTheme = "accent" | "mono";

const THEMES: Record<ColorTheme, { bg: string; text: string; border: string }> =
  {
    accent: {
      bg: "bg-accent/[0.06]",
      text: "text-accent",
      border: "border-accent/20",
    },
    mono: {
      bg: "bg-white/[0.03]",
      text: "text-text",
      border: "border-border-hair",
    },
  };

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

export interface Step {
  title: string;
  description: string;
  /** Small line under the title, e.g. the company. */
  place?: string;
  /** Turns `place` into an outbound link. */
  href?: string;
  /** Shown opposite the number, e.g. the date range. */
  date?: string;
  colorTheme?: ColorTheme;
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

interface CardProps extends Step {
  number: string;
  index: number;
  className?: string;
  rotate?: string;
}

const Card = ({
  number,
  title,
  description,
  place,
  href,
  date,
  colorTheme = "accent",
  index,
  className = "",
  rotate = "",
}: CardProps) => {
  const theme = THEMES[colorTheme];

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full transition-[scale] duration-300 hover:z-30 hover:scale-105 lg:w-[300px] ${rotate} ${className}`}
    >
      <div className="rounded-[25px] border border-border-hair bg-bg-elev p-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)]">
        <Pin className={`${theme.text} mx-auto mb-6 h-8 w-8`} />
        <div
          className={`${theme.bg} border ${theme.border} relative flex h-full flex-col overflow-hidden rounded-[15px] p-[18px]`}
        >
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <span
              className={`${theme.text} font-serif text-4xl italic leading-none`}
            >
              {number}
            </span>
            {date ? (
              <span className="text-[0.7rem] uppercase tracking-[0.15em] text-text-muted">
                {date}
              </span>
            ) : null}
          </div>
          <h3 className="font-serif text-2xl leading-tight tracking-tight text-text">
            {title}
          </h3>
          {place ? (
            href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex w-fit items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent"
              >
                {place}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="mt-1.5 text-sm text-text-muted">{place}</p>
            )
          ) : null}
          <p className="mt-3 text-sm/6 text-text-muted">{description}</p>
        </div>
      </div>
    </m.div>
  );
};

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "lg:absolute lg:top-0 lg:left-[15%]", rotate: "lg:rotate-6" },
  {
    className: "lg:absolute lg:top-[120px] lg:right-[15%]",
    rotate: "lg:-rotate-6",
  },
  {
    className: "lg:absolute lg:top-[450px] lg:left-[15%]",
    rotate: "lg:rotate-6",
  },
  {
    className: "lg:absolute lg:top-[570px] lg:right-[10%]",
    rotate: "lg:-rotate-6",
  },
  {
    className: "lg:absolute lg:top-[850px] lg:left-[15%]",
    rotate: "lg:rotate-6",
  },
];

export interface HowItWorksProps {
  features: Step[];
  className?: string;
  stepPositions?: StepPosition[];
  /** Height of the pinned board on large screens, in px. Defaults by card count. */
  height?: number;
}

/**
 * Steps pinned to a lined board, joined by a dashed path that keeps moving.
 * Large screens scatter the cards and tilt them; below that they stack.
 */
export default function HowItWorks({
  features,
  className = "",
  stepPositions,
  height: heightProp,
}: HowItWorksProps) {
  const data = features;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  const height =
    heightProp ??
    (data.length === 1
      ? 400
      : data.length === 2
        ? 450
        : data.length === 3
          ? 800
          : data.length === 4
            ? 900
            : 1130);

  // One curve per gap, between the scattered card positions.
  const pathD = data.reduce((acc, _, index) => {
    if (index >= data.length - 1) return acc;
    if (index === 0) return "M 290 150 C 500 150, 550 270, 710 270";
    if (index === 1) return acc + " C 850 270, 500 350, 290 450";
    if (index === 2) return acc + " C 290 600, 550 720, 750 720";
    if (index === 3) return acc + " C 950 720, 500 800, 290 850";
    return acc;
  }, "");

  return (
    <LazyMotion features={domAnimation}>
      <div className={`relative px-6 pb-10 pt-4 lg:px-8 lg:py-16 ${className}`}>
        {/* Ruled paper, fading out to the page at both sides. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-bg" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-bg" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div
            className="relative mx-auto flex h-auto w-full max-w-md flex-col space-y-8 lg:block lg:h-[var(--lg-height)] lg:max-w-[1000px] lg:space-y-0"
            style={{ "--lg-height": `${height}px` } as React.CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-full lg:block"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <m.path
                  d={pathD}
                  stroke="currentColor"
                  className="text-accent/40"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{
                    strokeDashoffset: -140, // Multiple of 14 (8+6) for a seamless loop
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            )}

            {data.map((step, index) => {
              const position = positions[index % positions.length];
              return (
                <Card
                  key={step.title}
                  {...step}
                  number={String(index + 1).padStart(2, "0")}
                  index={index}
                  rotate={position.rotate}
                  className={position.className}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
