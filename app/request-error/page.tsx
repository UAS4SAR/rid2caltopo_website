import type { Metadata } from "next";

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
        Please return to the form and check the required fields, or email{" "}
        <a className="inline-link" href="mailto:info@uas4sar.com">info@uas4sar.com</a>.
      </p>
      <a className="button button-secondary" href="/capabilities">Return to capabilities</a>
    </main>
  );
}
