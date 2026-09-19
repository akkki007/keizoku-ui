# Keizoku taste overrides

Read this before applying any `better-*` skill in this repo.

The nine skills carry two different kinds of rule fused together:

- **Invariants** — perception, accessibility, semantics, contrast math, motion restraint. These are not taste. They apply here unchanged, and nothing in this file overrides them.
- **Taste dials** — the specific values that made ObsidianUI look like ObsidianUI. Those values are *reset* below. Where a skill states a concrete number that this file contradicts, **this file wins**.

---

## 1. The one inverted principle

`better-layout` principle 1 — *Group with Space, Not Lines* — is **deliberately inverted** in Keizoku. Drawn rules are the primary structural device, not the last resort.

This is the single riskiest decision in the library, so it comes with a hard constraint rather than a licence:

> **One grid. One weight. One colour. One dash pattern.**
> `1px`, `4 4`, `--k-rule-ink`, aligned to `--k-unit` (8px).
> A second rule weight anywhere is a bug, not a variation.

The reason the original rule exists — lines read as noise when they compete with spacing — still holds. Keizoku survives it only by making the rules *systematic* enough to read as a drawing. The moment they are decorative, the page is clutter and the principle was right.

Two sub-rules that keep it honest:

- The 2× gap ratio still applies **inside** a ruled cell. Rules replace separators *between* sections, never spacing *within* them.
- A rule is allowed to be interrupted by a control sitting on it (a centred pill breaking the dash run). That is a feature, not an exception — it is what proves the rule is a drawn object rather than a border.

---

## 2. Motion

`transitions-dev/_root.css` has been replaced wholesale. The 27 recipes in that folder are still a valid **inventory** of what a library must cover — badge, dropdown, modal, toast, tabs, accordion, skeleton, toggle, checkbox, tooltip — but their *values* are ObsidianUI's answers and must be re-derived.

When porting any recipe:

| Recipe uses | Keizoku substitutes |
|---|---|
| `filter: blur(2px → 0)` | `clip-path` wipe, or nothing |
| `scale(0.96 → 1)` | no transform; a `--k-dur-1` ink change |
| `cubic-bezier(.22,1,.36,1)` | `--k-ease-travel` |
| spring, `bounce: 0` | `--k-ease-travel`; springs are out |
| `--ease-bounce-strong` | delete the interaction or make it travel |
| 150/250/350/400/500ms | `--k-dur-1/2/3` only |

`better-ui` principles 6, 7 and 9 (subtle exits, contextual icon blur-scale, `scale(0.96)` on press) are **superseded** by the table above. Principles 4, 12, 13, 16 (interruptible transitions, transition only what changes, sparing `will-change`, motion restraint) are invariants and still apply.

---

## 3. Surfaces

`better-ui` principle 3 says shadows for elevation, borders for structure. Keizoku keeps the second half and drops the first: **no elevation shadows.** Depth is expressed by rules, insets and at most a `1px` ring.

- Concentric radius (`outer = inner + padding`) still applies — it is geometry, not taste.
- Radius *contrast* is a Keizoku signature: surfaces at `6px`, controls at `999px`. Do not unify them.
- The framed-card pattern (a `4px` inset child inside a card) is inherited from Attio and is the house surface treatment.
- Image outlines keep `better-ui` principle 8 exactly as written — pure black/white at 10%, never tinted. That rule is perceptual, not stylistic.

---

## 4. Colour

`better-colors` applies in full — ramp construction, token tiering, contrast measurement, one-colour-one-meaning. Only the values change:

- Neutral ramp is **warm** (hue ≈ 85, chroma ≈ 0.002–0.006), held in one direction across the whole ramp.
- The UI chrome is achromatic. **Colour enters through content** — photography, brand marks, syntax highlighting — not through chrome.
- Exactly one accent: vermilion `oklch(0.62 0.19 35)`. One filled action per view, per `better-colors` principle 8.
- No gradient meshes, no glow, no shader decoration.

---

## 5. Type

`better-typography` applies in full. The pairing is the taste decision:

- **Grotesk** for display and body.
- **Monospace, uppercase, letter-spaced** for all meta — labels, dates, counts, coordinates, status. This is the label-gutter voice and it is doing a lot of the identity work.
- Principle 4's "pair for contrast, not similarity" is exactly why this works; two grotesks would read as a mistake.

---

## 6. What each library refuses

Keeping both lists visible is what stops the two drifting into each other.

| | **Keizoku refuses** | **ObsidianUI refuses** |
|---|---|---|
| Motion | blur as a motion channel; spring/bounce; press-scale | instant/stepped transitions; mechanical linear easing |
| Depth | elevation shadows; glow | flat structure with no elevation cue |
| Structure | invisible layout; undrawn grids | visible rules as ornament; dashed grids |
| Colour | coloured chrome; gradient meshes; >1 accent | warm achromatic restraint as the whole personality |
| Surface | uniform radius | radius contrast (square + pill in one view) |
| Type | a single family doing every job | uppercase letter-spaced mono as a primary voice |
| Spectacle | WebGL, shaders, particle effects | spectacle built only from layout |

Neither list is a judgement. They are the two libraries' opposite commitments, and a component that could ship in both is a component with no point of view.
