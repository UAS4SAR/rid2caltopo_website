import type { Metadata } from "next";
import Link from "next/link";
import { CalTopoLink, CalTopoText } from "../components/CalTopoTeamsLink";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Capabilities",
  description:
    "Compare RID2Caltopo field capabilities with self-hosted and managed r2c-tracker coordination.",
  path: "/capabilities",
});

const fieldCapabilities = [
  "Reliable ASTM F3411 Remote ID reception through a DroneScout Bridge",
  "Android or iOS devices",
  "Direct track publishing to CalTopo maps you can edit",
  "Local controller-video streaming for squinter review",
  "Potential-clue capture and on-device anomaly assistance",
];

const trackerCapabilities = [
  "FAA, airspace, and protected-land awareness with visible status",
  "Multiple RID2Caltopo tablets and DroneScout Bridges in one incident",
  "Drone ownership, sighting relay, and duplicate-track suppression",
  "Organization-wide flight histories and exports for BVLOS record support",
  "Pilot-authorized live video requests from Incident Command",
];

export default function CapabilitiesPage() {
  return (
    <main id="main" tabIndex={-1} className="info-shell">
      <section className="info-hero">
        <p className="eyebrow">What&apos;s available</p>
        <h1>Field awareness first.<br /><em>Coordination when you need it.</em></h1>
        <p>
          RID2Caltopo has a clear boundary: the app and DroneScout Bridge do the
          field work, while r2c-tracker adds incident-wide coordination and
          managed online services.
        </p>
      </section>

      <section className="info-section capability-overview">
        <article className="info-card field-card">
          <div className="info-card-top">
            <span className="cap-kicker">IN THE FIELD</span>
            <span className="info-tag">APP + BRIDGE</span>
          </div>
          <h2>Receive, record, and publish.</h2>
          <p>
            A DroneScout Bridge is required for reliable Remote ID
            reception. The RID2Caltopo app records what it receives and can
            publish to <CalTopoLink /> maps you can edit.
          </p>
          <ul className="info-list">
            {fieldCapabilities.map((capability) => (
              <li key={capability}><CalTopoText text={capability} /></li>
            ))}
          </ul>
          <Link className="button button-secondary" href="/#download">
            Download the app <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="info-card tracker-overview-card">
          <div className="info-card-top">
            <span className="cap-kicker">ACROSS AN INCIDENT</span>
            <span className="info-tag">R2C-TRACKER</span>
          </div>
          <h2>Coordinate devices and organizations.</h2>
          <p>
            The <Link className="inline-link" href="/tracker">r2c-tracker service</Link>{" "}
            connects multiple field devices, preserves organization-wide
            records, and supports authenticated Incident Command workflows.
          </p>
          <ul className="info-list">
            {trackerCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
          <Link className="button button-primary" href="/tracker">
            Compare tracker options <span aria-hidden="true">→</span>
          </Link>
        </article>
      </section>

      <footer className="info-footer">
        <Link href="/">← Back to RID2Caltopo</Link>
        <span>Operational aid—not a sole source for aviation or safety decisions.</span>
      </footer>
    </main>
  );
}
