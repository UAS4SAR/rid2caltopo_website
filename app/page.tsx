import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  CalTopoLink,
  CalTopoTeamsLink,
  CalTopoText,
} from "./components/CalTopoTeamsLink";
import { EmailContact } from "./components/EmailContact";

type SiteMode = "community" | "managed";

type PageProps = {
  searchParams?: Promise<{ view?: string }>;
};

const contactEmail = "kjtsar@kjt.us";

const testerLink = (platform: "Android" | "Apple") =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(
    `RID2Caltopo ${platform} tester request`,
  )}&body=${encodeURIComponent(
    `G'day,\n\nI'd like to help test RID2Caltopo on ${platform}.\n\nName:\nOrganization:\nDevice model:\nHow we use drones:\n\nThanks!`,
  )}`;

export const metadata: Metadata = {
  title: "RID2Caltopo — Track drone assignments and search coverage in real time",
  description:
    "Free and managed tools that turn Remote ID observations into useful field awareness for search-and-rescue teams.",
  alternates: { canonical: "/" },
};

const freeCapabilities = [
  "Receive and display ASTM F3411 Remote ID broadcasts",
  "Record drone tracks locally on the phone or tablet",
  "Publish tracks directly to CalTopo Teams incident maps",
  "Stream controller video locally for squinter review",
  "Capture potential clues and use on-device anomaly assist",
];

const managedCapabilities = [
  {
    number: "01",
    title: "FAA, airspace & land-use checks",
    copy: "Bring nearby flight restrictions, operational airspace context, and protected-land checks into the incident workflow with visible freshness and availability status.",
  },
  {
    number: "02",
    title: "Multiple R2C zones per incident",
    copy: "Coordinate multiple RID2Caltopo tablets and DroneScout Bridges, assign drone ownership, relay sightings, and suppress duplicate CalTopo tracks.",
  },
  {
    number: "03",
    title: "Flight record support",
    copy: "Retain an organization-wide record of flights that document pilot, drone, distance, time, and weather information to record incident and training flights and support FAA waiver compliance.",
  },
  {
    number: "04",
    title: "Pilot-authorized video for Incident Command",
    copy: "Let authorized IC personnel request a live drone feed. Video leaves the field tablet only after the pilot approves the connection.",
  },
];

const tutorials = [
  {
    duration: "3 min • Field setup",
    title: "Set up the DroneScout Bridge",
    copy: "Enable Relay ping, place the Bridge for useful line of sight, and verify power and live Remote ID reception before operations.",
    videoSrc: "/dronescout-bridge-setup.mp4?rev=20260804-relay-ping-on-audio",
    posterSrc: "/dronescout-bridge-setup-poster.jpg",
  },
  {
    duration: "4 min • Configuration",
    title: "Configure team drones and CalTopo Teams account",
    copy: "Add your organization’s drones, connect its CalTopo Teams account, verify a team map, and securely share the configuration.",
    videoSrc: "/configure-team-drones-caltopo-teams.mp4",
    posterSrc: "/configure-team-drones-caltopo-teams-poster.jpg",
  },
  {
    duration: "5 min • Field video",
    title: "Stream drone video to RID2Caltopo",
    copy: "Give a squinter a larger live view, bind video to Remote ID telemetry with the drone designator, and submit picture waypoints to the incident map.",
    videoSrc: "/stream-drone-video-to-rid2caltopo.mp4",
    posterSrc: "/stream-drone-video-to-rid2caltopo-poster.jpg",
  },
  {
    duration: "5 min • Advanced Mutual Aid",
    title: "Prepare and export a Mutual Aid package",
    copy: "Prepare early, cache the operational map, set the expiration, and transfer locally by peer-to-peer wireless or a USB-C storage device to minimize Starlink and cellular traffic.",
    videoSrc: "/prepare-mutual-aid-package.mp4?rev=20260804-dem-device",
    posterSrc: "/prepare-mutual-aid-package-poster.jpg?rev=20260804-dem-device",
  },
  {
    duration: "5 min • Site administration",
    title: "Administer an organization site",
    copy: "Activate a new site administrator, set privacy and retention, monitor service status, delegate member roles, enroll field devices, and manage flight records.",
    videoSrc: "/organization-site-administration.mp4",
    posterSrc: "/organization-site-administration-poster.jpg",
  },
];

function BrandMark() {
  return (
    <img
      className="brand-mark"
      src="/app-icon-orange.png"
      alt=""
      aria-hidden="true"
    />
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  ).toLowerCase();

  const forcedMode =
    params.view === "managed"
      ? "managed"
      : params.view === "community"
        ? "community"
        : null;
  const mode: SiteMode =
    forcedMode ?? (host.includes("rid2caltopo.com") ? "managed" : "community");
  const isManaged = mode === "managed";

  return (
    <main className={`site-shell mode-${mode}`}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RID2Caltopo home">
          <BrandMark />
          <span>RID<span className="brand-two">2</span>CalTopo</span>
        </a>
        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#tutorials">Tutorials</a>
          <Link href="/tips">Tips &amp; tricks</Link>
          <a href="#get-started">Get started</a>
        </nav>
        <div className="edition-switch" aria-label="Website edition">
          <Link
            className={!isManaged ? "active" : ""}
            href="/?view=community"
            aria-current={!isManaged ? "page" : undefined}
          >
            Community
          </Link>
          <Link
            className={isManaged ? "active" : ""}
            href="/?view=managed"
            aria-current={isManaged ? "page" : undefined}
          >
            Managed
          </Link>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            {isManaged
              ? "Managed coordination for SAR organizations"
              : "Free • Open source • Built for SAR"}
          </p>
          <h1>
            Track <em>drone assignments and search coverage</em> in real time.
          </h1>
          <p className="hero-lede">
            RID2Caltopo turns broadcast Remote ID into shared field awareness—
            helping search teams see drones, preserve coverage, and coordinate
            operations from Android, iPhone, and iPad.
          </p>
          <div className="hero-actions">
            {isManaged ? (
              <>
                <a className="button button-primary" href="/capabilities">
                  See what&apos;s available <ArrowIcon />
                </a>
                <a className="button button-secondary" href="/tracker">
                  Understand the tracker
                </a>
              </>
            ) : (
              <>
                <a
                  className="button button-primary"
                  href="https://github.com/kjtsar/RID2Caltopo"
                >
                  Explore the source <ArrowIcon />
                </a>
                <a className="button button-secondary" href="#testing">
                  Join the test team
                </a>
              </>
            )}
          </div>
          <p className="availability-note">
            <span aria-hidden="true" />
            Android and Apple test invitations are provided by email while the
            latest release completes field testing.
          </p>
        </div>

        <div className="hero-visual">
          <div className="hero-art-frame">
            <img
              src="/og-assignment-coverage.png"
              alt="RID2CalTopo illustration showing drone assignments and search coverage in real time on a topographic field map"
            />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Project principles">
        <span>Purpose-built for volunteer search teams</span>
        <span>Android • iPhone • iPad</span>
        <span>Open-source core</span>
      </section>

      <section className="how-it-works section" aria-labelledby="how-title">
        <div className="section-heading">
          <p className="eyebrow">The field link</p>
          <h2 id="how-title">From drone signal to a useful search record.</h2>
        </div>
        <div className="signal-flow">
          <article>
            <div className="flow-icon drone-icon" aria-hidden="true">✣</div>
            <p className="step">STEP 01</p>
            <h3>Drone broadcasts</h3>
            <p>
              Drones used in a SAR mission are required to broadcast ASTM F3411
              Remote ID.
            </p>
          </article>
          <div className="flow-line" aria-hidden="true"><span>RADIO</span></div>
          <article className="bridge-card">
            <img
              src="/dronescout-ds100-anker-field.jpg"
              alt="BlueMark DroneScout DS100 Remote ID bridge connected to an Anker USB power bank"
            />
            <div>
              <p className="step">STEP 02</p>
              <h3>Bridge receives</h3>
              <p>
                A DroneScout Bridge can receive Remote ID broadcasts over
                thousands of feet when terrain, line of sight, and radio
                conditions cooperate.
              </p>
              <a
                className="bridge-resource-link"
                href="https://gearfocus.com/products/drone-detector-bluemark-ds100-dronescout-retail-bridge-faa-r-79np1"
                target="_blank"
                rel="noreferrer"
              >
                DS100 details and purchase options <ArrowIcon />
              </a>
            </div>
          </article>
          <div className="flow-line" aria-hidden="true"><span>BRIDGE LINK</span></div>
          <article>
            <div className="flow-icon device-icon" aria-hidden="true">⌖</div>
            <p className="step">STEP 03</p>
            <h3>RID2Caltopo records</h3>
            <p>
              RID2Caltopo records tracks locally and directly to{" "}
              <CalTopoTeamsLink />{" "}
              incident maps.
            </p>
          </article>
          <div className="flow-line" aria-hidden="true"><span>LOCAL VIDEO</span></div>
          <article>
            <div className="flow-icon map-icon" aria-hidden="true">▶</div>
            <p className="step">STEP 04</p>
            <h3>Squinters review video</h3>
            <p>
              Stream video locally from a drone to a tablet to engage squinters
              in reviewing the live feed.
            </p>
          </article>
        </div>
      </section>

      <section className="capabilities section" id="capabilities">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">A clear capability boundary</p>
            <h2>Free app first. Tracker when coordination grows.</h2>
          </div>
          <p>
            RID2Caltopo and a DroneScout Bridge provide the core field tools. An
            optional <a className="inline-link" href="/tracker">r2c-tracker service</a>{" "}
            adds cross-device coordination and server-side services.
          </p>
        </div>
        <div className="capability-split">
          <article className="capability-panel free-panel">
            <div className="capability-panel-heading">
              <div>
                <span className="cap-kicker">FREE RID2CALTOPO APP</span>
                <h3>Lots of capabilities included.</h3>
              </div>
              <span className="cap-price">$0</span>
            </div>
            <p className="cap-summary">
              Install the app, deploy a DroneScout Bridge for reliable
              Remote ID reception, and connect directly to your{" "}
              <CalTopoTeamsLink /> incident map.
            </p>
            <ul className="capability-list">
              {freeCapabilities.map((capability) => (
                <li key={capability}>
                  <span className="capability-check" aria-hidden="true">✓</span>
                  <span className="capability-copy">
                    <CalTopoText text={capability} />
                  </span>
                </li>
              ))}
              <li>
                <span aria-hidden="true">✓</span>
                Use the core field tools without an online coordination service
              </li>
            </ul>
          </article>
          <article className="capability-panel tracker-panel">
            <div className="capability-panel-heading">
              <div>
                <span className="cap-kicker">OPTIONAL MANAGED TIER</span>
                <h3>Adds compliance awareness and coordination.</h3>
              </div>
              <span className="cap-adds">STARTER</span>
            </div>
            <p className="cap-summary">
              During the open-ended beta, each organization receives a
              platform-funded $10 usage allowance that resets each calendar
              month. An expanding list of features includes:
            </p>
            <ol className="managed-feature-list">
              {managedCapabilities.map((capability) => (
                <li key={capability.number}>
                  <span>{capability.number}</span>
                  <div>
                    <strong>{capability.title}</strong>
                    <p><CalTopoText text={capability.copy} /></p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="compliance-note">
              Record retention supports an organization&apos;s documentation;
              operators remain responsible for their authorization, procedures,
              and applicable FAA requirements.{" "}
              <a href="https://www.faa.gov/newsroom/beyond-visual-line-sight-bvlos">
                FAA BVLOS information
              </a>
            </p>
          </article>
        </div>
      </section>

      <section className="choice-section section" id="get-started">
        <div className="section-heading centered">
          <p className="eyebrow">Choose your path</p>
          <h2>The app stays free. Coordination is your choice.</h2>
          <p>
            The app and Bridge can work directly with <CalTopoLink />. Teams that need
            distributed coordination can learn about the{" "}
            <a className="inline-link" href="/tracker">r2c-tracker service</a>,
            host it themselves, or join the managed pilot.
          </p>
        </div>
        <div className="choice-grid" id="plans">
          <article className={!isManaged ? "featured" : ""}>
            <div className="choice-top">
              <span className="choice-label">COMMUNITY</span>
              <span className="price">$0 <small>forever</small></span>
            </div>
            <h3>Run it your way.</h3>
            <p>
              Use the mobile app locally, publish directly to <CalTopoLink />, or deploy
              and administer your own open-source tracker.
            </p>
            <ul>
              <li>Free Android and Apple apps</li>
              <li>Local Remote ID awareness</li>
              <li>Optional <CalTopoLink /> publishing</li>
              <li>Open r2c-tracker source</li>
            </ul>
            <a
              className="button button-card"
              href="https://github.com/kjtsar/r2c-tracker"
            >
              Self-host the tracker <ArrowIcon />
            </a>
          </article>

          <article className={isManaged ? "featured managed-plan" : "managed-plan"}>
            <div className="choice-top">
              <span className="choice-label">MANAGED PILOT</span>
              <span className="price">$10 monthly allowance <small>resets each calendar month during beta</small></span>
            </div>
            <h3>Let us handle the tracker.</h3>
            <p>
              A cost-sharing pilot for volunteer organizations that want
              compliance awareness and incident-wide coordination without
              administering cloud infrastructure.
            </p>
            <ul>
              <li>FAA, airspace, and protected-land checks</li>
              <li>Multiple R2C zones and Bridges per incident</li>
              <li>Organization-wide flight record support</li>
              <li>Pilot-authorized live video to Incident Command</li>
              <li>Organization onboarding</li>
              <li>Reasonable-use cloud hosting</li>
            </ul>
            <a className="button button-card" href="/managed-pilot">
              Request a managed pilot <ArrowIcon />
            </a>
            <p className="fine-print">
              The managed service is an open-ended beta with no fixed end date,
              and R2C Tracker does not accept payments. Each organization
              receives a platform-funded $10 usage allowance every calendar
              month. The administrative panel lets you monitor your team&apos;s
              actual usage costs.
            </p>
          </article>
        </div>
      </section>

      <section className="tutorials section" id="tutorials">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Learn in the field</p>
            <h2>Short tutorials. Real workflows.</h2>
          </div>
          <p>
            Start with the DroneScout Bridge field setup, then configure your
            team drones and <CalTopoTeamsLink /> account. Next, connect a
            controller video stream for squinter-assisted clue searching, then
            continue with advanced Mutual Aid package preparation. Managed
            organizations can also follow the site-administration guide for
            activation, policy, roles, enrollment, funding, and records.
          </p>
        </div>
        <div className="tutorial-grid">
          {tutorials.map((tutorial, index) => (
            <article key={tutorial.title}>
              {tutorial.videoSrc ? (
                <video
                  className="tutorial-video"
                  controls
                  playsInline
                  preload="metadata"
                  poster={tutorial.posterSrc ?? undefined}
                  aria-label={`${tutorial.title} video`}
                >
                  <source src={tutorial.videoSrc} type="video/mp4" />
                  Your browser does not support embedded video. You can download
                  the tutorial from the video controls instead.
                </video>
              ) : (
                <div className="video-placeholder">
                  <span className="play-button" aria-hidden="true">▶</span>
                  <span className="video-index">0{index + 1}</span>
                </div>
              )}
              <p className="step">{tutorial.duration}</p>
              <h3><CalTopoText text={tutorial.title} /></h3>
              <p><CalTopoText text={tutorial.copy} /></p>
              {tutorial.videoSrc ? (
                <a className="watch-now" href={tutorial.videoSrc}>
                  Watch or download video <ArrowIcon />
                </a>
              ) : (
                <span className="coming-soon">Video coming soon</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="test-cta section" id="testing">
        <div>
          <p className="eyebrow">Field testers wanted</p>
          <h2>Help make the next release dependable.</h2>
          <p>
            We’re looking for SAR drone teams, pilots, communications
            specialists, and technically curious volunteers willing to test
            real equipment and report what happens.
          </p>
        </div>
        <div className="tester-actions">
          <a className="button button-light" href={testerLink("Android")}>
            Request Android test access <ArrowIcon />
          </a>
          <a className="button button-outline-light" href={testerLink("Apple")}>
            Request Apple test access <ArrowIcon />
          </a>
          <span>Store invitation links will replace email after release testing.</span>
        </div>
      </section>

      <section className="roadmap section">
        <div className="section-heading">
          <p className="eyebrow">Looking ahead</p>
          <h2>Build what field teams actually need next.</h2>
        </div>
        <div className="roadmap-row">
          <span>FREE APP</span>
          <strong>Remote ID • Shared tracks • Local video • Anomaly assist</strong>
        </div>
        <div className="roadmap-row">
          <span>MANAGED STARTER</span>
          <strong>FAA / airspace / land checks • Multi-zone incidents • BVLOS records • Pilot-authorized IC video</strong>
        </div>
        <div className="roadmap-row future">
          <span>EXPLORING</span>
          <strong>Cloud video storage and playback • Trained-model video review</strong>
        </div>
        <p className="roadmap-disclaimer">
          Roadmap items are research directions, not release commitments.
          Operational decisions must always be based on verified information,
          trained personnel, and applicable procedures.
        </p>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#top">
            <BrandMark />
            <span>RID<span className="brand-two">2</span>CalTopo</span>
          </a>
          <p>Open tools for better search awareness.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>PROJECT</strong>
            <a href="https://github.com/kjtsar/RID2Caltopo">App source</a>
            <a href="https://github.com/kjtsar/r2c-tracker">Tracker source</a>
            <Link href="/tips">Tips &amp; tricks</Link>
            <Link href="/?view=community">Community edition</Link>
          </div>
          <div>
            <strong>CONNECT</strong>
            <EmailContact email={contactEmail} />
            <Link href="/managed-pilot">Managed pilot</Link>
            <a href="#testing">Become a tester</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RID2Caltopo</span>
          <span>
            RID2Caltopo is an operational aid—not a sole source for aviation,
            navigation, or safety decisions.
          </span>
        </div>
      </footer>
    </main>
  );
}
