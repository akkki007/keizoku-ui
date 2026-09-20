import { cache, type ReactNode } from "react";
import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { SiteNavbar } from "@/components/site/site-navbar";
import { DocsBar } from "@/components/docs/docs-bar";
import "nextra-theme-docs/style.css";
import "./docs.css";

const getCachedPageMap = cache(async () => getPageMap("/docs"));

export default async function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="keizoku-docs">
      {/* The site's own bar stays; Nextra's is dropped so there is one
          navigation system on the page rather than two stacked. */}
      <SiteNavbar />
      <DocsBar />
      <Layout
        navbar={null}
        /* Nextra mounts its own next-themes provider inside ours. Matching
           the settings keeps the two from disagreeing on first paint, when
           nothing is stored yet. */
        nextThemes={{ attribute: "class", defaultTheme: "dark", disableTransitionOnChange: true }}
        pageMap={await getCachedPageMap()}
        footer={<></>}
        editLink={null}
        feedback={{ content: null }}
        darkMode={false}
        copyPageButton={false}
        sidebar={{ defaultMenuCollapseLevel: 3, toggleButton: false }}
        toc={{ backToTop: null }}
      >
        {children}
      </Layout>
    </div>
  );
}
