"use client";

import * as React from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Tumble Deck Showcase: a stack of website screenshots standing on edge, one
 * behind the other. The front card tips forward on its bottom edge and lands
 * flat on the floor, the deck slides up to the line, the next one falls.
 *
 * Driven by the page's own scroll. The section is a tall track with the stage
 * pinned inside, so the wheel, a trackpad, the keyboard and touch all simply
 * scroll the page and the deck reports where it has got to; nothing is ever
 * captured. The deck runs from the first card to the last and stops there.
 *
 * Pure CSS 3D (one perspective, every card hinged on the same floor line) with
 * a single number driving it: the deck position. A small pool of card elements
 * is recycled along it: slot j always holds card k ≡ j (mod pool), and a slot
 * is only re-pointed while it is invisible (under the floor pile or past the
 * back).
 */

export type TumbleCard = {
  src: string;
  alt?: string;
  /** Shown beside the deck while this card is at the front. */
  title: string;
  meta?: string;
  href?: string;
  /** Opens `href` in a new tab. */
  external?: boolean;
};

export type TumbleDeckShowcaseProps = {
  cards: TumbleCard[];
  /** Card width ÷ height. Images are cropped to it from the top. */
  aspect?: number;
  /** How many upright cards show behind the front one. */
  depth?: number;
  /** Top-left corner, followed by the front card's number. */
  eyebrow?: string;
  /** A small line under the eyebrow. */
  note?: string;
  className?: string;
  ariaLabel?: string;
};

// #region pose
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Euclidean modulo, for pool slots. */
export const wrap = (k: number, n: number) => (n ? ((k % n) + n) % n : 0);

/**
 * Hinge angle (deg, CSS rotateX) of a card `t` of the way through its fall.
 * 0 stands upright, -90 lies flat towards the viewer. Gravity eases in, then
 * the card kicks once off the floor and settles.
 */
export function fallAngle(t: number): number {
  const u = clamp01(t);
  const land = 0.78;
  if (u <= land) {
    const k = u / land;
    return -90 * k * k * k;
  }
  const k = (u - land) / (1 - land);
  return -90 + 6 * Math.sin(Math.PI * k) * (1 - k);
}

/** How far the deck has slid forward, in card gaps, at deck position `pos`. */
export function deckAdvance(pos: number): number {
  const i = Math.floor(pos);
  const f = pos - i;
  const k = clamp01((f - 0.28) / 0.6);
  return i + k * k * (3 - 2 * k);
}

export type Pose = {
  angle: number;
  z: number;
  lift: number;
  opacity: number;
  flat: boolean;
};

/** Pose of card `k` when the deck is at `pos` (card k is at the front when pos = k). */
export function cardPose(k: number, pos: number, depth: number): Pose {
  const t = pos - k;
  // Floor cards lie a hair apart, the newest highest.
  const lift = (k - Math.floor(pos) + 3) * 0.6;
  if (t >= 1) {
    // On the floor. Only the two latest show.
    return { angle: -90, z: 0, lift, opacity: t < 3 ? 1 : 0, flat: true };
  }
  if (t > 0) return { angle: fallAngle(t), z: 0, lift, opacity: 1, flat: false };
  const rel = k - deckAdvance(pos);
  const opacity = clamp01(depth + 1 - rel);
  return { angle: 0, z: -Math.max(rel, 0), lift: 0, opacity, flat: false };
}
// #endregion

/** Page scroll, in viewport heights, that tips one card. */
const SCROLL_PER_CARD = 0.75;
/** Share of each card's stretch of scroll spent falling; the rest holds it up
    front, so the deck rests on a card rather than mid-fall. */
const FALL_SHARE = 0.55;
/** Corner labels sit this far down, clear of the fixed header. */
const INSET_TOP = "max(7.5%, 5.5rem)";

const pad = (n: number) => String(n).padStart(2, "0");

/** Continuous scroll in, whole cards out: hold, then tip quickly to the next. */
function detent(p: number) {
  const k = Math.floor(p);
  const s = clamp01((p - k - (1 - FALL_SHARE) / 2) / FALL_SHARE);
  return k + s * s * (3 - 2 * s);
}

