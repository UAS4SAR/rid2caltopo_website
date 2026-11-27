import type { Metadata } from "next";
import Link from "next/link";
import RequestForm from "../components/RequestForm";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Request the managed pilot",
  description:
    "Request access to the managed r2c-tracker pilot.",
  path: "/managed-pilot",
});

export default function ManagedPilotPage() {
  return (
    <main id="main" tabIndex={-1} className="request-shell managed-request-shell">
      <section className="request-layout">
        <div className="request-intro">
          <Link className="request-back-link" href="/tracker">← r2c-tracker</Link>
          <p className="eyebrow">Managed pilot • Platform-funded usage allowance</p>
          <h1>Bring managed coordination<br /><em>to your team.</em></h1>
          <p>
            Provide your organization&apos;s details and we&apos;ll follow up about
            onboarding, expected field use, and whether the managed pilot fits
            your needs. During the pilot, each organization receives a
            platform-funded usage allowance. Site administrators can
            monitor attributed usage and manage who may request streams. The
            pilot has no fixed end date, and R2C Tracker does not currently
            accept payments.
          </p>
        </div>
        <RequestForm kind="managed-pilot" />
      </section>
    </main>
  );
}
