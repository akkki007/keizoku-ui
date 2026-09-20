"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* Both glyphs stay mounted and cross-fade on the ink duration. No blur, no
   scale — the confirmation is a change of ink, which is all the feedback a
   120ms window can carry anyway. */
function CopyGlyphs({ copied }: { copied: boolean }) {
  const glyph =
    "col-start-1 row-start-1 size-4 transition-opacity duration-[var(--k-dur-1)] ease-[var(--k-ease-travel)]";

  return (
    <span aria-hidden className="inline-grid size-4 shrink-0">
      <svg
        viewBox="0 0 18 18"
        fill="currentColor"
        className={cn(glyph, copied ? "opacity-0" : "opacity-100")}
      >
        <path
          d="M11.75 14.5H4.25C3.5605 14.5 3 13.9395 3 13.25V6.75C3 6.3359 2.6641 6 2.25 6C1.8359 6 1.5 6.3359 1.5 6.75V13.25C1.5 14.7666 2.7334 16 4.25 16H11.75C12.1641 16 12.5 15.6641 12.5 15.25C12.5 14.8359 12.1641 14.5 11.75 14.5Z"
          opacity="0.4"
        />
        <path
          d="M13.75 2H7.25C5.73122 2 4.5 3.23122 4.5 4.75V10.25C4.5 11.7688 5.73122 13 7.25 13H13.75C15.2688 13 16.5 11.7688 16.5 10.25V4.75C16.5 3.23122 15.2688 2 13.75 2Z"
          opacity="0.5"
        />
      </svg>
      <svg
        viewBox="-1 -2 20 20"
        fill="currentColor"
        className={cn(glyph, copied ? "opacity-100 text-brand" : "opacity-0")}
      >
        <path d="M6.5001 14C6.3077 14 6.1163 13.9268 5.9698 13.7803L2.21981 10.0303C1.92681 9.7373 1.92681 9.2627 2.21981 8.9698C2.51281 8.6769 2.98741 8.6768 3.28031 8.9698L6.50001 12.1895L14.7197 3.9698C15.0127 3.6768 15.4873 3.6768 15.7802 3.9698C16.0731 4.2628 16.0732 4.7374 15.7802 5.0303L7.03022 13.7803C6.88372 13.9268 6.6925 14 6.5001 14Z" />
      </svg>
    </span>
  );
}

/** Keeps the same accessible name and live status while the glyph changes,
 *  so a screen reader hears one button that reports a result. */
export function CopyButton({
  copied,
  className,
  ...props
}: Omit<ComponentProps<"button">, "children"> & { copied: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full text-meta transition-colors duration-[var(--k-dur-1)] hover:bg-accent hover:text-foreground",
        className,
      )}
      {...props}
    >
      <CopyGlyphs copied={copied} />
    </button>
  );
}
