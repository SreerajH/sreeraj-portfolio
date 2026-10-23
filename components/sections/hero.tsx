import MascotPortfolioHero from "@/components/ui/mascot-portfolio-hero";

export function Hero() {
  return (
    // The navbar is fixed over the top 4rem; start the poster under it so the
    // poster's own top rule doesn't collide with the nav links.
    <section className="pt-16">
      <MascotPortfolioHero
        height="calc(100svh - 4rem)"
        title="Sreeraj H, UI/UX Designer & Developer"
        index="Portfolio"
        discipline="Sreeraj H"
        tagline="UI/UX Designer & Developer"
        collection={["Selected", "Works"]}
        reel={["Available for work", "Bengaluru, India"]}
        year="2026"
        initials="SH"
        badge="Hire me"
        line2="Designer"
        line3="Developer"
        word="Work"
        verticalTag="UI/UX"
        bracketed="S"
        seekingLabel="Open to*"
        seeking="New projects"
        href="#contact"
        services={[
          "UI/UX Design",
          "Web Development",
          "Mobile App Design",
          "Design Systems",
        ]}
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
