import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="response-shell not-found-shell">
      <p className="eyebrow">Error 404</p>
      <h1>That page isn&apos;t here.</h1>
      <p>
        The link may be old or mistyped. Try one of these instead, or send us a
        message if something that should exist is missing.
      </p>
      <div className="response-actions">
        <Link className="button button-primary" href="/">
          Back to the homepage
        </Link>
        <Link className="button button-secondary" href="/#download">
          Download the app
        </Link>
        <Link className="button button-secondary" href="/contact">
          Contact us
        </Link>
      </div>
    </main>
  );
}
