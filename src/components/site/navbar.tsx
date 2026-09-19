"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ModeToggle } from "@/components/site/mode-toggle";
import { cn } from "@/lib/utils";

/* Ported from ObsidianUI's landing navbar. The structure is kept as-is —
   a five-slice bar whose centre dips into a notch, outlined by a pair of
   hairlines that curve through the corners — and restyled onto Keizoku's
   tokens. The theme toggle, click sound and command menu are dropped;
   this build is dark-only and has no command palette yet. */

const NAV = {
  left: [
    { label: "Components", href: "#components" },
    { label: "Templates", href: "#templates" },
  ],
  right: [
    { label: "Playground", href: "#playground" },
    { label: "Docs", href: "#docs" },
  ],
};

/* Hairlines. Two strokes, 3px apart, at 0.16 opacity — the double rule
   is what makes the notch read as machined rather than drawn. */
const STROKE = {
  stroke: "currentColor",
  strokeOpacity: 0.16,
  strokeWidth: 0.5,
  fill: "none",
  className: "text-ink",
} as const;

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap text-[13px] font-medium text-muted transition-colors duration-200 hover:text-ink"
    >
      {label}
    </Link>
  );
}

export function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header
        className={cn("fixed inset-x-0 top-0 z-50 flex h-16", className)}
        {...props}
      >
        {/* Left rail */}
        <div className="relative z-20 h-10 min-w-0 flex-1 bg-page">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="39.5" x2="100%" y2="39.5" {...STROKE} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" {...STROKE} />
          </svg>
        </div>

        {/* Notch */}
        <div className="relative z-10 -ml-px flex h-16 shrink-0">
          {/* Left corner */}
          <div className="relative h-full w-[50px] shrink-0">
            <div
              className="absolute inset-0 bg-page"
              style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 50 64"
            >
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" {...STROKE} />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" {...STROKE} />
            </svg>
          </div>

          {/* Centre */}
          <div className="relative -ml-px h-full min-w-0 flex-1">
            <div className="absolute inset-0 bg-page">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="63.5" x2="100%" y2="63.5" {...STROKE} />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" {...STROKE} />
              </svg>
            </div>

            {/* The notch's visible body ends at the hairline (y≈62), not
                at the 64px box, so the row is centred on that band
                rather than on the element. */}
            <div className="relative flex h-[62px] w-full items-center justify-between px-4 md:justify-center md:gap-10 md:px-8">
              <nav className="mb-0.5 hidden shrink-0 items-center gap-8 md:flex">
                {NAV.left.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Wordmark */}
              <Link
                href="/"
                className="mx-2 shrink-0 text-[15px] font-medium tracking-[0.06em] text-ink transition-opacity duration-200 hover:opacity-70 md:mx-0"
              >
                継続
              </Link>

              <button
                ref={menuButtonRef}
                className="mb-0.5 p-1 text-meta transition-colors duration-200 hover:text-ink md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="site-mobile-navigation"
              >
                {open ? (
                  <X className="size-5" aria-hidden />
                ) : (
                  <Menu className="size-5" aria-hidden />
                )}
              </button>

              <nav className="mb-0.5 hidden shrink-0 items-center gap-8 md:flex">
                {NAV.right.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
                <span className="ml-1 border-l border-edge-subtle pl-4">
                  <ModeToggle className="-my-1.5" />
                </span>
              </nav>

              {/* Also balances the mobile row against the menu button so
                  the wordmark stays optically centred. */}
              <ModeToggle className="-mb-1 md:hidden" />
            </div>
          </div>

          {/* Right corner */}
          <div className="relative -ml-px h-full w-[50px] shrink-0">
            <div
              className="absolute inset-0 bg-page"
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 50 64"
            >
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" {...STROKE} />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" {...STROKE} />
            </svg>
          </div>
        </div>

        {/* Right rail */}
        <div className="relative z-20 -ml-px h-10 min-w-0 flex-1 bg-page">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="39.5" x2="100%" y2="39.5" {...STROKE} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" {...STROKE} />
          </svg>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 z-40 border-b border-edge-subtle bg-surface p-3 md:hidden"
          >
            <nav
              id="site-mobile-navigation"
              aria-label="Mobile navigation"
              className="flex flex-col"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                  menuButtonRef.current?.focus();
                }
              }}
            >
              {[...NAV.left, ...NAV.right].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium text-muted transition-colors duration-200 hover:bg-wash hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
