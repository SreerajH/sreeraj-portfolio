"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

/**
 * Links to a section of the home page. On the home page it glides there;
 * anywhere else (a case study) it navigates home and lands on the section.
 */
export function SectionLink({
  id,
  className,
  children,
  onNavigate,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  /** Runs before navigating, e.g. to close a menu. */
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/#${id}`}
      className={className}
      onClick={(event) => {
        onNavigate?.();
        const element = document.getElementById(id);
        if (!element) return;
        event.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {children}
    </Link>
  );
}

/** Links home; on the home page itself it glides back up to the hero. */
export function HomeLink({
  children,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (pathname !== "/") return;
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) history.replaceState(null, "", "/");
      }}
    >
      {children}
    </Link>
  );
}
