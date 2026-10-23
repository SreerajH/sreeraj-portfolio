"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

type MotionTag = React.ComponentType<HTMLMotionProps<"div">>;

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VIEWPORT = { once: true, margin: "50px", amount: 0 } as const;

// One motion component per tag, made once here. Creating it during render
// would hand React a new component type every time and remount the subtree.
const TAGS = {
  div: motion.create("div"),
  span: motion.create("span"),
  p: motion.create("p"),
  h1: motion.create("h1"),
  h2: motion.create("h2"),
  h3: motion.create("h3"),
  section: motion.create("section"),
  li: motion.create("li"),
} as unknown as Record<string, MotionTag>;

type Tag = "div" | "span" | "p" | "h1" | "h2" | "h3" | "section" | "li";

export type FadeInProps = {
  delay?: number;
  duration?: number;
  /** Starting offset, in px. */
  x?: number;
  /** Starting offset, in px. */
  y?: number;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export function FadeIn({
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = "div",
  className,
  style,
  children,
}: FadeInProps) {
  const Component = TAGS[as];
  const variants: Variants = {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { delay, duration, ease: EASE },
    },
  };

  return (
    <Component
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}
