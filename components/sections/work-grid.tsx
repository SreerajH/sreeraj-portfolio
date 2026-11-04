"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { SectionHeading } from "@/components/ui/section-heading";
import TumbleDeckShowcase, {
  type TumbleCard,
} from "@/components/ui/tumble-deck-showcase";
import { projects } from "@/lib/projects";

const NOTE = `${projects.length} selected from 40+ completed projects`;

const DECK_CARDS: TumbleCard[] = projects.map((p) => ({
  title: p.name,
  src: p.thumbnail,
  alt: `${p.name} website`,
  href: p.liveUrl ?? p.caseStudyUrl,
  external: Boolean(p.liveUrl),
  meta: `${p.category} · ${p.year}`,
}));

export function WorkGrid() {
  return (
    <section id="work" className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <SectionHeading kicker="Fresh off the canvas" lead="Selected" highlight="work" />
        <p className="mt-6 text-sm text-text-dim">{NOTE}</p>
      </div>

      {/* Tablet and up: the scroll-driven deck. On a phone the cards get too
          small to read, so phones get the stacked cards below. */}
      <div className="hidden md:block">
        <TumbleDeckShowcase cards={DECK_CARDS} eyebrow="Work" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-14 md:hidden">
        <div className="grid gap-6">
          {projects.map((p) => {
            const href = p.liveUrl ?? p.caseStudyUrl ?? "#";
            const external = Boolean(p.liveUrl);
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="block"
                  data-cursor="view"
                >
                  <GlowCard
                    glowColor={p.glowColor}
                    customSize
                    className="aspect-[16/10] w-full"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent" />

                      <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-white backdrop-blur-md">
                        {p.category}
                      </span>

                      <span className="absolute right-5 top-5 text-[0.65rem] uppercase tracking-[0.15em] text-white/60">
                        {p.year}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                        <div>
                          <h3 className="font-condensed text-3xl uppercase leading-none text-white">
                            {p.name}
                          </h3>
                          <p className="mt-1 max-w-sm text-sm text-white/70">
                            {p.description}
                          </p>
                        </div>
                        <ArrowUpRight className="h-6 w-6 shrink-0 text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:scale-110" />
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
