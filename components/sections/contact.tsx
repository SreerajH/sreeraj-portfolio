"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import KineticGrid from "@/components/ui/kinetic-grid";
import { ContactForm } from "@/components/sections/contact-form";
import { Pointer } from "@/components/ui/custom-cursor";
const EMAIL = "hsreeraj4@gmail.com";

// The three ways to reach me, set as big cards along the foot of the section.
const CHANNELS = [
  {
    title: "Resume",
    caption: "Download the PDF",
    href: "/Sreeraj-H-Resume.pdf",
    download: "Sreeraj H Resume.pdf",
  },
  {
    title: "LinkedIn",
    caption: "Say hi, connect",
    href: "https://linkedin.com/in/sreerajh",
    external: true,
  },
  {
    title: "Mail",
    caption: "Write to me directly",
    href: `mailto:${EMAIL}`,
  },
];

export function Contact() {
  // The grid behind turns white while the pointer is on the accent word.
  const [onWord, setOnWord] = useState(false);

  return (
    <section id="contact" className="relative">
      <KineticGrid className="py-28 md:py-36" highlight={onWord}>
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="eyebrow mb-6"
            >
              Ready to build?
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[14ch] font-condensed uppercase leading-[1.08] tracking-[0.01em] text-text"
              style={{ fontSize: "clamp(3.25rem, 6.2vw, 6.75rem)" }}
            >
              Let&apos;s make something{" "}
              <span
                className="text-accent"
                onPointerEnter={() => setOnWord(true)}
                onPointerLeave={() => setOnWord(false)}
              >
                unignorable.
              </span>
            </motion.h2>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Pointer>
              <ContactForm />
            </Pointer>
          </motion.div>
        </div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-24 grid max-w-6xl gap-12 px-6 md:grid-cols-3 md:gap-8"
        >
          {CHANNELS.map((c) => (
            <li key={c.title}>
              <a
                href={c.href}
                download={c.download}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="group block border-t border-white/20 pt-6 transition-colors hover:border-accent"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="font-condensed text-5xl uppercase leading-none text-text transition-colors group-hover:text-accent lg:text-6xl">
                    {c.title}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-text transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0A0A0A]">
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
                <span className="mt-4 block text-sm text-text-muted">{c.caption}</span>
              </a>
            </li>
          ))}
        </motion.ul>
      </KineticGrid>
    </section>
  );
}
