import Link from "next/link";
import { Mail } from "lucide-react";
import { LinkedinIcon, FiverrIcon, BehanceIcon } from "@/components/ui/brand-icons";

const QUICK = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

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
          <div className="font-serif text-2xl italic">SH</div>
          <p className="mt-2 text-xs text-text-dim">© 2026 Sreeraj H</p>
        </div>

        <ul className="flex flex-wrap gap-5 md:justify-center">
          {QUICK.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-text-muted transition-colors hover:text-text"
              >
                {l.label}
              </Link>
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
          Designed &amp; built in Bengaluru. Last updated April 2026.
        </p>
      </div>
    </footer>
  );
}
