import { Navbar } from "@/components/block/navbar";

/* The site's own chrome, configured from the shipped component so the
   library and the site that documents it can never drift apart. */
export function SiteNavbar() {
  return (
    <Navbar
      leftLinks={[
        { label: "Components", href: "/docs/ruled-section" },
        { label: "Theming", href: "/docs/theming" },
      ]}
      rightLinks={[
        { label: "Install", href: "/docs/installation" },
        { label: "Docs", href: "/docs" },
      ]}
    />
  );
}
