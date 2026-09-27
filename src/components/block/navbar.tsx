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
  actions = <ModeToggle />,
  ...props
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  return (
    <>
      <header
        className={cn("fixed inset-x-0 top-0 z-50 flex h-14", className)}
        {...props}
      >
        {/* No backdrop behind the whole 56px box: the rails, the corner clip
            paths and the centre slice already describe the silhouette, and
            filling the rectangle behind them turns a cut shape into a drawn
            one. The page is meant to show through beside the notch — that is
            what makes it read as a cutout rather than as a line. */}

        {/* Left rail */}
        <div className="relative z-20 h-5 min-w-0 flex-1 bg-background">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line x1="0" y1="19.5" x2="100%" y2="19.5" {...STROKE} />
            <line x1="0" y1="16.5" x2="100%" y2="16.5" {...STROKE} />
          </svg>
        </div>

        {/* Notch */}
        <div className="relative z-10 -ml-px flex h-14 shrink-0">
          {/* Left corner */}
          <div className="relative h-full w-[44px] shrink-0">
            <div
              className="absolute inset-0 bg-background"
              style={{ clipPath: "path('M0 0 H44 V56 C22 56 22 20 0 20 Z')" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 44 56"
              aria-hidden
            >
              <path d="M0 19.5 C22 19.5 22 55.5 44 55.5" {...STROKE} />
              <path d="M0 16.5 C22 16.5 22 52.5 44 52.5" {...STROKE} />
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
                <line x1="0" y1="55.5" x2="100%" y2="55.5" {...STROKE} />
                <line x1="0" y1="52.5" x2="100%" y2="52.5" {...STROKE} />
              </svg>
            </div>

            {/* Centred in the notch rather than in the header: the rail ends
                at y=20, so padding the row past it leaves a 36px band from 20
                to 56 and the links sit inside the cut instead of above it. */}
            <div className="relative flex h-14 w-full items-center justify-between px-4 pt-5 md:justify-center md:gap-9 md:px-7">
              {leftLinks.length > 0 && (
                <nav
                  aria-label="Primary"
                  className="hidden shrink-0 items-center gap-7 md:flex"
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
                className="p-1 text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:text-foreground md:hidden"
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

              <div className="hidden shrink-0 items-center gap-7 md:flex">
                {rightLinks.length > 0 && (
                  <nav aria-label="Secondary" className="flex items-center gap-7">
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
              {actions && <span className="md:hidden">{actions}</span>}
            </div>
          </div>

          {/* Right corner */}
          <div className="relative -ml-px h-full w-[44px] shrink-0">
            <div
              className="absolute inset-0 bg-background"
              style={{ clipPath: "path('M0 0 H44 V20 C22 20 22 56 0 56 Z')" }}
            />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 44 56"
              aria-hidden
            >
              <path d="M0 55.5 C22 55.5 22 19.5 44 19.5" {...STROKE} />
              <path d="M0 52.5 C22 52.5 22 16.5 44 16.5" {...STROKE} />
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
            <line x1="0" y1="19.5" x2="100%" y2="19.5" {...STROKE} />
            <line x1="0" y1="16.5" x2="100%" y2="16.5" {...STROKE} />
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
            className="fixed inset-x-0 top-14 z-40 border-b border-border bg-card p-3 md:hidden"
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
