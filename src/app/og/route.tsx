import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { site } from "@/lib/site";

/* Docs cards cannot live beside the page that needs them: an optional
   catch-all has to be the last segment of its route, so `opengraph-image`
   cannot nest under `[[...mdxPath]]`. A parameterised route gives each page
   its own card anyway — a single shared image would make every page look
   identical in a link preview. */

/** Crawler-facing and query-driven, so the text is clamped and stripped of
 *  anything that could lay out as more than one line. Without this the route
 *  would render arbitrary attacker-supplied text on our own domain. */
function clean(value: string | null, max: number, fallback: string): string {
  if (!value) return fallback;
  const text = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = clean(params.get("title"), 60, "Documentation");
  const description = clean(params.get("description"), 140, site.description);
  const eyebrow = clean(params.get("eyebrow"), 40, "DOCUMENTATION").toUpperCase();

  const rule = "rgba(251, 251, 250, 0.14)";

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
        {/* One grid, one weight, one colour — the thesis at poster scale. */}
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
            {`KEIZOKU UI · ${eyebrow}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1.06,
              letterSpacing: -3,
              fontWeight: 500,
            }}
          >
            {title}
            <span style={{ color: "#e8562f" }}>.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(251,251,250,0.66)",
              maxWidth: 900,
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ fontSize: 22, letterSpacing: 2, color: "rgba(251,251,250,0.5)" }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Cards change only when a page's title does, and the query string is
        // part of the cache key.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
