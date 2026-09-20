import nextra from "nextra";

const withNextra = nextra({
  // MDX in src/content/ is served under /docs, matching the
  // [[...mdxPath]] catch-all in src/app/docs/.
  contentDirBasePath: "/docs",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  // The install page renders the real token stylesheet by reading it, so the
  // file has to travel with the docs route's build output.
  outputFileTracingIncludes: {
    "/docs/[[...mdxPath]]": ["./src/styles/*.css"],
  },
  async headers() {
    return [
      {
        // The registry is a public API: `shadcn add` fetches these
        // JSON files cross-origin from the user's own project.
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./src/mdx-components.tsx",
    },
  },
};

export default withNextra(nextConfig);
