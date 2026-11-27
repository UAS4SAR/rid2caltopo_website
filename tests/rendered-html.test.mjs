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
    /class="brand-mark" src="\/icon-64\.png"/,
  );
  assert.match(html, /src="\/dronescout-ds100-anker-field\.jpg"/);
  assert.match(html, /aria-haspopup="dialog" aria-controls="receiver-options"/);
  assert.match(html, /Compare receivers and purchase options/);
  assert.match(html, /<dialog[^>]*id="receiver-options"[^>]*aria-labelledby="receiver-options-title"/);
  assert.match(html, /href="https:\/\/dronescout\.co\/product\/dronescout-bridge-ds100-retail\/"/);
  assert.match(html, /href="https:\/\/dronescout\.co\/product\/dronescout-bridge-triple-band-ds110-retail-remoteid-receiver-for-ios-android-and-drone\/"/);
  assert.match(html, /Skydio X10/);
  assert.match(html, /Wi-Fi NAN alone does not require DS110/);
  assert.match(html, /DS100 supports NAN at 2.4 GHz with updated firmware/);
  assert.doesNotMatch(html, /gearfocus\.com/);
  assert.match(
    html,
    /class="caltopo-disclosure-link"[^>]+aria-haspopup="dialog"[^>]*>CalTopo<\/button>/,
  );
  assertEveryVisibleCalTopoMentionOpensDisclosure(html);
  assert.match(html, /RID2Caltopo is not a CalTopo product\./);
  assert.match(html, /not affiliated with, sponsored by, or endorsed by CalTopo/);
  assert.match(html, /thankful to the CalTopo developers/);
  assert.match(html, /configure-team-drones-caltopo-teams\.mp4/);
  assert.doesNotMatch(html, /prepare-mutual-aid-package\.mp4/);
  assert.match(html, /Connect your [\s\S]*?CalTopo[\s\S]*? account/);
  assert.match(html, /src="\/connect-personal-caltopo-account\.mp4"/);
  assert.match(html, /kind="captions"[^>]*src="\/connect-personal-caltopo-account\.vtt"/);
  assert.match(html, /Read the tutorial/);
  assert.match(html, /check the confirmation box and tap Sync Account/);
  assert.match(html, /Download and share maps before the mission/);
  assert.match(html, /src="\/download-share-offline-maps\.mp4"/);
  assert.match(html, /kind="captions"[^>]*src="\/download-share-offline-maps\.vtt"/);
  assert.match(html, /packages include available cached USGS and USFS basemaps/);
  assert.match(html, /Map Management &gt; Export Map Package/);
  assert.doesNotMatch(html, /cost-sharing/i);
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
  assert.match(html, /rel="icon" href="https:\/\/rid2caltopo\.org\/favicon\.ico"/);
  assert.match(html, /rel="icon" href="https:\/\/rid2caltopo\.org\/icon-32\.png"[^>]*sizes="32x32"/);
  assert.match(html, /rel="apple-touch-icon" href="https:\/\/rid2caltopo\.org\/apple-touch-icon\.png"[^>]*sizes="180x180"/);
  assert.match(html, /rel="canonical" href="https:\/\/rid2caltopo\.org\/"/);
  assert.match(html, /"@type":"WebSite","name":"RID2Caltopo"/);
  assert.match(html, /"@type":"SoftwareApplication","name":"RID2Caltopo"/);
  assert.match(
    html,
    /UAS4SAR LLC\. RID2Caltopo is developed and operated by UAS4SAR LLC\./,
  );
  assert.match(html, /href="\/contact">Contact form<\/a>/);
  assert.match(html, /or email (?:<!-- -->)?info@uas4sar\.com/);
  assert.match(html, />Copy address<\/button>/);
  assert.match(
    html,
    /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=org\.ncssar\.rid2caltopo"[^>]*target="_blank"/,
  );
  assert.match(html, /Get RID2Caltopo on Google Play/);
  assert.doesNotMatch(html, /Request Android test access/);
  assert.match(html, /href="\/contact\?topic=apple-testing"/);
  assert.match(
    html,
    /href="https:\/\/testflight\.apple\.com\/join\/QhyVpGDh"[^>]*target="_blank"/,
  );
  assert.match(html, /href="https:\/\/apps\.apple\.com\/us\/app\/rid2caltopo\/id6792518823"/);
  assert.match(html, /src="\/qr-app-store\.svg"/);
  assert.match(html, /src="\/qr-google-play\.svg"/);
  assert.doesNotMatch(html, /Apple test invitations are provided by email/);
  assert.doesNotMatch(html, /Request Apple test access/);
  assert.doesNotMatch(html, /mailto:/);
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

