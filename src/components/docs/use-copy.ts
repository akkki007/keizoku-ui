"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** Collect the `code` prop of every nested CodeBlock, so an installation
 *  step can offer one copy button for all the commands inside it. */
export function getCodeToCopy(children: ReactNode): string {
  const blocks: string[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<{ code?: unknown; children?: ReactNode }>(child)) return;
    if (typeof child.props.code === "string") blocks.push(child.props.code);
    else if (child.props.children) {
      const nested = getCodeToCopy(child.props.children);
      if (nested) blocks.push(nested);
    }
  });
  return blocks.join("\n\n");
}

export function useCopy() {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      // Clipboard access is refused in some embeds and over plain http;
      // say so rather than showing a confirmation that did not happen.
      setStatus("Unable to copy. Select and copy the text manually.");
    }
    timer.current = setTimeout(() => setStatus(""), 3000);
  }, []);

  return { hasCopied: status === "Copied", status, copy };
}
