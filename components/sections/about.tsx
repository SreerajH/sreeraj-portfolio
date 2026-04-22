"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Wrench, Coffee } from "lucide-react";

const FACTS = [
  { Icon: MapPin, text: "Bengaluru, India" },
  { Icon: GraduationCap, text: "Google UX Certificate — Completed" },
  { Icon: Wrench, text: "Figma, Next.js, TypeScript" },
  { Icon: Coffee, text: "Cooking · Badminton · Piano" },
];

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow mb-6">About</p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="heading-2 text-text"
          >
            I&apos;m Sreeraj — a designer who{" "}
            <span className="italic text-accent">codes</span>, and a developer
            who <span className="italic text-accent">designs</span>. I&apos;ve
            spent the last year building full-stack products and shipping them
            end-to-end, and designing mobile apps that have shipped real
            features.
          </motion.p>
        </div>

        <div className="flex items-start md:justify-end">
          <ul className="w-full max-w-sm space-y-4 md:mt-2">
            {FACTS.map((f, i) => {
              const Icon = f.Icon;
              return (
                <motion.li
                  key={f.text}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center gap-3 border-b border-border-hair pb-4 text-sm text-text-muted"
                >
                  <Icon className="h-4 w-4 shrink-0 text-accent" />
                  <span>{f.text}</span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
