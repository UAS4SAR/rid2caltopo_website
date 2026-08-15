import type { Metadata } from "next";
import Link from "next/link";
import { EmailContact } from "../components/EmailContact";

const contactEmail = "kjtsar@kjt.us";

export const metadata: Metadata = {
  title: "r2c-tracker service",
  description:
    "Understand r2c-tracker incident coordination and compare self-hosted software with the managed pilot.",
  alternates: { canonical: "/tracker" },
};

export default function TrackerPage() {
  return (
    <main className="info-shell tracker-info-shell">
      <header className="info-header">
        <Link className="brand" href="/" aria-label="RID2Caltopo home">
          <span>RID<span className="brand-two">2</span>CalTopo</span>
        </Link>
        <nav aria-label="Information pages">
          <Link href="/capabilities">Capabilities</Link>
          <Link aria-current="page" href="/tracker">r2c-tracker</Link>
          <Link href="/tips">Tips &amp; tricks</Link>
          <Link href="/#tutorials">Tutorials</Link>
        </nav>
      </header>

      <section className="info-hero tracker-info-hero">
        <p className="eyebrow">The coordination service</p>
        <h1>One incident.<br /><em>Multiple field teams.</em></h1>
        <p>
          r2c-tracker is the online coordination layer behind RID2Caltopo. It
          lets authorized members of an organization bring multiple tablets,
          Bridges, drone observations, records, and Incident Command
          workflows together without replacing the app&apos;s local field tools.
        </p>
      </section>

      <section className="info-section tracker-mechanics">
        <div className="section-heading">
          <p className="eyebrow">What the service does</p>
          <h2>Coordinates the incident, then stays out of the field workflow.</h2>
        </div>
        <div className="mechanics-grid">
          <article><span>01</span><h3>Connects field devices</h3><p>Multiple RID2Caltopo tablets and DroneScout Bridges can participate in the same incident while the service manages ownership and duplicate observations.</p></article>
          <article><span>02</span><h3>Preserves shared records</h3><p>Organization-wide flight histories, timestamps, tracks, and exports support operational review and BVLOS record keeping.</p></article>
          <article><span>03</span><h3>Controls IC video access</h3><p>Authorized IC personnel may request a live stream. The pilot approves it on the field tablet before video begins; administrators cannot bypass that consent.</p></article>
        </div>
      </section>

      <section className="info-section pricing-section">
        <div className="section-heading centered">
          <p className="eyebrow">Two ways to run it</p>
          <h2>Use the open source, or let us operate it.</h2>
        </div>
        <div className="pricing-grid">
          <article>
            <span className="choice-label">ROLL YOUR OWN</span>
            <p className="tracker-price">$0 <small>software</small></p>
            <h3>Self-host r2c-tracker.</h3>
            <p>Deploy the open-source service in your own cloud account and retain responsibility for hosting, updates, access control, backups, and administration.</p>
            <a className="button button-card" href="https://github.com/kjtsar/r2c-tracker">Open the source repository <span aria-hidden="true">↗</span></a>
          </article>
          <article className="featured-price">
            <span className="choice-label">MANAGED PILOT</span>
            <p className="tracker-price">$10 monthly allowance <small>resets each calendar month during beta</small></p>
            <h3>Managed for your team.</h3>
            <p>We host and administer the tracker for volunteer organizations, provide onboarding, and fund a monthly usage allowance during the open-ended beta.</p>
            <a className="button button-primary" href="/managed-pilot">Request the managed pilot <span aria-hidden="true">→</span></a>
            <p className="fine-print">The beta has no fixed end date, and R2C Tracker does not accept payments during the beta. Each organization receives a platform-funded $10 usage allowance every calendar month. The allowance resets at the start of the next calendar month. To protect the allowance, remote video streaming pauses at $9 through month end while flight logs and R2C coordination continue.</p>
          </article>
        </div>
        <p className="pricing-note">
          Cloud video storage, playback, and other bandwidth- or storage-heavy
          services are not included in the managed pilot. If added, they would
          be a separate optional tier with clear costs.
        </p>
      </section>

      <footer className="info-footer">
        <a href="/capabilities">← Review all capabilities</a>
        <span className="info-contact">Questions? <EmailContact email={contactEmail} /></span>
      </footer>
    </main>
  );
}
