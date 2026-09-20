"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabPanel } from "./tabs";
import { useCopy } from "./use-copy";
import { CopyButton } from "./copy-button";

/** Keep in step with REGISTRY_ORIGIN in scripts/registry.ts. */
const REGISTRY_ORIGIN = "https://keizoku.akkki.tech";

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

/* Each manager's one-off executor. `shadcn add` is not installed as a
   dependency, so this is `npx` and its equivalents, never `npm install`. */
const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  bun: "bunx",
  yarn: "yarn dlx",
};

const TABS = (Object.keys(RUNNERS) as PackageManager[]).map((manager) => ({
  value: manager,
  label: manager,
}));

export interface CLICommandProps {
  /** Registry item name, matching the file in `public/r/`. */
  componentName: string;
  className?: string;
}

export function CLICommand({ componentName, className }: CLICommandProps) {
  const [manager, setManager] = useState<PackageManager>("npm");
  const { hasCopied, status, copy } = useCopy();
  const groupId = useId();

  const command = `${RUNNERS[manager]} shadcn@latest add "${REGISTRY_ORIGIN}/r/${componentName}.json"`;

  return (
    <div className={cn("min-w-0 rounded-lg bg-muted p-1", className)}>
      <span className="sr-only" role="status">
        {status}
      </span>

      <div className="flex min-h-9 items-center justify-between gap-1 px-1">
        <Tabs
          id={groupId}
          label="Package manager"
          tabs={TABS}
          value={manager}
          onValueChange={setManager}
        />
        <CopyButton
          copied={hasCopied}
          onClick={() => copy(command)}
          aria-label={`Copy ${manager} command`}
        />
      </div>

      <TabPanel
        id={groupId}
        value={manager}
        className="min-w-0 overflow-x-auto rounded-md border border-border bg-card p-3"
      >
        <code className="block whitespace-nowrap font-mono text-[13px] leading-relaxed text-muted-foreground">
          {command}
        </code>
      </TabPanel>
    </div>
  );
}
