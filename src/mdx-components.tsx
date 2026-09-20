import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import type { MDXComponents } from "mdx/types";
import { withIcons } from "nextra/components";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";

const themeComponents = getThemeComponents();

export function useMDXComponents(components: MDXComponents = {}) {
  return { ...themeComponents, pre: withIcons(DocsCodeBlock), ...components };
}
