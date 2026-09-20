import { Hero } from "@/components/landing/hero";
import { SiteNavbar } from "@/components/site/site-navbar";

export default function Home() {
  return (
    <>
      <SiteNavbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
