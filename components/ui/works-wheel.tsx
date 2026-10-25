"use client";

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. Scrolling on blows the ring open into a vertical drum: the card at
// the front lies flat and full size, the ones above and below rotate away into
// hard perspective and run off the top and bottom of the frame. Keep scrolling
// and the drum carries the next piece round to the front.
//
// The page's own scroll turns it. The section is a tall track with the stage
// pinned inside, so the wheel never has to swallow a wheel event or a swipe:
// the page keeps scrolling the whole way through, on a trackpad, a mouse, a
// keyboard or a touch screen, and the wheel just reports where it has got to.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
import * as React from "react";

import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
  /** Opens `href` in a new tab. */
  external?: boolean;
  /** A line under the front card's title, such as category and year. */
  meta?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default "Works '26" */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default "View" */
  action?: string;
  /** Top-left corner, followed by the front item's number. Omit to drop it. */
  eyebrow?: string;
  /** A small line under the eyebrow, e.g. how many pieces the index is drawn from. */
  note?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
/** Floors for the type, in px, so a short stage can't shrink it past reading. */
const TITLE_MIN = 28;
const INDEX_MIN = 12;
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;
/** The corner labels sit this far down - clear of a fixed header. */
const INSET_TOP = "max(7.5%, 5.5rem)";

/** Page scroll, in viewport heights, that turns the wheel by one item. */
const SCROLL_PER_TURN = 0.7;
/** Share of each item's stretch of scroll spent turning. The rest holds the item
    at the front, so the wheel rests on a piece rather than between two - with
    nothing at the front and the pair either side both turned half away. */
const TURN_SHARE = 0.4;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pad = (n: number) => String(n).padStart(2, "0");

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

/** Scroll is continuous; this turns it into a ratchet. Within each item's
    stretch the turn holds, then eases across to the next in TURN_SHARE of it. */
function detent(p: number) {
  const k = Math.floor(p);
  const s = clamp((p - k - (1 - TURN_SHARE) / 2) / TURN_SHARE, 0, 1);
  return k + s * s * (3 - 2 * s);
}

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", cb);
  return () => query.removeEventListener("change", cb);
}
const readReduced = () => window.matchMedia(REDUCED).matches;

export function WorksWheel({
  items,
  label = "Works '26",
  action = "View",
  eyebrow,
  note,
  className,
  style,
  ...props
}: WorksWheelProps) {
  const trackRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Reduced motion drops the easing, so the wheel lands where it is put instead
  // of gliding there. Read through a store, not during render: the server has
  // no matchMedia, and branching on it inline is a hydration mismatch.
  const reduced = React.useSyncExternalStore(
    subscribeReduced,
    readReduced,
    () => false,
  );

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    // The observer reports the starting size on its own.
    const ro = new ResizeObserver(() =>
      setStage({ w: el.clientWidth, h: el.clientHeight }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // How far the page is through the track is how far the wheel has turned.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const read = () => {
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = run > 0 ? clamp(-r.top / run, 0, 1) : 0;
      target.current = detent(p * count);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [count]);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(cardH * TITLE, TITLE_MIN),
      index: Math.max(cardH * INDEX, INDEX_MIN),
    };
  }, [stage, count]);

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!stage.h || !track) return;
    let frame = 0;
    let visible = true;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      // The drum is pulled back so its front face lands on the picture plane.
      // That set-back has to arrive with the drum, or the ring would sit at the
      // far side of the perspective and render at half its size.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          // Culled by distance, not by angle: at a full turn the far side comes
          // back round to face us, and everything past the neighbours lands on
          // the vanishing point in a heap.
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    // Off screen, the loop keeps its slot but does no work.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [metrics, stage.h, count, last, reduced]);

  /** Scroll the page to the point in the track where item `i` is at the front. */
  const toItem = React.useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track || !count) return;
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      window.scrollTo({
        top: window.scrollY + r.top + (run * (i + 1)) / count,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [count, reduced],
  );

  const current = items[active];

  return (
    <section
      ref={trackRef}
      aria-label={label}
      className={cn("relative w-full", className)}
      style={{ height: `${100 + count * SCROLL_PER_TURN * 100}svh`, ...style }}
      {...props}
    >
      <div className="bg-background text-foreground sticky top-0 h-svh w-full overflow-hidden select-none">
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{ perspective: `${metrics.depth}px` }}
        >
          <div
            ref={wheelRef}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
          >
            {items.map((item, i) => {
              const Tag = (item.href ? "a" : "div") as "a";
              const external = Boolean(item.href && item.external);
              return (
                <Tag
                  key={item.title}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  onClick={(event) => {
                    // Off the front, a card is the way to bring it round -
                    // not a way out of the page.
                    if (Math.abs(turn.current - (i + 1)) > 0.5) {
                      event.preventDefault();
                      toItem(i);
                    }
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible"))
                      toItem(i);
                  }}
                  className="group absolute [backface-visibility:hidden]"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span className="bg-muted border-border relative block size-full overflow-hidden rounded-lg border shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover"
                    />
                    {action && item.href ? (
                      <span className="bg-accent text-accent-foreground pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-medium opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        <svg
                          viewBox="0 0 12 12"
                          className="size-2.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              );
            })}
          </div>
        </div>

        {/* Ring title and front-card title trade places across the transition.
            Type is sized off the measured stage, not vh, so the wheel keeps its
            proportions inside a card as well as at full bleed. */}
        <div
          ref={labelRef}
          className="pointer-events-none absolute inset-0 grid place-items-center font-serif tracking-tight"
          style={{ fontSize: metrics.title }}
        >
          {label}
        </div>
        <div
          ref={titleRef}
          className="pointer-events-none absolute top-1/2 left-[8%] -translate-y-1/2 opacity-0"
        >
          <div
            className="font-serif leading-[1.05] tracking-tight"
            style={{ fontSize: metrics.title }}
          >
            {current?.title}
          </div>
          {current?.meta ? (
            <p className="eyebrow mt-3">{current.meta}</p>
          ) : null}
        </div>

        {eyebrow || note ? (
          <div
            className="pointer-events-none absolute left-[2.5%]"
            style={{ top: INSET_TOP }}
          >
            {eyebrow ? (
              <p className="eyebrow">
                {eyebrow} <span className="text-text-dim">·</span>{" "}
                {pad(active + 1)}{" "}
                <span className="text-text-dim">/ {pad(count)}</span>
              </p>
            ) : null}
            {note ? <p className="mt-2 text-xs text-text-dim">{note}</p> : null}
          </div>
        ) : null}

        <ol
          className="text-muted-foreground absolute right-[2.5%] text-right leading-[1.75]"
          style={{ fontSize: metrics.index, top: INSET_TOP }}
        >
          {items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => toItem(i)}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "hover:text-foreground cursor-pointer transition-colors",
                  i === active && "text-accent font-medium",
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WorksWheel;
