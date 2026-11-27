import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Tips & Tricks",
  description:
    "Quick RID2Caltopo field tips for track colors, bearing lines, and map/video picture-in-picture controls.",
  path: "/tips",
});

const tips = [
  {
    number: "01",
    id: "track-colors",
    title: "Change a drone’s track colors",
    path: "LIVE VIEW › MAP PANE › TAP DRONE MARKER",
    steps: [
      "Tap the drone marker on the map to open its details.",
      "Under Pilot Display, tap Active to change the current-flight track color, or Archive to change completed-flight tracks.",
      "Choose a color from the palette. The map updates immediately and remembers the selection.",
    ],
    note: "Display choices are saved for the pilot or owner shown in the panel. Drones assigned to that same pilot use the same track colors.",
  },
  {
    number: "02",
    id: "bearing-line",
    title: "Show or hide the bearing line",
    path: "LIVE VIEW › MAP PANE › TAP DRONE MARKER",
    steps: [
      "Tap the drone marker whose display you want to change.",
      "Find Bearing under Pilot Display.",
      "Enable Bearing to extend a heading line from the drone toward the edge of the visible map. Disable it to hide the line.",
    ],
    note: "Like track color, the bearing preference follows the displayed pilot or owner.",
  },
  {
    number: "03",
    id: "swap-pip",
    title: "Swap the map and stream in PiP",
    path: "LIVE VIEW › PiP:OFF",
    steps: [
      "Tap PiP:Off so the control reads PiP:On.",
      "The secondary view appears as an inset over the main view.",
      "Tap anywhere inside the inset to swap it with the main view. Tap it again to swap back.",
    ],
    note: "The inset can show the map or the stream. Split remains available when you prefer both panes side by side.",
  },
  {
    number: "04",
    id: "resize-pip",
    title: "Resize the PiP window",
    path: "LIVE VIEW › PiP:ON › LONG-PRESS INSET",
    steps: [
      "Long-press the PiP inset to enter resize mode.",
      "Use the resize handle in the inset’s upper-left corner and drag diagonally until the window is the size you want.",
      "Long-press the inset again to leave resize mode. RID2Caltopo remembers the new size.",
    ],
    note: "A normal tap swaps the views; a long-press enters or leaves resize mode.",
  },
];

export default function TipsPage() {
  return (
    <main id="main" tabIndex={-1} className="info-shell tips-shell">
      <section className="info-hero tips-hero">
        <p className="eyebrow">Tips &amp; tricks</p>
        <h1>Small controls.<br /><em>Faster field work.</em></h1>
        <p>
          Quick, field-ready instructions for RID2Caltopo controls that are
          useful every mission but easy to overlook. These steps apply to both
          Android and iOS.
        </p>
      </section>

      <nav className="tips-index" aria-label="Tips on this page">
        {tips.map((tip) => (
          <a key={tip.id} href={`#${tip.id}`}>
            <span>{tip.number}</span>{tip.title}
          </a>
        ))}
      </nav>

      <section className="info-section tips-section" aria-label="RID2Caltopo tips">
        <div className="tips-grid">
          {tips.map((tip) => (
            <article className="tip-card" id={tip.id} key={tip.id}>
              <div className="tip-card-heading">
                <span>{tip.number}</span>
                <p>{tip.path}</p>
              </div>
              <h2>{tip.title}</h2>
              <ol>
                {tip.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="tip-note"><strong>FIELD NOTE</strong>{tip.note}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="info-footer">
        <Link href="/">← Back to RID2Caltopo</Link>
        <span>Android and iOS • Same operator workflow</span>
      </footer>
    </main>
  );
}
