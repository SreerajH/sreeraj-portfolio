"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Magnetic } from "@/components/layout/magnetic";

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const HEADLINE_WORDS: Array<{ text: string; italic?: boolean }> = [
  { text: "Crafting" },
  { text: "digital", italic: true },
  { text: "experiences", italic: true },
  { text: "that" },
  { text: "feel" },
  { text: "inevitable." },
];

function HeadlineReveal() {
  let globalIndex = 0;

  return (
    <h1
      className="font-serif max-w-[18ch] text-text tracking-tight [hyphens:none] [overflow-wrap:normal] [word-break:normal]"
      style={{
        fontSize: "clamp(3rem, 7.5vw, 8rem)",
        lineHeight: 0.98,
        letterSpacing: "-0.02em",
      }}
    >
      <span className="sr-only">
        {HEADLINE_WORDS.map((w) => w.text).join(" ")}
      </span>
      <span aria-hidden>
        {HEADLINE_WORDS.map((w, wi) => {
          const chars = [...w.text];
          return (
            <span key={wi}>
              <span
                className={`inline-block whitespace-nowrap ${w.italic ? "italic" : ""}`}
              >
                {chars.map((ch, ci) => {
                  const idx = globalIndex++;
                  return (
                    <motion.span
                      key={ci}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: idx * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block"
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
              {wi < HEADLINE_WORDS.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <BackgroundPaths />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-3"
        >
          Sreeraj H
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6"
        >
          UI/UX Designer &amp; Developer · Based in India
        </motion.p>

        <HeadlineReveal />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: HEADLINE_WORDS.join("").length * 0.02,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 max-w-[60ch] text-base leading-[1.65] text-text-muted md:text-lg"
        >
          I design and build websites and apps that convert — with obsessive
          attention to motion, type, and detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToSection("work")}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-[#0A0A0A] transition-transform"
            >
              View work
              <ArrowDown className="h-4 w-4" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2 rounded-full border border-border-hair px-5 py-3 text-sm text-text transition-colors hover:border-text"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.15em] text-text-dim"
      >
        Scroll
      </motion.div>
    </section>
  );
}
