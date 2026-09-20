"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/* Both icons stay mounted and swap by rotation, so the change animates in
   and out without AnimatePresence — and without the blur-scale cross-fade
   Keizoku refuses. A quarter turn on the travel curve reads as one dial
   being turned, which is the mechanism this control actually is.

   Which icon shows is decided by the `.dark` class that next-themes writes
   on <html>, not by React state — so there is no mounted check, no
   hydration mismatch, and no icon flash on first paint. The theme is only
   read inside the click handler, where it is always resolved. */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const icon =
    "absolute size-[17px] transition-[opacity,rotate] duration-[var(--k-dur-2)] ease-[var(--k-ease-travel)]";

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "relative grid size-8 place-items-center rounded-full text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(icon, "rotate-90 opacity-0 dark:rotate-0 dark:opacity-100")}
      />
      <Moon
        aria-hidden
        className={cn(icon, "rotate-0 opacity-100 dark:-rotate-90 dark:opacity-0")}
      />
    </button>
  );
}
