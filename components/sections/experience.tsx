import HowItWorks, { type Step } from "@/components/ui/how-it-works";
import { SectionHeading } from "@/components/ui/section-heading";

// Oldest first: the path reads as a route from the certificate to today.
const STEPS: Step[] = [
  {
    date: "Apr - Jun 2025",
    title: "Google UX Certificate",
    place: "Coursera · Completed",
    description:
      "Completed Google's UX Design Professional Certificate, covering research, wireframing, prototyping, and usability testing.",
    outcome:
      "Put the full research-to-prototype process into practice in the HealthHub case study.",
    colorTheme: "mono",
  },
  {
    date: "Jul - Nov 2025",
    title: "Independent Designer & Developer",
    place: "Independent · Remote",
    description:
      "Designed and built concept websites and apps across healthcare, fitness, real estate and SaaS, taking each one from Figma to a live, responsive deployment.",
    outcome:
      "6 live websites and 2 app case studies shipped, all featured in this portfolio.",
    colorTheme: "accent",
  },
  {
    date: "Nov 2025 - Mar 2026",
    title: "Design Intern",
    place: "Avado Pvt Ltd",
    href: "https://avado.in/",
    description:
      "Worked on product flows and visual design for an acoustic sound system website. First taste of shipping design decisions to real users.",
    outcome:
      "Delivered product flows and visual designs for the company website.",
    colorTheme: "mono",
  },
  {
    date: "Apr - Sep 2026",
    title: "Graphic Designer",
    place: "Colour Vibrations",
    href: "https://colourvibrations.in/",
    description:
      "Graphic design for Avado's parent company, specialists in acoustic materials and A/V integration for bespoke stage and theatre systems.",
    outcome:
      "Created the launch posters and AI video ads for the CV Elite-Quiet™ acoustic curtain and the colourvibrations.in website launch.",
    colorTheme: "accent",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-6xl px-6 lg:mb-4">
        <SectionHeading
          kicker="How I got here"
          lead="The"
          highlight="journey"
          tail="so far"
        />
      </div>

      <HowItWorks
        features={STEPS}
        height={1100}
        // Follows the card positions below: 01 → 02 → 03 → 04.
        path="M 290 150 C 500 150, 550 270, 710 270 C 850 270, 500 390, 290 490 C 290 640, 550 800, 750 800"
        stepPositions={[
          { className: "lg:absolute lg:top-0 lg:left-[12%]", rotate: "lg:rotate-6" },
          {
            className: "lg:absolute lg:top-[130px] lg:right-[12%]",
            rotate: "lg:-rotate-6",
          },
          {
            className: "lg:absolute lg:top-[520px] lg:left-[12%]",
            rotate: "lg:rotate-6",
          },
          {
            className: "lg:absolute lg:top-[690px] lg:right-[10%]",
            rotate: "lg:-rotate-6",
          },
        ]}
      />
    </section>
  );
}
