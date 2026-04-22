export type ProjectCategory = "WEB" | "MOBILE APP" | "CASE STUDY";
export type GlowColor = "lime" | "orange" | "green" | "purple" | "red" | "blue";

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  description: string;
  thumbnail: string;
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
    slug: "luxe-estate",
    name: "Luxe Estate",
    category: "WEB",
    description:
      "Luxury real estate site with WebGL shaders and animated hero.",
    thumbnail: "/projects/luxe-estate.jpg",
    liveUrl: "https://lux-estate-one.vercel.app/",
    tech: ["Next.js", "Framer Motion", "WebGL", "Tailwind"],
    year: "2025",
    glowColor: "orange",
  },
  {
    slug: "appvault",
    name: "AppVault",
    category: "WEB",
    description:
      "Play Store-style app marketplace with auth, DB, and 11 API routes.",
    thumbnail: "/projects/appvault.jpg",
    liveUrl: "https://appvault-xi.vercel.app/",
    tech: ["Next.js 14", "Prisma", "NextAuth", "TypeScript"],
    year: "2025",
    glowColor: "green",
  },
  {
    slug: "lumina",
    name: "Lumina",
    category: "WEB",
    description:
      "AI SaaS landing page for a writing, design, and automation tool.",
    thumbnail: "/projects/lumina.jpg",
    liveUrl: "https://lumina-saas-ai.vercel.app/",
    tech: ["React", "Express", "Figma"],
    year: "2025",
    glowColor: "purple",
  },
  {
    slug: "brutus-studio",
    name: "Brutus Studio",
    category: "WEB",
    description:
      "Brutalist design studio concept with bold type and grid.",
    thumbnail: "/projects/brutus.jpg",
    liveUrl: "https://brutus-studio.vercel.app/",
    tech: ["Next.js", "Tailwind"],
    year: "2025",
    glowColor: "red",
  },
  {
    slug: "wayfare",
    name: "Wayfare",
    category: "MOBILE APP",
    description:
      "Thoughtful travel planning app — booking flow, itineraries, tickets.",
    thumbnail: "/projects/wayfare.jpg",
    liveUrl: null,
    caseStudyUrl: "/work/wayfare",
    tech: ["Figma", "Instrument Sans"],
    year: "2025",
    glowColor: "green",
    role: "Lead Designer",
    tools: ["Figma", "FigJam", "Notion"],
  },
  {
    slug: "healthyhub",
    name: "HealthHub",
    category: "MOBILE APP",
    description:
      "Family health records app — profiles, appointments, records management.",
    thumbnail: "/projects/healthyhub.jpg",
    liveUrl: null,
    caseStudyUrl: "/work/healthyhub",
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
