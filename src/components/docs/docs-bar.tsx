"use client";

import { ChevronDown } from "lucide-react";
import { setMenu, useMenu } from "nextra-theme-docs";
import { cn } from "@/lib/utils";
import { SearchTrigger } from "./command-menu";

/* Below `md` there is no sidebar to hang anything off, so this band carries
 * both of the controls that live in it above that width: the search trigger,
 * and the Contents pill that is the only way to reach the page list at all.
 *
 * The pill sits on the rule and interrupts the dash run — the house move for
 * a control that belongs to the line rather than to the block below it. */
export function DocsBar() {
  const open = useMenu();

  return (
    <div className="sticky top-14 z-30 bg-background md:hidden">
      <div className="relative flex h-[var(--docs-bar-height)] items-center gap-3 px-4">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]"
        />

        <SearchTrigger className="max-w-[220px]" />

        <button
          type="button"
          onClick={() => setMenu((isOpen) => !isOpen)}
          aria-expanded={open}
          className="ml-auto flex h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:text-foreground"
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
      </div>
    </div>
  );
}
