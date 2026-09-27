/** One source of truth for everything that needs to name or link the site:
 *  metadata, the sitemap, robots, the OG image and the structured data. */

/* Preview deployments get their own absolute URLs, so canonical links and OG
   images point at the deployment being previewed rather than at production.
   VERCEL_PROJECT_PRODUCTION_URL is stable across production deploys;
   VERCEL_URL changes per deployment. */
function resolveUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://keizoku.akkki.tech";
}

export const site = {
  name: "Keizoku UI",
  /** 継続 — continuation. */
  wordmark: "継続",
  url: resolveUrl(),
  tagline: "Components with staying power",
  description:
    "A React component library where the layout system is the ornament: drawn, not implied. Installs as source you own, through the shadcn CLI.",
  author: "akkki007",
  repository: "https://github.com/akkki007/keizoku-ui",
  keywords: [
    "react component library",
    "shadcn registry",
    "tailwind css v4",
    "next.js components",
    "design system",
    "react ui components",
    "copy paste components",
  ],
} as const;

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
