"use client";

import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* Ported from the portfolio's command menu: one dialog, one global ⌘K
 * listener, exposed through context so any number of triggers — the sidebar
 * pill, the mobile bar — open the same palette without duplicating either.
 *
 * The difference is what it searches. The portfolio's palette runs a fixed
 * list of actions; a docs site needs the prose. So the list is Pagefind's,
 * the same index the build already produces, and the static entries are
 * demoted to what you see before typing.
 *
 * This is also why Nextra's own <Search> is switched off in the docs layout:
 * every instance of it registers its own window-level ⌘K handler and focuses
 * its input unconditionally, so leaving one mounted would race this one.
 */

type CommandMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  modKey: string;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) throw new Error("useCommandMenu must be used within <CommandMenuProvider>");
  return context;
}

export interface NavEntry {
  label: string;
  href: string;
  /** The heading this page sits under, shown as a group in the palette. */
  section?: string;
}

/* ── Pagefind ────────────────────────────────────────────────────────────
   Loaded from the index the build writes to /_pagefind, on first use rather
   than on mount, so a visitor who never opens the palette never pays for it.
   It does not exist under `next dev` — the index is generated in postbuild —
   so a failure to load is reported as a state rather than swallowed. */

interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
}

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta?: { title?: string };
  sub_results?: PagefindSubResult[];
}

interface Pagefind {
  options: (value: Record<string, unknown>) => Promise<void>;
  debouncedSearch: (
    query: string,
  ) => Promise<{ results: { data: () => Promise<PagefindResultData> }[] } | null>;
}

declare global {
  interface Window {
    __keizokuPagefind?: Pagefind;
  }
}

