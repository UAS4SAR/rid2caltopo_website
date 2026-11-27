import { execFileSync } from "node:child_process";
import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// Sitemap <lastmod>: the date of the last commit touching each route's source
// (plus shared components/styles for the homepage), falling back to the build
// date when git history is unavailable (for example a tarball checkout).
const sitemapSources: Record<string, string[]> = {
  "/": ["app/page.tsx", "app/components", "app/globals.css", "app/layout.tsx"],
  "/capabilities": ["app/capabilities/page.tsx"],
  "/contact": ["app/contact/page.tsx", "app/components/ContactForm.tsx"],
  "/tracker": ["app/tracker/page.tsx"],
  "/tips": ["app/tips/page.tsx"],
  "/managed-pilot": [
    "app/managed-pilot/page.tsx",
    "app/components/RequestForm.tsx",
    "app/managedAccessTerms.ts",
  ],
};

function sitemapLastmod(): Record<string, string> {
  const today = new Date().toISOString().slice(0, 10);
  const result: Record<string, string> = {};
  for (const [route, sources] of Object.entries(sitemapSources)) {
    try {
      const stamp = execFileSync(
        "git",
        ["log", "-1", "--format=%cs", "--", ...sources],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      ).trim();
      result[route] = /^\d{4}-\d{2}-\d{2}$/.test(stamp) ? stamp : today;
    } catch {
      result[route] = today;
    }
  }
  return result;
}

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  name: "rid2caltopo-site",
  main: "./worker/index.ts",
  compatibility_date: "2026-05-22",
  compatibility_flags: ["nodejs_compat"],
  workers_dev: false,
  routes: [
    { pattern: "rid2caltopo.org", custom_domain: true },
    { pattern: "rid2caltopo.com", custom_domain: true },
    { pattern: "www.rid2caltopo.com", custom_domain: true },
  ],
  observability: { enabled: true },
  send_email: [
    {
      name: "EMAIL",
      destination_address: "info@uas4sar.com",
      allowed_sender_addresses: ["requests@rid2caltopo.com"],
    },
  ],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    define: {
      __SITEMAP_LASTMOD__: JSON.stringify(sitemapLastmod()),
    },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
