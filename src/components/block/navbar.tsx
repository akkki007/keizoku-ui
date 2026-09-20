"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";

/* A five-slice bar whose centre dips into a notch, outlined by a pair of
   hairlines that curve through the corners.

   The notch is not decoration: it is the rule. The bar's hairline runs the
   full width of the viewport at y=37/40, drops 24px through the centre
   slice, and comes back up — one unbroken line interrupted by a control,
   which is the house structural move. Drawing it as SVG strokes rather
   than borders is what lets it bend.

   Nothing here blurs, springs or scales. Hover is a 120ms ink change; the
   mobile panel is uncovered by a moving edge rather than faded in. */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Sits in the centre of the notch. Defaults to the Keizoku wordmark. */
  brand?: React.ReactNode;
  /** Where the brand links to. */
  brandHref?: string;
  /** Links left of the brand, desktop only. */
  leftLinks?: NavItem[];
  /** Links right of the brand, desktop only. */
  rightLinks?: NavItem[];
  /** Trailing controls, after a divider. Pass `null` to drop the divider too. */
  actions?: React.ReactNode;
}

/* Two strokes, 3px apart, at 0.16 opacity. The double rule is what makes
   the notch read as machined rather than drawn — a single stroke at this
   scale looks like a border that slipped. */
const STROKE = {
  stroke: "currentColor",
  strokeOpacity: 0.16,
  strokeWidth: 0.5,
  fill: "none",
  className: "text-foreground",
} as const;

function NavLink({ href, label }: NavItem) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap text-[13px] font-medium text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:text-foreground"
    >
      {label}
    </Link>
  );
}

export function Navbar({
  className,
  brand = "継続",
  brandHref = "/",
  leftLinks = [],
  rightLinks = [],
  actions = <ModeToggle className="-my-1.5" />,
  ...props
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  return (
    <>
      <header
        className={cn("fixed inset-x-0 top-0 z-50 flex h-16", className)}
        {...props}
      >
        {/* The bar is opaque across its whole height, not just the 40px rails.
            The notch is drawn by its hairlines, not cut out of the page, so
            nothing is lost — and without this, content scrolls through the
            24px band either side of the notch. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-background" />

        {/* Left rail */}
        <div className="relative z-20 h-10 min-w-0 flex-1 bg-background">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
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
              className="absolute inset-0 bg-background"
              style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 50 64"
              aria-hidden
            >
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" {...STROKE} />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" {...STROKE} />
            </svg>
          </div>

          {/* Centre */}
          <div className="relative -ml-px h-full min-w-0 flex-1">
            <div className="absolute inset-0 bg-background">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <line x1="0" y1="63.5" x2="100%" y2="63.5" {...STROKE} />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" {...STROKE} />
              </svg>
            </div>

            {/* The notch's visible body ends at the hairline (y≈62), not at
                the 64px box, so the row is centred on that band rather than
                on the element. */}
            <div className="relative flex h-[62px] w-full items-center justify-between px-4 md:justify-center md:gap-10 md:px-8">
              {leftLinks.length > 0 && (
                <nav
                  aria-label="Primary"
                  className="mb-0.5 hidden shrink-0 items-center gap-8 md:flex"
                >
                  {leftLinks.map((item) => (
                    <NavLink key={item.label} {...item} />
                  ))}
                </nav>
              )}

              <Link
                href={brandHref}
                className="mx-2 shrink-0 text-[15px] font-medium tracking-[0.06em] text-foreground transition-opacity duration-[var(--k-dur-1)] hover:opacity-70 md:mx-0"
              >
                {brand}
              </Link>

              <button
                ref={menuButtonRef}
                type="button"
                className="mb-0.5 p-1 text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:text-foreground md:hidden"
                onClick={() => setOpen((isOpen) => !isOpen)}
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

              <div className="mb-0.5 hidden shrink-0 items-center gap-8 md:flex">
                {rightLinks.length > 0 && (
                  <nav aria-label="Secondary" className="flex items-center gap-8">
                    {rightLinks.map((item) => (
                      <NavLink key={item.label} {...item} />
                    ))}
                  </nav>
                )}
                {actions && (
                  <span
                    className={cn(
                      rightLinks.length > 0 &&
                        "ml-1 border-l border-border pl-4",
                    )}
                  >
                    {actions}
                  </span>
                )}
              </div>

              {/* Also balances the mobile row against the menu button so the
                  brand stays optically centred. */}
              {actions && <span className="-mb-1 md:hidden">{actions}</span>}
            </div>
          </div>

          {/* Right corner */}
          <div className="relative -ml-px h-full w-[50px] shrink-0">
            <div
              className="absolute inset-0 bg-background"
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 50 64"
              aria-hidden
            >
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" {...STROKE} />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" {...STROKE} />
            </svg>
          </div>
        </div>

        {/* Right rail */}
        <div className="relative z-20 -ml-px h-10 min-w-0 flex-1 bg-background">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line x1="0" y1="39.5" x2="100%" y2="39.5" {...STROKE} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" {...STROKE} />
          </svg>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            /* Uncovered by a moving edge, not faded through translucency —
               the panel is already there, the rule just moves off it. */
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.32, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border bg-card p-3 md:hidden"
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
              {[...leftLinks, ...rightLinks].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:bg-accent hover:text-foreground"
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
