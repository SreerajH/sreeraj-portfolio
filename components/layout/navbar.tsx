"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--bg)_60%,transparent)] border-b border-border-hair"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-2xl italic tracking-tight text-text"
          aria-label="Sreeraj H home"
        >
          SH
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => scrollToSection(l.id)}
                className="text-sm text-text-muted transition-colors hover:text-text"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="hidden rounded-full border border-border-hair px-4 py-2 text-sm text-text transition-colors hover:border-accent hover:bg-accent hover:text-[#0A0A0A] md:inline-block"
          >
            Let&apos;s talk
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-border-hair p-2 text-text md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-bg md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="font-serif text-2xl italic">SH</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border-hair p-2"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      scrollToSection(l.id);
                    }}
                    className="font-serif text-5xl tracking-tight text-text"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + LINKS.length * 0.08,
                }}
                className="mt-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    scrollToSection("contact");
                  }}
                  className="inline-block rounded-full border border-accent bg-accent px-5 py-2 text-sm text-[#0A0A0A]"
                >
                  Let&apos;s talk
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
