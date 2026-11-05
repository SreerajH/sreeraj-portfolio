import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Sreeraj H: Designed. Built. Shipped.";

const ACCENT = "#C8FF00";
const INK = "#EDEDED";
const BG = "#0A0A0A";

/** Anton, the site's display face, fetched as TTF for the image renderer. */
async function loadAnton(text: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Anton&text=${encodeURIComponent(text)}`,
    )
  ).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error("Anton not found");
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error("Anton download failed");
  return res.arrayBuffer();
}

/** The shared preview card: black, lime accent, condensed display type. */
export async function renderOgImage() {
  const lines = ["Designed.", "Built.", "Shipped."];
  const text = "SREERAJ H" + lines.join("").toUpperCase() + "UI/UX DESIGNER & DEVELOPER · BENGALURU";

  let fonts: { name: string; data: ArrayBuffer; weight: 400; style: "normal" }[] = [];
  try {
    fonts = [{ name: "Anton", data: await loadAnton(text), weight: 400, style: "normal" }];
  } catch {
    // Offline build: fall back to the renderer's default face.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: INK,
          padding: "64px 80px",
          fontFamily: "Anton",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: ACCENT }} />
          <div style={{ fontSize: 44, color: ACCENT, letterSpacing: 1 }}>Sreeraj H</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.98 }}>
          {lines.map((line, i) => (
            <div key={line} style={{ display: "flex", fontSize: 128 }}>
              {i === lines.length - 1 ? (
                <span
                  style={{
                    background: ACCENT,
                    color: BG,
                    padding: "0 18px",
                    borderRadius: 10,
                  }}
                >
                  {line}
                </span>
              ) : (
                line
              )}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 30, color: "#A3A3A3", letterSpacing: 2 }}>
          UI/UX Designer &amp; Developer · Bengaluru
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
