import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";

type PageProps = {
  searchParams?: Promise<{ topic?: string }>;
};

const testerDefaults = {
  "android-testing": {
    subject: "RID2Caltopo Android tester request",
    message:
      "I'd like to help test RID2Caltopo on Android.\n\nOrganization:\nDevice model:\nHow we use drones:\n",
  },
  "apple-testing": {
    subject: "RID2Caltopo Apple tester request",
    message:
      "I'd like to help test RID2Caltopo on Apple.\n\nOrganization:\nDevice model:\nHow we use drones:\n",
  },
} as const;

export const metadata: Metadata = {
  title: "Contact RID2Caltopo",
  description: "Send a message to the RID2Caltopo project team.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const defaults =
    params.topic && params.topic in testerDefaults
      ? testerDefaults[params.topic as keyof typeof testerDefaults]
      : undefined;

  return (
    <main className="request-shell">
      <div className="request-layout">
        <section className="request-intro">
          <Link className="request-back-link" href="/">
            ← Back to RID2Caltopo
          </Link>
          <p className="eyebrow">Contact the project</p>
          <h1>Send us a message.</h1>
          <p>
            Ask a question, request test access, or tell us what happened in
            the field. Your reply will come to the email address you provide.
          </p>
        </section>
        <ContactForm
          defaultSubject={defaults?.subject}
          defaultMessage={defaults?.message}
        />
      </div>
    </main>
  );
}
