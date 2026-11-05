"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import KineticGrid from "@/components/ui/kinetic-grid";
import { ContactForm } from "@/components/sections/contact-form";
import { Pointer } from "@/components/ui/custom-cursor";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

type HireLink = {
  label: string;
  hint: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Saves the file under this name. */
  download?: string;
};

// Everything a recruiter needs, one tap each.
const HIRE_LINKS: HireLink[] = [
  {
    label: "Resume",
    hint: "Download PDF",
    href: "/Sreeraj-H-Resume.pdf",
    icon: FileText,
    download: "Sreeraj H Resume.pdf",
  },
  {
    label: "GitHub",
    hint: "See the code",
    href: "https://github.com/SreerajH",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    hint: "Connect with me",
    href: "https://linkedin.com/in/sreerajh",
    icon: LinkedinIcon,
  },
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** The short card for recruiters: resume, code, profile. */
function HireCard() {
  return (
    <div
      id="hire"
      className="scroll-mt-24 rounded-3xl border border-border-hair bg-bg-elev/85 p-6 backdrop-blur-md md:p-8"
    >
      <p className="eyebrow">For recruiters</p>
      <h3 className="mt-3 font-condensed text-3xl uppercase text-text">Hiring?</h3>
      <p className="mt-1 text-sm text-text-muted">
        Open to UI/UX design and frontend developer roles. Based in Bengaluru.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {HIRE_LINKS.map(({ label, hint, href, icon: Icon, download }) => (
          <li key={label}>
            <a
              href={href}
              download={download}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 items-center gap-4 rounded-2xl border border-border-hair bg-bg/60 px-4 py-3 transition-colors hover:border-accent"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-text transition-colors group-hover:text-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-condensed text-2xl uppercase leading-none text-text transition-colors group-hover:text-accent">
                  {label}
                </span>
                <span className="mt-1 block text-xs text-text-muted">{hint}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-text transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0A0A0A]">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Contact() {
  // The grid behind turns white while the pointer is on the accent word.
  const [onWord, setOnWord] = useState(false);

  return (
    <section id="contact" className="relative">
      <KineticGrid className="py-28 md:py-36" highlight={onWord}>
        <div className="mx-auto max-w-6xl px-6">
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

          {/* Recruiters first in the DOM: on phones and tablets their short
              card comes before the long form. From lg the form takes the
              left 60% and leads visually. */}
          <div className="mt-14 grid items-start gap-6 md:mt-16 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <motion.div {...rise(0.1)} className="lg:order-2">
              <Pointer>
                <HireCard />
              </Pointer>
            </motion.div>

            <motion.div {...rise(0.15)} className="lg:order-1">
              <Pointer>
                <ContactForm id="start-project" className="scroll-mt-24" />
              </Pointer>
            </motion.div>
          </div>
        </div>
      </KineticGrid>
    </section>
  );
}
