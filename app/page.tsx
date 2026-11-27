import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  CalTopoLink,
  CalTopoText,
} from "./components/CalTopoTeamsLink";
import { ReceiverOptions } from "./components/ReceiverOptions";
import { EmailContact } from "./components/EmailContact";
import { homeTitle, pageMetadata } from "./seo";

type SiteMode = "community" | "managed";

type PageProps = {
  searchParams?: Promise<{ view?: string }>;
};

const contactEmail = "info@uas4sar.com";
const playStoreUrl =
  "https://play.google.com/store/apps/details?id=org.ncssar.rid2caltopo";
const testFlightUrl = "https://testflight.apple.com/join/QhyVpGDh";
const appStoreUrl = "https://apps.apple.com/us/app/rid2caltopo/id6792518823";

const testerLink = (platform: "Android" | "Apple") =>
  `/contact?topic=${platform.toLowerCase()}-testing`;

export const metadata: Metadata = pageMetadata({
  title: homeTitle,
  absoluteTitle: true,
  description:
    "Free and managed tools that turn Remote ID observations into useful field awareness for search-and-rescue teams.",
  path: "/",
});

const freeCapabilities = [
  "Receive and display ASTM F3411 Remote ID broadcasts",
  "Record drone tracks locally on the phone or tablet",
  "Publish tracks to CalTopo maps you can edit",
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
    duration: "Getting started",
    title: "Connect your CalTopo account",
    copy: "Sign in with your personal CalTopo account to work with maps you can access. Teams credentials remain an option for organizations.",
    videoSrc: "/connect-personal-caltopo-account.mp4",
    posterSrc: "/connect-personal-caltopo-account-poster.jpg",
  },
  {
    duration: "3 min • Field setup",
    title: "Set up the DroneScout Bridge",
    copy: "Enable Relay ping, place the Bridge for useful line of sight, and verify power and live Remote ID reception before operations.",
    videoSrc: "/dronescout-bridge-setup.mp4?rev=20260804-relay-ping-on-audio",
    posterSrc: "/dronescout-bridge-setup-poster.jpg",
  },
  {
    duration: "6 min • Teams configuration",
    title: "Configure team drones and organization access",
    copy: "Create a CalTopo tracking Access URL and Connect Key, add your organization’s drones and API tuple, verify Shared Locations and a team map, and protect ORG access with the device screen lock.",
    videoSrc: "/configure-team-drones-caltopo-teams.mp4?rev=20260901-connect-key-walkthrough",
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
    duration: "Offline maps",
    title: "Download and share maps before the mission",
    copy: "Download USGS and USFS basemaps for offline use, then share available cached maps, terrain, and mapping layers in a map package. Sharing USGS and USFS basemaps requires version 2.6.1 or later.",
    videoSrc: "/download-share-offline-maps.mp4",
    posterSrc: "/download-share-offline-maps-poster.jpg",
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
      src="/icon-64.png"
      width={28}
      height={28}
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
    <main id="main" tabIndex={-1} className={`site-shell mode-${mode}`}>
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="edition-switch" role="group" aria-label="Choose homepage view">
            <span className="edition-switch-label" aria-hidden="true">
              View
            </span>
            <Link
              className={!isManaged ? "active" : ""}
              href="/?view=community"
              aria-current={!isManaged ? "page" : undefined}
            >
              Free app
            </Link>
            <Link
              className={isManaged ? "active" : ""}
              href="/?view=managed"
              aria-current={isManaged ? "page" : undefined}
            >
              Managed pilot
            </Link>
          </div>

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
            <a className="button button-primary" href="#testing">
              Download the app <ArrowIcon />
            </a>
            {isManaged ? (
              <a className="button button-secondary" href="/capabilities">
                See what&apos;s available
              </a>
            ) : (
              <a
                className="button button-secondary"
                href="https://github.com/UAS4SAR/RID2Caltopo"
              >
                Explore the source <ArrowIcon />
              </a>
            )}
          </div>
          <p className="availability-note">
            <span className="availability-dot" aria-hidden="true" />
            <span>Free on</span>
            <a
              className="store-badge"
              href={playStoreUrl}
              target="_blank"
              rel="noreferrer"
            >
              <small>Android</small>
              Google Play
            </a>
            <a
              className="store-badge"
              href={appStoreUrl}
              target="_blank"
              rel="noreferrer"
            >
              <small>iPhone &amp; iPad</small>
              App Store
            </a>
          </p>
        </div>

        <div className="hero-visual">
          <div className="hero-art-frame">
            <img
              src="/app-live-map-800.webp"
              srcSet="/app-live-map-480.webp 480w, /app-live-map-800.webp 800w, /app-live-map-1200.webp 1200w"
              sizes="(max-width: 560px) 80vw, 420px"
              width={800}
              height={1067}
              fetchPriority="high"
              decoding="async"
              alt="RID2Caltopo on an iPad: the Remote ID Tracks screen showing two active demo drones, DEMOALPHA01 and DEMOBRAVO02, with their recent track lines on a map"
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
              Drones used in SAR should advertise Remote ID.
            </p>
          </article>
          <div className="flow-line" aria-hidden="true"><span>RADIO</span></div>
          <article className="bridge-card">
            <img
              src="/dronescout-ds100-anker-field.jpg"
              srcSet="/dronescout-ds100-anker-field-480.jpg 480w, /dronescout-ds100-anker-field-800.jpg 800w, /dronescout-ds100-anker-field.jpg 1400w"
              sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 400px"
              width={1400}
              height={919}
              loading="lazy"
              decoding="async"
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
              <ReceiverOptions />
            </div>
          </article>
          <div className="flow-line" aria-hidden="true"><span>BRIDGE LINK</span></div>
          <article>
            <div className="flow-icon device-icon" aria-hidden="true">⌖</div>
            <p className="step">STEP 03</p>
            <h3>RID2Caltopo records</h3>
            <p>
              RID2Caltopo records tracks locally and directly to{" "}
              <CalTopoLink /> maps you can edit.
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
              <CalTopoLink /> map.
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
              During beta testing, each organization receives a generous
              platform-funded usage allowance. An expanding list of features
              includes:
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
              href="https://github.com/UAS4SAR/r2c-tracker"
            >
              Self-host the tracker <ArrowIcon />
            </a>
          </article>

          <article className={isManaged ? "featured managed-plan" : "managed-plan"}>
            <div className="choice-top">
              <span className="choice-label">MANAGED PILOT</span>
              <span className="price">Generous usage allowance <small>platform-funded during beta testing</small></span>
            </div>
            <h3>Let us handle the tracker.</h3>
            <p>
              A managed pilot for volunteer organizations that want
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
              and R2C Tracker does not accept payments. Site administrators can
              monitor their team&apos;s attributed usage and decide who may request
              streams and when, based on the organization&apos;s priorities.
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
            Start by connecting your personal <CalTopoLink /> account, then set up the
            DroneScout Bridge and controller video. Organizations can also use
            Teams credentials and follow the Teams configuration video. Download and share USGS and
            USFS maps ahead of time for offline use. Managed organizations can
            also follow the site-administration guide.
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
                  preload="none"
                  poster={tutorial.posterSrc ?? undefined}
                  aria-label={`${tutorial.title} video`}
                >
                  <source src={tutorial.videoSrc} type="video/mp4" />
                  {tutorial.videoSrc === "/connect-personal-caltopo-account.mp4" && (
                    <track kind="captions" src="/connect-personal-caltopo-account.vtt" srcLang="en" label="English" default />
                  )}
                  {tutorial.videoSrc === "/download-share-offline-maps.mp4" && (
                    <track kind="captions" src="/download-share-offline-maps.vtt" srcLang="en" label="English" default />
                  )}
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
              {tutorial.videoSrc === "/connect-personal-caltopo-account.mp4" && (
                <details className="tutorial-transcript">
                  <summary>Read the tutorial</summary>
                  <ol>
                    <li>Connect to the internet. In RID2Caltopo, open the main menu and choose Settings.</li>
                    <li>Under Personal Login Support, select Credentials and tap Sign in. If you previously used Session Cookies, choose Credentials to switch.</li>
                    <li>Read the sign-in prompt and tap Continue. Sign in to the <CalTopoLink /> account that has access to your maps, using your usual sign-in provider.</li>
                    <li>On the activation page, check the confirmation box and tap Sync Account. Wait for the app to return and load your account.</li>
                    <li>Open Select Map, choose your Personal credentials if needed, and select a map. To publish, choose a map you can edit and enable live <CalTopoLink /> publishing in Settings.</li>
                  </ol>
                  <p>To remove the personal credential from this device, choose Log out under Personal Login Support in Settings. It may still appear in your <CalTopoLink /> account until you remove it there. Organization Teams credentials remain separate.</p>
                </details>
              )}
              {tutorial.videoSrc === "/download-share-offline-maps.mp4" && (
                <details className="tutorial-transcript">
                  <summary>Read the tutorial</summary>
                  <ol>
                    <li>While connected to the internet, open the operational map and frame the area you need. Open the map settings gear and choose Download Map.</li>
                    <li>Choose Current Visible Map or an available boundary. Select USGS Scanned Topo or USFS Topo and the zoom levels you need. You can also select Contours, DEM elevation data, and AOL obstacle tiles.</li>
                    <li>Review the estimate and available storage. Reduce the area or detail, or adjust the map cache limit in Manage Storage if needed. Tap Start and wait for completion; retry any failures.</li>
                    <li>To share eligible cached data, frame the area on the map. Open map settings, then Map Management &gt; Export Map Package. Select the data and tap Prepare Map Package. Export uses the current visible region and does not download additional data.</li>
                    <li>By default, packages include available cached USGS and USFS basemaps, contours, DEM, AOL, and available R2C mapping layers. Review the selected contents before preparing the package. OSM and Esri basemaps and credentials are not included.</li>
                    <li>On Android, connect both devices to the same Wi-Fi or hotspot, keep the package QR panel open, and scan it from Import Config on the receiving device. On Apple, use Share Map Package to send the ZIP; the receiver chooses the file in Import Config. Wait for the import to complete.</li>
                    <li>Before departure, select the downloaded map layer and verify the area and required detail offline. On each receiving device, confirm the imported map and terrain data are present.</li>
                  </ol>
                </details>
              )}
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
          <h2>Download the app</h2>
          <p>Choose your platform to get RID2Caltopo.</p>
        </div>
        <div className="tester-actions">
          <article className="store-option">
            <div>
              <p className="store-platform">Android • Google Play</p>
              <a
                className="button button-light"
                href={playStoreUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get RID2Caltopo on Google Play <ArrowIcon />
              </a>
              <p className="store-note">
                Current release for Android phones and tablets.
              </p>
            </div>
            <img
              className="store-qr"
              src="/qr-google-play.svg"
              width="132"
              height="132"
              loading="lazy"
              alt="QR code that opens RID2Caltopo on Google Play"
            />
          </article>
          <article className="store-option">
            <div>
              <p className="store-platform">iPhone &amp; iPad • App Store</p>
              <a
                className="button button-light"
                href={appStoreUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download on the App Store <ArrowIcon />
              </a>
              <p className="store-note">
                Requires iOS or iPadOS 17 or later. To test upcoming releases,{" "}
                <a href={testFlightUrl} target="_blank" rel="noreferrer">join the TestFlight beta</a>.
              </p>
            </div>
            <img
              className="store-qr"
              src="/qr-app-store.svg"
              width="132"
              height="132"
              loading="lazy"
              alt="QR code that opens RID2Caltopo on the App Store"
            />
          </article>
          <span>
            Questions about joining?{" "}
            <a href={testerLink("Apple")}>Contact the test team</a> or email {contactEmail}.
          </span>
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
            <a href="https://github.com/UAS4SAR/RID2Caltopo">App source</a>
            <a href="https://github.com/UAS4SAR/r2c-tracker">Tracker source</a>
            <Link href="/tips">Tips &amp; tricks</Link>
            <Link href="/?view=community">Free app view</Link>
          </div>
          <div>
            <strong>CONNECT</strong>
            <a href="https://rid2caltopo.discourse.group/">Community forum</a>
            <EmailContact email={contactEmail} />
            <Link href="/managed-pilot">Managed pilot</Link>
            <a href="#testing">Download the app</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} UAS4SAR LLC. RID2Caltopo is developed
            and operated by UAS4SAR LLC.
          </span>
          <span>
            RID2Caltopo is an operational aid—not a sole source for aviation,
            navigation, or safety decisions.
          </span>
        </div>
      </footer>
    </main>
  );
}
