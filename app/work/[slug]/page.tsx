import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/layout/cursor";
import { FadeIn } from "@/components/ui/fade-in";
import { CountUp, ScrollProgress, SectionNav, Tilt } from "@/components/case-study/motion";
import { getProject, getNextProject, projects } from "@/lib/projects";
import { getCaseStudy, type Screen } from "@/lib/case-studies";

export function generateStaticParams() {
  return projects
    .filter((p) => p.caseStudyUrl)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  const study = getCaseStudy(slug);
  const description = study?.tagline ?? project.description;
  const path = `/work/${project.slug}`;
  return {
    title: `${project.name} Case Study`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${project.name} Case Study`,
      description,
      url: path,
      type: "article",
      // A page-level openGraph replaces the inherited one, so the image has
      // to be named here; it resolves against metadataBase (SITE_URL).
      images: [{ url: project.thumbnail, alt: project.thumbnailAlt }],
    },
  };
}

const SECTIONS = [
  { id: "problem", n: "01", label: "Problem" },
  { id: "assumptions", n: "02", label: "Assumptions" },
  { id: "flows", n: "03", label: "Key flows" },
  { id: "decisions", n: "04", label: "Decisions" },
  { id: "iteration", n: "05", label: "v1 → v2" },
  { id: "system", n: "06", label: "Visual system" },
  { id: "build", n: "07", label: "Build" },
  { id: "outcome", n: "08", label: "Outcome" },
];

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"];

/** A screenshot in a simple device frame that lifts a little on hover. */
function Phone({
  screen,
  className = "",
  eager = false,
  hover = true,
}: {
  screen: Screen;
  className?: string;
  eager?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[2rem] border border-white/10 bg-black p-[6px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-[transform,box-shadow,border-color] duration-500 ease-out ${hover ? "hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]" : ""} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screen.src}
        alt={screen.alt}
        // v2 captures carry a 54pt status bar (390×898); the v1 Figma exports are 393×852.
        width={screen.src.includes("-v2/") ? 390 : 393}
        height={screen.src.includes("-v2/") ? 898 : 852}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full rounded-[1.6rem]"
      />
    </div>
  );
}

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-6 flex items-center gap-3">
      <span className="text-accent">{n}</span>
      <span className="h-px w-8 bg-border-hair" />
      {children}
    </p>
  );
}

export default async function CaseStudyPage(
  props: PageProps<"/work/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();

  const next = getNextProject(slug);
  const { brand } = study;
  // A soft wash of the app's own colour, used behind screens so each study feels like its product.
  const glow = `radial-gradient(60% 55% at 50% 40%, ${brand.primary}55 0%, transparent 70%)`;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Cursor />
      <SectionNav items={SECTIONS} />

      <main className="overflow-x-clip pt-28">
        {/* ---------- Hero ---------- */}
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <FadeIn y={12} duration={0.5}>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-text"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> All work
            </Link>
          </FadeIn>

          <FadeIn y={16} delay={0.05}>
            <p className="eyebrow mt-10">
              {project.platform} · Case study · 6 min read
            </p>
            <h1 className="heading-1 mt-4 text-text">{project.name}</h1>
          </FadeIn>
          <FadeIn y={16} delay={0.12}>
            <p className="mt-6 max-w-3xl text-xl leading-[1.5] text-text md:text-[1.65rem]">
              {study.tagline}
            </p>
          </FadeIn>

          {/* The walkthrough is the main demo once it exists: most reviewers
              won't install an APK, and iPhones can't. */}
          {study.video ? (
            <FadeIn y={12} delay={0.18} className="mt-10">
              <figure className="overflow-hidden rounded-2xl border border-border-hair bg-bg-elev">
                <video
                  src={study.video.src}
                  poster={study.video.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black object-contain"
                />
                {study.video.caption ? (
                  <figcaption className="px-5 py-3 text-xs text-text-muted">{study.video.caption}</figcaption>
                ) : null}
              </figure>
            </FadeIn>
          ) : null}

          {study.links?.length ? (
            <FadeIn y={12} delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {study.links.map((l) => (
                <div key={l.href} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    <Download className="h-4 w-4" />
                    {l.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  {l.note ? <span className="text-xs text-text-muted">{l.note}</span> : null}
                </div>
              ))}
            </FadeIn>
          ) : null}

          <FadeIn y={12} delay={0.25}>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border-hair pt-8 md:grid-cols-4">
              {study.meta.map((m) => (
                <div key={m.label}>
                  <dt className="eyebrow mb-1 text-text-dim">{m.label}</dt>
                  <dd className="text-sm leading-relaxed text-text">{m.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </section>

        <section className="mx-auto max-w-6xl px-4 md:px-6">
          <div
            className="relative overflow-hidden rounded-3xl px-3 pt-10 md:px-12 md:pt-16"
            style={{ background: `linear-gradient(160deg, ${brand.primary} 0%, #0A0A0A 115%)` }}
          >
            {/* faint grid so the panel reads as a canvas, not a flat fill */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(70% 70% at 50% 30%, #000, transparent)",
              }}
            />
            <div className="relative mx-auto grid max-w-4xl grid-cols-[1fr_1.12fr_1fr] items-end gap-2 md:gap-10">
              <FadeIn y={60} delay={0.25} duration={0.9}>
                <div className="translate-y-10">
                  <Phone screen={study.hero[0]} eager hover={false} />
                </div>
              </FadeIn>
              <FadeIn y={80} delay={0.1} duration={1}>
                <Tilt max={6}>
                  <Phone screen={study.hero[1]} eager hover={false} />
                </Tilt>
              </FadeIn>
              <FadeIn y={60} delay={0.35} duration={0.9}>
                <div className="translate-y-10">
                  <Phone screen={study.hero[2]} eager hover={false} />
                </div>
              </FadeIn>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
          </div>
        </section>

        {/* ---------- TL;DR ---------- */}
        <section className="mx-auto max-w-6xl px-6 pt-14">
          <p className="eyebrow mb-4 text-text-dim">At a glance</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-hair bg-border-hair md:grid-cols-4">
            {study.tldr.map((t) => (
              <div key={t.label} className="group bg-bg p-6 transition-colors duration-300 hover:bg-bg-elev">
                <CountUp value={t.value} className="font-condensed text-4xl text-accent transition-transform duration-300 group-hover:-translate-y-0.5 md:text-5xl" />
                <p className="mt-2 text-sm leading-snug text-text-muted">{t.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 01 Context ---------- */}
        <section id="problem" className="mx-auto max-w-3xl scroll-mt-28 px-6 py-24 md:py-32">
          <SectionLabel n="01">The problem</SectionLabel>
          {study.context.problem.map((p, i) => (
            <FadeIn key={i} as="p" delay={i * 0.08} className="mt-5 text-lg leading-[1.75] text-text-muted first:mt-0 [&:first-of-type]:text-text">
              {p}
            </FadeIn>
          ))}
          <FadeIn delay={0.15} className="mt-10 rounded-2xl border border-dashed border-border-hair bg-bg-elev p-6">
            <p className="eyebrow mb-2 text-accent">A note on research</p>
            <p className="text-sm leading-[1.75] text-text-muted">{study.context.honesty}</p>
          </FadeIn>
        </section>

        {/* ---------- 02 Assumptions ---------- */}
        <section id="assumptions" className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-24 md:pb-32">
          <SectionLabel n="02">What I designed for</SectionLabel>
          <h2 className="max-w-3xl font-condensed text-4xl uppercase leading-[1.05] text-text md:text-5xl">
            {NUMBER_WORDS[study.assumptions.length] ?? study.assumptions.length} assumptions, written down before any screen
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {study.assumptions.map((a, i) => (
              <FadeIn
                key={a.title}
                delay={i * 0.07}
                className="group relative overflow-hidden rounded-2xl border border-border-hair bg-bg-elev p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/40"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover:bg-accent/10"
                />
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="mt-3 text-lg text-text">{a.title}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-text-muted">{a.body}</p>
              </FadeIn>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-[1.7] text-text-dim">{study.references}</p>
        </section>

        {/* ---------- 03 Flows ---------- */}
        <section id="flows" className="scroll-mt-20 border-y border-border-hair bg-bg-elev/40 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <SectionLabel n="03">Key flows</SectionLabel>
            <div className="space-y-28">
              {study.flows.map((f, i) => (
                <div key={f.title}>
                  <FadeIn className="grid gap-4 md:grid-cols-[1fr_1.4fr] md:items-end">
                    <h3 className="font-condensed text-3xl uppercase text-text md:text-4xl">
                      <span className="mr-3 text-text-dim">{String.fromCharCode(65 + i)}.</span>
                      {f.title}
                    </h3>
                    <p className="text-base leading-[1.7] text-text-muted">{f.body}</p>
                  </FadeIn>
                  <div className="relative">
                    <div aria-hidden className="pointer-events-none absolute -inset-x-6 inset-y-0" style={{ background: glow }} />
                    <div className="relative -mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:mx-0 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
                      {f.screens.map((s, j) => (
                        <FadeIn
                          key={s.src}
                          as="div"
                          delay={j * 0.09}
                          className="w-[62vw] max-w-[250px] shrink-0 snap-center md:w-[240px]"
                        >
                          <figure className="group">
                            <Phone screen={s} />
                            {s.caption ? (
                              <figcaption className="mt-4 flex gap-2 text-sm leading-snug text-text-muted transition-colors group-hover:text-text">
                                <span className="font-mono text-xs text-text-dim">{String(j + 1).padStart(2, "0")}</span>
                                {s.caption}
                              </figcaption>
                            ) : null}
                          </figure>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-text-dim md:hidden">Swipe to see more →</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 04 Decisions ---------- */}
        <section id="decisions" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:py-32">
          <SectionLabel n="04">Design decisions</SectionLabel>
          <div className="space-y-28">
            {study.decisions.map((d, i) => (
              <div
                key={d.title}
                className={`grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <FadeIn className="relative mx-auto w-full max-w-[300px]">
                  <div aria-hidden className="pointer-events-none absolute -inset-16" style={{ background: glow }} />
                  <Tilt className="relative">
                    <Phone screen={d.screen} hover={false} />
                  </Tilt>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-dim">
                    Decision {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-condensed text-3xl uppercase leading-[1.05] text-text md:text-5xl">
                    {d.title}
                  </h3>
                  <p className="mt-6 text-base leading-[1.75] text-text-muted md:text-lg">{d.why}</p>
                  {d.tradeoff ? (
                    <p className="mt-6 rounded-r-xl border-l-2 border-accent bg-accent-soft py-3 pl-4 pr-4 text-sm leading-[1.7] text-text-muted">
                      <span className="text-text">Trade-off: </span>
                      {d.tradeoff}
                    </p>
                  ) : null}
                </FadeIn>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 05 Iteration ---------- */}
        <section id="iteration" className="scroll-mt-20 border-y border-border-hair bg-bg-elev/40 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <SectionLabel n="05">v1 → v2</SectionLabel>
            <h2 className="max-w-3xl font-condensed text-4xl uppercase leading-[1.05] text-text md:text-5xl">
              What changed when the concept met real data
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-[1.7] text-text-muted">{study.iteration.intro}</p>

            <div className="mt-16 space-y-16">
              {study.iteration.pairs.map((p) => (
                <FadeIn
                  key={p.after.src + p.before.src}
                  className="group grid items-center gap-8 md:grid-cols-[1fr_auto_1fr_1.1fr]"
                >
                  <figure className="mx-auto w-full max-w-[220px]">
                    <p className="eyebrow mb-3 text-text-dim">Before · v1</p>
                    <Phone
                      screen={p.before}
                      hover={false}
                      className="opacity-70 grayscale-[45%] group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </figure>
                  <ArrowRight
                    aria-hidden
                    className="mx-auto hidden h-6 w-6 text-text-dim transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:text-accent md:block"
                  />
                  <figure className="mx-auto w-full max-w-[220px]">
                    <p className="eyebrow mb-3 text-accent">After · v2</p>
                    <Phone screen={p.after} />
                  </figure>
                  <p className="text-base leading-[1.7] text-text-muted md:text-lg">{p.note}</p>
                </FadeIn>
              ))}
            </div>

            {study.iteration.review ? (
              <FadeIn className="mt-24 grid gap-10 rounded-3xl border border-border-hair bg-bg p-8 md:grid-cols-[1fr_1.3fr] md:p-12">
                <div>
                  <p className="eyebrow mb-3 text-accent">Self-critique</p>
                  <h3 className="font-condensed text-3xl uppercase text-text md:text-4xl">
                    {study.iteration.review.title}
                  </h3>
                  <p className="mt-4 text-base leading-[1.7] text-text-muted">{study.iteration.review.body}</p>
                </div>
                <ol className="divide-y divide-border-hair">
                  {study.iteration.review.fixes.map((f, i) => (
                    <li
                      key={f}
                      className="flex gap-4 py-3.5 text-sm leading-[1.6] text-text-muted transition-colors first:pt-0 hover:text-text"
                    >
                      <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                      {f}
                    </li>
                  ))}
                </ol>
              </FadeIn>
            ) : null}
          </div>
        </section>

        {/* ---------- 06 System ---------- */}
        <section id="system" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:py-32">
          <SectionLabel n="06">Visual system</SectionLabel>
          <div>
            <div className={`grid gap-4 sm:grid-cols-2 ${study.system.colors.length === 5 ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
              {study.system.colors.map((c, i) => (
                <FadeIn
                  key={c.hex}
                  delay={i * 0.06}
                  className="group overflow-hidden rounded-2xl border border-border-hair transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="h-24 transition-[height] duration-500 group-hover:h-28" style={{ background: c.hex }} />
                  <div className="bg-bg-elev p-4">
                    <p className="text-sm text-text">{c.name}</p>
                    <p className="mt-1 font-mono text-xs text-text-dim">{c.hex}</p>
                    <p className="mt-2 text-xs leading-snug text-text-muted">{c.role}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <p className="text-sm leading-[1.7] text-text-muted">
              <span className="eyebrow mr-2 text-text-dim">Type</span>
              {study.system.type}
            </p>
            <p className="text-sm leading-[1.7] text-text-muted">{study.system.note}</p>
          </div>
        </section>

        {/* ---------- 07 Build ---------- */}
        <section id="build" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24 md:pb-32">
          <SectionLabel n="07">Built, not just drawn</SectionLabel>
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <FadeIn>
              <p className="text-lg leading-[1.7] text-text-muted">{study.build.intro}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {study.build.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-hair px-3 py-1 text-xs text-text-muted transition-colors duration-300 hover:border-accent/50 hover:text-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border-hair bg-border-hair sm:grid-cols-2">
              {study.build.points.map((p) => (
                <div key={p.title} className="group bg-bg p-6 transition-colors duration-300 hover:bg-bg-elev">
                  <h3 className="flex items-center gap-2 text-base text-text">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/50 transition-colors group-hover:bg-accent" />
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.65] text-text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 08 Outcome ---------- */}
        <section id="outcome" className="scroll-mt-20 border-t border-border-hair">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <SectionLabel n="08">Outcome and what’s next</SectionLabel>
            <div className="grid gap-6 md:grid-cols-3">
              {study.outcome.metrics.map((m, i) => (
                <FadeIn
                  key={m.label}
                  delay={i * 0.08}
                  className="rounded-2xl border border-border-hair bg-bg-elev p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/40"
                >
                  <CountUp value={m.value} className="font-condensed text-4xl text-accent md:text-5xl" />
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-text-dim">{m.label}</p>
                </FadeIn>
              ))}
            </div>
            <div className="mt-16 grid gap-12 md:grid-cols-2">
              <div>
                <p className="eyebrow mb-4 text-text-dim">If I took it further</p>
                <ol className="space-y-4">
                  {study.outcome.next.map((n, i) => (
                    <li key={n} className="flex gap-4 text-base leading-[1.6] text-text-muted">
                      <span className="font-mono text-sm text-accent">0{i + 1}</span>
                      {n}
                    </li>
                  ))}
                </ol>
              </div>
              <FadeIn as="div">
                <blockquote className="border-l-2 border-accent pl-6 text-xl leading-[1.6] text-text md:text-2xl">
                  “{study.outcome.lesson}”
                </blockquote>
              </FadeIn>
            </div>
          </div>
        </section>

        {next && (
          <section className="border-t border-border-hair">
            <Link
              href={next.liveUrl ?? next.caseStudyUrl ?? "/"}
              target={next.liveUrl ? "_blank" : undefined}
              rel={next.liveUrl ? "noopener noreferrer" : undefined}
              className="group mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-16 transition-colors hover:bg-bg-elev/40"
            >
              <div>
                <p className="eyebrow mb-2 text-text-dim">Next project</p>
                <h3 className="font-condensed text-4xl uppercase text-text transition-colors duration-300 group-hover:text-accent md:text-6xl">
                  {next.name}
                </h3>
              </div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-hair transition-[background-color,border-color] duration-300 group-hover:border-accent group-hover:bg-accent">
                <ArrowRight className="h-6 w-6 text-text-muted transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-[#0A0A0A]" />
              </span>
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