test("uses the organization public mailbox across every web contact surface", async () => {
  const sources = await Promise.all(
    [
      "../app/page.tsx",
      "../app/tracker/page.tsx",
      "../app/request-error/page.tsx",
      "../worker/index.ts",
      "../vite.config.ts",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const publicWebSource = sources.join("\n");

  assert.doesNotMatch(publicWebSource, /kjtsar@kjt\.us|kjt@uas4sar\.com/i);
  assert.match(publicWebSource, /info@uas4sar\.com/);
  assert.doesNotMatch(publicWebSource, /mailto:/);
});

test("renders a prefilled contact form for tester requests", async () => {
  const response = await render(
    "rid2caltopo.com",
    "/contact?topic=android-testing",
  );
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /action="\/api\/contact" method="post"/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="subject"/);
  assert.match(html, /RID2Caltopo Android tester request/);
  assert.match(html, /name="message"/);
  assert.match(html, /I&#x27;d like to help test RID2Caltopo on Android/);
  assert.match(html, /Send message/);
  assert.match(html, /email us directly at info@uas4sar\.com/);
});

test("sends contact forms through the website email binding", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const sent = [];
  const form = new FormData();
  form.set("name", "Taylor Tester");
  form.set("email", "taylor@example.org");
  form.set("subject", "Android field test");
  form.set("message", "Please add our team to the next field test.");

  const response = await worker.fetch(
    new Request("https://rid2caltopo.com/api/contact", {
      method: "POST",
      body: form,
    }),
    {
      EMAIL: {
        async send(message) {
          sent.push(message);
        },
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 303);
  assert.equal(
    response.headers.get("location"),
    "https://rid2caltopo.com/contact-received",
  );
  assert.equal(sent.length, 1);
  assert.equal(sent[0].from, "requests@rid2caltopo.com");
  assert.equal(sent[0].to, "info@uas4sar.com");
  assert.equal(sent[0].replyTo, "taylor@example.org");
  assert.match(sent[0].subject, /Android field test/);
  assert.match(sent[0].text, /Please add our team to the next field test\./);
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
  assert.match(html, /copied to the requester/);
  assert.match(html, /retained in the managed-pilot administration system/);
  assert.match(html, /All fields are required unless marked optional/);
  assert.match(html, /Required acknowledgment/);
  assert.match(html, /<input(?=[^>]*name="termsAcknowledged")(?=[^>]*required)[^>]*>/);
  assert.match(html, /name="termsVersion" value="2026-08-31"/);
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
  assert.match(html, /accept full responsibility/);
  assert.match(html, /release, waive, discharge, indemnify, defend, and hold harmless/);
  assert.match(html, /UAS4SAR LLC/);
  assert.match(html, /California Civil Code section 1542/);
  assert.match(html, /expressly waive all rights and benefits under section 1542/);
  assert.match(html, /unknown or unsuspected/);
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
  assert.match(workerSource, /terms_text: managedAccessTermsText/);
  assert.match(workerSource, /termsVersion !== managedAccessTermsVersion/);
  assert.match(workerSource, /managedAccessTermsText/);

  const termsSource = await readFile(
    new URL("../app/managedAccessTerms.ts", import.meta.url),
    "utf8",
  );
  assert.match(termsSource, /managedAccessTermsVersion = "2026-08-31"/);
  assert.match(termsSource, /California Civil Code section 1542/);
  assert.match(termsSource, /hold harmless UAS4SAR LLC/);
});

test("sends new visitors and old early-access links to the download section", async () => {
  const capabilities = await render("rid2caltopo.com", "/capabilities");
  assert.match(await capabilities.text(), /href="\/#testing"[^>]*>Download the app/);
  const home = await render("rid2caltopo.com");
  assert.match(await home.text(), /<section[^>]*id="testing"/);
  const oldLink = await render("rid2caltopo.com", "/early-access");
  assert.ok([301, 302, 303, 307, 308].includes(oldLink.status));
  assert.equal(new URL(oldLink.headers.get("location"), "https://rid2caltopo.com").href,
    "https://rid2caltopo.com/#testing");
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
    "/contact",
    "/contact-error",
    "/contact-received",
    "/donations",
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
  assert.doesNotMatch(publicCopy, /mailto:/);
  assert.match(publicCopy, /\/contact\?topic=\$\{platform\.toLowerCase\(\)\}-testing/);
  assert.match(publicCopy, /const contactEmail = "info@uas4sar\.com"/);
  assert.doesNotMatch(publicCopy, /kjtstar@kjt\.us|Founding pilot|Android support is in progress|Built honestly/i);
  assert.doesNotMatch(
    publicCopy,
    /Real-time tracking of Drone search assignments and what has been searched/i,
  );

  const [icon, touchIcon] = await Promise.all([
    readFile(new URL("../public/icon-32.png", import.meta.url)),
    readFile(new URL("../public/apple-touch-icon.png", import.meta.url)),
  ]);
  assert.equal(icon.readUInt32BE(16), 32);
  assert.equal(icon.readUInt32BE(20), 32);
  assert.equal(touchIcon.readUInt32BE(16), 180);
  assert.equal(touchIcon.readUInt32BE(20), 180);

  const [appStoreQr, playQr] = await Promise.all([
    readFile(new URL("../public/qr-app-store.svg", import.meta.url), "utf8"),
    readFile(new URL("../public/qr-google-play.svg", import.meta.url), "utf8"),
  ]);
  assert.match(appStoreQr, /<svg viewBox="0 0 \d+ \d+"/);
  assert.match(appStoreQr, /QR code: https:\/\/apps\.apple\.com\/us\/app\/rid2caltopo\/id6792518823</);
  assert.match(playQr, /<svg viewBox="0 0 \d+ \d+"/);
  assert.match(
    playQr,
    /QR code: https:\/\/play\.google\.com\/store\/apps\/details\?id=org\.ncssar\.rid2caltopo</,
  );
});

test("renders the same site header with Download and a mobile menu on every page", async () => {
  const paths = [
    "/",
    "/capabilities",
    "/contact",
    "/contact-error",
    "/contact-received",
    "/donations",
    "/managed-pilot",
    "/request-error",
    "/request-received",
    "/tips",
    "/tracker",
  ];
  const destinations = [
    'href="/capabilities"',
    'href="/tracker"',
    'href="/tips"',
    'href="/#tutorials"',
    'href="https://rid2caltopo.discourse.group/"',
    'href="/contact"',
  ];

  for (const path of paths) {
    const response = await render("rid2caltopo.com", path);
    const html = await response.text();
    const header = html.match(/<header class="site-header"[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, `${path} has the shared header`);
    assert.equal(html.match(/<header/g)?.length, 1, `${path} has a single header`);
    assert.match(header, /class="brand-mark" src="\/icon-64\.png"/, path);
    assert.match(header, /href="\/#testing"[^>]*>Download<\/a>/, path);
    assert.match(header, /<button[^>]*class="menu-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="site-nav"/, path);
    assert.match(header, /<nav[^>]*id="site-nav"[^>]*aria-label="Primary navigation"/, path);
    for (const destination of destinations) {
      assert.ok(header.includes(destination), `${path} header links ${destination}`);
    }
  }
});

test("leads with Download and linked store badges in the hero on both editions", async () => {
  for (const path of ["/", "/?view=community", "/?view=managed"]) {
    const response = await render("rid2caltopo.com", path);
    const html = await response.text();
    const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] ?? "";
    assert.match(
      hero,
      /<a class="button button-primary" href="#testing">Download the app/,
      path,
    );
    assert.match(
      hero,
      /<p class="availability-note">[\s\S]*href="https:\/\/play\.google\.com\/store\/apps\/details\?id=org\.ncssar\.rid2caltopo"[\s\S]*href="https:\/\/apps\.apple\.com\/us\/app\/rid2caltopo\/id6792518823"/,
      path,
    );
    assert.match(hero, />Free app<\/a>/, path);
    assert.match(hero, />Managed pilot<\/a>/, path);
    assert.doesNotMatch(hero, />Community<\/a>/, path);
  }
});

test("ships a small 1200x630 social card, favicon set and responsive hero artwork", async () => {
  const [card, ico] = await Promise.all([
    readFile(new URL("../public/og-image.jpg", import.meta.url)),
    readFile(new URL("../public/favicon.ico", import.meta.url)),
  ]);
  // JPEG: find the SOF0/SOF2 marker for dimensions.
  assert.equal(card[0], 0xff);
  assert.equal(card[1], 0xd8);
  let offset = 2;
  let size;
  while (offset < card.length) {
    assert.equal(card[offset], 0xff);
    const marker = card[offset + 1];
    const length = card.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      size = [card.readUInt16BE(offset + 7), card.readUInt16BE(offset + 5)];
      break;
    }
    offset += 2 + length;
  }
  assert.deepEqual(size, [1200, 630]);
  assert.ok(card.length < 300 * 1024, `OG card is ${card.length} bytes`);
  // ICO header: reserved 0, type 1, at least one image.
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.ok(ico.readUInt16LE(4) >= 1);

  const html = await (await render("rid2caltopo.com")).text();
  assert.match(html, /property="og:image" content="https:\/\/rid2caltopo\.com\/og-image\.jpg"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:image" content="https:\/\/rid2caltopo\.com\/og-image\.jpg"/);
  const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(hero, /src="\/app-live-map-800\.webp"/);
  assert.match(hero, /srcSet="[^"]*app-live-map-480\.webp 480w[^"]*app-live-map-1200\.webp 1200w"/i);
  assert.match(hero, /<img[^>]*width="800"[^>]*height="1067"/);
  assert.doesNotMatch(html, /og-assignment-coverage/);
  // Below-the-fold photo is lazy and responsive; tutorial videos do not preload.
  assert.match(html, /<img[^>]*dronescout-ds100-anker-field-480\.jpg 480w[^>]*loading="lazy"/i);
  assert.equal((html.match(/<video[^>]*preload="none"/g) ?? []).length, 6);
  assert.doesNotMatch(html, /preload="metadata"/);
});

test("declares long-lived cache headers for static assets", async () => {
  const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
  assert.match(headers, /\/assets\/\*\n\s+Cache-Control: public, max-age=31536000, immutable/);
  for (const extension of ["mp4", "jpg", "png", "webp", "svg", "ico", "vtt"]) {
    assert.match(headers, new RegExp(`\\/\\*\\.${extension}\\n\\s+Cache-Control: public, max-age=604800`));
  }
});

test("offers a skip link and a main landmark target on every page", async () => {
  const paths = [
    "/",
    "/capabilities",
    "/contact",
    "/contact-error",
    "/contact-received",
    "/donations",
    "/managed-pilot",
    "/request-error",
    "/request-received",
    "/tips",
    "/tracker",
  ];
  for (const path of paths) {
    const html = await (await render("rid2caltopo.com", path)).text();
    assert.match(html, /<a class="skip-link" href="#main">Skip to main content<\/a><header/, path);
    assert.equal(html.match(/<main[^>]*id="main"[^>]*tabindex="-1"/gi)?.length, 1, path);
  }
});

test("keeps palette tokens at WCAG AA and avoids sub-12px type", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const token = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))[1];
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  for (const background of ["paper", "cream", "sage"]) {
    assert.ok(ratio(token("muted"), token(background)) >= 4.5, `muted on ${background}`);
    assert.ok(ratio(token("accent-text"), token(background)) >= 4.5, `accent-text on ${background}`);
  }
  assert.ok(ratio("#ffffff", token("orange-deep")) >= 4.5, "white on orange-deep");
  assert.doesNotMatch(css, /font-size:\s*(?:[0-9]|1[01])px/, "no type below 12px");
  assert.match(css, /:focus-visible \{\s*outline: 3px solid var\(--focus-ring\)/);
});

test("publishes per-page social cards with og:url and an absolute homepage title", async () => {
  const pages = {
    "/": { title: "RID2Caltopo — Track drone assignments and search coverage in real time" },
    "/tips": { title: "Tips &amp; Tricks | RID2Caltopo" },
    "/capabilities": { title: "Capabilities | RID2Caltopo" },
    "/tracker": { title: "r2c-tracker service | RID2Caltopo" },
    "/managed-pilot": { title: "Request the managed pilot | RID2Caltopo" },
    "/contact": { title: "Contact RID2Caltopo | RID2Caltopo" },
    "/donations": { title: "Project support | RID2Caltopo" },
  };
  const seenDescriptions = new Set();

  for (const host of ["rid2caltopo.com", "rid2caltopo.org"]) {
    for (const [path, { title }] of Object.entries(pages)) {
      const html = await (await render(host, path)).text();
      const origin = `https://${host}`;
      const url = path === "/" ? `${origin}/` : `${origin}${path}`;
      assert.ok(html.includes(`<title>${title}</title>`), `${host}${path} <title>`);
      assert.ok(html.includes(`property="og:url" content="${url}"`), `${host}${path} og:url`);
      assert.ok(html.includes(`rel="canonical" href="${url}"`), `${host}${path} canonical`);
      assert.ok(html.includes(`property="og:title" content="${title}"`), `${host}${path} og:title`);
      assert.ok(html.includes(`name="twitter:title" content="${title}"`), `${host}${path} twitter:title`);
      assert.ok(html.includes(`property="og:image" content="${origin}/og-image.jpg"`), `${host}${path} og:image`);
      assert.match(html, /property="og:site_name" content="RID2Caltopo"/, path);
      const description = html.match(/property="og:description" content="([^"]+)"/)?.[1];
      assert.ok(description, `${path} og:description`);
      if (host === "rid2caltopo.com") seenDescriptions.add(description);
    }
  }
  assert.equal(seenDescriptions.size, Object.keys(pages).length, "one social description per page");

  // Pages that are noindex keep inheriting the site defaults.
  const received = await (await render("rid2caltopo.com", "/contact-received")).text();
  assert.match(received, /name="robots" content="noindex, nofollow"/);
});

test("adds lastmod to the sitemap and hides transient pages from robots", async () => {
  const robots = await (await render("rid2caltopo.com", "/robots.txt")).text();
  for (const path of ["/api/", "/request-error", "/request-received", "/contact-error", "/contact-received", "/early-access", "/_vinext/"]) {
    assert.ok(robots.includes(`Disallow: ${path}\n`), `robots disallows ${path}`);
  }
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \/assets/);

  const xml = await (await render("rid2caltopo.com", "/sitemap.xml")).text();
  const entries = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod><\/url>/g)];
  assert.equal(entries.length, 6);
  for (const [, , lastmod] of entries) {
    assert.ok(!Number.isNaN(Date.parse(lastmod)));
    assert.ok(Date.parse(lastmod) <= Date.now() + 86_400_000, "lastmod is not in the future");
  }
});

test("links to the UAS4SAR GitHub organization for source repositories", async () => {
  const html = await (await render("rid2caltopo.com")).text();
  assert.match(html, /href="https:\/\/github\.com\/UAS4SAR\/RID2Caltopo"/);
  assert.match(html, /href="https:\/\/github\.com\/UAS4SAR\/r2c-tracker"/);
  assert.match(html, /"codeRepository":"https:\/\/github\.com\/UAS4SAR\/RID2Caltopo"/);
  assert.doesNotMatch(html, /github\.com\/kjtsar\//);
  const tracker = await (await render("rid2caltopo.com", "/tracker")).text();
  assert.match(tracker, /href="https:\/\/github\.com\/UAS4SAR\/r2c-tracker"/);
  assert.doesNotMatch(tracker, /github\.com\/kjtsar\//);
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.name, "rid2caltopo-website");
});
