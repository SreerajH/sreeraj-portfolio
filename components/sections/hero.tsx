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
        // Kept deliberately bare: the headline, one sentence and the mascot.
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
        headlineScale={1.15}
        subheading="I'm Sreeraj, a UI/UX designer and developer taking websites and apps from first sketch to live launch."
        glow="#1558C9"
        seeking=""
        services={[
          "UI/UX Design",
          "Web Development",
          "Mobile App Design",
          "Design Systems",
        ]}
        // Phones and tablets only; large screens have "Let's talk" in the navbar.
        actions={
          <>
            <SectionLink
              id="contact"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-text"
            >
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </SectionLink>
            <SectionLink
              id="work"
              className="inline-flex min-h-11 items-center rounded-full border border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-[#0A0A0A]"
            >
              View work
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
