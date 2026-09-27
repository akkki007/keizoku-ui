import { cache, type ReactNode } from "react";
import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { SiteNavbar } from "@/components/site/site-navbar";
import { DocsBar } from "@/components/docs/docs-bar";
import { CommandMenuProvider, type NavEntry } from "@/components/docs/command-menu";
import { SidebarSearch } from "@/components/docs/sidebar-search";
import "nextra-theme-docs/style.css";
import "./docs.css";

const getCachedPageMap = cache(async () => getPageMap("/docs"));

/** Flatten the page map into the list the palette shows before you type,
 *  keeping each page under the heading it sits beneath in the sidebar. */
function collectNavigation(items: unknown[]): NavEntry[] {
  const entries: NavEntry[] = [];
  let section: string | undefined;

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const node = item as { type?: unknown; title?: unknown; name?: unknown; route?: unknown };

    if (node.type === "separator") {
      section = typeof node.title === "string" ? node.title : undefined;
      continue;
    }
    if (typeof node.route === "string" && node.route.startsWith("/docs/")) {
      const label =
        typeof node.title === "string"
          ? node.title
          : typeof node.name === "string"
            ? node.name
            : node.route;
      entries.push({ label, href: node.route, section });
    }
  }

  return entries;
}

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const pageMap = await getCachedPageMap();

  return (
    <div className="keizoku-docs">
      {/* The site's own bar stays; Nextra's is dropped so there is one
          navigation system on the page rather than two stacked. */}
      <SiteNavbar />
      <CommandMenuProvider navigation={collectNavigation(pageMap)}>
        <DocsBar />
        <Layout
          navbar={null}
          /* Nextra's own <Search> is switched off entirely. Every instance of
             it registers a window-level Ctrl+K handler and focuses its input
             unconditionally, so leaving one mounted would race the palette. */
          search={null}
          /* Nextra mounts its own next-themes provider inside ours. Matching
             the settings keeps the two from disagreeing on first paint, when
             nothing is stored yet. */
          nextThemes={{ attribute: "class", defaultTheme: "dark", disableTransitionOnChange: true }}
          pageMap={pageMap}
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
        <SidebarSearch />
      </CommandMenuProvider>
    </div>
  );
}
