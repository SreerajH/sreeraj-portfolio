/**
 * The site's public origin: the one source for metadataBase, canonical URLs,
 * Open Graph / Twitter images, the sitemap and robots.txt.
 *
 * Set NEXT_PUBLIC_SITE_URL (e.g. https://sreerajh.com) once a custom domain
 * is live; until then the Vercel URL is used.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sreeraj-portfolio.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Sreeraj H";
export const SITE_TITLE = "Sreeraj H | UI/UX Designer & Developer";
