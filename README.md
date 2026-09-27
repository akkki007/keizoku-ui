<div align="center">

# Keizoku UI

**継続 — continuation.**
A React component library where the layout system is the ornament: drawn, not implied.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-1a1a18?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-1a1a18?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-1a1a18?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-1a1a18?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/shadcn-registry-white?labelColor=1a1a18" alt="shadcn registry" />
</p>

[**keizoku.akkki.tech**](https://keizoku.akkki.tech) &nbsp;·&nbsp; [Documentation](https://keizoku.akkki.tech/docs) &nbsp;·&nbsp; [Get started](https://keizoku.akkki.tech/docs/introduction)

</div>

---

Most component libraries hide their grid and put their personality in effects.
Keizoku inverts that. The grid is visible, ruled and unbroken down the length of
the page; components hang off it. Spectacle is built from **layout**, never from
blur, glow or shaders.

It is a deliberate complement to [ObsidianUI](https://www.obsidianui.dev), not a
successor — a component that could ship in both has no point of view.

## Quick start

Components install as source into your own project through the shadcn CLI:

```bash
npx shadcn@latest add "https://keizoku.akkki.tech/r/navbar.json"
```

Or register the namespace once in `components.json` and install by name:

```json
{
  "registries": {
    "@keizoku": "https://keizoku.akkki.tech/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @keizoku/socials
```

There is nothing to set up first. Components are written against the shadcn
token names your project already defines — `background`, `foreground`, `border`,
`muted`, `primary` — so one arrives themed to whatever your product looks like
rather than dragging this palette in with it. The only CSS a component brings
is six motion variables, and the CLI merges those for you.

Want the warm-paper look as well? That is one optional command:

```bash
npx shadcn@latest add "https://keizoku.akkki.tech/r/theme.json"
```

## What it commits to

1. **Drawn structure** — dashed and hairline rules are first-class ornament, on one grid, one weight, one colour
2. **Achromatic UI, content-coloured page** — chrome is warm grayscale; colour enters through photography, brand marks, syntax
3. **The label gutter** — a left rail carrying section labels outside the content column
4. **Framed surfaces** — a 4px inset child inside every card
5. **Radius contrast** — surfaces at 6px, controls at 999px, never reconciled
6. **Mono for meta** — labels, dates, counts, coordinates and status in uppercase letter-spaced monospace
7. **Mechanical motion** — clip, wipe, draw, snap. Drafting-instrument behaviour.

And what it refuses: blur as a motion channel, springs, press-scale, elevation
shadows, glow, gradient meshes, more than one accent, a uniform radius, one type
family doing every job, WebGL.

## Development

```bash
npm install
npm run dev          # builds the registry first, then starts Next.js
npm run check        # lint + typecheck + build
```

| Script | Does |
| --- | --- |
| `registry:build` | regenerates `public/r/*.json` from `src/components/{ui,block}`, plus the theme item from `src/styles/keizoku.css` |
| `build` | registry → `next build` → Pagefind search index |
| `typecheck` | `next typegen && tsc --noEmit` |

### How a component becomes installable

Drop a `.tsx` file in `src/components/ui/` (primitives) or
`src/components/block/` (composed components) and rebuild the registry. The
generator walks its imports through the TypeScript AST, inlines every local file
it reaches, collects the npm packages it needs, rewrites `/public` asset paths to
absolute URLs, and writes one manifest per component. The file name becomes the
registry name, so it must be kebab-case.

A component and its documented source cannot drift apart — the docs page loads
the same manifest the CLI installs.

### Layout

```
src/
  app/            site and /docs route
  components/
    ui/           primitives — installable
    block/        composed components — installable
    docs/         documentation chrome, not shipped
    site/         this site's own chrome, not shipped
  content/        MDX docs; _meta.tsx sets sidebar order
  styles/         the token layer; the theme registry item is generated from it
scripts/          registry generator
skills/           the nine craft skills, with taste dials reset
docs/KEIZOKU.md   the thesis, and what it is measured against
```

## License

[MIT](LICENSE)
