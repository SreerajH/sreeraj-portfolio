import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/layout/cursor";
import { GalleryGridBlock } from "@/components/ui/gallery-grid-block";
import { getProject, getNextProject, projects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/case-studies";

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
  return {
    title: `${project.name} — Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.name} — Case Study`,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default async function CaseStudyPage(
  props: PageProps<"/work/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();

  const next = getNextProject(slug);

  return (
    <>
      <Navbar />
      <Cursor />

      <main className="pt-28">
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-text"
          >
            <ArrowLeft className="h-3 w-3" /> All work
          </Link>

          <p className="eyebrow mt-10">{project.category} · {project.year}</p>
          <h1 className="heading-1 mt-4 text-text">{project.name}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-[1.65] text-text-muted">
            {project.description}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border-hair pt-8 md:grid-cols-4">
            <div>
              <dt className="eyebrow mb-1 text-text-dim">Role</dt>
              <dd className="text-sm text-text">{project.role ?? "Designer"}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-text-dim">Year</dt>
              <dd className="text-sm text-text">{project.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow mb-1 text-text-dim">Tools</dt>
              <dd className="flex flex-wrap gap-2">
                {(project.tools ?? project.tech).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-hair px-3 py-1 text-xs text-text-muted"
                  >
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mx-auto max-w-6xl px-6">
          <div
            className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border-hair"
            style={{ background: "#111111" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.cover}
              alt={`${project.name} cover`}
              className="block h-auto w-full"
              style={{ objectFit: "contain", background: "#111111" }}
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <p className="eyebrow mb-4">The Problem</p>
          {study.problem.map((p, i) => (
            <p
              key={i}
              className="mt-4 text-lg leading-[1.65] text-text-muted first:mt-0"
            >
              {p}
            </p>
          ))}
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <p className="eyebrow mb-6">Research</p>
          <ul className="grid gap-4 md:grid-cols-2">
            {study.research.map((r, i) => (
              <li
                key={i}
                className="rounded-2xl border border-border-hair bg-bg-elev p-6 text-sm leading-[1.65] text-text-muted"
              >
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="eyebrow mb-10">Design Decisions</p>
          <div className="space-y-20">
            {study.decisions.map((d, i) => (
              <div
                key={d.title}
                className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div
                  className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-border-hair"
                  style={{ background: "#111111", minHeight: "420px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.image}
                    alt={d.title}
                    loading="lazy"
                    className="block h-auto max-h-[620px] w-auto max-w-full"
                    style={{ objectFit: "contain", background: "#111111" }}
                  />
                </div>
                <div>
                  <h3 className="font-serif text-3xl tracking-tight text-text md:text-4xl">
                    {d.title}
                  </h3>
                  <p className="mt-4 text-base leading-[1.65] text-text-muted">
                    {d.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="eyebrow mb-10">Screens</p>
          <GalleryGridBlock items={study.gallery} />
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <p className="eyebrow mb-6">Outcome</p>
          <div className="grid gap-6 md:grid-cols-3">
            {study.outcome.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border-hair bg-bg-elev p-6"
              >
                <p className="font-serif text-3xl tracking-tight text-accent md:text-4xl">
                  {m.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-text-dim">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-base leading-[1.65] text-text-muted">
            {study.outcome.lessons}
          </p>
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
                <h3 className="font-serif text-4xl tracking-tight text-text md:text-6xl">
                  {next.name}
                </h3>
              </div>
              <ArrowRight className="h-8 w-8 text-text-muted transition-transform group-hover:translate-x-2" />
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
