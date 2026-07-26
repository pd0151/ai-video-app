import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AdForge | Mobile Tyres, Recovery & Local Businesses",
  description:
    "Find mobile tyre fitting, vehicle recovery and trusted local businesses across Liverpool, Wirral and Merseyside.",
  alternates: {
    canonical: "https://adforge.uk/",
  },
  openGraph: {
    title: "AdForge | Find Local Help Fast",
    description:
      "Mobile tyre fitting, vehicle recovery and trusted local businesses across Merseyside.",
    url: "https://adforge.uk/",
    siteName: "AdForge",
    type: "website",
  },
};

const services = [
  {
    label: "TYRE SERVICES",
    title: "Mobile Tyre Fitting",
    description:
      "Puncture repairs, replacement tyres, emergency call-outs and roadside tyre fitting.",
    href: "/services/mobile-tyre-fitting",
    image: "/images/mobile-tyre-fitting.jpg",
    button: "Find tyre fitting",
  },
  {
    label: "RECOVERY SERVICES",
    title: "Vehicle Recovery",
    description:
      "Breakdown recovery, accident recovery, roadside assistance and vehicle transport.",
    href: "/services/vehicle-recovery",
    image: "/images/recovery-truck.jpg",
    button: "Get recovery help",
  },
  {
    label: "LOCAL DIRECTORY",
    title: "Local Businesses",
    description:
      "Browse trusted local businesses, compare services and contact providers directly.",
    href: "/businesses",
    image:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=85",
    button: "Browse businesses",
  },
  {
    label: "BUSINESS AUTOMATION",
    title: "AI Receptionist",
    description:
      "Answer calls 24/7, capture customer details and send new leads straight by SMS.",
    href: "/ai-receptionist",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    button: "Explore AI receptionist",
  },
];

const areas = [
  "Liverpool",
  "Wirral",
  "Bootle",
  "Huyton",
  "Kirkby",
  "St Helens",
  "Widnes",
  "Warrington",
  "Southport",
  "Prescot",
];

