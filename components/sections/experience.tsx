"use client";

import { motion } from "framer-motion";

const ITEMS = [
  {
    year: "2025",
    title: "Freelance — UI/UX Designer & Developer",
    place: "Fiverr · LinkedIn",
    body: "Active on Fiverr and LinkedIn. Shipping websites and mobile app designs for SaaS founders and early-stage startups.",
  },
  {
    year: "2025",
    title: "Google UX Certificate",
    place: "Coursera · Completed",
    body: "Completed Google's UX Design Professional Certificate — covering research, wireframing, prototyping, and usability testing.",
  },
  {
    year: "2024",
    title: "Design Intern",
    place: "GoPratle",
    body: "Worked on product flows and visual design for a consumer app. First taste of shipping design decisions to real users.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="eyebrow mb-4">Path</p>
          <h2 className="heading-2 text-text">Experience</h2>
        </div>

        <ol className="relative ml-4 border-l border-border-hair md:ml-0 md:mx-auto md:max-w-3xl">
          {ITEMS.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mb-12 pl-8 last:mb-0"
            >
              <span className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-accent" />
              <p className="eyebrow mb-2 text-text-dim">{item.year}</p>
              <h3 className="font-serif text-2xl tracking-tight text-text md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-text-muted">{item.place}</p>
              <p className="mt-3 max-w-prose text-sm leading-[1.65] text-text-muted">
                {item.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
