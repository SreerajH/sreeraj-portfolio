import { ArrowRight } from "lucide-react";
import MascotPortfolioHero from "@/components/ui/mascot-portfolio-hero";
import { SectionLink } from "@/components/layout/nav-links";

export function Hero() {
  return (
    // The navbar is fixed over the top 4rem; start the poster under it.
    <section className="pt-16">
      <MascotPortfolioHero
        height="calc(100svh - 4rem)"
        title="Designed. Built. Shipped. Sreeraj H, UI/UX designer and developer"
        topRow={false}
        swash={false}
        rules={false}
        // Three beats of the process, one per line.
        year="Designed."
        initials=""
        badge=""
        line2="Built."
        line3="Shipped."
        word=""
        // Who and where first, so the slogan isn't doing the job of a title.
        eyebrow={
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text md:text-sm">
              UI/UX designer &amp; developer<span className="hidden sm:inline"> · Bengaluru</span>
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-text-muted backdrop-blur">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="sm:hidden">Open to UI/UX &amp; dev roles</span>
              <span className="hidden sm:inline">Open to UI/UX and design-engineer roles</span>
            </p>
          </>
        }
        subheading="I design mobile and web products in Figma, then build them in React Native and Next.js. Two shipped Android apps below, with the trade-offs."
        glow="#1558C9"
        seeking=""
        // What I do lives in the Tools section; the fold is for proof.
        services={[]}
        actions={
          <>
            <SectionLink
              id="case-studies"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-text"
            >
              <span className="sm:hidden">Case studies</span>
              <span className="hidden sm:inline">See the case studies</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </SectionLink>
            <SectionLink
              id="hire"
              className="inline-flex min-h-11 items-center rounded-full border border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-[#0A0A0A]"
            >
              Resume &amp; links
            </SectionLink>
          </>
        }
        greetings={[
          "Hi, I'm Sreeraj!",
          "Let's make something unignorable.",
          "Psst, I'm open to work.",
          "Okay, you can stop poking me :)",
        ]}
      />
    </section>
  );
}
