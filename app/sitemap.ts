import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = projects
    .filter((p) => p.caseStudyUrl)
    .map((p) => ({
      url: `${SITE_URL}${p.caseStudyUrl}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...caseStudies,
  ];
}
