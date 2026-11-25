"use client";

import * as React from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin accent bar along the top of the viewport that fills as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

/**
 * Counts a figure up from 0 the first time it scrolls into view.
 * The real value is what the server renders, so crawlers, link previews and
 * anyone without JavaScript never see a 0. Figures already on screen at load
 * just stay put. Anything that isn't a plain integer ("1 tap", "OTA") is
 * shown as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const armed = React.useRef(false);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const target = /^\d+$/.test(value) ? Number(value) : null;

  // Before paint: only figures still below the fold are reset to 0, so the
  // count-up is never a visible jump backwards. Written to the DOM directly,
  // so React's rendered text stays the real value.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || target === null || reduce) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.textContent = "0";
      armed.current = true;
    }
  }, [target, reduce]);

  React.useEffect(() => {
    const el = ref.current;
    if (!inView || !el || target === null || !armed.current) return;
    armed.current = false;
    const controls = animate(0, target, {
      duration: Math.min(1.6, 0.6 + target / 40),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
      onComplete: () => {
        el.textContent = value;
      },
    });
    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [inView, target, value]);

  return (
    <p ref={ref} className={className} aria-label={value}>
      {value}
    </p>
  );
}

/** Tilts its child gently towards the pointer, like holding a phone up to the light. */
export function Tilt({ children, className = "", max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = React.useState({ x: 0, y: 0, on: false });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ x: -py * max, y: px * max, on: true });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setT({ x: 0, y: 0, on: false })}
      className={className}
      style={{ perspective: "1200px" }}
    >
      <div
        className="transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `rotateX(${t.x}deg) rotateY(${t.y}deg) translateY(${t.on ? -6 : 0}px)`,
          transitionDuration: t.on ? "150ms" : "600ms",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Left-hand table of contents on wide screens; highlights the section being read. */
export function SectionNav({ items }: { items: Array<{ id: string; n: string; label: string }> }) {
  const [active, setActive] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Case study sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:block"
    >
      <ol className="space-y-3">
        {items.map((i) => {
          const on = i.id === active;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={`group flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] transition-colors ${on ? "text-text" : "text-text-dim hover:text-text-muted"}`}
              >
                <span className={`h-px transition-all duration-500 ${on ? "w-8 bg-accent" : "w-4 bg-border-hair group-hover:w-6 group-hover:bg-text-dim"}`} />
                <span className={on ? "text-accent" : ""}>{i.n}</span>
                <span className={`transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{i.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
