import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",
  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, vehicle recovery, breakdown recovery and roadside assistance across Liverpool, Wirral and Merseyside.",
  alternates: {
    canonical: "https://adforge.uk/",
  },
  openGraph: {
    title: "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",
    description:
      "Find mobile tyre fitting, emergency tyre repair, vehicle recovery and trusted local services across Liverpool, Wirral and Merseyside.",
    url: "https://adforge.uk/",
    siteName: "AdForge",
    type: "website",
    images: [
      {
        url: "https://adforge.uk/images/hero-recovery.png",
        width: 1200,
        height: 630,
        alt: "AdForge mobile tyre fitting and vehicle recovery services",
      },
    ],
  },
};

const PHONE = "+447576579923";
const DISPLAY_PHONE = "+44 7576 579923";

const serviceCards = [
  {
    number: "01",
    title: "Mobile Tyre Fitting",
    text: "24-hour mobile tyre fitting, puncture repairs, emergency tyre replacement, new and part-worn tyres.",
    href: "/services/mobile-tyre-fitting",
  },
  {
    number: "02",
    title: "Vehicle Recovery",
    text: "Breakdown recovery, towing, accident recovery, roadside assistance and vehicle transport.",
    href: "/services/vehicle-recovery",
  },
  {
    number: "03",
    title: "Local Businesses",
    text: "Browse trusted businesses across Liverpool, Wirral and Merseyside.",
    href: "/businesses",
  },
];

const tyreServices = [
  "24-hour mobile tyre fitting",
  "Emergency tyre repair",
  "Puncture repairs",
  "New and part-worn tyres",
  "Roadside tyre replacement",
  "Wheel balancing",
  "Locking-wheel-nut removal",
];

const recoveryServices = [
  "24-hour recovery service",
  "Breakdown recovery",
  "Accident recovery",
  "Towing service",
  "Roadside assistance",
  "Vehicle transport",
  "Liverpool, Wirral and Merseyside coverage",
];

const areas = [
  "Liverpool",
  "Wirral",
  "Bootle",
  "Huyton",
  "Kirkby",
  "Knowsley",
  "Wallasey",
  "Sefton",
  "St Helens",
  "Widnes",
  "Merseyside",
];

