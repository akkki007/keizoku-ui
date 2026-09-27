"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* A ruled rail of brand marks, grouped, with a label that rises on hover.
 *
 * The hover is built from layout, not from transform: the hovered item takes
 * extra horizontal margin and its neighbours are pushed aside by the flex row
 * itself. Because the rail is centred and grows symmetrically, the item under
 * the cursor stays put while the rest of the row spreads away from it — so
 * the pointer never loses the target it is hovering, which a scale-up on the
 * icon would risk. Nothing blurs, springs or shrinks.
 *
 * Every measurement derives from one variable, `--rail-icon`, so the rail
 * scales as a unit. It defaults to a clamp and needs no breakpoints; pass
 * `size` to pin it. Chrome comes from the host project's tokens — `border`
 * for the rule, `primary` for the label — so the only colour the component
 * carries is whatever the icons bring with them.
 */

export interface SocialItem {
  /** Accessible name for the link, and the text of the hover label. */
  label: string;
  href: string;
  /** Rendered inside a square, rounded, clipped box. An `<img>`, an SVG, an
   *  `<Image>` — anything. Images are sized and cropped to fill. */
  icon: React.ReactNode;
  /** Defaults to opening in a new tab for absolute URLs. */
  external?: boolean;
}

export interface SocialsProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "children"> {
  /** Each group is drawn as a run of icons; a hairline separates one from the
   *  next. Pass a single group for an undivided rail. */
  groups: SocialItem[][];
  /** Accessible name for the rail. */
  label?: string;
  /** Icon edge in pixels. Omit for the responsive default. */
  size?: number;
}

export function Socials({
  groups,
  label = "Social links",
  size,
  className,
  style,
  ...props
}: SocialsProps) {
  return (
    /* The scroll container carries the label's headroom so the rail can
       overflow sideways on a narrow screen without clipping a raised label.
       `w-max` plus `mx-auto` centres the rail while it fits and lets it
       scroll once it does not — icons never shrink below a usable target. */
    <div
      className="w-full overflow-x-auto pb-1 pt-[calc(var(--rail-icon)*0.38)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={
        {
          "--rail-icon": size ? `${size}px` : "clamp(48px, 7vw, 92px)",
          ...style,
        } as React.CSSProperties
      }
    >
      <nav
        aria-label={label}
        className={cn(
          "mx-auto flex w-max items-center border border-border",
          "gap-[calc(var(--rail-icon)*0.163)] rounded-[calc(var(--rail-icon)*0.26)]",
          "px-[calc(var(--rail-icon)*0.152)] py-[calc(var(--rail-icon)*0.141)]",
          className,
        )}
        {...props}
      >
        {groups.map((group, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              /* The rule between groups: one weight, one colour, drawn at the
                 same 73% of the icon height the design sets it at. */
              <span
                aria-hidden
                className="w-px shrink-0 self-center bg-border"
                style={{ height: "calc(var(--rail-icon) * 0.728)" }}
              />
            )}
            <ul className="flex items-center gap-[calc(var(--rail-icon)*0.163)]">
              {group.map((item) => (
                <SocialLink key={item.href + item.label} {...item} />
              ))}
            </ul>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}

function SocialLink({ label, href, icon, external }: SocialItem) {
  const opensNewTab = external ?? /^https?:\/\//.test(href);

  return (
    <li
      /* The spread. Margin rather than transform, so the row actually
         relayouts and the neighbours move with it. `focus-within` gives the
         keyboard the same behaviour the pointer gets. */
      className={cn(
        "shrink-0 transition-[margin] duration-[var(--k-dur-2)] ease-[var(--k-ease-travel)]",
        "hover:mx-[calc(var(--rail-icon)*0.174)]",
        "focus-within:mx-[calc(var(--rail-icon)*0.174)]",
      )}
    >
      <a
        href={href}
        {...(opensNewTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="group/social relative block size-[var(--rail-icon)] rounded-[calc(var(--rail-icon)*0.25)] outline-offset-4"
      >
        <span className="sr-only">{label}</span>

        {/* The label rises into the headroom above the rail. It travels and
            resolves — no blur, no scale. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-[calc(100%+var(--rail-icon)*0.29)] left-1/2 z-10 -translate-x-1/2",
            "whitespace-nowrap rounded-full bg-primary text-primary-foreground",
            "px-[calc(var(--rail-icon)*0.13)] py-[calc(var(--rail-icon)*0.033)]",
            "text-[calc(var(--rail-icon)*0.12)] font-light leading-none tracking-[-0.04em]",
            "translate-y-[calc(var(--rail-icon)*0.09)] opacity-0",
            "transition-[opacity,translate] duration-[var(--k-dur-2)] ease-[var(--k-ease-travel)]",
            "group-hover/social:translate-y-0 group-hover/social:opacity-100",
            "group-focus-visible/social:translate-y-0 group-focus-visible/social:opacity-100",
          )}
        >
          {label}
        </span>

        {/* Icons arrive pre-rounded or square; clipping to the same radius
            makes the run consistent either way. */}
        <span className="block size-full overflow-hidden rounded-[calc(var(--rail-icon)*0.25)] [&_img]:size-full [&_img]:object-cover [&_svg]:size-full">
          {icon}
        </span>
      </a>
    </li>
  );
}