/** Pagefind writes `.html` into its URLs; the routes it points at do not. */
const cleanUrl = (url: string) => url.replace(/\.html$/, "").replace(/\.html#/, "#");

async function loadPagefind(): Promise<Pagefind> {
  if (window.__keizokuPagefind) return window.__keizokuPagefind;
  /* The specifier has to stay a literal for the bundler directive to apply,
     and the file only exists after `postbuild` writes the index — so there is
     nothing for TypeScript to resolve at compile time. */
  // @ts-expect-error -- resolved at runtime from the built Pagefind index
  const pagefind = (await import(/* webpackIgnore: true */ "/_pagefind/pagefind.js")) as Pagefind;
  await pagefind.options({ baseUrl: "/" });
  window.__keizokuPagefind = pagefind;
  return pagefind;
}

type Hit = { id: string; title: string; href: string; excerpt: string; page: string };

/** Which modifier the shortcut hint shows. Read during render rather than
 *  written from an effect, with a server snapshot so the markup matches. */
function useModKey(): string {
  return useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
}

export function CommandMenuProvider({
  children,
  navigation = [],
}: {
  children: ReactNode;
  navigation?: NavEntry[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const router = useRouter();
  const deferredQuery = useDeferredValue(query);
  const requestId = useRef(0);

  const modKey = useModKey();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((isOpen) => !isOpen);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const term = deferredQuery.trim();
    if (!term) return;

    /* Results can land out of order, so only the newest request is allowed
       to write. */
    const id = ++requestId.current;

    void (async () => {
      try {
        // Marked in flight where the request actually starts, rather than
        // synchronously in the effect body.
        setStatus("loading");
        const pagefind = await loadPagefind();
        const response = await pagefind.debouncedSearch(term);
        if (id !== requestId.current || !response) return;

        const pages = await Promise.all(response.results.slice(0, 8).map((item) => item.data()));
        if (id !== requestId.current) return;

        setHits(
          pages.flatMap((page) => {
            const pageTitle = page.meta?.title ?? "Documentation";
            const sections = (page.sub_results ?? []).slice(0, 3);
            if (!sections.length) {
              return [
                {
                  id: page.url,
                  title: pageTitle,
                  href: cleanUrl(page.url),
                  excerpt: page.excerpt,
                  page: pageTitle,
                },
              ];
            }
            return sections.map((section) => ({
              id: `${page.url}${section.url}`,
              title: section.title,
              href: cleanUrl(section.url),
              excerpt: section.excerpt,
              page: pageTitle,
            }));
          }),
        );
        setStatus("ready");
      } catch {
        if (id === requestId.current) setStatus("unavailable");
      }
    })();
  }, [deferredQuery]);

  /* Clearing on close rather than from an effect watching `open`: reopening
     with a stale query would show last time's results until the new search
     resolved. */
  const changeOpen = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  }, []);

  const go = useCallback(
    (href: string) => {
      changeOpen(false);
      router.push(href);
    },
    [changeOpen, router],
  );

  const showHits = Boolean(query.trim());
  // Derived rather than cleared from an effect: stale hits simply are not
  // rendered once the query empties.
  const visibleHits = showHits ? hits : [];

  return (
    <CommandMenuContext.Provider value={{ open, setOpen, modKey }}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={changeOpen}
        label="Search documentation"
        overlayClassName="keizoku-cmd-overlay fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm"
        contentClassName="keizoku-cmd-panel fixed left-1/2 top-[15%] z-[70] w-[92vw] max-w-[600px] -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-popover"
      >
        {/* Pagefind has already ranked and matched; cmdk filtering on top of
            it would throw away the ranking and hide valid hits. */}
        <Command loop shouldFilter={!showHits}>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search aria-hidden className="size-[18px] shrink-0 text-meta" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search the docs…"
              className="h-[52px] flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-meta"
            />
            <kbd className="hidden h-[22px] shrink-0 items-center rounded-[6px] border border-border px-1.5 font-mono text-[11px] leading-none text-meta sm:flex">
              ESC
            </kbd>
          </div>

          <CommandList className="max-h-[min(60vh,380px)] overflow-y-auto overscroll-contain p-2">
            <CommandEmpty className="px-3 py-8 text-center text-sm text-meta">
              {status === "unavailable"
                ? "Search runs on the built index — it is unavailable in development."
                : status === "loading"
                  ? "Searching…"
                  : "No results found."}
            </CommandEmpty>

            {showHits
              ? visibleHits.length > 0 && (
                  <CommandGroup
                    heading="Results"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-meta"
                  >
                    {visibleHits.map((hit) => (
                      <CommandItem
                        key={hit.id}
                        value={hit.id}
                        onSelect={() => go(hit.href)}
                        className="flex cursor-pointer flex-col items-start gap-1 rounded-md px-3 py-2.5 data-[selected=true]:bg-accent"
                      >
                        <span className="flex w-full items-baseline gap-2">
                          <span className="truncate text-sm font-medium text-foreground">
                            {hit.title}
                          </span>
                          <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-meta">
                            {hit.page}
                          </span>
                        </span>
                        {/* Pagefind marks the matched terms with <mark>. */}
                        <span
                          className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground [&_mark]:bg-transparent [&_mark]:font-medium [&_mark]:text-brand"
                          dangerouslySetInnerHTML={{ __html: hit.excerpt }}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              : navigation.length > 0 && (
                  <CommandGroup
                    heading="Documentation"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-meta"
                  >
                    {navigation.map((entry) => (
                      <CommandItem
                        key={entry.href}
                        value={`${entry.section ?? ""} ${entry.label}`}
                        onSelect={() => go(entry.href)}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-accent"
                      >
                        <FileText aria-hidden className="size-4 shrink-0 text-meta" />
                        <span>{entry.label}</span>
                        {entry.section && (
                          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-meta">
                            {entry.section}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandMenuContext.Provider>
  );
}

/** The "Search ⌘ K" pill. Opens the shared palette. */
export function SearchTrigger({ className }: { className?: string }) {
  const { setOpen, modKey } = useCommandMenu();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search documentation"
      aria-keyshortcuts="Control+K Meta+K"
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-full border border-border bg-muted pl-3.5 pr-2",
        "text-meta transition-colors duration-[var(--k-dur-1)] hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <Search aria-hidden className="size-4 shrink-0" />
      <span className="text-[13px] leading-none">Search</span>
      <span className="ml-auto flex shrink-0 items-center gap-1">
        <kbd className="flex h-[20px] min-w-[20px] items-center justify-center rounded-[5px] border border-border bg-background px-1 font-mono text-[10px] leading-none">
          {modKey}
        </kbd>
        <kbd className="flex h-[20px] min-w-[20px] items-center justify-center rounded-[5px] border border-border bg-background px-1 font-mono text-[10px] leading-none">
          K
        </kbd>
      </span>
    </button>
  );
}
