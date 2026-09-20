import { Navbar } from "@/components/block/navbar";

/* The navbar is `fixed`, which a preview pane cannot contain. Overriding the
   position class (tailwind-merge keeps the last one in the group) drops it
   into the frame without a second copy of the component. */
export function NavbarDemo() {
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-[4px] bg-background">
      <Navbar
        className="absolute z-10"
        leftLinks={[
          { label: "Components", href: "#" },
          { label: "Templates", href: "#" },
        ]}
        rightLinks={[
          { label: "Playground", href: "#" },
          { label: "Docs", href: "#" },
        ]}
      />
    </div>
  );
}
