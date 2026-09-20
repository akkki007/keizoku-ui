"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* A minimal tablist. Not Radix: the docs chrome needs four tabs with a
   sliding rule under them, and pulling a headless library in for that would
   put a second set of design decisions into the one surface that is meant
   to demonstrate this library's own.
 *
 * Keyboard behaviour follows the APG tabs pattern — arrows move and
 * activate, Home/End jump to the ends — because that part is not taste. */

export interface TabsProps<T extends string> {
  /** Shared with the matching TabPanels. Create it once with `useId()`. */
  id: string;
  tabs: readonly { value: T; label: ReactNode }[];
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name for the tablist, e.g. "Package manager". */
  label: string;
  className?: string;
}

export function Tabs<T extends string>({
  id: groupId,
  tabs,
  value,
  onValueChange,
  label,
  className,
}: TabsProps<T>) {
  const refs = useRef(new Map<T, HTMLButtonElement>());

  function move(offset: number) {
    const index = tabs.findIndex((tab) => tab.value === value);
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    onValueChange(next.value);
    refs.current.get(next.value)?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className={cn("flex items-center", className)}>
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(node) => {
              if (node) refs.current.set(tab.value, node);
              else refs.current.delete(tab.value);
            }}
            type="button"
            role="tab"
            id={`${groupId}-${tab.value}-tab`}
            aria-selected={selected}
            aria-controls={`${groupId}-${tab.value}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(tab.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") move(1);
              else if (event.key === "ArrowLeft") move(-1);
              else if (event.key === "Home") onValueChange(tabs[0].value);
              else if (event.key === "End") onValueChange(tabs[tabs.length - 1].value);
              else return;
              event.preventDefault();
            }}
            className={cn(
              "relative flex h-8 shrink-0 items-center gap-1.5 px-2 text-xs font-medium transition-colors duration-[var(--k-dur-1)]",
              selected ? "text-foreground" : "text-meta hover:text-foreground",
            )}
          >
            {tab.label}
            {selected && (
              /* One rule travelling between tabs, not one rule per tab
                 fading in and out. The movement is the state change. */
              <motion.span
                aria-hidden
                layoutId={`${groupId}-indicator`}
                className="absolute inset-x-2 bottom-0 h-px bg-ink"
                transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pair for `Tabs`. Only the selected panel is mounted, so long code blocks
 *  in hidden tabs cost nothing. */
export function TabPanel({
  id,
  value,
  children,
  className,
}: {
  /** The `useId()` value shared with the matching Tabs. */
  id: string;
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tabpanel"
      id={`${id}-${value}-panel`}
      aria-labelledby={`${id}-${value}-tab`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
