"use client";

import * as React from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { cn } from "@/lib/utils";
import { getCodeToCopy, useCopy } from "./use-copy";
import { CopyButton } from "./copy-button";
import { CodeCardContext, useCodeCard } from "./code-card-context";

/** Set when a step owns the copy button, so the blocks inside it do not each
 *  render one and copy a fragment of what the step is telling you to run. */
const StepCopyContext = React.createContext(false);

/* Chrome stays achromatic; colour arrives through content, and syntax is
   content. One hue does the work — vermilion marks the keywords that carry
   a line's meaning, and everything else is the neutral ramp. */
const codeTheme: PrismTheme = {
  plain: { color: "var(--foreground)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--meta)", fontStyle: "italic" },
    },
    { types: ["punctuation", "operator"], style: { color: "var(--meta)" } },
    {
      types: ["keyword", "atrule", "boolean", "tag", "selector"],
      style: { color: "var(--brand-text)" },
    },
    {
      types: ["string", "attr-value", "char", "inserted"],
      style: { color: "var(--muted-foreground)" },
    },
    { types: ["function", "class-name"], style: { color: "var(--foreground)" } },
    { types: ["attr-name", "property"], style: { color: "var(--muted-foreground)" } },
  ],
};

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  /** File path or heading for the card header. */
  title?: string;
  hideCopy?: boolean;
  /** Render bare, for use inside a surface that already has a frame. */
  nested?: boolean;
}

