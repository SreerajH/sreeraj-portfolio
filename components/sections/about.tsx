import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { Magnetic } from "@/components/layout/magnetic";

const ASSETS =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7";

/* Decorative 3D pieces pinned to the corners; each slides in from its own side.
   The top pair sits at 10% rather than 4% to stay clear of the fixed navbar. */
const CORNERS = [
  {
    src: `${ASSETS}/moon_icon.11395d36.png`,
    className:
      "top-[10%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]",
    delay: 0.1,
    x: -80,
  },
  {
    src: `${ASSETS}/p59_1.4659672e.png`,
    className:
      "bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]",
    delay: 0.25,
    x: -80,
  },
  {
    src: `${ASSETS}/lego_icon-1.703bb594.png`,
    className:
      "top-[10%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]",
    delay: 0.15,
    x: 80,
  },
  {
    src: `${ASSETS}/Group_134-1.2e04f3ce.png`,
    className:
      "bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]",
    delay: 0.3,
    x: 80,
  },
];

const FLOAT_SECONDS = [7, 8.5, 6.5, 9];

const COPY = [
  { text: "I'm Sreeraj, a UI/UX designer who also " },
  { text: "writes the code.", accent: true },
  {
    text: " I design websites and mobile apps that feel clear and effortless, then build them myself, so nothing gets lost between design and launch. Based in Bengaluru, open to new projects.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      {CORNERS.map((c, i) => (
        <FadeIn
          key={c.src}
          delay={c.delay}
          duration={0.9}
          x={c.x}
          y={0}
          className={cn("pointer-events-none absolute z-0", c.className)}
        >
          {/* Each piece floats on its own period and phase, so they never
              bob in step with one another. */}
          <div
            className="float-slow"
            style={{
              animationDuration: `${FLOAT_SECONDS[i]}s`,
              animationDelay: `${-i * 1.7}s`,
            }}
          >
            {/* The source art is blue/purple glass; rendered as chrome so lime
                stays the only accent on the page. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt=""
              aria-hidden="true"
              className="h-auto w-full brightness-110 contrast-110 grayscale"
            />
          </div>
        </FadeIn>
      ))}

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn
            as="h2"
            y={40}
            className="gradient-heading whitespace-nowrap text-center font-display uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 10vw, 128px)" }}
          >
            About me
          </FadeIn>

          <ScrollRevealText
            segments={COPY}
            className="max-w-[560px] text-center font-medium leading-relaxed text-text"
            style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
          />
        </div>

        <FadeIn delay={0.3} y={20}>
          <Magnetic>
            <a
              href="#contact"
              className="pulse-ring inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-[#0A0A0A] transition-opacity duration-200 hover:opacity-90 active:opacity-75 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
              style={{
                background:
                  "linear-gradient(123deg, #7FA300 7%, #B4E600 37%, #C8FF00 72%, #E6FF8A 100%)",
                boxShadow:
                  "0px 4px 4px rgba(200, 255, 0, 0.2), 4px 4px 12px #6E8C00 inset",
                outline: "2px solid rgba(10, 10, 10, 0.55)",
                outlineOffset: "-3px",
              }}
            >
              Contact me
            </a>
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  );
}
