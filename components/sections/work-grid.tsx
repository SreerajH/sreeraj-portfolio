"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { AnimatedText } from "@/components/ui/animated-underline-text";
import { projects } from "@/lib/projects";

export function WorkGrid() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-4">Work · 2025</p>
            <AnimatedText
              text="Selected Work"
              as="h2"
              className="text-text"
            />
          </div>
          <p className="hidden max-w-xs text-sm text-text-muted md:block">
            A mix of coded web projects and designed mobile apps. Each one
            shipped — or close to it.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((p, i) => {
            const href = p.liveUrl ?? p.caseStudyUrl ?? "#";
            const external = Boolean(p.liveUrl);
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: (i % 2) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="block"
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
                        loading={i < 2 ? "eager" : "lazy"}
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
                          <h3 className="font-serif text-2xl tracking-tight text-white md:text-3xl">
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
