import { FramedCard, RuledSection } from "@/components/ui/ruled-section";

export function RuledSectionDemo() {
  return (
    <div className="w-full bg-background">
      <RuledSection
        label="Components"
        index="01 / 07"
        action={
          <a
            href="#ruled-section"
            className="rounded-full border border-border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-[var(--k-dur-1)] hover:bg-accent hover:text-foreground"
          >
            View all
          </a>
        }
      >
        <FramedCard>
          <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground">
            The grid is the ornament
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Rules replace separators between sections, never spacing within them.
            The card inside this cell is framed, not shadowed — a 4px inset child
            on a 6px surface.
          </p>
        </FramedCard>
      </RuledSection>
    </div>
  );
}
