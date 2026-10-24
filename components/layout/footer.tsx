import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import {
  LinkedinIcon,
  FiverrIcon,
  BehanceIcon,
} from "@/components/ui/brand-icons";
import { HomeLink, SectionLink } from "@/components/layout/nav-links";
import { SECTIONS } from "@/lib/sections";

const SOCIAL = [
  {
    href: "https://linkedin.com/in/sreerajh",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    href: "https://fiverr.com/sreeraj_h",
    label: "Fiverr",
    icon: FiverrIcon,
  },
  {
    href: "https://www.behance.net/sreerajh20",
    label: "Behance",
    icon: BehanceIcon,
  },
  {
    href: "mailto:hsreeraj4@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-hair">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3 md:gap-6">
        <div>
          <HomeLink
            aria-label="Sreeraj H, back to top"
            className="inline-block"
          >
            <Image
              src="/logo.png"
              alt=""
              width={207}
              height={206}
              className="h-9 w-9 transition-transform duration-300 hover:rotate-[-8deg]"
            />
          </HomeLink>
          <p className="mt-2 text-xs text-text-dim">© 2026 Sreeraj H</p>
        </div>

        <ul className="flex flex-wrap items-center gap-8 md:justify-center">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <SectionLink
                id={s.id}
                className="nav-link text-[15px] font-medium text-text/85 hover:text-text"
              >
                {s.label}
              </SectionLink>
            </li>
          ))}
        </ul>

        <ul className="flex gap-4 md:justify-end">
          {SOCIAL.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.label}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-hair text-text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-border-hair">
        <p className="mx-auto max-w-6xl px-6 py-4 text-[0.7rem] uppercase tracking-[0.15em] text-text-dim">
          Designed &amp; built in Bengaluru. Last updated October 2026.
        </p>
      </div>
    </footer>
  );
}
