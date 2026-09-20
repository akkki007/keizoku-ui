import { readFile } from "node:fs/promises";
import path from "node:path";
import { CodeBlock } from "./code-block";

/** Renders the real token stylesheet, read at build time, so the CSS the
 *  install page asks you to paste is byte-for-byte the CSS this site runs
 *  on. Documenting it by hand would drift the first time a token moved. */
export async function TokensSource({ title }: { title?: string }) {
  const source = await readFile(
    path.join(process.cwd(), "src/styles/keizoku.css"),
    "utf8",
  );

  return (
    <CodeBlock
      code={source}
      language="css"
      title={title ?? "src/styles/keizoku.css"}
      className="max-h-[32rem] overflow-auto"
    />
  );
}
