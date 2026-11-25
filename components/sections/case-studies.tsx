import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/fade-in";
import { caseStudyProjects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/case-studies";

/**
 * The in-depth write-ups get their own section near the top, so nobody has to
 * scroll through the whole work deck to find the process behind the screens.
 */
export function CaseStudies() {
  const items = caseStudyProjects
    .map((p) => ({ p, s: getCaseStudy(p.slug) }))
    .filter((x): x is { p: (typeof caseStudyProjects)[number]; s: NonNullable<ReturnType<typeof getCaseStudy>> } => !!x.s);

  return (
    <section id="case-studies" className="relative scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading kicker="Problem to shipped app" lead="Case" highlight="studies" />
          <p className="max-w-sm text-sm leading-relaxed text-text-dim">
            Designed in Figma, then built and shipped as real Android apps. The full story, from
            assumptions to trade-offs.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {items.map(({ p, s }, i) => {
            const apk = s.links?.[0];
            return (
              <FadeIn key={p.slug} delay={i * 0.1} className="group relative h-full">
                <Link
                  href={p.caseStudyUrl ?? `/work/${p.slug}`}
                  data-cursor="view"
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-border-hair bg-bg-elev transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnail}
                      alt={p.thumbnailAlt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs text-text-dim">
                          {String(i + 1).padStart(2, "0")} · {p.platform} · {p.year}
                        </p>
                        <h3 className="mt-2 font-condensed text-4xl uppercase leading-none text-text transition-colors duration-300 group-hover:text-accent md:text-5xl">
                          {p.name}
                        </h3>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-hair transition-[background-color,border-color] duration-300 group-hover:border-accent group-hover:bg-accent">
                        <ArrowUpRight className="h-5 w-5 text-text transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0A0A0A]" />
                      </span>
                    </div>

                    <p className="mt-4 text-base leading-[1.6] text-text-muted">{s.tagline}</p>

                    <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border-hair pt-5">
                      {s.tldr.slice(0, 3).map((t) => (
                        <div key={t.label}>
                          <dt className="sr-only">{t.label}</dt>
                          <dd>
                            <span className="block font-condensed text-2xl text-accent md:text-3xl">{t.value}</span>
                            <span className="mt-1 block text-xs leading-snug text-text-dim">{t.label}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-auto pt-6 text-sm font-medium text-text">Read case study →</p>
                  </div>
                </Link>

                {/* Outside the card link, so it doesn't nest one link inside another. */}
                {apk ? (
                  <a
                    href={apk.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 right-6 inline-flex items-center gap-1.5 rounded-full border border-border-hair bg-bg/80 px-3.5 py-1.5 text-xs text-text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent md:bottom-8 md:right-8"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Android APK
                  </a>
                ) : null}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
