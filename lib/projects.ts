/** What was built: shown as the WEB / MOBILE APP tag. */
export type ProjectPlatform = "WEB" | "MOBILE APP" | "CASE STUDY";
/**
 * Who it was for. "Concept" is self-initiated work built to a realistic brief;
 * switch a project to "Client" once it was made for a paying client.
 */
export type ProjectCategory = "Concept" | "Client" | "Personal";
export type GlowColor = "lime" | "orange" | "green" | "purple" | "red" | "blue";

export type Project = {
  slug: string;
  name: string;
  platform: ProjectPlatform;
  category: ProjectCategory;
  description: string;
  thumbnail: string;
  /** Describes the thumbnail for screen readers and search. */
  thumbnailAlt: string;
  /** Live demo deployment, or null for design-only case studies. */
  liveUrl: string | null;
  caseStudyUrl?: string;
  tech: string[];
  year: string;
  glowColor: GlowColor;
  role?: string;
  tools?: string[];
};

export const projects: Project[] = [
  {
    slug: "ironform",
    name: "Ironform Strength Club",
    platform: "WEB",
    category: "Concept",
    description:
      "Gym website for a Bengaluru strength club with programs, coaches, class schedule and plans.",
    thumbnail: "/projects/ironform.jpg",
    thumbnailAlt: "Ironform Strength Club gym website homepage",
    // TODO: replace with subdomain of custom domain once set up
    liveUrl: "https://ironform-strength-club.vercel.app/",
    tech: ["Next.js", "Tailwind", "Framer Motion"],
    year: "2026",
    glowColor: "orange",
  },
  {
    slug: "lumina",
    name: "Lumina",
    platform: "WEB",
    category: "Concept",
    description:
      "AI SaaS landing page for a writing, design, and automation tool.",
    thumbnail: "/projects/lumina.jpg",
    thumbnailAlt: "Lumina AI writing studio landing page with a large VOICE headline",
    // TODO: replace with subdomain of custom domain once set up
    liveUrl: "https://lumina-saas-ai.vercel.app/",
    tech: ["React", "Express", "Figma"],
    year: "2025",
    glowColor: "purple",
  },
  {
    slug: "velmont",
    name: "Velmont Private Estates",
    platform: "WEB",
    category: "Concept",
    description:
      "Luxury real estate site for private residences, with a cinematic hero and private viewing enquiries.",
    thumbnail: "/projects/velmont.jpg",
    thumbnailAlt: "Velmont Private Estates homepage with a snow-covered alpine house",
    // TODO: replace with subdomain of custom domain once set up
    liveUrl: "https://velmont-private-estates.vercel.app/",
    tech: ["Next.js", "Framer Motion", "Tailwind"],
    year: "2025",
    glowColor: "orange",
  },
  {
    slug: "nacre-dental",
    name: "Nacre Dental Studio",
    platform: "WEB",
    category: "Concept",
    description:
      "Dental clinic website with treatments, doctors, reviews and WhatsApp booking.",
    thumbnail: "/projects/nacre-dental.jpg",
    thumbnailAlt: "Nacre Dental Studio clinic website homepage with a treatment room photo",
    // TODO: replace with subdomain of custom domain once set up
    liveUrl: "https://nacre-dental-studio.vercel.app/",
    tech: ["Next.js", "Tailwind", "Framer Motion"],
    year: "2026",
    glowColor: "blue",
  },
  {
    slug: "appvault",
    name: "AppVault",
    platform: "WEB",
    category: "Concept",
    description:
      "Play Store-style app marketplace with auth, DB, and 11 API routes.",
    thumbnail: "/projects/appvault.jpg",
    thumbnailAlt: "AppVault app marketplace Today page with the app of the day",
    // TODO: replace with subdomain of custom domain once set up
    liveUrl: "https://appvault-xi.vercel.app/",
    tech: ["Next.js 14", "Prisma", "NextAuth", "TypeScript"],
    year: "2025",
    glowColor: "green",
  },
  {
    slug: "brutus-studio",
    name: "Brutus Studio",
    platform: "WEB",
    category: "Concept",
    description:
      "Brutalist design studio concept with bold type and grid.",
    thumbnail: "/projects/brutus.jpg",
    thumbnailAlt: "Brutus Studio design studio website homepage",
    // TODO: replace with subdomain of custom domain once set up
    liveUrl: "https://brutus-studio.vercel.app/",
    tech: ["Next.js", "Tailwind"],
    year: "2025",
    glowColor: "red",
  },
  {
    slug: "wayfare",
    name: "Wayfare",
    platform: "MOBILE APP",
    category: "Concept",
    description:
      "Travel planning app with booking flow, itineraries and tickets.",
    thumbnail: "/projects/wayfare.jpg",
    thumbnailAlt: "Wayfare travel app home and Tokyo destination screens on three phones",
    liveUrl: null,
    caseStudyUrl: "/work/wayfare",
    tech: ["Figma", "Instrument Sans"],
    year: "2025",
    glowColor: "green",
    role: "Lead Designer",
    tools: ["Figma", "FigJam", "Notion"],
  },
  {
    slug: "healthhub",
    name: "HealthHub",
    platform: "MOBILE APP",
    category: "Concept",
    description:
      "Family health records app for profiles, appointments and records.",
    thumbnail: "/projects/healthyhub.jpg",
    thumbnailAlt: "HealthHub family health app home and profiles screens on three phones",
    liveUrl: null,
    caseStudyUrl: "/work/healthhub",
    tech: ["Figma", "UX Research"],
    year: "2025",
    glowColor: "blue",
    role: "UX Designer",
    tools: ["Figma", "Maze", "Notion"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}

export function getNextProject(slug: string) {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx < 0) return null;
  return projects[(idx + 1) % projects.length];
}
