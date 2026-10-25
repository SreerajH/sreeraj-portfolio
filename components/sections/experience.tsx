import HowItWorks, { type Step } from "@/components/ui/how-it-works";

// Oldest first: the path reads as a route from the certificate to today.
const STEPS: Step[] = [
  {
    date: "Apr - Jun 2025",
    title: "Google UX Certificate",
    place: "Coursera · Completed",
    description:
      "Completed Google's UX Design Professional Certificate, covering research, wireframing, prototyping, and usability testing.",
    colorTheme: "mono",
  },
  {
    date: "Jul - Nov 2025",
    title: "Freelance UI/UX Designer & Developer",
    place: "Fiverr · LinkedIn",
    description:
      "Completed 40+ projects, designing and shipping websites and mobile apps for SaaS founders and early-stage startups.",
    colorTheme: "accent",
  },
  {
    date: "Nov 2025 - Mar 2026",
    title: "Design Intern",
    place: "Avado Pvt Ltd",
    href: "https://avado.in/",
    description:
      "Worked on product flows and visual design for an acoustic sound system website. First taste of shipping design decisions to real users.",
    colorTheme: "mono",
  },
  {
    date: "Apr - Sep 2026",
    title: "Graphic Designer",
    place: "Colour Vibrations",
    href: "https://colourvibrations.in/",
    description:
      "Graphic design for Avado's parent company, specialists in acoustic materials and A/V integration for bespoke stage and theatre systems.",
    colorTheme: "accent",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-6xl px-6 lg:mb-4">
        <p className="eyebrow mb-4">Path</p>
        <h2 className="heading-2 text-text">Experience</h2>
      </div>

      <HowItWorks
        features={STEPS}
        height={1000}
        stepPositions={[
          { className: "lg:absolute lg:top-0 lg:left-[12%]", rotate: "lg:rotate-6" },
          {
            className: "lg:absolute lg:top-[130px] lg:right-[12%]",
            rotate: "lg:-rotate-6",
          },
          {
            className: "lg:absolute lg:top-[480px] lg:left-[12%]",
            rotate: "lg:rotate-6",
          },
          {
            className: "lg:absolute lg:top-[610px] lg:right-[10%]",
            rotate: "lg:-rotate-6",
          },
        ]}
      />
    </section>
  );
}
