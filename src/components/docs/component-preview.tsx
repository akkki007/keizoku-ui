"use client";

import { useId, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { Tabs, TabPanel } from "./tabs";
import { useCopy } from "./use-copy";
import { CopyButton } from "./copy-button";

const TABS = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
] as const;

type View = (typeof TABS)[number]["value"];

export interface ComponentPreviewProps {
  /** The live component, rendered on the preview surface. */
  component: ReactNode;
  /** The snippet shown under the Code tab — the usage, not the source. */
  code: string;
  label?: string;
  description?: string;
  className?: string;
  previewClassName?: string;
}

export function ComponentPreview({
  component,
  code,
  label = "Preview",
  description,
  className,
  previewClassName,
}: ComponentPreviewProps) {
  const [view, setView] = useState<View>("preview");
  const [renderKey, setRenderKey] = useState(0);
  const { hasCopied, status, copy } = useCopy();
  const groupId = useId();

  return (
    <div className={cn("my-6 mb-10 min-w-0", className)}>
      <span className="sr-only" role="status">
        {status}
      </span>

      {description && (
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}

      <div className="min-w-0 rounded-lg bg-muted p-1">
        <div className="flex min-h-9 flex-wrap items-center justify-between gap-x-2 px-1">
          <span className="ml-1 min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.14em] text-meta">
            {label}
          </span>
          <div className="ml-auto flex items-center gap-1">
            {view === "preview" && (
              <button
                type="button"
                /* Remounting is the only honest way to replay an entrance
                   animation, so the control changes the key rather than
                   poking at the component. */
                onClick={() => setRenderKey((previous) => previous + 1)}
                aria-label="Replay preview"
                title="Replay preview"
                className="grid size-6 shrink-0 place-items-center rounded-full text-meta transition-colors duration-[var(--k-dur-1)] hover:bg-accent hover:text-foreground"
              >
                <RotateCcw aria-hidden className="size-3.5" />
              </button>
            )}
            {view === "code" && (
              <CopyButton
                copied={hasCopied}
                onClick={() => copy(code)}
                aria-label="Copy example"
              />
            )}
            <Tabs
              id={groupId}
              label="Preview or code"
              tabs={TABS}
              value={view}
              onValueChange={setView}
            />
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-md border border-border bg-card">
          {view === "preview" ? (
            <TabPanel id={groupId} value="preview" className="min-w-0">
              <div
                key={renderKey}
                className={cn(
                  "flex min-h-[360px] w-full items-center justify-center p-4 sm:p-6",
                  previewClassName,
                )}
              >
                <div className="flex w-full items-center justify-center">{component}</div>
              </div>
            </TabPanel>
          ) : (
            <TabPanel
              id={groupId}
              value="code"
              className="h-[360px] min-w-0 overflow-auto p-4"
            >
              <CodeBlock code={code} language="tsx" hideCopy nested />
            </TabPanel>
          )}
        </div>
      </div>
    </div>
  );
}
