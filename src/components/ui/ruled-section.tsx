import { cn } from "@/lib/utils";

/* The primitive every other Keizoku layout hangs off.
 *
 * A section is a ruled cell: one dashed hairline across the top, a label
 * gutter on the left carrying the section name in mono, an index rail on
 * the right, and the content column between them. The rule is drawn as a
 * repeating gradient rather than a dashed border so the dash pattern stays
 * exactly 4px/4px at any width — a border's dashes stretch to fit, which
 * breaks the "one dash pattern" rule the moment two sections differ in size.
 *
 * `action` sits on the rule and interrupts it. That is the point: an
 * interrupted rule proves the line is a drawn object rather than a border,
 * and it is the one licensed exception to the unbroken grid.
 *
 * One grid. One weight. One colour. One dash pattern. A second rule weight
 * anywhere in a Keizoku layout is a bug, not a variation.
 */

export interface RuledSectionProps extends React.ComponentPropsWithoutRef<"section"> {
  /** Section name, set in the left gutter. Rendered uppercase mono. */
  label?: string;
  /** Counter or coordinate for the right rail, e.g. `01 / 07`. */
  index?: string;
  /** A control that sits on the top rule and breaks the dash run. */
  action?: React.ReactNode;
  /** Draw the rule below the section as well. Use on the last section only. */
  closed?: boolean;
  /** Class names for the content column, not the ruled frame. */
  contentClassName?: string;
}

/** A single hairline on the grid: 1px, 4/4 dash, one colour, everywhere. */
export function Rule({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]",
        className,
      )}
      {...props}
    />
  );
}

/** Uppercase letter-spaced mono — the label-gutter voice, shared by every
 *  piece of meta text in the library. */
export function MetaLabel({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function RuledSection({
  label,
  index,
  action,
  closed = false,
  className,
  contentClassName,
  children,
  ...props
}: RuledSectionProps) {
  return (
    <section className={cn("relative w-full", className)} {...props}>
      <div className="relative flex items-center">
        <Rule />
        {action && (
          /* The control covers the rule rather than the rule stopping short:
             one element, one background, no gap to keep aligned. */
          <div className="absolute left-1/2 -translate-x-1/2 bg-background px-4">
            {action}
          </div>
        )}
      </div>

      {/* 96px gutters, held with no deviation on desktop; on mobile the
          gutters collapse and the label moves above the content, because a
          16px gutter cannot carry letter-spaced mono. */}
      <div className="grid grid-cols-1 gap-y-6 px-4 py-10 md:grid-cols-[96px_minmax(0,1fr)_96px] md:gap-y-0 md:px-0 md:py-16">
        {(label || index) && (
          <div className="flex items-baseline justify-between md:block md:pl-6 md:pt-1">
            {label && <MetaLabel>{label}</MetaLabel>}
            {index && <MetaLabel className="md:hidden">{index}</MetaLabel>}
          </div>
        )}

        <div className={cn("min-w-0", contentClassName)}>{children}</div>

        {index && (
          <div className="hidden justify-end pr-6 pt-1 md:flex">
            <MetaLabel>{index}</MetaLabel>
          </div>
        )}
      </div>

      {closed && <Rule />}
    </section>
  );
}

/* A framed surface: a 4px inset child inside a card, concentric by way of
   the project's own --radius. The house surface treatment, inherited from
   Attio — depth without a shadow, and it adopts whatever radius the host
   project already uses. */
export function FramedCard({
  className,
  contentClassName,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { contentClassName?: string }) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-muted p-1", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-md border border-border bg-card p-10",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
