"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeLink, SectionLink } from "@/components/layout/nav-links";
import { SECTIONS } from "@/lib/sections";

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
        <HomeLink aria-label="Sreeraj H, back to top" className="shrink-0">
          <Image
            src="/logo.png"
            alt=""
            width={207}
            height={206}
            priority
            className="h-9 w-9 transition-transform duration-300 hover:rotate-[-8deg]"
          />
        </HomeLink>

        <ul className="hidden items-center gap-10 md:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <SectionLink
                id={s.id}
                className="nav-link text-[15px] font-medium text-text/85 hover:text-text"
              >
                {s.label}
              </SectionLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <SectionLink
            id="contact"
            className="pulse-ring hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-text md:inline-block"
          >
            Let&apos;s talk
          </SectionLink>
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
              <HomeLink
                aria-label="Sreeraj H, back to top"
                onClick={() => setOpen(false)}
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={207}
                  height={206}
                  className="h-9 w-9"
                />
              </HomeLink>
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
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <SectionLink
                    id={s.id}
                    onNavigate={() => setOpen(false)}
                    className="font-serif text-5xl tracking-tight text-text"
                  >
                    {s.label}
                  </SectionLink>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + SECTIONS.length * 0.08,
                }}
                className="mt-4"
              >
                <SectionLink
                  id="contact"
                  onNavigate={() => setOpen(false)}
                  className="pulse-ring inline-block rounded-full border border-accent bg-accent px-5 py-2 text-sm text-[#0A0A0A]"
                >
                  Let&apos;s talk
                </SectionLink>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
