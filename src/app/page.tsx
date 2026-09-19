import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/site/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
