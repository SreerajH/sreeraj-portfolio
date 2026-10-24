"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A grid drawn on canvas that bends away from the pointer and ripples where
// you click. The canvas fills this component's own box, not the window, and
// only listens to the pointer while it is over the component - so it can sit
// behind one section of a long page without leaking into the others.

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

type RGBA = { r: number; g: number; b: number; a: number };

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE = 55; // Sets the column and row count
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 28;
const LERP_SPEED = 0.08;

const LINE_BASE: RGBA = { r: 255, g: 255, b: 255, a: 0.09 };
const NODE_BASE_RADIUS = 1.8;
const NODE_ACTIVE_RADIUS = 3.2;
const OFF = -9999;

const THEMES = {
  /** Lime: the site accent. */
  accent: {
    bg: "#0A0A0A",
    lineActive: { r: 200, g: 255, b: 0, a: 0.85 },
    nodeActive: { r: 200, g: 255, b: 0, a: 1 },
    glow: "200,255,0",
    ripple: "200,255,0",
  },
  monochrome: {
    bg: "#000000",
    lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
    nodeActive: { r: 255, g: 255, b: 255, a: 1 },
    glow: "255,255,255",
    ripple: "255,255,255",
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(base: RGBA, active: RGBA, t: number): string {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function warpPoint(
  gx: number,
  gy: number,
  col: number,
  row: number,
  mouse: Point,
  ripples: Ripple[],
  cols: number,
  rows: number,
): { pt: Point; proximity: number } {
  // Edge pin: boundary rows and columns stay put, easing in over 1.5 cells.
  const edgeMargin = 1.5;
  const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
  const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
  const pinFactor = colPin * colPin * rowPin * rowPin;

  const dx = gx - mouse.x;
  const dy = gy - mouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

  // Ripple displacement
  let rx = 0;
  let ry = 0;
  for (const r of ripples) {
    const rdx = gx - r.x;
    const rdy = gy - r.y;
    const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
    const waveWidth = 55;
    const diff = rdist - r.radius;
    if (Math.abs(diff) < waveWidth) {
      const strength =
        (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
      const angle = Math.atan2(rdy, rdx);
      const sign = diff < 0 ? -1 : 1;
      rx -= Math.cos(angle) * strength * sign;
      ry -= Math.sin(angle) * strength * sign;
    }
  }

  // Cursor warp with a bell falloff
  if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
    const t = dist / INFLUENCE_RADIUS;
    const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
    const warpAmt = eased * MAX_WARP * pinFactor;
    const angle = Math.atan2(dy, dx);
    return {
      pt: {
        x: gx - Math.cos(angle) * warpAmt + rx,
        y: gy - Math.sin(angle) * warpAmt + ry,
      },
      proximity,
    };
  }

  return { pt: { x: gx + rx, y: gy + ry }, proximity };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KineticGrid({
  children,
  className,
  globalColor = "accent",
}: {
  children?: ReactNode;
  className?: string;
  globalColor?: keyof typeof THEMES;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const theme = THEMES[globalColor];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse: Point = { x: OFF, y: OFF };
    const target: Point = { x: OFF, y: OFF };
    const ripples: Ripple[] = [];
    let size = { w: 0, h: 0 };
    let raf = 0;
    let visible = false;

    const draw = (now: number) => {
      const { w: W, h: H } = size;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W, H);

      // Static dot texture
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      // Warped grid
      const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);
      const pts: Point[][] = [];
      const prox: number[][] = [];
      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col++) {
          const { pt, proximity } = warpPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            mouse,
            ripples,
            cols,
            rows,
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      const seg = (p1: Point, p2: Point, pr1: number, pr2: number) => {
        const avg = (pr1 + pr2) / 2;
        const t = avg * avg * (3 - 2 * avg); // smoothstep
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, t);
        ctx.lineWidth = lerpN(0.8, 1.5, t);
        ctx.stroke();
      };
      ctx.lineCap = "butt";
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols - 1; col++)
          seg(
            pts[row][col],
            pts[row][col + 1],
            prox[row][col],
            prox[row][col + 1],
          );
      for (let col = 0; col < cols; col++)
        for (let row = 0; row < rows - 1; row++)
          seg(
            pts[row][col],
            pts[row + 1][col],
            prox[row][col],
            prox[row + 1][col],
          );

      // Intersection nodes
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = pts[row][col];
          const pr = prox[row][col];
          const t = pr * pr * (3 - 2 * pr);
          const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);
          if (t > 0.3) {
            const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
            const grd = ctx.createRadialGradient(
              p.x,
              p.y,
              r * 0.5,
              p.x,
              p.y,
              glowR,
            );
            grd.addColorStop(0, `rgba(${theme.glow},${(t * 0.3).toFixed(3)})`);
            grd.addColorStop(1, `rgba(${theme.glow},0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(
            { r: 255, g: 255, b: 255, a: 0.16 },
            theme.nodeActive,
            t,
          );
          ctx.fill();
        }
      }

      // Ripple rings
      for (const r of ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${theme.ripple},${(r.opacity * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      mouse.x = lerpN(mouse.x, target.x, LERP_SPEED);
      mouse.y = lerpN(mouse.y, target.y, LERP_SPEED);
      draw(now);
    };

    // Match the canvas to the component's box, at device resolution.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = { w: root.clientWidth, h: root.clientHeight };
      canvas.width = Math.round(size.w * dpr);
      canvas.height = Math.round(size.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) draw(performance.now());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // Pointer positions are local to the component.
    const local = (e: PointerEvent): Point => {
      const rect = root.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      target.x = p.x;
      target.y = p.y;
      // First contact: start the warp where the pointer is, not off-screen.
      if (mouse.x === OFF) Object.assign(mouse, p);
    };
    const onLeave = () => {
      target.x = OFF;
      target.y = OFF;
      mouse.x = OFF;
      mouse.y = OFF;
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({
        ...local(e),
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
    };

    if (!still) {
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerdown", onDown);
      raf = requestAnimationFrame(tick);
    }

    // Off screen, the loop keeps its slot but draws nothing.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [globalColor]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative w-full overflow-hidden",
        globalColor === "monochrome" ? "bg-black" : "bg-bg",
        className,
      )}
    >
      {/* Faded at the edges so the grid melts into the sections around it. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]"
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
