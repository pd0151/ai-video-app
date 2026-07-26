import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AdForge | Mobile Tyres, Recovery & Local Help",
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

const serviceCards = [
  {
    title: "Mobile Tyre Fitting",
    description:
      "Puncture repairs, replacement tyres and roadside tyre fitting at your location.",
    href: "/services/mobile-tyre-fitting",
    image: "/images/mobile-tyre-fitting.jpg",
    icon: "◉",
  },
  {
    title: "Vehicle Recovery",
    description:
      "Breakdown recovery, accident recovery and safe vehicle transport, 24/7.",
    href: "/services/vehicle-recovery",
    image: "/images/recovery-truck.jpg",
    icon: "▱",
  },
  {
    title: "Roadside Assistance",
    description:
      "Battery help, jump starts, tyre emergencies and other urgent roadside support.",
    href: "/businesses",
    image: "/images/hero-recovery.png",
    icon: "▣",
  },
];

const steps = [
  {
    number: "01",
    title: "Search",
    description: "Tell us what service you need and where you are.",
  },
  {
    number: "02",
    title: "Choose",
    description: "View trusted local businesses operating near you.",
  },
  {
    number: "03",
    title: "Get Help",
    description: "Contact a provider directly and get moving again.",
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
];

export default function PublicHomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AdForge",
    url: "https://adforge.uk/",
    description:
      "Find mobile tyre fitting, vehicle recovery and trusted local businesses.",
  };

  return (
    <>
      <main className="page">
        <header className="header">
          <Link href="/" className="brand" aria-label="AdForge homepage">
            <span className="brandMark">AF</span>

            <span className="brandText">
              Ad<span>Forge</span>
              <small>LOCAL SERVICE PLATFORM</small>
            </span>
          </Link>

          <nav className="desktopNav" aria-label="Public navigation">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <Link href="/signup" className="topButton">
            List Business Free <span>→</span>
          </Link>
        </header>

        <nav className="mobileNav" aria-label="Mobile public navigation">
          <Link href="#services">Services</Link>
          <Link href="/businesses">Businesses</Link>
          <Link href="/ai-receptionist">AI Receptionist</Link>
          <Link href="#areas">Areas</Link>
          <Link href="/home">Open App</Link>
        </nav>

        <section className="hero">
          <div className="heroImage" />
          <div className="heroShade" />

          <div className="heroInner">
            <div className="heroCopy">
              <div className="eyebrow">
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

              <div className="heroButtons">
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

              <Link href="/signup" className="freeLink">
                List your business free <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="trustStrip" aria-label="Why use AdForge">
          <article>
            <div className="trustIcon">✓</div>
            <div>
              <strong>Trusted Local Businesses</strong>
              <span>Vetted. Rated. Reliable.</span>
            </div>
          </article>

          <article>
            <div className="trustIcon">◷</div>
            <div>
              <strong>24/7 Support</strong>
              <span>Help whenever you need it.</span>
            </div>
          </article>

          <article>
            <div className="trustIcon">☆</div>
            <div>
              <strong>4.9/5 Average Rating</strong>
              <span>From local customers.</span>
            </div>
          </article>
        </section>

        <section className="servicesSection" id="services">
          <div className="sectionHeading">
            <span>OUR SERVICES</span>
            <h2>Help when you need it most.</h2>
            <p>
              Simple, focused service options without the clutter. Choose what
              you need and find local help fast.
            </p>
          </div>

          <div className="serviceGrid">
            {serviceCards.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="serviceCard"
              >
                <div
                  className="servicePhoto"
                  style={{ backgroundImage: `url("${service.image}")` }}
                />
                <div className="serviceOverlay" />

                <div className="serviceContent">
                  <div className="serviceIcon">{service.icon}</div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <span className="learnMore">
                    Learn more <b>→</b>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="howSection">
          <div className="sectionHeading centred">
            <span>HOW IT WORKS</span>
            <h2>Quick. Simple. Done.</h2>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <article key={step.number} className="step">
                <div className="stepNumber">{step.number}</div>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="featuredBusiness">
          <div className="featuredCopy">
            <span>FEATURED BUSINESS</span>
            <h2>Total Tyres 24/7</h2>

            <div className="stars">
              ★★★★★ <small>4.9 customer rating</small>
            </div>

            <p>
              Mobile tyre fitting, puncture repairs, new and part-worn tyres,
              brakes, batteries and emergency call-outs across Liverpool and
              Merseyside.
            </p>

            <div className="featureTags">
              <span>Mobile Tyres</span>
              <span>Puncture Repairs</span>
              <span>Brakes</span>
              <span>Batteries</span>
              <span>24/7 Call Out</span>
            </div>
          </div>

          <div className="featuredActions">
            <a href="tel:07385182500" className="primaryButton">
              Call 07385 182 500 <span>→</span>
            </a>

            <Link
              href="/services/mobile-tyre-fitting"
              className="secondaryButton"
            >
              View Services <span>→</span>
            </Link>
          </div>
        </section>

        <section className="statsSection">
          <article>
            <strong>3,000+</strong>
            <span>Service Pages</span>
          </article>

          <article>
            <strong>50+</strong>
            <span>Areas Covered</span>
          </article>

          <article>
            <strong>24/7</strong>
            <span>Always Available</span>
          </article>

          <article>
            <strong>Fast</strong>
            <span>Local Response</span>
          </article>
        </section>

        <section className="areasSection" id="areas">
          <div className="sectionHeading">
            <span>LOCAL COVERAGE</span>
            <h2>Serving Liverpool and Merseyside.</h2>
          </div>

          <div className="areaLinks">
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

        <section className="businessCta">
          <div>
            <span>GROW YOUR BUSINESS</span>
            <h2>Get discovered by more local customers.</h2>
            <p>
              Create a free business listing and appear across AdForge local
              service pages.
            </p>
          </div>

          <Link href="/signup" className="primaryButton">
            List Business Free <span>→</span>
          </Link>
        </section>

        <footer className="footer">
          <div className="footerBrand">
            <Link href="/" className="brand">
              <span className="brandMark">AF</span>

              <span className="brandText">
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
            <Link href="/businesses">Local Businesses</Link>
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
          --bg: #020202;
          --panel: #0a0b0c;
          --panel-soft: #0e1012;
          --line: rgba(255,255,255,.11);
          --green: #9cf000;
          --green-bright: #b8ff18;
          --text: #f6f7f8;
          --muted: #a5abb1;
          --max: 1420px;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

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
          background: #020202;
        }

        .header {
          position: absolute;
          z-index: 30;
          top: 0;
          left: 50%;
          width: min(calc(100% - 64px), var(--max));
          height: 94px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .brandMark {
          color: #fff;
          font-size: 32px;
          font-style: italic;
          font-weight: 1000;
          letter-spacing: -5px;
        }

        .brandText {
          display: flex;
          flex-direction: column;
          color: #fff;
          font-size: 28px;
          line-height: .86;
          font-weight: 950;
          letter-spacing: -2px;
        }

        .brandText > span {
          color: var(--green);
        }

        .brandText small {
          margin-top: 8px;
          color: #8c9298;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2.2px;
        }

        .desktopNav {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .desktopNav a {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          padding: 0 17px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
          background: rgba(7,8,9,.6);
          color: rgba(255,255,255,.84);
          font-size: 11px;
          font-weight: 800;
        }

        .desktopNav a:hover {
          color: var(--green);
          border-color: rgba(156,240,0,.35);
        }

        .topButton,
        .primaryButton,
        .secondaryButton {
          min-height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 0 21px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 950;
          transition: transform .2s ease, border-color .2s ease;
        }

        .topButton,
        .primaryButton {
          border: 1px solid var(--green);
          color: #061000;
          background: linear-gradient(135deg, var(--green-bright), #78d500);
          box-shadow: 0 0 28px rgba(156,240,0,.16);
        }

        .topButton {
          min-height: 46px;
          margin-left: 6px;
        }

        .secondaryButton {
          border: 1px solid rgba(156,240,0,.42);
          color: #fff;
          background: rgba(3,4,5,.82);
        }

        .topButton:hover,
        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .mobileNav {
          display: none;
        }

        .hero {
          position: relative;
          min-height: 760px;
          display: flex;
          align-items: flex-end;
          isolation: isolate;
        }

        .heroImage {
          position: absolute;
          inset: 0;
          z-index: -3;
          background-image: url("/images/hero-recovery.png");
          background-size: cover;
          background-position: center 54%;
          background-repeat: no-repeat;
          filter: brightness(1.03) contrast(1.08) saturate(1.04);
        }

        .heroShade {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(
              90deg,
              rgba(0,0,0,.96) 0%,
              rgba(0,0,0,.76) 34%,
              rgba(0,0,0,.18) 62%,
              rgba(0,0,0,.04) 100%
            ),
            linear-gradient(
              0deg,
              #020202 0%,
              transparent 28%
            );
        }

        .heroInner {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
          padding: 150px 0 74px;
        }

        .heroCopy {
          width: 46%;
          max-width: 610px;
        }

        .eyebrow {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding: 10px 14px;
          border: 1px solid rgba(156,240,0,.36);
          border-radius: 999px;
          background: rgba(0,0,0,.58);
          color: #dfe6d4;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.7px;
        }

        .eyebrow i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 13px var(--green);
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(55px, 6.1vw, 92px);
          line-height: .9;
          letter-spacing: -5.5px;
          font-weight: 1000;
        }

        .hero h1 span {
          display: block;
          color: var(--green);
        }

        .heroCopy > p {
          max-width: 570px;
          margin: 24px 0 27px;
          color: #c7ccd1;
          font-size: 15px;
          line-height: 1.68;
        }

        .heroButtons {
          max-width: 600px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .freeLink {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 17px;
          color: #e0e3e6;
          font-size: 11px;
          font-weight: 850;
        }

        .freeLink span {
          color: var(--green);
        }

        .trustStrip {
          width: min(calc(100% - 64px), var(--max));
          margin: -20px auto 0;
          position: relative;
          z-index: 6;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--line);
          border-radius: 18px;
          background: rgba(10,11,12,.96);
          box-shadow: 0 18px 50px rgba(0,0,0,.35);
        }

        .trustStrip article {
          min-height: 96px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 28px;
          border-right: 1px solid var(--line);
        }

        .trustStrip article:last-child {
          border-right: 0;
        }

        .trustIcon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid rgba(156,240,0,.4);
          border-radius: 50%;
          color: var(--green);
          background: rgba(156,240,0,.06);
          font-size: 19px;
        }

        .trustStrip strong,
        .trustStrip span {
          display: block;
        }

        .trustStrip strong {
          margin-bottom: 5px;
          font-size: 12px;
        }

        .trustStrip span {
          color: var(--muted);
          font-size: 10px;
        }

        .servicesSection,
        .howSection,
        .areasSection {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
        }

        .servicesSection {
          padding: 82px 0 0;
        }

        .howSection,
        .areasSection {
          padding: 88px 0 0;
        }

        .sectionHeading {
          max-width: 700px;
        }

        .sectionHeading.centred {
          margin: 0 auto;
          text-align: center;
        }

        .sectionHeading > span,
        .featuredCopy > span,
        .businessCta > div > span {
          display: block;
          margin-bottom: 10px;
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .sectionHeading h2,
        .featuredCopy h2,
        .businessCta h2 {
          margin: 0;
          font-size: clamp(38px, 4.4vw, 62px);
          line-height: .98;
          letter-spacing: -3.6px;
        }

        .sectionHeading p {
          max-width: 600px;
          margin: 16px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .serviceGrid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .serviceCard {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--panel);
          transition: transform .25s ease, border-color .25s ease;
        }

        .serviceCard:hover {
          transform: translateY(-6px);
          border-color: rgba(156,240,0,.4);
        }

        .servicePhoto {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }

        .serviceOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,.03) 0%,
              rgba(0,0,0,.2) 37%,
              rgba(5,6,7,.95) 72%,
              #090a0b 100%
            );
        }

        .serviceContent {
          position: absolute;
          inset: auto 0 0;
          z-index: 2;
          padding: 26px;
        }

        .serviceIcon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          margin-bottom: 21px;
          border: 1px solid rgba(156,240,0,.34);
          border-radius: 50%;
          color: var(--green);
          background: rgba(156,240,0,.08);
          font-size: 20px;
        }

        .serviceContent h3 {
          margin: 0 0 10px;
          font-size: 23px;
          letter-spacing: -1.2px;
        }

        .serviceContent p {
          min-height: 64px;
          margin: 0 0 22px;
          color: #b5bbc0;
          font-size: 12px;
          line-height: 1.65;
        }

        .learnMore {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--green);
          font-size: 11px;
          font-weight: 900;
        }

        .steps {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .step {
          min-height: 190px;
          display: flex;
          align-items: flex-start;
          gap: 19px;
          padding: 28px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: var(--panel);
        }

        .stepNumber {
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid rgba(156,240,0,.45);
          border-radius: 50%;
          color: var(--green);
          font-size: 12px;
          font-weight: 950;
        }

        .step h3 {
          margin: 2px 0 9px;
          font-size: 20px;
        }

        .step p {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .featuredBusiness {
          width: min(calc(100% - 64px), var(--max));
          margin: 88px auto 0;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 48px;
          padding: 38px;
          border: 1px solid rgba(156,240,0,.28);
          border-radius: 20px;
          background:
            linear-gradient(90deg, rgba(8,9,10,.98), rgba(8,9,10,.83)),
            url("/images/mobile-tyre-fitting.jpg") right center / 48% auto no-repeat;
        }

        .featuredCopy {
          max-width: 750px;
        }

        .stars {
          margin-top: 12px;
          color: #ffd92b;
          font-size: 14px;
          letter-spacing: 2px;
        }

        .stars small {
          margin-left: 9px;
          color: #c3c8cd;
          font-size: 10px;
          letter-spacing: 0;
        }

        .featuredCopy > p {
          max-width: 690px;
          margin: 16px 0;
          color: #bdc3c8;
          font-size: 12px;
          line-height: 1.65;
        }

        .featureTags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .featureTags span {
          padding: 8px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: #dfe3e6;
          background: rgba(0,0,0,.42);
          font-size: 9px;
        }

        .featuredActions {
          min-width: 240px;
          display: grid;
          gap: 11px;
        }

        .statsSection {
          width: min(calc(100% - 64px), var(--max));
          margin: 20px auto 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--panel);
        }

        .statsSection article {
          min-height: 118px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-right: 1px solid var(--line);
          text-align: center;
        }

        .statsSection article:last-child {
          border-right: 0;
        }

        .statsSection strong {
          margin-bottom: 6px;
          color: var(--green);
          font-size: 31px;
          letter-spacing: -1px;
        }

        .statsSection span {
          color: var(--muted);
          font-size: 10px;
        }

        .areaLinks {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--line);
        }

        .areaLinks a {
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 17px;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          color: #e2e5e8;
          font-size: 11px;
          font-weight: 800;
        }

        .areaLinks a:nth-child(4n) {
          border-right: 0;
        }

        .areaLinks a span {
          color: var(--green);
        }

        .businessCta {
          width: min(calc(100% - 64px), var(--max));
          margin: 88px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 42px;
          padding: 38px;
          border: 1px solid rgba(156,240,0,.3);
          border-radius: 20px;
          background:
            linear-gradient(100deg, rgba(156,240,0,.09), transparent 46%),
            var(--panel);
        }

        .businessCta > div {
          max-width: 770px;
        }

        .businessCta p {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .footer {
          width: min(calc(100% - 64px), var(--max));
          margin: 88px auto 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 45px;
          padding: 42px 0 28px;
          border-top: 1px solid var(--line);
        }

        .footerBrand p {
          max-width: 390px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.65;
        }

        .footerLinks {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 28px;
        }

        .footerLinks a {
          color: var(--muted);
          font-size: 10px;
        }

        .footerLinks a:hover {
          color: var(--green);
        }

        .footerBottom {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          padding-top: 21px;
          border-top: 1px solid var(--line);
          color: #71777d;
          font-size: 9px;
        }

        @media (max-width: 1050px) {
          .desktopNav {
            display: none;
          }

          .serviceGrid,
          .steps {
            grid-template-columns: 1fr;
          }

          .serviceCard {
            min-height: 390px;
          }

          .featuredBusiness {
            grid-template-columns: 1fr;
          }

          .featuredActions {
            min-width: 0;
            max-width: 420px;
          }

          .statsSection {
            grid-template-columns: repeat(2, 1fr);
          }

          .statsSection article:nth-child(2) {
            border-right: 0;
          }

          .statsSection article:nth-child(-n+2) {
            border-bottom: 1px solid var(--line);
          }

          .areaLinks {
            grid-template-columns: repeat(2, 1fr);
          }

          .areaLinks a:nth-child(4n) {
            border-right: 1px solid var(--line);
          }

          .areaLinks a:nth-child(even) {
            border-right: 0;
          }
        }

        @media (max-width: 760px) {
          .header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 92px;
            padding: 0 20px;
            transform: none;
            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,.95),
                rgba(0,0,0,.62),
                transparent
              );
          }

          .brand {
            gap: 9px;
          }

          .brandMark {
            font-size: 24px;
          }

          .brandText {
            font-size: 23px;
          }

          .brandText small {
            font-size: 5px;
            letter-spacing: 1.5px;
          }

          .topButton {
            min-height: 43px;
            margin-left: auto;
            padding: 0 15px;
            border-radius: 999px;
            gap: 13px;
            white-space: nowrap;
            font-size: 10px;
          }

          .mobileNav {
            position: absolute;
            z-index: 29;
            top: 92px;
            left: 0;
            width: 100%;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 7px 16px 10px;
            scrollbar-width: none;
            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,.72),
                rgba(0,0,0,.28),
                transparent
              );
          }

          .mobileNav::-webkit-scrollbar {
            display: none;
          }

          .mobileNav a {
            flex: 0 0 auto;
            min-height: 35px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 14px;
            border: 1px solid rgba(255,255,255,.15);
            border-radius: 999px;
            background: rgba(4,5,6,.78);
            color: rgba(255,255,255,.88);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            font-size: 10px;
            font-weight: 850;
          }

          .mobileNav a:first-child {
            border-color: rgba(156,240,0,.45);
            color: var(--green);
          }

          .hero {
            min-height: auto;
            display: block;
            padding-top: 0;
            background: #020202;
          }

          .heroImage {
            position: relative;
            inset: auto;
            z-index: 1;
            width: 100%;
            height: 575px;
            background-position: 56% center;
          }

          .heroImage::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,.03) 0%,
                rgba(0,0,0,.01) 64%,
                rgba(2,2,2,.92) 100%
              );
          }

          .heroShade {
            display: none;
          }

          .heroInner {
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .heroCopy {
            width: 100%;
            max-width: none;
            padding: 31px 26px 44px;
            background: #020202;
          }

          .eyebrow {
            margin-bottom: 18px;
            padding: 9px 12px;
            font-size: 7px;
            letter-spacing: 1.2px;
          }

          .hero h1 {
            max-width: 620px;
            font-size: clamp(45px, 12.8vw, 58px);
            line-height: .92;
            letter-spacing: -3.8px;
          }

          .heroCopy > p {
            max-width: 620px;
            margin: 21px 0 24px;
            font-size: 15px;
            line-height: 1.72;
          }

          .heroButtons {
            grid-template-columns: 1fr;
            max-width: none;
          }

          .topButton,
          .primaryButton,
          .secondaryButton {
            min-height: 63px;
            font-size: 14px;
          }

          .topButton {
            min-height: 43px;
            font-size: 10px;
          }

          .trustStrip,
          .servicesSection,
          .howSection,
          .areasSection,
          .featuredBusiness,
          .statsSection,
          .businessCta,
          .footer {
            width: calc(100% - 32px);
          }

          .trustStrip {
            margin-top: 18px;
            grid-template-columns: 1fr;
          }

          .trustStrip article {
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .trustStrip article:last-child {
            border-bottom: 0;
          }

          .servicesSection {
            padding-top: 70px;
          }

          .howSection,
          .areasSection {
            padding-top: 72px;
          }

          .serviceCard {
            min-height: 430px;
          }

          .featuredBusiness {
            margin-top: 72px;
            padding: 27px 22px;
          }

          .statsSection {
            grid-template-columns: repeat(2, 1fr);
          }

          .areaLinks {
            grid-template-columns: 1fr;
          }

          .areaLinks a {
            border-right: 0 !important;
          }

          .businessCta {
            margin-top: 72px;
            align-items: flex-start;
            flex-direction: column;
            padding: 28px 23px;
          }

          .footer {
            margin-top: 72px;
            grid-template-columns: 1fr;
          }

          .footerBottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }
        }

        @media (max-width: 390px) {
          .heroImage {
            height: 525px;
            background-position: 57% center;
          }

          .hero h1 {
            font-size: 43px;
            letter-spacing: -3px;
          }

          .topButton {
            padding: 0 12px;
            font-size: 9px;
          }
        }
      `}</style>
    </>
  );
}
