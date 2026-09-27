import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  /* Preview deployments must not compete with production in the index, and
     they are the one place a stray canonical can do real damage. */
  const isPreview = process.env.VERCEL_ENV === "preview";

  return {
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : {
          userAgent: "*",
          allow: "/",
          // Generated output: the search index and the registry manifests.
          // Useful to a CLI, noise to a crawler.
          disallow: ["/_pagefind/", "/r/"],
        },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
