"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
  underlineColor?: string;
};

export function AnimatedText({
  text,
  className,
  as = "h2",
  underlineColor = "var(--accent)",
}: Props) {
  const Tag = motion[as];

  return (
    <span className={cn("relative inline-block", className)}>
      <Tag
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif tracking-tight"
      >
        {text}
      </Tag>
      <motion.svg
        aria-hidden
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        className="absolute -bottom-2 left-0 h-[0.35em] w-full"
      >
        <motion.path
          d="M 2 6 Q 50 1 100 5 T 198 4"
          stroke={underlineColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 1.1,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </motion.svg>
    </span>
  );
}
