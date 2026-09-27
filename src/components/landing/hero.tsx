"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

const HEADLINE = ["Components", "with", "staying", "power"];

export function Hero() {
  const reduced = useReducedMotion();
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Written straight to CSS custom properties so the glow never
  // triggers a React render on pointer move.
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const node = spotlightRef.current;
      if (!node || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      node.style.setProperty("--x", `${event.clientX - rect.left}px`);
      node.style.setProperty("--y", `${event.clientY - rect.top}px`);
      node.style.opacity = "1";
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    const node = spotlightRef.current;
    if (node) node.style.opacity = "0";
  }, []);

  // Restrained entrance: a short rise and a light defocus, no
  // overshoot. Every curve is ease-out — nothing springs back.
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.055 } },
  };

  const rise: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="grain relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-background"
    >
      {/* A single soft glow, drifting slowly. One shape, not a scene.
          Weight comes from --hero-glow so it reads the same against
          paper as it does against obsidian. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="animate-drift absolute left-1/2 top-[38%] h-[52vmax] w-[52vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-shu-500 blur-[160px]"
          style={{ opacity: "var(--hero-glow)" }}
        />
      </div>

      {/* Cursor glow. Pointer devices only; opacity is toggled
          imperatively so it costs nothing while idle. */}
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 [background:radial-gradient(460px_circle_at_var(--x,50%)_var(--y,50%),color-mix(in_oklab,var(--shu-400)_var(--hero-cursor-glow),transparent),transparent_68%)]"
      />

      {/* Vignette, so the glow never reaches the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_80%_at_50%_40%,transparent_20%,var(--background)_88%)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center"
      >
        <MotionLink
          variants={rise}
          href="/docs/introduction"
          className="group inline-flex items-center gap-2.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] text-meta transition-colors duration-200 hover:border-border hover:text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-shu-500" />
          継続 · v0.1 alpha
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </MotionLink>

        <h1 className="mt-8 text-balance text-[clamp(2.75rem,7.5vw,5rem)] font-medium leading-[1.05] tracking-[-0.05em] text-foreground">
          {HEADLINE.map((word, i) => (
            <motion.span
              key={word}
              variants={rise}
              className={cn(
                "mr-[0.22em] inline-block",
                /* Instrument Serif runs small and light beside Geist at
                   the same size, so the accent word is nudged up a step
                   and given back a little tracking. */
                i === 0 &&
                  "font-serif text-[1.08em] font-normal tracking-[-0.035em]",
              )}
            >
              {word}
              {/* The one accent on the page. */}
              {i === HEADLINE.length - 1 && (
                <span className="text-shu-500">.</span>
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={rise}
          className="mt-6 max-w-lg text-pretty text-[17px] leading-relaxed text-muted-foreground"
        >
          A React component library for interfaces that earn a second look.
          Built on Tailwind CSS v4, shipped as source you own.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/docs/ruled-section"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Browse components
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          <Link
            href="/docs"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-[15px] font-medium text-muted-foreground transition-colors duration-200 hover:border-border hover:text-foreground active:scale-[0.98]"
          >
            Documentation
          </Link>
        </motion.div>

        <motion.p variants={rise} className="mt-14 text-[13px] text-meta">
          Next.js 16 · React 19 · Tailwind v4 · MIT
        </motion.p>
      </motion.div>
    </section>
  );
}