export default function PublicHomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AdForge",
    url: "https://adforge.uk/",
    description:
      "AdForge helps customers find mobile tyre fitting, vehicle recovery and trusted local services across Liverpool, Wirral and Merseyside.",
  };

  return (
    <>
      <main className="page">
        <header className="siteHeader">
          <Link href="/" className="logo">
            <span className="logoBox">AF</span>

            <span className="logoText">
              <strong>
                Ad<span>Forge</span>
              </strong>
              <small>LOCAL SERVICE PLATFORM</small>
            </span>
          </Link>

          <nav className="desktopNav">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <div className="headerActions">
            <a href={`tel:${PHONE}`} className="callTop">
              <span>CALL NOW</span>
              <strong>{DISPLAY_PHONE}</strong>
            </a>

            <Link href="/signup" className="listTop">
              List Business Free
            </Link>
          </div>
        </header>

        <nav className="mobileNav">
          <Link href="#services">Services</Link>
          <Link href="/businesses">Businesses</Link>
          <Link href="#areas">Areas</Link>
          <Link href="/home">Open App</Link>
        </nav>

        <section className="hero">
          <div className="heroMedia" />
          <div className="heroOverlay" />

          <div className="heroGrid">
            <div className="heroCopy">
              <div className="eyebrow">
                <span />
                24/7 LOCAL EMERGENCY SERVICES
              </div>

              <h1>
                Mobile tyres.
                <span>Vehicle recovery.</span>
                Liverpool.
              </h1>

              <p className="heroLead">
                AdForge helps drivers find 24-hour mobile tyre fitting,
                emergency tyre repair, puncture repairs, mobile tyres, new and
                part-worn tyres, vehicle recovery, breakdown recovery, towing
                services and roadside assistance across Liverpool, Wirral and
                Merseyside.
              </p>

              <div className="heroActions">
                <a href={`tel:${PHONE}`} className="primaryCta">
                  Call AdForge
                  <span>→</span>
                </a>

                <Link href="/services/mobile-tyre-fitting" className="secondaryCta">
                  Find Mobile Tyres
                  <span>→</span>
                </Link>

                <Link href="/services/vehicle-recovery" className="secondaryCta">
                  Find Recovery
                  <span>→</span>
                </Link>
              </div>
            </div>

            <aside className="heroPanel">
              <span className="panelKicker">LIVE LOCAL RESPONSE</span>

              <div className="statusRow">
                <span>Service</span>
                <strong>Tyres &amp; Recovery</strong>
              </div>

              <div className="statusRow">
                <span>Area</span>
                <strong>Liverpool &amp; nearby</strong>
              </div>

              <div className="statusRow">
                <span>Status</span>
                <strong className="available">Available now</strong>
              </div>

              <a href={`tel:${PHONE}`} className="panelCall">
                Call {DISPLAY_PHONE}
              </a>
            </aside>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>24/7</strong>
            <span>Emergency support</span>
          </div>

          <div>
            <strong>Local</strong>
            <span>Liverpool coverage</span>
          </div>

          <div>
            <strong>Direct</strong>
            <span>Calls through AdForge</span>
          </div>

          <div>
            <strong>Fast</strong>
            <span>Simple enquiry process</span>
          </div>
        </section>

        <section className="services" id="services">
          <div className="sectionIntro">
            <span>WHAT ADFORGE HELPS YOU FIND</span>
            <h2>One platform for urgent local help.</h2>
            <p>
              Browse AdForge service hubs, find a local provider and send every
              call or enquiry through AdForge.
            </p>
          </div>

          <div className="serviceStack">
            {serviceCards.map((service) => (
              <Link href={service.href} className="serviceRow" key={service.number}>
                <div className="serviceNumber">{service.number}</div>

                <div className="serviceWords">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>

                <span className="serviceArrow">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="splitServices">
          <article className="splitCard tyreCard">
            <div className="splitImage tyrePhoto" />

            <div className="splitContent">
              <span className="splitKicker">MOBILE TYRE SERVICES</span>
              <h2>24-hour mobile tyre fitting across Liverpool.</h2>

              <p>
                AdForge helps customers find emergency mobile tyre fitting,
                puncture repairs, emergency tyre repair, roadside tyre
                replacement, mobile tyres, new and part-worn tyres, wheel
                balancing and locking-wheel-nut removal.
              </p>

              <details>
                <summary>
                  View all tyre services
                  <b>+</b>
                </summary>

                <div className="detailGrid">
                  {tyreServices.map((item) => (
                    <span key={item}>✓ {item}</span>
                  ))}
                </div>
              </details>

              <div className="splitActions">
                <Link href="/services/mobile-tyre-fitting" className="smallGreen">
                  Browse Tyre Areas
                </Link>

                <a href={`tel:${PHONE}`} className="smallDark">
                  Call Now
                </a>
              </div>
            </div>
          </article>

          <article className="splitCard recoveryCard">
            <div className="splitContent">
              <span className="splitKicker">VEHICLE RECOVERY</span>
              <h2>Breakdown recovery, towing and roadside help.</h2>

              <p>
                Find 24-hour vehicle recovery, breakdown recovery, accident
                recovery, towing service, roadside assistance and vehicle
                transport through AdForge across Liverpool, Wirral and
                Merseyside.
              </p>

              <details>
                <summary>
                  View all recovery services
                  <b>+</b>
                </summary>

                <div className="detailGrid">
                  {recoveryServices.map((item) => (
                    <span key={item}>✓ {item}</span>
                  ))}
                </div>
              </details>

              <div className="splitActions">
                <Link href="/services/vehicle-recovery" className="smallGreen">
                  Browse Recovery Areas
                </Link>

                <a href={`tel:${PHONE}`} className="smallDark">
                  Call Now
                </a>
              </div>
            </div>

            <div className="splitImage recoveryPhoto" />
          </article>
        </section>

        <section className="featured">
          <div className="featuredMedia">
            <span className="featuredBadge">FEATURED LOCAL PROVIDER</span>

            <img
              src="/images/totaltyres.jpeg"
              alt="Total Tyres mobile tyre fitting van in Liverpool"
            />
          </div>

          <div className="featuredCopy">
            <span className="featuredKicker">
              LOCAL BUSINESS COVERING LIVERPOOL &amp; MERSEYSIDE
            </span>

            <h2>Total Tyres &amp; Recovery 247 Ltd</h2>
            <h3>Mobile Tyre Fitting &amp; Tyre Support</h3>

            <p>
              Local mobile tyre fitting provider offering emergency tyre
              replacement, puncture repairs, new and part-worn tyres, wheel
              balancing, locking nut removal and roadside tyre support.
            </p>

            <div className="featureList">
              <span>✓ Mobile Tyre Fitting</span>
              <span>✓ Puncture Repairs</span>
              <span>✓ New &amp; Part-Worn Tyres</span>
              <span>✓ Emergency Tyre Replacement</span>
              <span>✓ Wheel Balancing</span>
              <span>✓ Locking Nut Removal</span>
            </div>

            <div className="coverage">
              <strong>Coverage:</strong> Liverpool, Wirral &amp; Merseyside
            </div>

            <div className="featuredActions">
              <a href={`tel:${PHONE}`} className="featuredPrimary">
                Call Through AdForge
                <span>→</span>
              </a>

              <Link href="/services/mobile-tyre-fitting" className="featuredSecondary">
                View Services
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="areas" id="areas">
          <div className="sectionIntro">
            <span>LOCAL COVERAGE</span>
            <h2>Tyre and recovery services near you.</h2>
            <p>
              AdForge service pages cover Liverpool, Wirral, Merseyside and
              surrounding towns.
            </p>
          </div>

          <div className="areaGrid">
            {areas.map((area) => (
              <Link href="/services/mobile-tyre-fitting" key={area}>
                {area}
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="businessCta">
          <div>
            <span>FOR LOCAL BUSINESSES</span>
            <h2>List your business free on AdForge.</h2>
            <p>
              Create a public business listing and upgrade later to advertising
              tools or the AdForge AI receptionist.
            </p>
          </div>

          <Link href="/signup" className="businessButton">
            Create Free Listing
            <span>→</span>
          </Link>
        </section>

        <footer className="footer">
          <div className="footerBrand">
            Ad<span>Forge</span>
          </div>

          <p>
            Mobile tyre fitting, vehicle recovery and trusted local services
            across Liverpool, Wirral and Merseyside.
          </p>

          <div className="footerLinks">
            <Link href="/services/mobile-tyre-fitting">Mobile Tyres</Link>
            <Link href="/services/vehicle-recovery">Vehicle Recovery</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/signup">List Business Free</Link>
          </div>

          <small>© 2026 AdForge</small>
        </footer>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <style>{`
        :root {
          --green: #32ff73;
          --black: #000;
          --panel: #07090c;
          --panel2: #0b0e12;
          --line: rgba(255,255,255,.12);
          --muted: #9ca2aa;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: var(--black);
        }

        body {
          margin: 0;
          background: var(--black);
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 18%, rgba(50,255,115,.05), transparent 24%),
            #000;
        }

        .siteHeader {
          position: absolute;
          z-index: 30;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(calc(100% - 48px), 1380px);
          min-height: 94px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logoBox {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50,255,115,.4);
          border-radius: 14px;
          color: var(--green);
          font-style: italic;
          font-weight: 1000;
          font-size: 18px;
        }

        .logoText {
          display: flex;
          flex-direction: column;
          line-height: .9;
        }

        .logoText strong {
          font-size: 24px;
          letter-spacing: -1.8px;
        }

        .logoText strong span {
          color: var(--green);
        }

        .logoText small {
          margin-top: 8px;
          color: #7f858d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .desktopNav {
          display: flex;
          gap: 8px;
        }

        .desktopNav a {
          padding: 11px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 850;
          color: #d7dade;
        }

        .desktopNav a:hover {
          color: var(--green);
          background: rgba(255,255,255,.04);
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .callTop {
          min-width: 166px;
          min-height: 58px;
          padding: 8px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.17);
          border-radius: 18px;
          background: rgba(5,7,10,.82);
          backdrop-filter: blur(16px);
        }

        .callTop span {
          color: var(--green);
          font-size: 8px;
          letter-spacing: 2.4px;
          font-weight: 950;
        }

        .callTop strong {
          margin-top: 4px;
          font-size: 14px;
        }

        .listTop {
          min-height: 48px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          border-radius: 999px;
          background: var(--green);
          color: #031006;
          font-size: 11px;
          font-weight: 950;
        }

        .mobileNav {
          display: none;
        }

        .hero {
          position: relative;
          min-height: 860px;
          display: flex;
          align-items: flex-end;
        }

        .heroMedia {
          position: absolute;
          inset: 0;
          background-image: url("/images/hero-recovery.png");
          background-size: cover;
          background-position: center 26%;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(0,0,0,.58) 0%, rgba(0,0,0,.24) 52%, rgba(0,0,0,.08) 100%),
            linear-gradient(180deg, rgba(0,0,0,.02) 0%, rgba(0,0,0,.08) 56%, rgba(0,0,0,.82) 86%, #000 100%);
        }

        .heroGrid {
          position: relative;
          z-index: 3;
          width: min(calc(100% - 56px), 1280px);
          margin: 0 auto;
          padding: 170px 0 74px;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, .65fr);
          align-items: end;
          gap: 60px;
        }

        .heroCopy {
          max-width: 760px;
        }

        .eyebrow {
          width: max-content;
          max-width: 100%;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(50,255,115,.42);
          border-radius: 999px;
          background: rgba(4,8,5,.66);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.2px;
        }

        .eyebrow span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 18px rgba(50,255,115,.85);
        }

        .hero h1 {
          margin: 18px 0 0;
          max-width: 700px;
          font-size: clamp(48px, 5.4vw, 78px);
          line-height: .92;
          letter-spacing: -4px;
          font-weight: 1000;
        }

        .hero h1 span {
          display: block;
          color: var(--green);
        }

        .heroLead {
          max-width: 700px;
          margin: 24px 0 0;
          color: #c3c7cc;
          font-size: 17px;
          line-height: 1.72;
        }

        .heroActions {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 52px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border-radius: 13px;
          font-size: 11px;
          font-weight: 950;
        }

        .primaryCta {
          min-width: 174px;
          background: var(--green);
          color: #031006;
        }

        .secondaryCta {
          min-width: 170px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(4,6,8,.8);
        }

        .heroPanel {
          padding: 28px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 24px;
          background: rgba(6,9,12,.8);
          backdrop-filter: blur(22px);
          box-shadow: 0 30px 90px rgba(0,0,0,.45);
        }

        .panelKicker {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .statusRow {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid var(--line);
        }

        .statusRow span {
          color: #858b93;
          font-size: 11px;
        }

        .statusRow strong {
          font-size: 12px;
          text-align: right;
        }

        .available {
          color: var(--green);
        }

        .panelCall {
          min-height: 52px;
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 12px;
          font-weight: 950;
        }

        .stats {
          width: min(calc(100% - 56px), 1280px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: var(--panel);
        }

        .stats div {
          min-height: 105px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid var(--line);
        }

        .stats div:last-child {
          border-right: 0;
        }

        .stats strong {
          color: var(--green);
          font-size: 24px;
        }

        .stats span {
          margin-top: 4px;
          color: #8f959d;
          font-size: 11px;
        }

        .services,
        .splitServices,
        .featured,
        .areas,
        .businessCta,
        .footer {
          width: min(calc(100% - 56px), 1280px);
          margin-left: auto;
          margin-right: auto;
        }

        .services {
          padding: 110px 0 45px;
          display: grid;
          grid-template-columns: .72fr 1.28fr;
          gap: 80px;
        }

        .sectionIntro > span,
        .splitKicker,
        .featuredKicker,
        .businessCta > div > span {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.8px;
        }

        .sectionIntro h2 {
          margin: 16px 0 0;
          font-size: clamp(44px, 5vw, 72px);
          line-height: .94;
          letter-spacing: -4px;
        }

        .sectionIntro p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .serviceStack {
          display: grid;
          gap: 12px;
        }

        .serviceRow {
          min-height: 132px;
          padding: 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: var(--panel);
        }

        .serviceRow:hover {
          border-color: rgba(50,255,115,.42);
          transform: translateY(-2px);
        }

        .serviceNumber {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50,255,115,.36);
          border-radius: 17px;
          color: var(--green);
          font-size: 15px;
          font-weight: 950;
        }

        .serviceWords h3 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .serviceWords p {
          margin: 8px 0 0;
          color: #91979f;
          font-size: 12px;
          line-height: 1.55;
        }

        .serviceArrow {
          color: var(--green);
          font-size: 25px;
        }

        .splitServices {
          padding: 75px 0 25px;
          display: grid;
          gap: 22px;
        }

        .splitCard {
          min-height: 560px;
          display: grid;
          grid-template-columns: 45% 55%;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 26px;
          background: var(--panel);
        }

        .recoveryCard {
          grid-template-columns: 55% 45%;
        }

        .splitImage {
          min-height: 560px;
          background-size: cover;
          background-position: center;
        }

        .tyrePhoto {
          background-image: url("/images/mobile-tyre-fitting.jpg");
        }

        .recoveryPhoto {
          background-image: url("/images/recovery-truck.jpg");
        }

        .splitContent {
          padding: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .splitContent h2 {
          margin: 16px 0 0;
          font-size: clamp(42px, 4.8vw, 68px);
          line-height: .94;
          letter-spacing: -4px;
        }

        .splitContent > p {
          margin: 22px 0 0;
          color: #a4a9b0;
          font-size: 14px;
          line-height: 1.72;
        }

        details {
          margin-top: 22px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: #050608;
        }

        summary {
          min-height: 56px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          list-style: none;
          font-size: 12px;
          font-weight: 900;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        summary b {
          color: var(--green);
          font-size: 19px;
        }

        .detailGrid {
          padding: 0 17px 17px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          color: #d7dade;
          font-size: 11px;
        }

        .splitActions {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .smallGreen,
        .smallDark {
          min-height: 48px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 950;
        }

        .smallGreen {
          background: var(--green);
          color: #031006;
        }

        .smallDark {
          border: 1px solid rgba(50,255,115,.3);
          background: #050608;
        }

        .featured {
          margin-top: 95px;
          display: grid;
          grid-template-columns: 46% 54%;
          overflow: hidden;
          border: 1px solid rgba(50,255,115,.46);
          border-radius: 28px;
          background: var(--panel);
        }

        .featuredMedia {
          position: relative;
          min-height: 620px;
          overflow: hidden;
        }

        .featuredMedia img {
          width: 100%;
          height: 100%;
          min-height: 620px;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .featuredBadge {
          position: absolute;
          z-index: 2;
          top: 26px;
          left: 26px;
          padding: 11px 16px;
          border: 1px solid rgba(50,255,115,.5);
          border-radius: 999px;
          background: rgba(7,9,12,.9);
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .featuredCopy {
          padding: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .featuredCopy h2 {
          margin: 16px 0 0;
          font-size: clamp(42px, 4.8vw, 68px);
          line-height: .94;
          letter-spacing: -4px;
        }

        .featuredCopy h3 {
          margin: 14px 0 0;
          color: var(--green);
          font-size: 22px;
        }

        .featuredCopy > p {
          margin: 21px 0 0;
          color: #a6abb2;
          font-size: 13px;
          line-height: 1.72;
        }

        .featureList {
          margin-top: 23px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 18px;
          font-size: 11px;
          font-weight: 850;
        }

        .coverage {
          margin-top: 23px;
          padding: 14px 16px;
          border: 1px solid var(--line);
          border-radius: 13px;
          color: #aeb3b9;
          font-size: 11px;
        }

        .coverage strong {
          color: #fff;
        }

        .featuredActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 10px;
        }

        .featuredPrimary,
        .featuredSecondary {
          min-height: 52px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 950;
        }

        .featuredPrimary {
          background: var(--green);
          color: #031006;
        }

        .featuredSecondary {
          border: 1px solid rgba(50,255,115,.3);
          background: #050608;
        }

        .areas {
          padding: 110px 0 45px;
        }

        .areaGrid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .areaGrid a {
          min-height: 58px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--panel);
          font-size: 11px;
          font-weight: 850;
        }

        .areaGrid span {
          color: var(--green);
        }

        .businessCta {
          margin-top: 85px;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          border: 1px solid rgba(50,255,115,.34);
          border-radius: 26px;
          background:
            radial-gradient(circle at 88% 12%, rgba(50,255,115,.1), transparent 28%),
            var(--panel);
        }

        .businessCta > div {
          max-width: 760px;
        }

        .businessCta h2 {
          margin: 14px 0 0;
          font-size: clamp(38px, 4vw, 58px);
          line-height: .95;
          letter-spacing: -3px;
        }

        .businessCta p {
          margin: 17px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .businessButton {
          min-width: 205px;
          min-height: 52px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 11px;
          font-weight: 950;
        }

        .footer {
          margin-top: 95px;
          padding: 45px 0 40px;
          border-top: 1px solid var(--line);
        }

        .footerBrand {
          font-size: 30px;
          font-weight: 1000;
          letter-spacing: -2px;
        }

        .footerBrand span {
          color: var(--green);
        }

        .footer p {
          max-width: 620px;
          color: #8e949b;
          font-size: 12px;
          line-height: 1.65;
        }

        .footerLinks {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 22px;
        }

        .footerLinks a {
          font-size: 11px;
          font-weight: 800;
        }

        .footer small {
          display: block;
          margin-top: 34px;
          color: #666b72;
          font-size: 9px;
        }

        @media (max-width: 1160px) {
          .desktopNav {
            display: none;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }

          .heroPanel {
            max-width: 520px;
          }

          .services {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 980px) {
          .siteHeader {
            width: calc(100% - 36px);
          }

          .listTop {
            display: none;
          }

          .mobileNav {
            position: absolute;
            z-index: 29;
            top: 94px;
            left: 0;
            width: 100%;
            padding: 0 18px 12px;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .mobileNav::-webkit-scrollbar {
            display: none;
          }

          .mobileNav a {
            min-height: 44px;
            padding: 0 18px;
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            border: 1px solid rgba(255,255,255,.16);
            border-radius: 999px;
            background: rgba(5,7,9,.84);
            backdrop-filter: blur(16px);
            font-size: 10px;
            font-weight: 850;
          }

          .splitCard,
          .recoveryCard,
          .featured {
            grid-template-columns: 1fr;
          }

          .recoveryCard .splitImage {
            order: -1;
          }

          .areaGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .siteHeader {
            top: 0;
            left: 0;
            transform: none;
            width: 100%;
            min-height: 90px;
            padding: 12px 18px;
          }

          .logoBox {
            width: 42px;
            height: 42px;
            font-size: 15px;
          }

          .logoText strong {
            font-size: 20px;
          }

          .logoText small {
            font-size: 5px;
            letter-spacing: 1.6px;
          }

          .callTop {
            min-width: 146px;
            min-height: 54px;
            padding: 7px 11px;
          }

          .callTop span {
            font-size: 7px;
          }

          .callTop strong {
            font-size: 12px;
          }

          .mobileNav {
            top: 90px;
          }

          .hero {
            min-height: 820px;
          }

          .heroMedia {
            background-position: 58% 20%;
          }

          .heroOverlay {
            background:
              linear-gradient(180deg, rgba(0,0,0,.02) 0%, rgba(0,0,0,.07) 44%, rgba(0,0,0,.62) 76%, #000 100%);
          }

          .heroGrid {
            width: 100%;
            padding: 160px 20px 36px;
            gap: 24px;
          }

          .eyebrow {
            padding: 9px 13px;
            font-size: 7px;
            letter-spacing: 1.8px;
          }

          .hero h1 {
            margin-top: 14px;
            max-width: 560px;
            font-size: 39px;
            line-height: .95;
            letter-spacing: -2.5px;
          }

          .heroLead {
            width: 92%;
            max-width: 560px;
            margin-top: 14px;
            font-size: 12px;
            line-height: 1.62;
          }

          .heroActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .primaryCta {
            grid-column: 1 / -1;
          }

          .primaryCta,
          .secondaryCta {
            min-width: 0;
            min-height: 48px;
            padding: 0 14px;
            font-size: 10px;
          }

          .heroPanel {
            display: none;
          }

          .stats,
          .services,
          .splitServices,
          .featured,
          .areas,
          .businessCta,
          .footer {
            width: calc(100% - 34px);
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .stats div {
            min-height: 88px;
            border-bottom: 1px solid var(--line);
          }

          .stats div:nth-child(2) {
            border-right: 0;
          }

          .stats div:nth-child(3),
          .stats div:nth-child(4) {
            border-bottom: 0;
          }

          .services {
            padding-top: 80px;
          }

          .sectionIntro h2 {
            font-size: 44px;
            letter-spacing: -3px;
          }

          .serviceRow {
            min-height: 112px;
            padding: 17px;
            gap: 15px;
          }

          .serviceNumber {
            width: 50px;
            height: 50px;
          }

          .serviceWords h3 {
            font-size: 20px;
          }

          .serviceWords p {
            font-size: 10px;
          }

          .splitServices {
            padding-top: 55px;
          }

          .splitImage {
            min-height: 300px;
          }

          .splitContent {
            padding: 30px 21px;
          }

          .splitContent h2 {
            font-size: 40px;
            letter-spacing: -3px;
          }

          .splitContent > p {
            font-size: 12px;
          }

          .detailGrid {
            grid-template-columns: 1fr;
          }

          .featured {
            margin-top: 65px;
          }

          .featuredMedia,
          .featuredMedia img {
            min-height: 310px;
            max-height: 350px;
          }

          .featuredCopy {
            padding: 30px 21px;
          }

          .featuredCopy h2 {
            font-size: 40px;
            letter-spacing: -3px;
          }

          .featuredCopy h3 {
            font-size: 19px;
          }

          .featureList {
            grid-template-columns: 1fr;
          }

          .featuredActions {
            grid-template-columns: 1fr;
          }

          .areas {
            padding-top: 85px;
          }

          .areaGrid {
            grid-template-columns: 1fr 1fr;
          }

          .businessCta {
            margin-top: 65px;
            padding: 30px 21px;
            display: block;
          }

          .businessCta h2 {
            font-size: 40px;
          }

          .businessButton {
            width: 100%;
            min-width: 0;
            margin-top: 24px;
          }

          .footer {
            margin-top: 72px;
          }
        }

        @media (max-width: 430px) {
          .logoBox {
            display: none;
          }

          .callTop {
            min-width: 142px;
          }

          .hero h1 {
            font-size: 37px;
          }

          .heroLead {
            width: 92%;
          }

          .heroActions {
            grid-template-columns: 1fr;
          }

          .primaryCta {
            grid-column: auto;
          }

          .areaGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
