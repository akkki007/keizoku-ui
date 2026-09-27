import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Drawn rather than photographed: the card is the library's own thesis at
   poster scale — a ruled grid, one vermilion mark, mono for the meta line.
   Text stays Latin-only because ImageResponse falls back to a bundled font
   that carries no CJK, so the 継続 wordmark would render as tofu. */
export default function OpengraphImage() {
  const rule = "rgba(251, 251, 250, 0.14)";
  const headline = {
    fontSize: 96,
    lineHeight: 1.06,
    letterSpacing: -4,
    fontWeight: 500,
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111110",
          color: "#fbfbfa",
          padding: 72,
          position: "relative",
        }}
      >
        {/* The grid, drawn. Four horizontals and three verticals on the same
            weight and colour — one grid, one weight, one colour. */}
        {[0, 1, 2, 3].map((index) => (
          <div
            key={`h${index}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 126 * (index + 1),
              height: 1,
              background: rule,
            }}
          />
        ))}
        {[0, 1, 2].map((index) => (
          <div
            key={`v${index}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 300 * (index + 1),
              width: 1,
              background: rule,
            }}
          />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 16, letterSpacing: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#e8562f" }} />
          <div style={{ fontSize: 22, color: "rgba(251,251,250,0.62)" }}>
            KEIZOKU UI · COMPONENT LIBRARY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Split by hand rather than left to wrap: Satori lays a flex row's
              text and its sibling span out as separate items, so an
              auto-wrapped headline strands the accent at the end of the first
              line instead of after the last word. */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={headline}>Components with</div>
            <div style={{ ...headline, display: "flex" }}>
              staying power
              <span style={{ color: "#e8562f" }}>.</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(251,251,250,0.66)",
              maxWidth: 820,
            }}
          >
            The layout system is the ornament: drawn, not implied.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            color: "rgba(251,251,250,0.5)",
          }}
        >
          <div>REACT · TAILWIND V4 · SHADCN REGISTRY</div>
          <div>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
