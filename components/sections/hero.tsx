import MascotPortfolioHero from "@/components/ui/mascot-portfolio-hero";

export function Hero() {
  return (
    // The navbar is fixed over the top 4rem; start the poster under it so the
    // poster's own top rule doesn't collide with the nav links.
    <section className="pt-16">
      <MascotPortfolioHero
        height="calc(100svh - 4rem)"
        title="Designed. Built. Shipped. Sreeraj H, UI/UX designer and developer"
        index="Portfolio"
        discipline="Sreeraj H"
        tagline="UI/UX Designer & Developer"
        collection={["Design", "Code"]}
        reel={["Available for work", "Bengaluru, India"]}
        // Three beats of the process, one per line.
        year="Designed."
        initials=""
        badge="Hire me"
        line2="Built."
        line3="Shipped."
        word=""
        headlineScale={1.15}
        glow="#1558C9"
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
