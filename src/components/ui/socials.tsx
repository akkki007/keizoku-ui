"use client";

import * as React from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { cn } from "@/lib/utils";

gsap.registerPlugin(CustomEase);

/* A rail of grouped brand marks, with a label that rises on hover.
 *
 * The hover is built from layout, not from a transform: the hovered item
 * takes horizontal margin and its neighbours are pushed aside by the flex row
 * itself. Because the rail is centred and grows symmetrically, the mark under
 * the cursor stays put while the rest of the row spreads away from it — so
 * the pointer never loses the target it is hovering, which a scale-up on the
 * icon would risk. Nothing blurs, springs or shrinks.
 *
 * Every measurement derives from one variable, `--rail-icon`, so the rail
 * scales as a unit. It defaults to a clamp and needs no breakpoints; pass
 * `size` to pin it. Chrome comes from the host project's tokens, so the only
 * colour the component carries is whatever the marks bring with them.
 */

const RATIO = {
  gap: 0.163,
  padX: 0.152,
  padY: 0.141,
  radius: 0.26,
  iconRadius: 0.25,
  rule: 0.728,
  /** How far a hovered mark pushes its neighbours, each side. */
  spread: 0.174,
  /** Label's baseline gap above the mark, and how far it travels up. */
  tipGap: 0.29,
  tipRise: 0.09,
} as const;

/** GSAP works in seconds; the motion scale is authored in CSS. Reading the
 *  variable rather than hardcoding keeps the contract — retune `--k-dur-2`
 *  and this retunes with it, and the reduced-motion floor that ships with
 *  the component collapses these to a near-zero duration for free. */
function readSeconds(element: Element, name: string, fallback: number): number {
  const raw = getComputedStyle(element).getPropertyValue(name).trim();
  if (raw.endsWith("ms")) return parseFloat(raw) / 1000;
  if (raw.endsWith("s")) return parseFloat(raw);
  return fallback;
}

/** `--k-ease-travel` is a cubic-bezier; CustomEase takes the same four
 *  control points as a path, so the curve is exact rather than approximated
 *  by the nearest `power` ease. Created once per distinct curve. */
const easeCache = new Map<string, string>();