export function CodeBlock({
  code,
  language = "bash",
  className,
  title,
  hideCopy: hideCopyProp,
  nested: nestedProp,
}: CodeBlockProps) {
  const stepOwnsCopy = React.useContext(StepCopyContext);
  const insideCard = useCodeCard();
  const hideCopy = hideCopyProp ?? stepOwnsCopy;
  const nested = nestedProp ?? insideCard;
  const { hasCopied, status, copy } = useCopy();

  return (
    <div
      className={cn(
        "relative min-w-0",
        !nested && "not-first:mt-5 rounded-lg bg-muted p-1",
        className,
      )}
    >
      <span className="sr-only" role="status">
        {status}
      </span>

      {!nested ? (
        <div className="flex min-h-9 items-center justify-between gap-2 px-2">
          <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.14em] text-meta">
            {title ?? language}
          </span>
          {!hideCopy && (
            <CopyButton
              copied={hasCopied}
              onClick={() => copy(code)}
              aria-label="Copy code"
            />
          )}
        </div>
      ) : (
        !hideCopy && (
          <CopyButton
            copied={hasCopied}
            onClick={() => copy(code)}
            aria-label="Copy code"
            className="absolute right-1 top-1 z-10 bg-card"
          />
        )
      )}

      <div
        className={cn(
          "relative min-w-0 overflow-x-auto font-mono text-[13px] leading-relaxed",
          !nested && "rounded-md border border-border bg-card p-4",
          nested && !hideCopy && "pr-10",
        )}
      >
        <Highlight theme={codeTheme} code={code.trim()} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="font-mono text-[13px] leading-relaxed"
              style={{ ...style, backgroundColor: "transparent", margin: 0, padding: 0 }}
            >
              {tokens.map((line, index) => (
                <div key={index} {...getLineProps({ line })} className="table-row">
                  {!nested && (
                    <span
                      aria-hidden
                      className="table-cell w-8 select-none pr-4 text-right text-[11px] tabular-nums text-meta/60"
                    >
                      {index + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export interface StepProps {
  /** Position in the installation sequence, shown in the gutter square. */
  step?: number;
  title?: string;
  children?: React.ReactNode;
  /** Overrides what the step's copy button puts on the clipboard. Without it
   *  the step copies every CodeBlock inside it, joined. */
  copyText?: string;
  id?: string;
  /** Registry name — appends a source-file browser loaded from `/r/<name>.json`. */
  source?: string;
  className?: string;
}

/** One numbered step of a manual installation: a framed card with the step
 *  index in the gutter and a single copy button for everything inside it. */
export function Step({
  step,
  title,
  children,
  copyText,
  id,
  source,
  className,
}: StepProps) {
  const { hasCopied, status, copy } = useCopy();
  const textToCopy = copyText ?? getCodeToCopy(children);

  return (
    <div
      id={id}
      className={cn(
        "relative mb-6 w-full min-w-0 scroll-mt-24 rounded-lg bg-muted p-1",
        className,
      )}
    >
      <span className="sr-only" role="status">
        {status}
      </span>

      <div className="flex min-h-9 items-center justify-between gap-2 px-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {step !== undefined && (
            <span className="grid size-5 shrink-0 place-items-center rounded-sm border border-border bg-card font-mono text-[11px] tabular-nums text-meta">
              {step}
            </span>
          )}
          {title && (
            <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-meta">
              {title}
            </h3>
          )}
        </div>
        {textToCopy && (
          <CopyButton
            copied={hasCopied}
            onClick={() => copy(textToCopy)}
            aria-label={title ? `Copy ${title.toLowerCase()}` : "Copy code"}
          />
        )}
      </div>

      <div className="min-w-0 space-y-4 rounded-md border border-border bg-card p-4">
        <CodeCardContext.Provider value={true}>
          <StepCopyContext.Provider value={Boolean(textToCopy)}>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
          </StepCopyContext.Provider>
          {source && <RegistrySource key={source} componentName={source} />}
        </CodeCardContext.Provider>
      </div>
    </div>
  );
}

interface SourceFile {
  path: string;
  content: string;
}

function isSourceFile(value: unknown): value is SourceFile {
  return (
    typeof value === "object" &&
    value !== null &&
    "path" in value &&
    typeof value.path === "string" &&
    "content" in value &&
    typeof value.content === "string"
  );
}

/** Reads the manifest this same build generated, so the source shown on the
 *  page and the source the CLI installs can never be different files. It is
 *  fetched on request rather than inlined: a component's full source is far
 *  larger than the page around it. */
function RegistrySource({ componentName }: { componentName: string }) {
  const [files, setFiles] = React.useState<SourceFile[]>([]);
  const [selectedPath, setSelectedPath] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const controller = React.useRef<AbortController | null>(null);
  const selectId = React.useId();

  React.useEffect(() => () => controller.current?.abort(), []);

  async function loadSource() {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError("");
    try {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(componentName)) throw new Error("Invalid component name");
      const response = await fetch(`/r/${componentName}.json`, {
        signal: request.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Source unavailable");
      const manifest: unknown = await response.json();
      if (
        !manifest ||
        typeof manifest !== "object" ||
        !("name" in manifest) ||
        manifest.name !== componentName ||
        !("files" in manifest) ||
        !Array.isArray(manifest.files) ||
        !manifest.files.length ||
        !manifest.files.every(isSourceFile)
      ) {
        throw new Error("Invalid source manifest");
      }
      if (request.signal.aborted) return;
      setFiles(manifest.files);
      setSelectedPath(
        manifest.files.find((file) => file.path.endsWith(`/${componentName}.tsx`))?.path ??
          manifest.files[0].path,
      );
      setNotes("docs" in manifest && typeof manifest.docs === "string" ? manifest.docs : "");
    } catch {
      if (!request.signal.aborted) {
        setError("Source files could not be loaded. Use the CLI command above, or try again.");
      }
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }

  const selectedFile = files.find((file) => file.path === selectedPath);

  return (
    <div className="space-y-3">
      {!files.length && (
        <button
          type="button"
          onClick={loadSource}
          disabled={loading}
          className="rounded-full border border-border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:border-border hover:bg-accent hover:text-foreground disabled:opacity-60"
        >
          {loading ? "Loading source…" : error ? "Retry" : "View source files"}
        </button>
      )}

      <p role="status" className={cn("text-sm text-meta", !error && !loading && "sr-only")}>
        {error || (loading ? "Loading source files" : "")}
      </p>

      {selectedFile && (
        <>
          <p className="text-sm text-muted-foreground">
            Copy each file to the path shown. Skip the ones you already have.
          </p>
          <label
            htmlFor={selectId}
            className="block font-mono text-[11px] uppercase tracking-[0.14em] text-meta"
          >
            Source file
          </label>
          <select
            id={selectId}
            value={selectedPath}
            onChange={(event) => setSelectedPath(event.target.value)}
            className="h-9 w-full min-w-0 rounded-md border border-border bg-background px-3 font-mono text-xs text-foreground"
          >
            {files.map((file) => (
              <option key={file.path} value={file.path}>
                {file.path}
              </option>
            ))}
          </select>
          <CodeBlock
            key={selectedFile.path}
            code={selectedFile.content}
            language={
              selectedFile.path.endsWith(".css")
                ? "css"
                : selectedFile.path.endsWith(".json")
                  ? "json"
                  : selectedFile.path.endsWith(".svg")
                    ? "markup"
                    : "tsx"
            }
            title={selectedFile.path}
            nested={false}
            className="max-h-[28rem] overflow-auto"
          />
          {notes && <p className="whitespace-pre-line text-sm text-meta">{notes}</p>}
        </>
      )}
    </div>
  );
}
