import type { Metadata } from "next";
import Link from "next/link";
import { CalTopoLink } from "../components/CalTopoTeamsLink";

export const metadata: Metadata = {
  title: "Project support",
  description:
    "Learn how RID2Caltopo grew, the principles guiding its development, and the current project-support policy.",
  alternates: { canonical: "/donations" },
};

const directives = [
  {
    number: "01",
    title: "Serve the field mission",
    copy: "Build practical tools around the way SAR drone teams actually search, coordinate, document flights, and review imagery.",
  },
  {
    number: "02",
    title: "Keep the core accessible",
    copy: "Keep the RID2Caltopo field app free, preserve the self-hosted path, and make managed services transparent and usage-based.",
  },
  {
    number: "03",
    title: "Respect operational control",
    copy: "Protect organization data, require pilot approval before video leaves the field device, and never present software as a substitute for trained judgment.",
  },
  {
    number: "04",
    title: "Grow both platforms together",
    copy: "Treat Android and iOS as peer platforms and continue improving the capabilities and productivity of SAR drone teams.",
  },
];

export default function DonationsPage() {
  return (
    <main id="main" tabIndex={-1} className="info-shell donations-shell">
      <section className="info-hero donations-hero">
        <p className="eyebrow">Project support</p>
        <h1>Built for the search.<br /><em>Structured for the public good.</em></h1>
        <p>
          RID2Caltopo began a little over a year ago as a Python script that
          converted drone tracks to GeoJSON for import into <CalTopoLink />. Field needs
          kept pulling it forward, and it has grown into a small ecosystem
          supporting our SAR drone team&apos;s work.
        </p>
      </section>

      <section className="info-section donation-history">
        <div>
          <p className="eyebrow">How it grew</p>
          <h2>One utility became a field platform.</h2>
        </div>
        <div className="donation-story">
          <p>
            What started as track conversion now spans Android and iOS field
            apps, DroneScout Bridge reception, <CalTopoLink /> publishing, local and
            pilot-authorized video, incident coordination, flight records, and
            an expanding set of operational tools.
          </p>
          <p>
            I&apos;ve invested many hundreds of hours in the project. Starting late
            last year, I&apos;ve also spent hundreds of dollars on AI tokens and
            development tools to reach the current level of functionality. I
            plan to continue development aimed at making SAR drone teams more
            capable and productive.
          </p>
        </div>
      </section>

      <section className="info-section donation-directives">
        <div className="section-heading">
          <p className="eyebrow">Project directives</p>
          <h2>Useful, accessible, accountable.</h2>
        </div>
        <div className="directive-grid">
          {directives.map((directive) => (
            <article key={directive.number}>
              <span>{directive.number}</span>
              <h3>{directive.title}</h3>
              <p>{directive.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section donation-funding">
        <div className="funding-copy">
          <p className="eyebrow">Current policy</p>
          <h2>Personal contributions are paused.</h2>
          <p>
            RID2Caltopo is not currently accepting personal donations while a
            fiscal sponsorship and an appropriate long-term operating structure
            are evaluated.
          </p>
          <p>
            No payment is required to request managed-pilot access or to use the
            community field app. If a formal contribution path is approved,
            its administrator, terms, and tax status will be published here.
          </p>
        </div>
        <aside className="donation-action" aria-label="Project support status">
          <span>CONTRIBUTIONS PAUSED</span>
          <h3>No personal payment link is active.</h3>
          <p>
            Access, support, and operational decisions are not conditioned on a
            contribution. Questions about future organizational support may be
            sent through the project contact address.
          </p>
        </aside>
      </section>

      <footer className="info-footer">
        <Link href="/">← Back to RID2Caltopo</Link>
        <span>Public-safety software for SAR drone teams</span>
      </footer>
    </main>
  );
}
