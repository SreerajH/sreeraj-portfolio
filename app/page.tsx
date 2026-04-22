import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/layout/cursor";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { WorkGrid } from "@/components/sections/work-grid";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Cursor />

      <main>
        <Hero />
        <Marquee />
        <About />
        <WorkGrid />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
