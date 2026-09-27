import type { Metadata } from "next";
import Link from "next/link";
import { SiteNavbar } from "@/components/site/site-navbar";

export const metadata: Metadata = {
  title: "Not found",
  // A 404 has nothing worth indexing, and indexing it competes with the
  // page the visitor was actually looking for.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteNavbar />
      <main className="flex min-h-svh flex-col items-center justify-center px-6 pt-16 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-meta">
          404 · not found
        </span>

        <h1 className="mt-6 text-balance text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-foreground">
          This page was not drawn
          <span className="text-brand">.</span>
        </h1>

        <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
          The address does not match anything in the library. It may have moved
          when a component was renamed.
        </p>

        <div
          aria-hidden
          className="my-10 h-px w-full max-w-md bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]"
        />

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/docs/introduction"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-[var(--k-dur-1)] hover:opacity-90"
          >
            Read the docs
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:text-foreground"
          >
            Back to the start
          </Link>
        </div>
      </main>
    </>
  );
}
