"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
};

/**
 * The site's section heading: a brush-script kicker over a condensed
 * uppercase title with one word knocked out of a lime box that tilts on hover.
 */
export function SectionHeading({
  kicker,
  lead,
  highlight,
  tail,
  className,
}: {
  kicker: string;
  lead?: string;
  highlight: string;
  tail?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.p
        {...rise}
        transition={{ duration: 0.6 }}
        className="font-script text-lg text-accent md:text-xl"
      >
        {kicker}
      </motion.p>
      <motion.h2
        {...rise}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mt-3 flex flex-wrap items-center gap-x-[0.22em] gap-y-2 font-condensed uppercase leading-[0.95] text-text",
        )}
        style={{ fontSize: "clamp(2.75rem, 7vw, 5.75rem)" }}
      >
        {/* The {" "} gaps are real spaces for anyone reading the text; flex
            layout ignores them, so the visual gap is still gap-x. */}
        {lead ? <span>{lead}</span> : null}
        {lead ? " " : null}
        {/* Straight at rest; on hover it tips and swells on a spring, then settles back. */}
        <motion.span
          whileHover={{ rotate: -4, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 380, damping: 14 }}
          className="inline-block cursor-default rounded-md bg-accent px-[0.14em] pb-[0.02em] text-[#0A0A0A]"
        >
          {highlight}
        </motion.span>
        {tail ? " " : null}
        {tail ? <span>{tail}</span> : null}
      </motion.h2>
    </div>
  );
}
