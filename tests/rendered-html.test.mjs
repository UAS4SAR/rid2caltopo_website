import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(host = "rid2caltopo.org", path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${host}${path}`, {
      headers: {
        accept: "text/html",
        host,
        "x-forwarded-host": host,
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function assertEveryVisibleCalTopoMentionOpensDisclosure(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";
  const visibleMarkup = body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<dialog[\s\S]*?<\/dialog>/g, "")
    .replace(/<a[^>]+class="brand"[\s\S]*?<\/a>/g, "")
    .replace(/\saria-label="[^"]*"/g, "");
  const withoutProductName = visibleMarkup.replace(/RID2CalTopo|RID2Caltopo/g, "");
  const mentions = withoutProductName.match(/CalTopo(?: Teams)?/g) ?? [];
  const disclosureLinks = withoutProductName.match(
    /<button[^>]+class="caltopo-disclosure-link"[^>]+aria-haspopup="dialog"[^>]*>CalTopo(?: Teams)?<\/button>/g,
  ) ?? [];

  assert.ok(mentions.length > 0);
  assert.equal(mentions.length, disclosureLinks.length);
}

test("renders the RID2Caltopo landing page and app-icon metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /Track <em>drone assignments and search coverage<\/em> in real time\./,
  );
  assert.match(
    html,
    /RID2Caltopo — Track drone assignments and search coverage in real time/,
  );
  assert.match(
    html,
    /class="brand-mark" src="\/app-icon-orange\.png"/,
  );
  assert.match(html, /src="\/dronescout-ds100-anker-field\.jpg"/);
  assert.match(
    html,
    /href="https:\/\/gearfocus\.com\/products\/drone-detector-bluemark-ds100-dronescout-retail-bridge-faa-r-79np1"/,
  );
  assert.match(html, /DS100 details and purchase options/);
  assert.match(
    html,
    /class="caltopo-disclosure-link"[^>]+aria-haspopup="dialog"[^>]*>CalTopo Teams<\/button>/,
  );
  assertEveryVisibleCalTopoMentionOpensDisclosure(html);
  assert.match(html, /RID2Caltopo is not a CalTopo product\./);
  assert.match(html, /not affiliated with, sponsored by, or endorsed by CalTopo/);
  assert.match(html, /thankful to the CalTopo developers/);
  assert.match(html, /src="\/configure-team-drones-caltopo-teams\.mp4"/);
  assert.match(html, /Stream drone video to RID2Caltopo/);
  assert.match(html, /Administer an organization site/);
  assert.match(html, /organization-site-administration\.mp4/);
  assert.match(html, /src="\/stream-drone-video-to-rid2caltopo\.mp4"/);
  assert.match(html, /href="\/tips">Tips &amp; tricks<\/a>/);
  assert.doesNotMatch(html, /<strong>Community-supported\.<\/strong>/);
  assert.doesNotMatch(html, /href="\/donations"/);
  assert.doesNotMatch(html, /Support the project/);
  assert.doesNotMatch(html, /href="https:\/\/paypal\.me\/kjtgv"/);
  assert.doesNotMatch(html, /tax[- ]deductible/i);
  assert.match(html, /rel="icon" href="https:\/\/rid2caltopo\.org\/app-icon-orange\.png"/);
  assert.match(html, /rel="apple-touch-icon" href="https:\/\/rid2caltopo\.org\/app-icon-orange\.png"/);
  assert.match(html, /rel="canonical" href="https:\/\/rid2caltopo\.org\/"/);
  assert.match(html, /"@type":"WebSite","name":"RID2Caltopo"/);
  assert.match(html, /"@type":"SoftwareApplication","name":"RID2Caltopo"/);
  assert.match(html, /href="mailto:kjtsar@kjt\.us">kjtsar@kjt\.us<\/a>/);
  assert.match(html, />Copy address<\/button>/);
  assert.doesNotMatch(html, /kjtstar@kjt\.us/);
  assert.doesNotMatch(html, /\baircraft\b/i);
  assert.doesNotMatch(html, /Know where the drones have searched/i);
});

test("publishes host-specific robots and sitemap discovery", async () => {
  const [comRobots, orgSitemap, comSitemap] = await Promise.all([
    render("rid2caltopo.com", "/robots.txt"),
    render("rid2caltopo.org", "/sitemap.xml"),
    render("rid2caltopo.com", "/sitemap.xml"),
  ]);

  assert.equal(comRobots.status, 200);
  assert.match(comRobots.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(
    await comRobots.text(),
    /Sitemap: https:\/\/rid2caltopo\.com\/sitemap\.xml/,
  );

  assert.equal(orgSitemap.status, 200);
  assert.match(
    orgSitemap.headers.get("content-type") ?? "",
    /^application\/xml\b/i,
  );
  const orgXml = await orgSitemap.text();
  assert.match(orgXml, /<loc>https:\/\/rid2caltopo\.org\/<\/loc>/);
  assert.match(orgXml, /<loc>https:\/\/rid2caltopo\.org\/tips<\/loc>/);
  assert.doesNotMatch(orgXml, /\/donations<\/loc>/);
  assert.doesNotMatch(orgXml, /rid2caltopo\.com/);

  assert.equal(comSitemap.status, 200);
  const comXml = await comSitemap.text();
  assert.match(comXml, /<loc>https:\/\/rid2caltopo\.com\/tracker<\/loc>/);
  assert.match(comXml, /<loc>https:\/\/rid2caltopo\.com\/tips<\/loc>/);
  assert.doesNotMatch(comXml, /\/donations<\/loc>/);
  assert.doesNotMatch(comXml, /rid2caltopo\.org/);
});

test("explains project history while personal contributions are paused", async () => {
  const response = await render("rid2caltopo.com", "/donations");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /began a little over a year ago as a Python script/);
  assert.match(html, /converted drone tracks to GeoJSON for import into/);
  assertEveryVisibleCalTopoMentionOpensDisclosure(html);
  assert.match(html, /many hundreds of hours/);
  assert.match(html, /hundreds of dollars on AI tokens/);
  assert.match(html, /Personal contributions are paused\./);
  assert.match(html, /not currently accepting personal donations/);
  assert.match(html, /No payment is required to request managed-pilot access/);
  assert.match(html, /No personal payment link is active\./);
  assert.doesNotMatch(html, /href="https:\/\/paypal\.me\/kjtgv"/);
});

test("publishes field tips for the shared Android and iOS workflow", async () => {
  const response = await render("rid2caltopo.com", "/tips");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Change a drone’s track colors/);
  assert.match(html, /Show or hide the bearing line/);
  assert.match(html, /Swap the map and stream in PiP/);
  assert.match(html, /Resize the PiP window/);
  assert.match(html, /Pilot Display/);
  assert.match(html, /Long-press the PiP inset/);
  assert.match(html, /These steps apply to both Android and iOS\./);
});

test("collects managed-pilot phone contact information for tracker administration", async () => {
  const response = await render("rid2caltopo.org", "/managed-pilot");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<input[^>]*name="phone"[^>]*>/);
  assert.match(html, /type="tel"/);
  assert.match(html, /Phone number/);
  assert.match(html, /retained in the managed-pilot administration system/);
  assert.match(html, /name="termsAcknowledged"/);
  assert.match(html, /name="termsVersion" value="2026-08-08"/);
  assert.match(html, /placeholder="For example, mySAR"/);
  assert.doesNotMatch(html, /NCSSAR|Nevada County Sheriff/i);
  assert.match(html, /best-effort/);
  assert.match(html, /as is/);
  assert.match(html, /as available/);
  assert.match(html, /no express or implied warranties or guarantees/);
  assert.match(html, /suitability, reliability/);
  assert.match(html, /availability, accuracy, or completeness/);
  assert.match(html, /supplemental situational awareness/);
  assert.match(html, /must not be used as the sole source/);
  assert.match(html, /independently verifying safety-critical information/);
  assert.match(html, /independent project/);
  assert.match(html, /not affiliated with, sponsored by, or endorsed by CalTopo/);
  assert.match(html, /through the CalTopo Teams/);
  assert.match(html, /thankful to the CalTopo developers/);
  assertEveryVisibleCalTopoMentionOpensDisclosure(html);

  const workerSource = await readFile(
    new URL("../worker/index.ts", import.meta.url),
    "utf8",
  );
  assert.match(workerSource, /https:\/\/r2c-tracker\.com\/managed-access-requests/);
  assert.match(workerSource, /MANAGED_REQUEST_INGEST_KEY/);
  assert.match(workerSource, /requester_phone: phone/);
  assert.match(workerSource, /terms_acknowledged: "yes"/);
  assert.match(workerSource, /terms_version: termsVersion/);
  assert.match(workerSource, /termsVersion !== managedAccessTermsVersion/);
  assert.match(workerSource, /managedAccessTermsVersion = "2026-08-08"/);
  assert.match(workerSource, /Best-effort safety terms acknowledged/);
});

test("opens the relationship disclosure for every visible CalTopo mention on the capabilities page", async () => {
  const response = await render("rid2caltopo.com", "/capabilities");
  assert.equal(response.status, 200);
  assertEveryVisibleCalTopoMentionOpensDisclosure(await response.text());
});

test("uses the disclosure control for CalTopo references on every public page", async () => {
  const paths = [
    "/",
    "/capabilities",
    "/donations",
    "/early-access",
    "/managed-pilot",
    "/request-error",
    "/request-received",
    "/tips",
    "/tracker",
  ];

  for (const path of paths) {
    const response = await render("rid2caltopo.com", path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assertEveryVisibleCalTopoMentionOpensDisclosure(html);
    assert.match(html, /RID2Caltopo is not a CalTopo product\./, path);
  }
});

test("keeps public copy drone-specific and ships correctly sized artwork", async () => {
  const appRoot = new URL("../app/", import.meta.url);
  const appFiles = await readdir(appRoot, { recursive: true });
  const copyFiles = appFiles.filter((path) => path.endsWith(".tsx"));
  const publicCopy = (
    await Promise.all(
      copyFiles.map((path) => readFile(new URL(path, appRoot), "utf8")),
    )
  ).join("\n");

  assert.doesNotMatch(publicCopy, /\baircraft\b/i);
  assert.doesNotMatch(publicCopy, /Know where the drones have searched/i);
  assert.doesNotMatch(publicCopy, /\$100|100\/year/i);
  assert.doesNotMatch(publicCopy, /\$TBD|after pilot usage review/);
  assert.doesNotMatch(publicCopy, /\btrial\b|30[ -]?day/i);
  assert.doesNotMatch(publicCopy, /\$10|\$9|monthly allowance/i);
  assert.match(publicCopy, /open-ended beta/);
  assert.match(publicCopy, /generous usage allowance during beta testing/);
  assert.match(publicCopy, /platform-funded during beta testing/);
  assert.match(publicCopy, /Site administrators can monitor/);
  assert.match(publicCopy, /who receives the video requester role/);
  assert.match(publicCopy, /does not accept payments/);
  assert.match(publicCopy, /Lots of capabilities included\./);
  assert.match(publicCopy, /title: "Flight record support"/);
  assert.match(publicCopy, /support FAA waiver compliance\./);
  assert.doesNotMatch(publicCopy, /planned-extension|MANAGED PILOT • AVAILABLE/);
  assert.match(publicCopy, /mailto:\$\{contactEmail\}/);
  assert.match(publicCopy, /const contactEmail = "kjtsar@kjt\.us"/);
  assert.doesNotMatch(publicCopy, /kjtstar@kjt\.us|Founding pilot|Android support is in progress|Built honestly/i);
  assert.doesNotMatch(
    publicCopy,
    /Real-time tracking of Drone search assignments and what has been searched/i,
  );

  const [icon, socialCard] = await Promise.all([
    readFile(new URL("../public/app-icon-orange.png", import.meta.url)),
    readFile(new URL("../public/og-assignment-coverage.png", import.meta.url)),
  ]);
  assert.equal(icon.readUInt32BE(16), 1024);
  assert.equal(icon.readUInt32BE(20), 1024);
  assert.equal(socialCard.readUInt32BE(16), 1792);
  assert.equal(socialCard.readUInt32BE(20), 907);
});
