import type { MetadataRoute } from "next";
import { getPageMap } from "nextra/page-map";
import { absoluteUrl } from "@/lib/site";

/** Nextra's page map is a tree of pages, folders and separators. Only the
 *  entries that carry a route are real URLs. */
function collectRoutes(items: unknown[], found: Set<string>): void {
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const node = item as { route?: unknown; children?: unknown };
    if (typeof node.route === "string" && node.route.startsWith("/docs/")) {
      found.add(node.route);
    }
    if (Array.isArray(node.children)) collectRoutes(node.children, found);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = new Set<string>();
  collectRoutes(await getPageMap("/docs"), routes);

  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...[...routes].sort().map((route) => ({
      url: absoluteUrl(route),
      lastModified,
      changeFrequency: "weekly" as const,
      // The entry point outranks the rest of the docs.
      priority: route === "/docs/introduction" ? 0.9 : 0.7,
    })),
  ];
}
