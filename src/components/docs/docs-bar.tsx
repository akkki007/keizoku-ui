"use client";

import { ChevronDown } from "lucide-react";
import { Search } from "nextra/components";
import { setMenu, useMenu } from "nextra-theme-docs";
import { cn } from "@/lib/utils";

/* The docs' own controls: search, and below `md` the Contents pill that is the
 * only way to reach the sidebar. Both exist because Nextra puts them in its
 * navbar, which this site replaces.
 *
 * There is exactly one of these on the page, and it moves rather than
 * duplicating. Every Nextra <Search> registers its own global Ctrl+K/"/"
 * listener and focuses its input unconditionally — including when it sits in a
 * `display:none` container, where focus() is a silent no-op. Two instances
 * behind two breakpoints therefore make the advertised shortcut depend on
 * mount order rather than on which field is visible. One instance, repositioned
 * with CSS, has one listener and one input.
 *
 * Below `xl` it is a band under the site bar. At `xl` the band would read as a
 * seam — a second full-width bar under the first, obvious once the page is
 * scrolled — and the navbar's right rail is finally wide enough to clear the
 * notch, so the bar goes fixed and parks itself there. */
export function DocsBar() {
  const open = useMenu();

  return (
    <div
      className={cn(
        // Sticky rather than fixed below xl: it stays in flow, so the content
        // needs no spacer. z-30 clears Nextra's mobile panel (z-20); z-60 at xl
        // clears the site bar itself (z-50), so the results popover is not
        // painted behind it.
        "sticky top-16 z-30 bg-background",
        // Shrink-to-fit at xl, not inset-x-0: a full-width box at z-60 would
        // sit over the whole bar and swallow clicks on the nav links.
        "xl:fixed xl:inset-x-auto xl:right-4 xl:top-1 xl:z-[60] xl:bg-transparent",
      )}
    >
      <div className="relative mx-auto flex h-12 max-w-(--nextra-content-width) items-center justify-center px-4 md:justify-end xl:h-8 xl:max-w-none xl:px-0">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)] xl:hidden"
        />

        <button
          type="button"
          onClick={() => setMenu((isOpen) => !isOpen)}
          aria-expanded={open}
          className="relative -bottom-px flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:text-foreground md:hidden"
        >
          Contents
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 transition-transform duration-[var(--k-dur-2)] ease-[var(--k-ease-travel)]",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Below md, Nextra's mobile panel carries its own search field. */}
        <div className="hidden w-full max-w-72 md:block xl:w-[200px]">
          <Search placeholder="Search docs…" />
        </div>
      </div>
    </div>
  );
}
