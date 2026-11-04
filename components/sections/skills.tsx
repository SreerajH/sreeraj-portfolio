"use client";

import { motion } from "framer-motion";
import {
  siClaude,
  siGithub,
  siGsap,
  siNextdotjs,
  siPrisma,
  siReact,
  siShadcnui,
  siTailwindcss,
  siVercel,
} from "simple-icons";
import { StackDock, type StackTool } from "@/components/ui/stack-dock";
import { SectionHeading } from "@/components/ui/section-heading";

const icon = (si: { title: string; path: string; hex: string }, name = si.title): StackTool => ({
  name,
  path: si.path,
  hex: si.hex,
});

// Design first, then the build chain, in the order a project moves through them.
const STACK: StackTool[] = [
  { name: "Figma", img: "/stack/figma.webp" },
  icon(siNextdotjs, "Next.js"),
  icon(siReact),
  { name: "TypeScript", img: "/stack/typescript.webp" },
  icon(siTailwindcss, "Tailwind CSS"),
  { name: "Framer Motion", img: "/stack/framer-motion.webp" },
  icon(siGsap, "GSAP"),
  icon(siShadcnui, "shadcn/ui"),
  icon(siPrisma),
  icon(siGithub),
  icon(siVercel),
  // The AI tools in the loop.
  icon(siClaude),
  { name: "ChatGPT", img: "/stack/chatgpt.webp" },
  { name: "Google Antigravity", img: "/stack/antigravity.webp" },
  { name: "Google Flow", img: "/stack/google-flow.webp" },
];

const CAPABILITIES = [
  "UI/UX Design",
  "Prototyping",
  "Design Systems",
  "UX Research",
  "Web Development",
  "Interaction & Motion",
];

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
};

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          kicker="Tried, tested, trusted"
          lead="Tools of the"
          highlight="trade"
        />

        <motion.p
          {...rise}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-text-muted"
        >
          Ideas start in Figma and ship in Next.js. Every tool in between earns
          its place by making the work faster or the details sharper.
        </motion.p>

        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.15 }} className="mt-14">
          <p className="eyebrow">My stack</p>
          <StackDock tools={STACK} />
        </motion.div>

        <motion.div {...rise} transition={{ duration: 0.7, delay: 0.2 }} className="mt-14">
          <p className="eyebrow">What I do</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {CAPABILITIES.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border-hair px-4 py-2 text-sm text-text/90 transition-colors hover:border-accent hover:text-accent"
              >
                {c}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.p
          {...rise}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-14 font-semibold text-text"
        >
          Open to new projects. Based in{" "}
          <span className="text-accent underline decoration-accent/40 decoration-2 underline-offset-[6px]">
            Bengaluru
          </span>
          .
        </motion.p>
      </div>
    </section>
  );
}
