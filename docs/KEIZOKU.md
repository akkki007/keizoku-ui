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
| Depth | elevation shadows; glow | flat structure with no elevation cue |
| Structure | invisible layout; undrawn grids | visible rules as ornament; dashed grids |
| Colour | coloured chrome; gradient meshes; >1 accent | warm achromatic restraint as the whole personality |
| Surface | uniform radius | radius contrast in one view |
| Type | one family doing every job | uppercase letter-spaced mono as a primary voice |
| Spectacle | WebGL, shaders, particles | spectacle built only from layout |

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
KEIZOKU.md      this document
tokens.css      the full scale — all values in :root, no build required
hero.html       hero section, self-contained preview
skills/         the nine craft skills, with taste dials reset
  KEIZOKU-TASTE.md            which principles are inverted and why
  transitions-dev/_root.css   Keizoku motion scale (replaces transitions.dev)
```

Everything in `skills/` not named in `KEIZOKU-TASTE.md` is an **invariant** — accessibility, semantics, contrast, perception — and carries over untouched. Invariants don't care about taste.

## Preview

```bash
cd "Keizoku UI" && python3 -m http.server 4173
# open http://localhost:4173/hero.html
```

The hero's motion does not show in a screenshot. On load: six rules draw themselves in on a linear curve, the headline wipes in word by word, the lede follows. On pointer move a crosshair **snaps** to the 48px cell with a live coordinate readout — the stepping is the point. All of it collapses to static under `prefers-reduced-motion`.

## Next

- [ ] Port `hero.html` to React + Tailwind v4 (add `@theme inline` mapping onto the `:root` tokens — do not move values into `@theme`, or any unbuilt page renders unstyled)
- [ ] Ruled section container as the second component — the primitive every other layout hangs off
- [ ] Re-derive the `transitions-dev` recipe inventory into Keizoku's motion vocabulary
- [ ] Self-host Geist / Geist Mono as `.woff2` instead of the Google Fonts CDN
