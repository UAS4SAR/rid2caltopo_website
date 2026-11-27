import type { Metadata } from "next";

type PageProps = {
  searchParams?: Promise<{ type?: string }>;
};

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
};

export default async function RequestReceivedPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const managed = params.type === "managed-pilot";

  return (
    <main id="main" tabIndex={-1} className="response-shell">
      <p className="eyebrow">Request received</p>
      <h1>Thank you.</h1>
      <p>
        {managed
          ? "Your managed-pilot request has been sent. A copy of the request and exact acknowledgment was sent to the email address you provided."
          : "Your request has been sent. We’ll reply to the email address you provided."}
      </p>
      <a className="button button-primary" href={managed ? "/tracker" : "/capabilities"}>
        Return to {managed ? "r2c-tracker" : "capabilities"}
      </a>
    </main>
  );
}
