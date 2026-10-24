"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Copy, Mail } from "lucide-react";
import KineticGrid from "@/components/ui/kinetic-grid";
import { Magnetic } from "@/components/layout/magnetic";
import {
  LinkedinIcon,
  FiverrIcon,
  BehanceIcon,
} from "@/components/ui/brand-icons";

const EMAIL = "hsreeraj4@gmail.com";
const LINKS = [
  {
    href: "https://linkedin.com/in/sreerajh",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  { href: "https://fiverr.com/sreeraj_h", label: "Fiverr", icon: FiverrIcon },
  {
    href: "https://www.behance.net/sreerajh20",
    label: "Behance",
    icon: BehanceIcon,
  },
  { href: `mailto:${EMAIL}`, label: "Email", icon: Mail },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <section id="contact" className="relative">
      <KineticGrid className="py-32 md:py-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
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
            className="display-xl mx-auto max-w-[16ch] text-text"
          >
            Let&apos;s make something{" "}
            <span className="italic text-accent">unignorable.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex justify-center"
          >
            <Magnetic>
              <button
                type="button"
                onClick={copyEmail}
                aria-live="polite"
                className="group inline-flex items-center gap-3 rounded-full border border-border-hair bg-bg-elev px-5 py-3 text-sm text-text transition-colors hover:border-accent"
              >
                <span>{EMAIL}</span>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-accent" />
                    <span className="text-xs text-accent">Copied</span>
                  </>
                ) : (
                  <Copy className="h-4 w-4 text-text-muted transition-colors group-hover:text-accent" />
                )}
              </button>
            </Magnetic>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            {LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      l.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </KineticGrid>
    </section>
  );
}
