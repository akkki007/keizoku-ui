"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/* Both icons stay mounted and cross-fade, so the swap animates in and
   out without AnimatePresence.

   Which one shows is decided by the `.dark` class that next-themes
   writes on <html>, not by React state — so there is no mounted check,
   no hydration mismatch, and no icon flash on first paint. The theme is
   only read inside the click handler, where it is always resolved. */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const icon =
    "absolute size-[17px] transition-[opacity,transform,filter] duration-300 ease-[var(--ease-out-expo)]";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "relative grid size-8 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-wash hover:text-ink",
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          icon,
          "scale-[0.4] opacity-0 blur-[3px] dark:scale-100 dark:opacity-100 dark:blur-0",
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          icon,
          "scale-100 opacity-100 blur-0 dark:scale-[0.4] dark:opacity-0 dark:blur-[3px]",
        )}
      />
    </button>
  );
}