function readEase(element: Element, name: string): string | ((t: number) => number) {
  const raw = getComputedStyle(element).getPropertyValue(name).trim();
  const points = raw.match(/-?\d*\.?\d+/g);
  if (!raw.startsWith("cubic-bezier") || !points || points.length < 4) return "power2.inOut";
  const cached = easeCache.get(raw);
  if (cached) return cached;
  const [x1, y1, x2, y2] = points;
  const id = `keizoku-${easeCache.size}`;
  CustomEase.create(id, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
  easeCache.set(raw, id);
  return id;
}

export interface SocialItem {
  /** Accessible name for the link, and the text of the hover label. */
  label: string;
  href: string;
  /** Rendered inside a square, rounded, clipped box. An `<img>`, an SVG, an
   *  `<Image>` — anything. Images are sized and cropped to fill. */
  icon: React.ReactNode;
  /** Shows a dot on the mark. The text is appended to the link's accessible
   *  name, so the dot means something to a screen reader too — "2 unread",
   *  "new", "currently live". */
  badge?: string;
  /** Defaults to opening in a new tab for absolute URLs. */
  external?: boolean;
}

export interface SocialsProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "children"> {
  /** Each group is drawn as a run of marks; a hairline separates one from the
   *  next. Pass a single group for an undivided rail. */
  groups: SocialItem[][];
  /** Accessible name for the rail. */
  label?: string;
  /** Icon edge in pixels. Omit for the responsive default. */
  size?: number;
  /** `outline` is the drawn rail: a hairline on nothing. `glass` is a
   *  translucent surface that refracts what sits behind it, and only earns
   *  its keep over photography, a gradient, or content that scrolls under. */
  variant?: "outline" | "glass";
}

export function Socials({
  groups,
  label = "Social links",
  size,
  variant = "outline",
  className,
  style,
  ...props
}: SocialsProps) {
  return (
    /* The scroll container carries the label's headroom so the rail can
       overflow sideways on a narrow screen without clipping a raised label.
       `w-max` plus `mx-auto` centres the rail while it fits and lets it
       scroll once it does not — marks never shrink below a usable target. */
    <div
      className="w-full overflow-x-auto pb-2 pt-[calc(var(--rail-icon)*0.56)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={
        {
          "--rail-icon": size ? `${size}px` : "clamp(40px, 5vw, 56px)",
          ...style,
        } as React.CSSProperties
      }
    >
      <nav
        aria-label={label}
        className={cn(
          "mx-auto flex w-max items-center border",
          "gap-[calc(var(--rail-icon)*0.163)] rounded-[calc(var(--rail-icon)*0.26)]",
          "px-[calc(var(--rail-icon)*0.152)] py-[calc(var(--rail-icon)*0.141)]",
          variant === "outline" && "border-border",
          variant === "glass" && [
            "border-white/15 bg-[color-mix(in_oklab,var(--card)_55%,transparent)]",
            "backdrop-blur-xl backdrop-saturate-150",
            /* Pure black and white at low alpha, never tinted — the ambient
               shadow and the top highlight that make a translucent surface
               read as a pane rather than as reduced opacity. */
            "shadow-[0_8px_32px_-8px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.25)]",
          ],
          className,
        )}
        {...props}
      >
        {groups.map((group, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              /* The rule between groups: one weight, one colour, drawn at the
                 same 73% of the mark's height the design sets it at. */
              <span
                aria-hidden
                className={cn(
                  "w-px shrink-0 self-center",
                  variant === "glass" ? "bg-white/20" : "bg-border",
                )}
                style={{ height: `calc(var(--rail-icon) * ${RATIO.rule})` }}
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

function SocialLink({ label, href, icon, badge, external }: SocialItem) {
  const itemRef = React.useRef<HTMLLIElement>(null);
  const tipRef = React.useRef<HTMLSpanElement>(null);
  const opensNewTab = external ?? /^https?:\/\//.test(href);

  const setOpen = React.useCallback((open: boolean) => {
    const item = itemRef.current;
    const tip = tipRef.current;
    if (!item || !tip) return;

    /* Measured per interaction rather than cached, so a rail sized by a
       clamp stays in proportion across a viewport resize. */
    const iconSize = (item.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
    const duration = readSeconds(item, "--k-dur-2", 0.2);
    const ease = readEase(item, "--k-ease-travel");

    gsap.to(item, {
      marginLeft: open ? iconSize * RATIO.spread : 0,
      marginRight: open ? iconSize * RATIO.spread : 0,
      duration,
      ease,
      overwrite: "auto",
    });
    gsap.to(tip, {
      autoAlpha: open ? 1 : 0,
      y: open ? 0 : iconSize * RATIO.tipRise,
      duration,
      ease,
      overwrite: "auto",
    });
  }, []);

  React.useEffect(() => {
    const item = itemRef.current;
    const tip = tipRef.current;
    return () => {
      if (item) gsap.killTweensOf(item);
      if (tip) gsap.killTweensOf(tip);
    };
  }, []);

  return (
    <li
      ref={itemRef}
      className="shrink-0"
      /* Pointer events rather than CSS :hover so the rail and the label share
         one timeline, and so a touch tap never leaves a mark stuck open. */
      onPointerEnter={(event) => event.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={(event) => event.pointerType !== "touch" && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <a
        href={href}
        {...(opensNewTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="relative block size-[var(--rail-icon)] rounded-[calc(var(--rail-icon)*0.25)] outline-offset-4"
      >
        <span className="sr-only">{badge ? `${label} — ${badge}` : label}</span>

        {/* The label rises into the headroom above the rail. It travels and
            resolves — no blur, no scale. Hidden until GSAP raises it. */}
        <span
          ref={tipRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-[calc(100%+var(--rail-icon)*0.29)] left-1/2 z-10 -translate-x-1/2",
            "whitespace-nowrap rounded-full bg-primary text-primary-foreground",
            "px-[calc(var(--rail-icon)*0.19)] py-[calc(var(--rail-icon)*0.075)]",
            "text-[calc(var(--rail-icon)*0.2)] font-light leading-none tracking-[-0.02em]",
          )}
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {label}
        </span>

        {/* Marks arrive pre-rounded or square; clipping to the same radius
            makes the run consistent either way. */}
        <span className="block size-full overflow-hidden rounded-[calc(var(--rail-icon)*0.25)] [&_img]:size-full [&_img]:object-cover [&_svg]:size-full">
          {icon}
        </span>

        {badge && (
          <span
            aria-hidden
            className="absolute right-0 top-0 block -translate-y-1/3 translate-x-1/3 rounded-full bg-primary ring-2 ring-background"
            style={{
              width: "calc(var(--rail-icon) * 0.16)",
              height: "calc(var(--rail-icon) * 0.16)",
            }}
          />
        )}
      </a>
    </li>
  );
}
