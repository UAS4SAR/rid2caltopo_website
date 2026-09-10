import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request could not be sent",
  robots: { index: false, follow: false },
};

export default function RequestErrorPage() {
  return (
    <main className="response-shell error-response-shell">
      <p className="eyebrow">Delivery problem</p>
      <h1>Your request wasn&apos;t sent.</h1>
      <p>
        Please return to the form and check the required fields, or use the{" "}
        <Link className="inline-link" href="/contact">contact form</Link>.
      </p>
      <a className="button button-secondary" href="/capabilities">Return to capabilities</a>
    </main>
  );
}
