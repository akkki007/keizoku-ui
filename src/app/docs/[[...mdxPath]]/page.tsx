import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ mdxPath?: string[] }> };

export const generateStaticParams = generateStaticParamsFor("mdxPath");

/* Every docs page is known at build time, so anything else is a 404 rather
   than an on-demand render that would throw inside importPage. */
export const dynamicParams = false;

const Wrapper = getMDXComponents().wrapper;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mdxPath } = await params;
  // /docs has no page of its own to import — the route redirects instead.
  if (!mdxPath?.length) return { title: "Docs", robots: { index: false, follow: true } };

  const { metadata } = await importPage(mdxPath);
  const pathname = "/docs/" + mdxPath.join("/");
  /* The root layout's template appends the site name, so pages carry only
     their own. The OG and Twitter titles need it spelled out, since neither
     goes through the template. */
  const name = typeof metadata.title === "string" ? metadata.title : "Docs";
  const description =
    (typeof metadata.description === "string" && metadata.description) ||
    `${name} — ${site.name} documentation.`;

  /* Setting `openGraph` here replaces the object the root layout supplied,
     including the image Next injects from opengraph-image.tsx — so the card
     has to be named explicitly. */
  const card = `/og?title=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`;
  const images = [{ url: card, width: 1200, height: 630, alt: `${name} — ${site.name}` }];

  return {
    ...metadata,
    title: name,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type: "article",
      url: pathname,
      siteName: site.name,
      title: `${name} — ${site.name}`,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${site.name}`,
      description,
      images,
    },
  };
}

export default async function DocsPage({ params }: PageProps) {
  const resolved = await params;
  // /docs itself has no page of its own; the introduction is the first entry.
  if (!resolved.mdxPath?.length) redirect("/docs/introduction");
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(resolved.mdxPath);
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <div id="main-content" tabIndex={-1}>
        <MDXContent params={resolved} />
      </div>
    </Wrapper>
  );
}
