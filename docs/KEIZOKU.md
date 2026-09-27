# Keizoku UI

**継続 — continuation.** A React component library where the layout system is the ornament: drawn, not implied.

---

## Thesis

Most component libraries hide their grid and put their personality in effects. Keizoku inverts that. The grid is visible, ruled, and unbroken down the length of the page; components hang off it. Spectacle is built from **layout**, never from blur, glow or shaders.

This is a deliberate complement to [ObsidianUI](../ObsidianUI), not a successor. ObsidianUI puts its identity in motion — blur, spring, WebGL. Keizoku puts its identity in structure. A component that could ship in both has no point of view.

## Where the taste came from

| Source | Contribution |
|---|---|
| Attio homepage | 96px gutters held with zero deviation · framed cards (4px inset child) · hairlines drawn as objects, not borders · a left spine threading each section · paired CTAs · big display type |
| Portfolio landing page | dashed rules as the primary structural device · the left **label gutter** · right index rail · achromatic chrome with colour arriving only through content · pill controls against square surfaces · **a control sitting on a rule and interrupting it** |

## Commits to

1. **Drawn structure** — dashed and hairline rules are first-class ornament, on one grid, one weight, one colour
2. **Achromatic UI, content-coloured page** — chrome is warm grayscale; colour enters through photography, brand marks, syntax
3. **The label gutter** — a left rail carrying section labels outside the content column
4. **Framed surfaces** — a 4px inset child inside every card
5. **Radius contrast** — surfaces at 6px, controls at 999px, never reconciled
6. **Mono for meta** — labels, dates, counts, coordinates, status in uppercase letter-spaced monospace
7. **Mechanical motion** — clip, wipe, draw, snap. Drafting-instrument behaviour.

## Refuses

| | **Keizoku refuses** | **ObsidianUI refuses** |
|---|---|---|
| Motion | blur as a motion channel; spring/bounce; press-scale | instant/stepped transitions; mechanical linear easing |
| Depth | elevation shadow between opaque surfaces; glow | flat structure with no elevation cue |
| Structure | invisible layout; undrawn grids | visible rules as ornament; dashed grids |
| Colour | coloured chrome; gradient meshes; >1 accent | warm achromatic restraint as the whole personality |
| Surface | uniform radius | radius contrast in one view |
| Type | one family doing every job | uppercase letter-spaced mono as a primary voice |
| Spectacle | WebGL, shaders, particles | spectacle built only from layout |

## Blur, precisely

The refuse list says *blur*. That was always shorthand for one thing, and the
`socials` glass variant is the point at which it has to be said properly:

> Blur is refused as a **motion channel**. Nothing here defocuses on its way
> in or out — that is the other library's signature, and `--k-ease-travel`
> plus a clip wipe is how Keizoku says the same thing.
>
> **Surface** blur is permitted where the surface is genuinely translucent and
> there is something behind it worth refracting. A `backdrop-filter` on a pane
> is a material property, not a transition.

The test is whether the blur is doing work a still frame can show. A glass rail
over a photograph reads as glass with the page paused; a blurred fade-in only
exists while it is moving. The first is a surface, the second is motion, and
only the second is refused.

Elevation shadow carries the same caveat and no more: a translucent pane casts
an ambient shadow because that is what a pane does. It does not license shadow
as a way of ranking two opaque cards — rules and a 1px ring still do that.

## Token scale, against ObsidianUI

| | ObsidianUI | Keizoku |
|---|---|---|
| Ease | `cubic-bezier(.22,1,.36,1)` | `cubic-bezier(.65,0,.35,1)` travel · `linear` draws |
| Durations | 150/250/350/400/500 | **0 / 120 / 200 / 320** (+640 draw) |
| Motion verbs | fade + blur + scale | **clip wipe · stroke draw · snap** |
| Blur | 2/3/8px | **none** |
| Press | `scale(0.96)` | `1` — a 120ms ink change |
| Depth | 3-layer oklch shadow | **1px ring + drawn rules** |
| Radius | uniform concentric | **6px surfaces / 999px controls** |
| Neutral | cool obsidian | **warm paper** `oklch(.985 .002 85)` → `oklch(.18 .005 85)` |
| Accent | brand blue | **vermilion 朱色** `oklch(.62 .19 35)` |
| Type | single grotesk | **Geist + Geist Mono**, mono carries all meta |
| Gutter | — | 96px / 16px mobile, 40px card padding |

## The standing risk

`better-layout` principle 1 — *group with space, not lines* — is deliberately inverted here. That principle exists because rules read as noise when they compete with spacing, and it is still correct. Keizoku survives it only by discipline:

> **One grid. One weight. One colour. One dash pattern.**
> A second rule weight anywhere is a bug, not a variation.

The 2× gap ratio still applies *inside* a ruled cell — rules replace separators **between** sections, never spacing **within** them.

## Files

```
docs/KEIZOKU.md       this document
src/styles/keizoku.css   the full token scale — colour, type, motion;
                         the optional theme registry item is generated from it
src/components/ui/       installable primitives (ruled-section, mode-toggle)
src/components/block/    installable composed components (navbar)
src/content/             the MDX docs, served at /docs
scripts/registry.ts      generates public/r/*.json from the two folders above
skills/                  the nine craft skills, with taste dials reset
  KEIZOKU-TASTE.md            which principles are inverted and why
  transitions-dev/_root.css   Keizoku motion scale (replaces transitions.dev)
```

Everything in `skills/` not named in `KEIZOKU-TASTE.md` is an **invariant** — accessibility, semantics, contrast, perception — and carries over untouched. Invariants don't care about taste.

## Preview

```bash
npm install
npm run dev
# the landing page at http://localhost:3000
# the docs at http://localhost:3000/docs
```

The hero's motion does not show in a screenshot. On load the headline rises word by word and a single vermilion glow drifts behind it. All of it collapses to static under `prefers-reduced-motion`.

## Distribution

Components install into a consumer's project through the shadcn CLI, as source they own:

```bash
npx shadcn@latest add "https://keizoku.akkki.tech/r/navbar.json"
```

`scripts/registry.ts` generates one manifest per `.tsx` file in `src/components/ui/` and `src/components/block/`, following each file's imports through the TypeScript AST. The docs page for a component loads the same manifest, so its documented source and its installed source cannot differ.

**Components carry no palette.** They are written against shadcn's semantic names — `background`, `foreground`, `border`, `muted`, `primary` — so an installed component reads the host project's colours rather than importing Keizoku's. The only CSS a component ships is six motion variables. This is the one place the library's identity is deliberately *not* enforced: a navbar in someone else's product should look like their navbar, and the taste that survives the swap is the structural part — the drawn rules, the label gutter, the framed surface, the radius contrast.

Keizoku's own values ship separately, as a `registry:theme` item generated from `src/styles/keizoku.css`:

```bash
npx shadcn@latest add "https://keizoku.akkki.tech/r/theme.json"
```

## Next

- [x] Port `hero.html` to React + Tailwind v4 (`@theme inline` maps onto the `:root` tokens; values stay in `:root`, or any unbuilt page renders unstyled)
- [x] Ruled section container as the second component — the primitive every other layout hangs off
- [x] shadcn-compatible registry, and a docs site that installs from it
- [ ] Re-derive the `transitions-dev` recipe inventory into Keizoku's motion vocabulary
- [ ] Bring the landing hero onto the motion scale — it still uses blur and `ease-out-expo`, both of which `KEIZOKU-TASTE.md` refuses
- [ ] Self-host Geist / Geist Mono as `.woff2` instead of the Google Fonts CDN