export default function TumbleDeckShowcase({
  cards,
  aspect = 1.6,
  depth = 5,
  eyebrow,
  note,
  className,
  ariaLabel = "Selected work",
}: TumbleDeckShowcaseProps) {
  const router = useRouter();
  const trackRef = React.useRef<HTMLElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = React.useRef<(HTMLImageElement | null)[]>([]);
  const slotK = React.useRef<number[]>([]);
  const state = React.useRef({ pos: 0 });
  const geo = React.useRef({ h: 200, gap: 44 });
  const [active, setActive] = React.useState(0);
  const n = cards.length;
  // Two on the floor, the falling one, the front one, `depth` behind, one fading in.
  const pool = n ? depth + 5 : 0;

  const paint = React.useCallback(() => {
    const { pos } = state.current;
    const { gap } = geo.current;
    const base = Math.floor(pos) - 2;
    cardRefs.current.forEach((el, j) => {
      const img = imgRefs.current[j];
      if (!el || !img || j >= pool) return;
      const k = base + wrap(j - base, pool);
      // The deck has a first and a last card: nothing before or after shows.
      if (k < 0 || k >= n) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        slotK.current[j] = k;
        return;
      }
      if (slotK.current[j] !== k || !img.getAttribute("src")) {
        slotK.current[j] = k;
        img.src = cards[k].src;
        img.alt = cards[k].alt ?? cards[k].title;
      }
      const p = cardPose(k, pos, depth);
      el.style.transform = `translate3d(0, ${-p.lift}px, ${p.z * gap}px) rotateX(${p.angle}deg)`;
      el.style.opacity = String(p.opacity);
      el.style.visibility = p.opacity > 0 ? "visible" : "hidden";
      // Light falls from above: a card darkens a touch as it tips away from it.
      const shade = p.flat ? 0.12 : (-p.angle / 90) * 0.12;
      el.style.setProperty("--td-shade", String(shade));
    });
  }, [depth, pool, cards, n]);

  // New images: re-point every slot on the next paint.
  React.useLayoutEffect(() => {
    slotK.current = [];
  }, [cards]);

  // Fit the card, the deck above it and the floor card below inside the stage.
  // Perspective and eye height are fixed ratios of the card height.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;
    const fit = () => {
      const W0 = root.clientWidth;
      const H0 = root.clientHeight;
      const wFrac = W0 < 1024 ? 0.62 : 0.5;
      const h = Math.max(60, Math.min((W0 * wFrac) / aspect, H0 * 0.42, 560));
      const w = h * aspect;
      const top = H0 / 2 - 0.5 * h;
      geo.current = { h, gap: 0.24 * h };
      scene.style.perspective = `${6 * h}px`;
      scene.style.perspectiveOrigin = `50% ${top - 1.66 * h}px`;
      root.style.setProperty("--td-w", `${w}px`);
      root.style.setProperty("--td-h", `${h}px`);
      root.style.setProperty("--td-top", `${top}px`);
      paint();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => ro.disconnect();
  }, [aspect, paint]);

  // How far the page is through the track is where the deck is heading; the
  // deck eases after it every frame.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track || n === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    let target = s.pos;
    let running = false;
    let shown = -1;

    const report = () => {
      const front = Math.min(n - 1, Math.max(0, Math.round(s.pos)));
      if (front !== shown) {
        shown = front;
        setActive(front);
      }
    };
    const follow = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60;
      s.pos += (target - s.pos) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - s.pos) < 2e-3) {
        s.pos = target;
        gsap.ticker.remove(follow);
        running = false;
      }
      paint();
      report();
    };
    const read = () => {
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = run > 0 ? clamp01(-r.top / run) : 0;
      target = detent(p * (n - 1));
      if (reduce) {
        s.pos = Math.round(target);
        paint();
        report();
      } else if (!running) {
        running = true;
        gsap.ticker.add(follow);
      }
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      gsap.ticker.remove(follow);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [n, paint]);

  /** Scroll the page to where card `i` stands at the front. */
  const toCard = React.useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track || n < 2) return;
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      window.scrollTo({
        top: window.scrollY + r.top + (run * i) / (n - 1),
        behavior: "smooth",
      });
    },
    [n],
  );

  const open = React.useCallback(
    (card: TumbleCard) => {
      if (!card.href) return;
      if (card.external) window.open(card.href, "_blank", "noopener,noreferrer");
      else router.push(card.href);
    },
    [router],
  );

  const current = cards[active];

  return (
    <section
      ref={trackRef}
      aria-label={ariaLabel}
      className={cn("relative w-full", className)}
      style={{ height: `${100 + Math.max(0, n - 1) * SCROLL_PER_CARD * 100}svh` }}
    >
      <div ref={rootRef} className="td-root sticky top-0 h-svh w-full select-none overflow-hidden bg-bg">
        <style>{`
          .td-scene { position: absolute; inset: 0; transform-style: preserve-3d; }
          .td-card {
            position: absolute; left: 50%; top: var(--td-top);
            width: var(--td-w); height: var(--td-h); margin-left: calc(var(--td-w) / -2);
            transform-origin: 50% 100%; transform-style: preserve-3d;
            backface-visibility: visible; will-change: transform;
            border-radius: 10px; overflow: hidden; cursor: pointer;
            background: var(--bg-elev);
            box-shadow: 0 0 0 1px rgba(237, 237, 237, 0.08), 0 30px 60px -30px rgba(0, 0, 0, 0.9);
          }
          .td-card img {
            display: block; width: 100%; height: 100%; max-width: none;
            object-fit: cover; object-position: 50% 0%; pointer-events: none;
          }
          .td-card::after {
            content: ""; position: absolute; inset: 0; pointer-events: none;
            background: #000; opacity: var(--td-shade, 0);
          }
        `}</style>
        <div ref={sceneRef} className="td-scene">
          {Array.from({ length: pool }, (_, j) => (
            <div
              key={j}
              ref={(el) => {
                cardRefs.current[j] = el;
              }}
              className="td-card"
              data-cursor="view"
              onClick={() => {
                // The front card opens its project; any other is brought round.
                const k = slotK.current[j];
                if (k === active) open(cards[k]);
                else if (k >= 0 && k < n) toCard(k);
              }}
            >
              {/* src/alt are set in paint() as the slot moves along the deck. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(el) => {
                  imgRefs.current[j] = el;
                }}
                alt=""
                width={720}
                height={Math.round(720 / aspect)}
                draggable={false}
                decoding="async"
              />
            </div>
          ))}
        </div>

        {eyebrow || note ? (
          <div className="pointer-events-none absolute left-[5%]" style={{ top: INSET_TOP }}>
            {eyebrow ? (
              <p className="eyebrow">
                {eyebrow} <span className="text-text-dim">·</span> {pad(active + 1)}{" "}
                <span className="text-text-dim">/ {pad(n)}</span>
              </p>
            ) : null}
            {note ? <p className="mt-2 text-xs text-text-dim">{note}</p> : null}
          </div>
        ) : null}

        {/* The front card's caption: beside the deck on wide screens, under it otherwise. */}
        {current ? (
          <div
            key={active}
            className="absolute bottom-[7%] left-1/2 w-[min(90%,28rem)] -translate-x-1/2 text-center lg:bottom-auto lg:left-[5%] lg:top-1/2 lg:w-[19%] lg:translate-x-0 lg:-translate-y-1/2 lg:text-left"
          >
            <h3 className="font-condensed text-4xl uppercase leading-[0.95] text-text xl:text-5xl">
              {current.title}
            </h3>
            {current.meta ? <p className="eyebrow mt-3">{current.meta}</p> : null}
            {current.href ? (
              <button
                type="button"
                onClick={() => open(current)}
                className="nav-link mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-text"
              >
                {current.external ? "Visit site" : "Read case study"}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ) : null}

        <ol
          className="absolute right-[4%] hidden text-right text-[13px] leading-[1.9] text-text-muted lg:block"
          style={{ top: INSET_TOP }}
        >
          {cards.map((card, i) => (
            <li key={card.title}>
              <button
                type="button"
                onClick={() => toCard(i)}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "cursor-pointer transition-colors hover:text-text",
                  i === active && "font-medium text-accent",
                )}
              >
                {card.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
