import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";

type PageProps = { params: Promise<{ mdxPath?: string[] }> };

export const generateStaticParams = generateStaticParamsFor("mdxPath");

const Wrapper = getMDXComponents().wrapper;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mdxPath } = await params;
  // /docs has no page of its own to import — the route redirects instead.
  if (!mdxPath?.length) return { title: "Docs — Keizoku UI" };
  const { metadata } = await importPage(mdxPath);
  const pathname = "/docs" + (mdxPath?.length ? "/" + mdxPath.join("/") : "");
  const title = metadata.title ? `${metadata.title} — Keizoku UI` : "Docs — Keizoku UI";
  return {
    ...metadata,
    title,
    description:
      metadata.description ||
      "Keizoku UI documentation: installation, tokens and component reference.",
    alternates: { canonical: pathname },
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
