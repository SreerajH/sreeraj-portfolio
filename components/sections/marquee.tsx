"use client";

const WORDS = [
  "FIGMA",
  "NEXT.JS",
  "FRAMER MOTION",
  "TAILWIND",
  "TYPESCRIPT",
  "SHADCN/UI",
  "CLAUDE CODE",
  "UX RESEARCH",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center gap-8">
          <span className="font-serif text-4xl italic text-text md:text-5xl">
            {w}
          </span>
          <span className="text-2xl text-accent">◆</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="Tech stack"
      className="group overflow-hidden border-y border-border-hair py-8"
    >
      <div className="flex [animation:marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        <Row />
        <Row />
        <Row />
      </div>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.3333%);
          }
        }
      `}</style>
    </section>
  );
}
