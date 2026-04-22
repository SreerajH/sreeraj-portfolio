"use client";

import { Progress } from "@/components/ui/interfaces-progress";
import { AnimatedText } from "@/components/ui/animated-underline-text";

const DESIGN = [
  { label: "Figma", value: 95 },
  { label: "UI/UX", value: 90 },
  { label: "Prototyping", value: 85 },
  { label: "Design Systems", value: 80 },
  { label: "UX Research", value: 70 },
];

const DEV = [
  { label: "Next.js", value: 75 },
  { label: "React", value: 78 },
  { label: "TypeScript", value: 65 },
  { label: "Tailwind CSS", value: 90 },
  { label: "Framer Motion", value: 70 },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="eyebrow mb-4">Craft</p>
          <AnimatedText text="Tools &amp; Capabilities" as="h2" />
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow mb-6 text-text-dim">Design</p>
            <ul className="space-y-5">
              {DESIGN.map((s) => (
                <li key={s.label}>
                  <Progress label={s.label} value={s.value} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6 text-text-dim">Development</p>
            <ul className="space-y-5">
              {DEV.map((s) => (
                <li key={s.label}>
                  <Progress label={s.label} value={s.value} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
