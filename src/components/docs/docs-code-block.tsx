"use client";

import { useRef, type ComponentProps } from "react";
import { Pre } from "nextra/mdx-components/pre/index";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { useCopy } from "./use-copy";
import { useCodeCard } from "./code-card-context";

/** Fenced code inside MDX. Nextra has already highlighted the markup at
 *  build time, so this keeps its output and only replaces the chrome — the
 *  frame, the mono header and the shared copy feedback. */
export function DocsCodeBlock({
  "data-copy": copyEnabled,
  ...props
}: ComponentProps<typeof Pre>) {
  const container = useRef<HTMLDivElement>(null);
  const { hasCopied, status, copy } = useCopy();
  const filename = props["data-filename"];
  const nested = useCodeCard();

  function copyCode() {
    const code = container.current?.querySelector("pre code");
    if (code) void copy(code.textContent ?? "");
  }

  return (
    <div
      ref={container}
      className={cn(
        "docs-code-block relative min-w-0",
        nested ? "docs-code-block-nested" : "docs-code-card not-first:mt-5 rounded-lg bg-muted p-1",
      )}
    >
      {!nested && (
        <div className="flex min-h-9 items-center px-2 font-mono text-[11px] uppercase tracking-[0.14em] text-meta">
          {typeof filename === "string" ? filename : "Code"}
        </div>
      )}
      <div className="relative min-w-0">
        <Pre {...props} data-copy={undefined} />
        {copyEnabled === "" && (
          <>
            <span className="sr-only" role="status">
              {status}
            </span>
            <CopyButton
              copied={hasCopied}
              onClick={copyCode}
              aria-label="Copy code"
              title="Copy code"
              className="absolute right-2 top-2 bg-card"
            />
          </>
        )}
      </div>
    </div>
  );
}
