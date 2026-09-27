import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { SiteNavbar } from "@/components/site/site-navbar";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  // The root layout's template would append the site name twice here, so the
  // home page states its own title outright.
  title: { absolute: `${site.name} — ${site.tagline}` },
  alternates: { canonical: "/" },
};

/* Structured data. Two things a crawler cannot infer from the markup: that
   this is a free developer library rather than a product page, and who
   publishes it. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": absoluteUrl("/#author") },
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: site.author,
      url: site.repository,
    },
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description: site.description,
      url: site.url,
      codeRepository: site.repository,
      license: "https://opensource.org/licenses/MIT",
      author: { "@id": absoluteUrl("/#author") },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a literal defined above, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteNavbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