export default function PublicHomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AdForge",
    url: "https://adforge.uk/",
    description:
      "Find mobile tyre fitting, vehicle recovery and local businesses.",
  };

  return (
    <>
      <main className="page">
        <header className="header">
          <Link href="/" className="logo" aria-label="AdForge homepage">
            <span className="logoMark">AF</span>

            <span className="logoText">
              Ad<span>Forge</span>
              <small>LOCAL SERVICE PLATFORM</small>
            </span>
          </Link>

          <nav className="desktopNav">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <Link href="/signup" className="listButton">
            List Business Free <span>→</span>
          </Link>
        </header>

        <section className="hero">
          <div className="heroImage" />
          <div className="heroOverlay" />
          <div className="heroGlow" />

          <div className="heroInner">
            <div className="heroCopy">
              <div className="heroBadge">
                <i />
                24/7 MOBILE TYRE &amp; RECOVERY SERVICES
              </div>

              <h1>
                Find Local Help.
                <span>Get Moving Again.</span>
              </h1>

              <p>
                Find mobile tyre fitting, emergency tyre assistance, vehicle
                recovery and trusted local businesses across Liverpool, Wirral
                and Merseyside.
              </p>

              <div className="heroActions">
                <Link
                  href="/services/mobile-tyre-fitting"
                  className="primaryButton"
                >
                  Find Mobile Tyre Fitting <span>→</span>
                </Link>

                <Link
                  href="/services/vehicle-recovery"
                  className="secondaryButton"
                >
                  Find Vehicle Recovery <span>→</span>
                </Link>
              </div>

              <Link href="/signup" className="freeBusinessLink">
                List your business free <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="servicePanel" id="services">
          <div className="serviceGrid">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="serviceCard"
              >
                <div
                  className="serviceImage"
                  style={{ backgroundImage: `url("${service.image}")` }}
                />
                <div className="serviceShade" />

                <div className="serviceLabel">{service.label}</div>

                <div className="serviceBody">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>

                  <div className="serviceButton">
                    {service.button} <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="featuredRow">
            <article className="featuredBusiness">
              <span className="premiumTag">PREMIUM</span>

              <div className="businessLogo">TT</div>

              <div className="businessInfo">
                <span className="featuredEyebrow">FEATURED BUSINESS</span>
                <h2>Total Tyres 24/7</h2>

                <div className="rating">
                  ★★★★★ <small>4.9 customer rating</small>
                </div>

                <p>
                  Mobile tyre fitting • Emergency call-outs • Puncture repairs •
                  New and part-worn tyres • Wheel alignment
                </p>

                <div className="businessTags">
                  <span>Tyres</span>
                  <span>Brakes</span>
                  <span>Batteries</span>
                  <span>Wheel Alignment</span>
                  <span>24/7 Call Out</span>
                </div>
              </div>

              <div className="businessActions">
                <a href="tel:07385182500" className="primaryButton compact">
                  Call 07385 182 500 <span>→</span>
                </a>

                <Link
                  href="/services/mobile-tyre-fitting"
                  className="secondaryButton compact"
                >
                  View Services <span>→</span>
                </Link>
              </div>
            </article>

            <aside className="searchCard">
              <div className="searchHeading">
                <span>FIND LOCAL HELP FAST</span>
                <b>LIVE</b>
              </div>

              <div className="searchInput">
                <span>⌖</span>
                <div>
                  <small>Your postcode or area</small>
                  <strong>Liverpool</strong>
                </div>
                <b>⌄</b>
              </div>

              <div className="searchInput">
                <span>◇</span>
                <div>
                  <small>What do you need?</small>
                  <strong>Mobile Tyre Fitting</strong>
                </div>
                <b>⌄</b>
              </div>

              <Link href="/businesses" className="searchButton">
                Search Local Services <span>→</span>
              </Link>
            </aside>
          </div>

          <div className="benefits">
            <article>
              <b>24/7</b>
              <div>
                <strong>Emergency Help</strong>
                <span>Available when you need it</span>
              </div>
            </article>

            <article>
              <b>⚡</b>
              <div>
                <strong>Fast Local Response</strong>
                <span>Find trusted providers nearby</span>
              </div>
            </article>

            <article>
              <b>⌖</b>
              <div>
                <strong>Area-Based Results</strong>
                <span>Search by service and location</span>
              </div>
            </article>

            <article>
              <b>✓</b>
              <div>
                <strong>Free Business Listings</strong>
                <span>List your business for free</span>
              </div>
            </article>
          </div>
        </section>

        <section className="stats">
          <article>
            <strong>3,000+</strong>
            <span>Local service pages</span>
          </article>
          <article>
            <strong>24/7</strong>
            <span>Emergency support</span>
          </article>
          <article>
            <strong>50+</strong>
            <span>Areas covered</span>
          </article>
          <article>
            <strong>Fast</strong>
            <span>Local response</span>
          </article>
        </section>

        <section className="aiSection">
          <div className="aiCopy">
            <span>NEW • AI RECEPTIONIST</span>
            <h2>Never miss another call.</h2>

            <p>
              AdForge AI answers customer calls 24/7, captures job details and
              sends every new lead straight to your phone.
            </p>

            <div className="aiActions">
              <Link href="/ai-receptionist" className="primaryButton compact">
                Learn More <span>→</span>
              </Link>

              <Link href="/signup" className="secondaryButton compact">
                Start Free <span>→</span>
              </Link>
            </div>
          </div>

          <div className="phone">
            <div className="speaker" />

            <div className="phoneScreen">
              <small>ADFORGE AI</small>
              <strong>Receptionist</strong>
              <span>00:24</span>

              <div className="wave">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <b>☎</b>
            </div>
          </div>

          <div className="aiFeatures">
            <span>✓ Answers calls instantly</span>
            <span>✓ Captures customer details</span>
            <span>✓ Sends leads by SMS</span>
            <span>✓ Available 24/7</span>
          </div>
        </section>

        <section className="areas" id="areas">
          <div className="areasHeading">
            <span>LOCAL COVERAGE</span>
            <h2>Serving Liverpool and Merseyside.</h2>
          </div>

          <div className="areaGrid">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/businesses?location=${encodeURIComponent(area)}`}
              >
                {area} <span>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bottomCta">
          <div>
            <span>NEED HELP NOW?</span>
            <h2>We’re here 24/7.</h2>
          </div>

          <Link href="/businesses" className="secondaryButton compact">
            Get Help Now <span>→</span>
          </Link>
        </section>

        <footer className="footer">
          <div className="footerIntro">
            <Link href="/" className="logo">
              <span className="logoMark">AF</span>

              <span className="logoText">
                Ad<span>Forge</span>
                <small>LOCAL SERVICE PLATFORM</small>
              </span>
            </Link>

            <p>
              Connecting local customers with tyre, recovery and business
              services across Merseyside.
            </p>
          </div>

          <div className="footerLinks">
            <Link href="/services/mobile-tyre-fitting">Mobile Tyres</Link>
            <Link href="/services/vehicle-recovery">Vehicle Recovery</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="/signup">List Business Free</Link>
            <Link href="/home">Open App</Link>
          </div>

          <div className="footerBottom">
            <span>© {new Date().getFullYear()} AdForge</span>
            <span>Liverpool, United Kingdom</span>
          </div>
        </footer>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <style>{`
        :root {
          --bg: #020304;
          --panel: #080c10;
          --panel2: #0b1117;
          --line: rgba(255,255,255,.12);
          --green: #98ed00;
          --green2: #baff16;
          --text: #f7f8f9;
          --muted: #9aa3ac;
          --max: 1460px;
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
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
            radial-gradient(circle at 50% 0%, rgba(110,185,0,.12), transparent 30%),
            #020304;
        }

        .header {
          position: absolute;
          z-index: 30;
          top: 0;
          left: 50%;
          width: min(calc(100% - 64px), var(--max));
          height: 92px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .logoMark {
          color: white;
          font-size: 31px;
          font-style: italic;
          font-weight: 1000;
          letter-spacing: -5px;
        }

        .logoText {
          display: flex;
          flex-direction: column;
          font-size: 28px;
          line-height: .86;
          font-weight: 950;
          letter-spacing: -2px;
        }

        .logoText > span { color: var(--green); }

        .logoText small {
          margin-top: 8px;
          color: #8c959f;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2.3px;
        }

        .desktopNav {
          display: flex;
          align-items: center;
          gap: 31px;
          margin-left: auto;
        }

        .desktopNav a {
          color: rgba(255,255,255,.84);
          font-size: 12px;
          font-weight: 800;
        }

        .desktopNav a:hover { color: var(--green); }

        .listButton {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 0 20px;
          border: 1px solid var(--green);
          border-radius: 10px;
          color: #061000;
          background: linear-gradient(135deg, var(--green2), #72ce00);
          box-shadow: 0 0 28px rgba(152,237,0,.2);
          font-size: 12px;
          font-weight: 950;
        }

   .hero {
  min-height: 820px;
  padding-top: 82px;
  align-items: flex-end;
}

.heroImage {
  background-position: 57% center;
  background-size: cover;
}

.heroOverlay {
  background:
    linear-gradient(
      180deg,
      rgba(0,0,0,.08) 0%,
      rgba(0,0,0,.12) 28%,
      rgba(0,0,0,.55) 58%,
      rgba(0,0,0,.96) 100%
    ),
    linear-gradient(
      90deg,
      rgba(0,0,0,.72) 0%,
      rgba(0,0,0,.22) 60%,
      rgba(0,0,0,.04) 100%
    );
}

.heroInner {
  width: calc(100% - 34px);
  min-height: 820px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  padding: 300px 0 38px;
}

.heroCopy {
  width: 100%;
  max-width: 390px;
  margin-left: 0;
}

.heroBadge {
  margin-bottom: 17px;
  padding: 9px 12px;
  font-size: 7px;
  letter-spacing: 1.2px;
}

.hero h1 {
  width: 100%;
  max-width: 390px;
  margin: 0;
  font-size: 49px;
  line-height: .91;
  letter-spacing: -3.5px;
  font-weight: 1000;
}

.hero h1 span {
  display: block;
}

.heroCopy > p {
  max-width: 340px;
  margin: 21px 0;
  font-size: 14px;
  line-height: 1.65;
}

.heroActions {
  width: 100%;
  max-width: 340px;
  grid-template-columns: 1fr;
  gap: 10px;
}

.primaryButton,
.secondaryButton {
  min-height: 61px;
  padding: 0 18px;
  font-size: 13px;
}

.freeBusinessLink {
  margin-top: 15px;
  font-size: 12px;
}

        .freeBusinessLink span { color: var(--green); }

        .servicePanel {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
          padding: 24px 0 0;
        }

        .serviceGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .serviceCard {
          position: relative;
          min-height: 340px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--panel);
          transition: .25s ease;
        }

        .serviceCard:hover {
          transform: translateY(-6px);
          border-color: rgba(152,237,0,.48);
        }

        .serviceImage {
          position: absolute;
          inset: 0 0 47% 0;
          background-position: center;
          background-size: cover;
        }

        .serviceShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, transparent, rgba(7,10,13,.18) 28%, #080c10 60%, #080c10);
        }

        .serviceLabel,
        .serviceBody {
          position: relative;
          z-index: 2;
        }

        .serviceLabel {
          width: fit-content;
          margin: 16px;
          padding: 7px 9px;
          border: 1px solid rgba(152,237,0,.34);
          border-radius: 999px;
          color: var(--green);
          background: rgba(0,0,0,.58);
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 1.3px;
        }

        .serviceBody { padding: 20px 18px; }

        .serviceBody h2 {
          margin: 0 0 9px;
          font-size: 21px;
          letter-spacing: -1px;
        }

        .serviceBody p {
          min-height: 55px;
          margin: 0 0 18px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.55;
        }

        .serviceButton {
          display: flex;
          justify-content: space-between;
          color: var(--green);
          font-size: 11px;
          font-weight: 900;
        }

        .featuredRow {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 14px;
        }

        .featuredBusiness {
          position: relative;
          overflow: hidden;
          min-height: 205px;
          display: grid;
          grid-template-columns: 90px 1fr auto;
          align-items: center;
          gap: 22px;
          padding: 24px;
          border: 1px solid rgba(152,237,0,.27);
          border-radius: 16px;
          background:
            linear-gradient(90deg, rgba(3,6,8,.98), rgba(3,6,8,.82)),
            url("/images/mobile-tyre-fitting.jpg") right center / 48% auto no-repeat;
        }

        .premiumTag {
          position: absolute;
          top: 13px;
          right: 16px;
          z-index: 3;
          padding: 5px 9px;
          border-radius: 999px;
          color: #071000;
          background: var(--green);
          font-size: 7px;
          font-weight: 950;
        }

        .businessLogo {
          width: 90px;
          height: 90px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(152,237,0,.42);
          border-radius: 50%;
          color: var(--green);
          background: rgba(0,0,0,.72);
          font-size: 26px;
          font-weight: 1000;
        }

        .featuredEyebrow {
          display: block;
          margin-bottom: 7px;
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .businessInfo h2 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -1.5px;
        }

        .rating {
          margin-top: 6px;
          color: #ffd72a;
          letter-spacing: 1.5px;
          font-size: 12px;
        }

        .rating small {
          margin-left: 7px;
          color: #c3c9cf;
          letter-spacing: 0;
        }

        .businessInfo p {
          max-width: 630px;
          margin: 10px 0;
          color: #c6ccd1;
          font-size: 11px;
          line-height: 1.55;
        }

        .businessTags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .businessTags span {
          padding: 6px 8px;
          border: 1px solid var(--line);
          border-radius: 7px;
          color: #d8dde1;
          background: rgba(0,0,0,.45);
          font-size: 9px;
        }

        .businessActions {
          min-width: 205px;
          display: grid;
          gap: 9px;
        }

        .compact {
          min-height: 48px;
          font-size: 11px;
        }

        .searchCard {
          padding: 17px;
          border: 1px solid rgba(152,237,0,.27);
          border-radius: 16px;
          background:
            radial-gradient(circle at 90% 0%, rgba(152,237,0,.1), transparent 30%),
            var(--panel);
        }

        .searchHeading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.8px;
        }

        .searchHeading b {
          padding: 5px 7px;
          border: 1px solid rgba(152,237,0,.38);
          border-radius: 999px;
          font-size: 7px;
        }

        .searchInput {
          min-height: 58px;
          display: grid;
          grid-template-columns: 32px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: rgba(1,3,5,.72);
        }

        .searchInput + .searchInput { margin-top: 8px; }

        .searchInput > span { color: var(--green); }

        .searchInput small,
        .searchInput strong { display: block; }

        .searchInput small {
          margin-bottom: 4px;
          color: #8f98a1;
          font-size: 8px;
        }

        .searchInput strong { font-size: 12px; }

        .searchButton {
          min-height: 51px;
          margin-top: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 9px;
          color: #061000;
          background: linear-gradient(135deg, var(--green2), #72d000);
          font-size: 11px;
          font-weight: 1000;
        }

        .benefits {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--line);
          border-radius: 15px;
          background: var(--panel);
        }

        .benefits article {
          min-height: 92px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px 20px;
          border-right: 1px solid var(--line);
        }

        .benefits article:last-child { border-right: 0; }

        .benefits b {
          min-width: 38px;
          color: var(--green);
          font-size: 22px;
        }

        .benefits strong,
        .benefits span { display: block; }

        .benefits strong {
          margin-bottom: 4px;
          font-size: 11px;
        }

        .benefits span {
          color: var(--muted);
          font-size: 9px;
        }

        .stats {
          width: min(calc(100% - 64px), var(--max));
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--line);
          border-radius: 15px;
          background: var(--panel);
        }

        .stats article {
          min-height: 95px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 19px 24px;
          border-right: 1px solid var(--line);
        }

        .stats article:last-child { border-right: 0; }

        .stats strong {
          margin-bottom: 5px;
          font-size: 24px;
        }

        .stats span {
          color: var(--muted);
          font-size: 10px;
        }

        .aiSection {
          width: min(calc(100% - 64px), var(--max));
          min-height: 310px;
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: 1.1fr .42fr .72fr;
          align-items: center;
          gap: 28px;
          padding: 34px;
          border: 1px solid rgba(152,237,0,.27);
          border-radius: 16px;
          background:
            radial-gradient(circle at 35% 120%, rgba(152,237,0,.16), transparent 35%),
            var(--panel);
        }

        .aiCopy > span,
        .areasHeading > span,
        .bottomCta > div > span {
          display: block;
          margin-bottom: 9px;
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.8px;
        }

        .aiCopy h2,
        .areasHeading h2,
        .bottomCta h2 {
          margin: 0;
          font-size: clamp(35px, 4vw, 56px);
          line-height: .98;
          letter-spacing: -3px;
        }

        .aiCopy p {
          max-width: 560px;
          margin: 17px 0 20px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .aiActions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .phone {
          position: relative;
          width: 145px;
          height: 265px;
          justify-self: center;
          padding: 7px;
          border: 2px solid rgba(255,255,255,.2);
          border-radius: 29px;
          background: #000;
        }

        .speaker {
          position: absolute;
          z-index: 2;
          top: 14px;
          left: 50%;
          width: 48px;
          height: 14px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #000;
        }

        .phoneScreen {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 44px 13px 16px;
          border-radius: 21px;
          background:
            radial-gradient(circle at 50% 82%, rgba(152,237,0,.18), transparent 32%),
            #060a0e;
        }

        .phoneScreen small {
          color: var(--green);
          font-size: 6px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .phoneScreen strong {
          margin-top: 6px;
          font-size: 10px;
        }

        .phoneScreen > span {
          margin-top: 13px;
          color: #828b94;
          font-size: 9px;
        }

        .wave {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .wave i {
          width: 3px;
          border-radius: 99px;
          background: white;
        }

        .wave i:nth-child(1) { height: 18px; }
        .wave i:nth-child(2) { height: 36px; }
        .wave i:nth-child(3) { height: 24px; }
        .wave i:nth-child(4) { height: 48px; }
        .wave i:nth-child(5) { height: 29px; }
        .wave i:nth-child(6) { height: 55px; }
        .wave i:nth-child(7) { height: 27px; }
        .wave i:nth-child(8) { height: 39px; }

        .phoneScreen > b {
          width: 41px;
          height: 41px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #061000;
          background: var(--green);
          font-size: 17px;
        }

        .aiFeatures {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .aiFeatures span {
          padding: 11px 13px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(1,3,5,.7);
          color: #d8dde1;
          font-size: 10px;
          font-weight: 750;
        }

        .areas {
          width: min(calc(100% - 64px), var(--max));
          margin: 18px auto 0;
          padding: 30px 0;
        }

        .areaGrid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          border-top: 1px solid var(--line);
        }

        .areaGrid a {
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          color: #dce1e5;
          font-size: 10px;
          font-weight: 800;
        }

        .areaGrid a:nth-child(5n) { border-right: 0; }

        .areaGrid a span { color: var(--green); }

        .bottomCta {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 24px 28px;
          border: 1px solid rgba(152,237,0,.29);
          border-radius: 14px;
          background:
            linear-gradient(90deg, rgba(152,237,0,.13), rgba(152,237,0,.02));
        }

        .bottomCta h2 {
          font-size: 32px;
          letter-spacing: -2px;
        }

        .footer {
          width: min(calc(100% - 64px), var(--max));
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 45px;
          padding: 42px 0 26px;
          border-top: 1px solid var(--line);
        }

        .footerIntro p {
          max-width: 390px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .footerLinks {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 30px;
        }

        .footerLinks a {
          color: var(--muted);
          font-size: 10px;
        }

        .footerBottom {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          color: #6d7680;
          font-size: 9px;
        }

        @media (max-width: 1080px) {
          .desktopNav { display: none; }

          .serviceGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .featuredRow {
            grid-template-columns: 1fr;
          }

          .featuredBusiness {
            grid-template-columns: 80px 1fr;
          }

          .businessActions {
            grid-column: 1 / -1;
          }

          .benefits {
            grid-template-columns: repeat(2, 1fr);
          }

          .benefits article:nth-child(2) {
            border-right: 0;
          }

          .benefits article:nth-child(-n+2) {
            border-bottom: 1px solid var(--line);
          }

          .aiSection {
            grid-template-columns: 1fr .45fr;
          }

          .aiFeatures {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }

          .areaGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .areaGrid a:nth-child(5n) {
            border-right: 1px solid var(--line);
          }

          .areaGrid a:nth-child(even) {
            border-right: 0;
          }
        }

        @media (max-width: 760px) {
          .header {
            width: calc(100% - 32px);
            height: 82px;
          }

          .logoMark { font-size: 24px; }
          .logoText { font-size: 23px; }

          .logoText small {
            font-size: 5px;
            letter-spacing: 1.6px;
          }

          .listButton {
            min-height: 40px;
            padding: 0 13px;
            border-radius: 999px;
            font-size: 9px;
          }

          .hero {
            min-height: auto;
            padding-top: 82px;
          }

          .heroImage {
            background-position: 62% top;
          }

          .heroOverlay {
            background:
              linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,.42) 30%, rgba(0,0,0,.92) 68%, #020304 100%);
          }

          .heroInner {
            width: calc(100% - 32px);
            padding: 240px 0 34px;
          }

          .heroBadge {
            font-size: 6px;
            letter-spacing: 1.1px;
          }

          .hero h1 {
            font-size: 50px;
            letter-spacing: -4px;
          }

          .heroCopy > p {
            font-size: 13px;
          }

          .heroActions {
            grid-template-columns: 1fr;
          }

          .servicePanel {
            width: calc(100% - 32px);
          }

          .serviceGrid {
            grid-template-columns: 1fr;
          }

          .featuredBusiness {
            grid-template-columns: 64px 1fr;
            padding: 18px;
          }

          .businessLogo {
            width: 64px;
            height: 64px;
            font-size: 20px;
          }

          .businessInfo h2 {
            font-size: 21px;
          }

          .businessActions {
            min-width: 0;
          }

          .benefits {
            grid-template-columns: 1fr;
          }

          .benefits article {
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .benefits article:last-child {
            border-bottom: 0;
          }

          .stats {
            width: calc(100% - 32px);
            grid-template-columns: repeat(2, 1fr);
          }

          .stats article {
            border-bottom: 1px solid var(--line);
          }

          .stats article:nth-child(2) {
            border-right: 0;
          }

          .stats article:nth-child(3),
          .stats article:nth-child(4) {
            border-bottom: 0;
          }

          .aiSection {
            width: calc(100% - 32px);
            grid-template-columns: 1fr;
            padding: 25px 20px;
          }

          .aiFeatures {
            grid-column: auto;
            grid-template-columns: 1fr;
          }

          .areas {
            width: calc(100% - 32px);
          }

          .areaGrid {
            grid-template-columns: 1fr;
          }

          .areaGrid a {
            border-right: 0 !important;
          }

          .bottomCta {
            width: calc(100% - 32px);
            align-items: flex-start;
            flex-direction: column;
          }

          .footer {
            width: calc(100% - 32px);
            grid-template-columns: 1fr;
          }

          .footerBottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }
        }
      `}</style>
    </>
  );
}
