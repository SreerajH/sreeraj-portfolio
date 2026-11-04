import MascotPortfolioHero from "@/components/ui/mascot-portfolio-hero";

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
