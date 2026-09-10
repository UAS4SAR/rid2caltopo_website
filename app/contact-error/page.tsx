import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Message could not be sent",
  robots: { index: false, follow: false },
};

export default function ContactErrorPage() {
  return (
    <main className="response-shell error-response-shell">
      <p className="eyebrow">Delivery problem</p>
      <h1>Your message wasn&apos;t sent.</h1>
      <p>
        Please return to the contact form, check each required field, and try
        again.
      </p>
      <Link className="button button-secondary" href="/contact">
        Return to the contact form
      </Link>
    </main>
  );
}
