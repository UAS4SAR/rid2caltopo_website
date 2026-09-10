"use client";

import { useState } from "react";

export function EmailContact({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
  }

  return (
    <span className="email-contact">
      <a href="/contact">{email}</a>
      <button type="button" onClick={copyAddress}>
        {copied ? "Copied" : "Copy address"}
      </button>
    </span>
  );
}
