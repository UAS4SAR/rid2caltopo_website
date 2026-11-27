/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  managedAccessTermsText,
  managedAccessTermsVersion,
} from "../app/managedAccessTerms";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  EMAIL: {
    send(message: {
      from: string;
      to: string;
      subject: string;
      text: string;
      replyTo?: string;
    }): Promise<unknown>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
  MANAGED_REQUEST_INGEST_KEY: string;
}

const notificationAddress = "info@uas4sar.com";
const indexablePaths = [
  "/",
  "/capabilities",
  "/contact",
  "/tracker",
  "/tips",
  "/managed-pilot",
];

// Injected at build time by vite.config.ts (route -> YYYY-MM-DD).
declare const __SITEMAP_LASTMOD__: Record<string, string> | undefined;

function lastmodFor(path: string): string | undefined {
  return typeof __SITEMAP_LASTMOD__ === "undefined"
    ? undefined
    : __SITEMAP_LASTMOD__[path];
}

/** rid2caltopo.com is the only canonical origin. */
const canonicalOrigin = "https://rid2caltopo.com";

/** Hosts served by this Worker that must 301 to the same path on the canonical origin. */
const redirectHosts = new Set([
  "www.rid2caltopo.com",
  "rid2caltopo.org",
  "www.rid2caltopo.org",
]);

function canonicalRedirect(url: URL): Response | null {
  if (!redirectHosts.has(url.hostname.toLowerCase())) return null;
  return Response.redirect(
    `${canonicalOrigin}${url.pathname}${url.search}`,
    301,
  );
}

function robotsResponse(): Response {
  const origin = canonicalOrigin;
  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /request-error",
      "Disallow: /request-received",
      "Disallow: /contact-error",
      "Disallow: /contact-received",
      "Disallow: /early-access",
      "Disallow: /_vinext/",
      `Sitemap: ${origin}/sitemap.xml`,
      "",
    ].join("\n"),
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}

function sitemapResponse(): Response {
  const origin = canonicalOrigin;
  const entries = indexablePaths
    .map((path) => {
      const lastmod = lastmodFor(path);
      return `  <url><loc>${origin}${path}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
      }</url>`;
    })
    .join("\n");
  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      entries,
      "</urlset>",
      "",
    ].join("\n"),
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}

function cleanField(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength)
    : "";
}

function cleanMessage(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").trim().slice(0, maxLength)
    : "";
}

function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleRequestForm(request: Request, env: Env): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) {
    return Response.redirect(new URL("/request-error", request.url), 303);
  }

  const form = await request.formData();
  const requestType = cleanField(form.get("requestType"), 32);
  const name = cleanField(form.get("name"), 100);
  const email = cleanField(form.get("email"), 254);
  const phone = cleanField(form.get("phone"), 64);
  const organization = cleanField(form.get("organization"), 120);
  const designator = cleanField(form.get("designator"), 24);
  const termsVersion = cleanField(form.get("termsVersion"), 32);
  const termsAcknowledged = cleanField(form.get("termsAcknowledged"), 8);
  const honeypot = cleanField(form.get("website"), 200);
  if (honeypot) {
    return Response.redirect(
      new URL(`/request-received?type=${encodeURIComponent(requestType)}`, request.url),
      303,
    );
  }

  if (
    !name ||
    !validEmail(email) ||
    requestType !== "managed-pilot" ||
    !organization ||
    !designator ||
    termsAcknowledged !== "yes" ||
    termsVersion !== managedAccessTermsVersion
  ) {
    return Response.redirect(new URL("/request-error", request.url), 303);
  }

  try {
    const intakeBody = new URLSearchParams({
      requester_name: name,
      requester_email: email,
      requester_phone: phone,
      organization_name: organization,
      designator,
      source_host: new URL(request.url).host,
      terms_acknowledged: "yes",
      terms_version: termsVersion,
      terms_text: managedAccessTermsText,
    });
    const intakeResponse = await fetch(
      "https://r2c-tracker.com/managed-access-requests",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.MANAGED_REQUEST_INGEST_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: intakeBody,
      },
    );
    if (!intakeResponse.ok) {
      throw new Error(`Managed request storage failed (${intakeResponse.status})`);
    }
  } catch (error) {
    console.error("Request delivery failed", error);
    return Response.redirect(new URL("/request-error", request.url), 303);
  }

  return Response.redirect(
    new URL(`/request-received?type=${encodeURIComponent(requestType)}`, request.url),
    303,
  );
}

async function handleContactForm(request: Request, env: Env): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) {
    return Response.redirect(new URL("/contact-error", request.url), 303);
  }

  const form = await request.formData();
  const name = cleanField(form.get("name"), 100);
  const email = cleanField(form.get("email"), 254);
  const subject = cleanField(form.get("subject"), 140);
  const message = cleanMessage(form.get("message"), 4000);
  const honeypot = cleanField(form.get("website"), 200);

  if (honeypot) {
    return Response.redirect(new URL("/contact-received", request.url), 303);
  }

  if (!name || !validEmail(email) || !subject || !message) {
    return Response.redirect(new URL("/contact-error", request.url), 303);
  }

  const body = [
    "RID2Caltopo website message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    message,
    "",
    `Submitted: ${new Date().toISOString()}`,
    `Site: ${new URL(request.url).host}`,
  ].join("\n");

  try {
    await env.EMAIL.send({
      from: "requests@rid2caltopo.com",
      to: notificationAddress,
      replyTo: email,
      subject: `Website message: ${subject}`,
      text: body,
    });
  } catch (error) {
    console.error("Contact delivery failed", error);
    return Response.redirect(new URL("/contact-error", request.url), 303);
  }

  return Response.redirect(new URL("/contact-received", request.url), 303);
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const redirect = canonicalRedirect(url);
    if (redirect) return redirect;

    if (url.pathname === "/robots.txt") {
      return robotsResponse();
    }

    if (url.pathname === "/sitemap.xml") {
      return sitemapResponse();
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/request") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      }
      return handleRequestForm(request, env);
    }

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      }
      return handleContactForm(request, env);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
