import { cn } from "@/lib/utils";

export interface PropDef {
  prop: string;
  type: string;
  defaultValue?: string;
  description: string;
}

/** A ruled table: hairlines between rows, mono for every cell that holds an
 *  identifier, prose only in the last column. */
export function PropsTable({
  data,
  caption,
  className,
}: {
  data: PropDef[];
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn("my-6 w-full overflow-x-auto rounded-lg bg-muted p-1", className)}>
      <table className="w-full min-w-[520px] border-collapse rounded-md border border-border bg-card text-left text-[13px]">
        {caption && (
          <caption className="px-4 pb-2 pt-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-meta">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-border">
            {["Prop", "Type", "Default", "Description"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="h-9 whitespace-nowrap px-4 text-left align-middle font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-meta"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.prop} className="border-b border-border last:border-b-0">
              <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs font-medium text-foreground">
                {item.prop}
              </td>
              <td className="px-4 py-3 align-top">
                <code className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {item.type}
                </code>
              </td>
              <td className="px-4 py-3 align-top">
                {item.defaultValue ? (
                  <code className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {item.defaultValue}
                  </code>
                ) : (
                  <span className="font-mono text-xs text-meta">—</span>
                )}
              </td>
              <td className="min-w-[220px] px-4 py-3 align-top leading-relaxed text-muted-foreground">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
