import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Message received",
  robots: { index: false, follow: false },
};

export default function ContactReceivedPage() {
  return (
    <main className="response-shell">
      <p className="eyebrow">Message received</p>
      <h1>Thank you.</h1>
      <p>
        Your message has been sent to the RID2Caltopo project team. We’ll reply
        to the email address you provided.
      </p>
      <Link className="button button-primary" href="/">
        Return to RID2Caltopo
      </Link>
    </main>
  );
}
