import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact RID2Caltopo",
  description:
    "Send a message to the RID2Caltopo project team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="request-shell">
      <div className="request-layout">
        <section className="request-intro">
          <Link className="request-back-link" href="/">
            ← Back to RID2Caltopo
          </Link>
          <p className="eyebrow">Contact the project</p>
          <h1>Send us a message.</h1>
          <p>
            Ask a question or tell us what happened in the field. You can also email us directly at info@uas4sar.com.
          </p>
        </section>
        <ContactForm />
      </div>
    </main>
  );
}
