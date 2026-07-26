import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AdForge | Mobile Tyres, Recovery & Local Services",
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
    title: "Mobile Tyre Fitting",
    description:
      "Puncture repairs, replacement tyres and emergency roadside fitting.",
    href: "/services/mobile-tyre-fitting",
    image: "/images/mobile-tyre-fitting.jpg",
    button: "Find tyre fitting",
  },
  {
    title: "Vehicle Recovery",
    description:
      "Breakdown recovery, accident recovery and vehicle transport.",
    href: "/services/vehicle-recovery",
    image: "/images/recovery-truck.jpg",
    button: "Find recovery",
  },
  {
    title: "Local Businesses",
    description:
      "Browse trusted local businesses and contact providers directly.",
    href: "/businesses",
    image: "/images/hero-recovery.png",
    button: "Browse businesses",
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

          <div className="heroContent">
            <div className="eyebrow">
              <i />
              24/7 MOBILE TYRE &amp; RECOVERY SERVICES
            </div>

            <h1>
              Find Local Help.
              <span>Get Moving Again.</span>
            </h1>

            <p>
              Mobile tyre fitting, vehicle recovery and trusted local
              businesses across Liverpool, Wirral and Merseyside.
            </p>

            <div className="heroButtons">
              <Link
                href="/services/mobile-tyre-fitting"
                className="primaryButton"
              >
                Find Mobile Tyres <span>→</span>
              </Link>

              <Link
                href="/services/vehicle-recovery"
                className="secondaryButton"
              >
                Find Vehicle Recovery <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="quickStrip">
          <article>
            <strong>24/7</strong>
            <span>Emergency help</span>
          </article>

          <article>
            <strong>Local</strong>
            <span>Liverpool &amp; Merseyside</span>
          </article>

          <article>
            <strong>Direct</strong>
            <span>Contact providers</span>
          </article>
        </section>

        <section className="servicesSection" id="services">
          <div className="sectionHeading">
            <span>POPULAR SERVICES</span>
            <h2>What do you need?</h2>
          </div>

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

                <div className="serviceBody">
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>

                  <span>
                    {service.button} <b>→</b>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="featuredBusiness">
          <div className="featuredCopy">
            <span>FEATURED BUSINESS</span>
            <h2>Total Tyres 24/7</h2>

            <p>
              Mobile tyre fitting, puncture repairs, brakes, batteries, wheel
              alignment and emergency call-outs across Liverpool.
            </p>

            <div className="tags">
              <span>Tyres</span>
              <span>Punctures</span>
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

        <section className="simpleSteps">
          <div className="sectionHeading centred">
            <span>HOW IT WORKS</span>
            <h2>Search. Choose. Contact.</h2>
          </div>

          <div className="steps">
            <article>
              <b>01</b>
              <h3>Search</h3>
              <p>Choose a service and your area.</p>
            </article>

            <article>
              <b>02</b>
              <h3>Choose</h3>
              <p>View local businesses operating nearby.</p>
            </article>

            <article>
              <b>03</b>
              <h3>Contact</h3>
              <p>Call the provider directly and get help.</p>
            </article>
          </div>
        </section>

        <section className="areasSection" id="areas">
          <div className="sectionHeading">
            <span>LOCAL COVERAGE</span>
            <h2>Areas we cover.</h2>
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

        <section className="finalCta">
          <div>
            <span>FOR LOCAL BUSINESSES</span>
            <h2>Get listed on AdForge.</h2>
            <p>
              Create a free business listing and get discovered by more local
              customers.
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
              Connecting local customers with trusted tyre, recovery and
              business services.
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
          --bg: #000;
          --panel: #090a0b;
          --line: rgba(255,255,255,.11);
          --green: #9cf000;
          --green-bright: #b8ff18;
          --text: #f7f7f7;
          --muted: #a8adb3;
          --max: 1380px;
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
          background: #000;
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
          gap: 28px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
        }

        .brandMark {
          color: #fff;
          font-size: 31px;
          font-style: italic;
          font-weight: 1000;
          letter-spacing: -5px;
        }

        .brandText {
          display: flex;
          flex-direction: column;
          color: #fff;
          font-size: 27px;
          line-height: .86;
          font-weight: 950;
          letter-spacing: -2px;
        }

        .brandText > span {
          color: var(--green);
        }

        .brandText small {
          margin-top: 8px;
          color: #8b9197;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2.1px;
        }

        .desktopNav {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 23px;
        }

        .desktopNav a {
          color: rgba(255,255,255,.84);
          font-size: 11px;
          font-weight: 800;
        }

        .desktopNav a:hover {
          color: var(--green);
        }

        .topButton,
        .primaryButton,
        .secondaryButton {
          min-height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 21px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 950;
          transition: .2s ease;
        }

        .topButton,
        .primaryButton {
          border: 1px solid var(--green);
          color: #061000;
          background: linear-gradient(135deg, var(--green-bright), #79d600);
        }

        .topButton {
          min-height: 46px;
          margin-left: 8px;
        }

        .secondaryButton {
          border: 1px solid rgba(156,240,0,.42);
          color: #fff;
          background: rgba(0,0,0,.72);
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
          min-height: 720px;
          display: flex;
          align-items: flex-end;
          isolation: isolate;
        }

        .heroImage {
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            url("/images/hero-recovery.png") center 54% / cover no-repeat;
          filter: brightness(1.03) contrast(1.07) saturate(1.03);
        }

        .heroShade {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(
              90deg,
              rgba(0,0,0,.95) 0%,
              rgba(0,0,0,.76) 34%,
              rgba(0,0,0,.18) 62%,
              rgba(0,0,0,.02) 100%
            ),
            linear-gradient(
              0deg,
              #000 0%,
              transparent 28%
            );
        }

        .heroContent {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
          padding: 145px 0 72px;
        }

        .heroContent > * {
          max-width: 600px;
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
          font-size: clamp(55px, 6vw, 88px);
          line-height: .9;
          letter-spacing: -5px;
          font-weight: 1000;
        }

        .hero h1 span {
          display: block;
          color: var(--green);
        }

        .hero p {
          margin: 24px 0 27px;
          color: #c6cbd0;
          font-size: 15px;
          line-height: 1.68;
        }

        .heroButtons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .quickStrip {
          width: min(calc(100% - 64px), var(--max));
          margin: -18px auto 0;
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--line);
          border-radius: 16px;
          background: #090a0b;
        }

        .quickStrip article {
          min-height: 86px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 19px 25px;
          border-right: 1px solid var(--line);
        }

        .quickStrip article:last-child {
          border-right: 0;
        }

        .quickStrip strong {
          margin-bottom: 4px;
          color: var(--green);
          font-size: 20px;
        }

        .quickStrip span {
          color: var(--muted);
          font-size: 10px;
        }

        .servicesSection,
        .simpleSteps,
        .areasSection {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
        }

        .servicesSection {
          padding-top: 76px;
        }

        .simpleSteps,
        .areasSection {
          padding-top: 82px;
        }

        .sectionHeading {
          max-width: 650px;
        }

        .sectionHeading.centred {
          margin: 0 auto;
          text-align: center;
        }

        .sectionHeading > span,
        .featuredCopy > span,
        .finalCta > div > span {
          display: block;
          margin-bottom: 10px;
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .sectionHeading h2,
        .featuredCopy h2,
        .finalCta h2 {
          margin: 0;
          font-size: clamp(38px, 4.3vw, 60px);
          line-height: .98;
          letter-spacing: -3.5px;
        }

        .serviceGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .serviceCard {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: var(--panel);
          transition: .25s ease;
        }

        .serviceCard:hover {
          transform: translateY(-5px);
          border-color: rgba(156,240,0,.38);
        }

        .serviceImage {
          height: 215px;
          background-position: center;
          background-size: cover;
        }

        .serviceBody {
          min-height: 190px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 23px;
        }

        .serviceBody h3 {
          margin: 0 0 10px;
          font-size: 23px;
          letter-spacing: -1px;
        }

        .serviceBody p {
          margin: 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .serviceBody > span {
          margin-top: 25px;
          display: flex;
          justify-content: space-between;
          color: var(--green);
          font-size: 11px;
          font-weight: 900;
        }

        .featuredBusiness {
          width: min(calc(100% - 64px), var(--max));
          margin: 82px auto 0;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 44px;
          padding: 34px;
          border: 1px solid rgba(156,240,0,.28);
          border-radius: 18px;
          background:
            linear-gradient(90deg, rgba(8,9,10,.98), rgba(8,9,10,.86)),
            url("/images/mobile-tyre-fitting.jpg") right center / 48% auto no-repeat;
        }

        .featuredCopy {
          max-width: 700px;
        }

        .featuredCopy > p {
          max-width: 650px;
          margin: 15px 0;
          color: #bfc4c9;
          font-size: 12px;
          line-height: 1.65;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tags span {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: #e1e4e6;
          background: rgba(0,0,0,.42);
          font-size: 9px;
        }

        .featuredActions {
          min-width: 235px;
          display: grid;
          gap: 10px;
        }

        .steps {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .steps article {
          padding: 25px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--panel);
        }

        .steps b {
          color: var(--green);
          font-size: 11px;
        }

        .steps h3 {
          margin: 15px 0 8px;
          font-size: 20px;
        }

        .steps p {
          margin: 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .areaGrid {
          margin-top: 27px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--line);
        }

        .areaGrid a {
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          color: #e2e5e8;
          font-size: 11px;
          font-weight: 800;
        }

        .areaGrid a:nth-child(4n) {
          border-right: 0;
        }

        .areaGrid a span {
          color: var(--green);
        }

        .finalCta {
          width: min(calc(100% - 64px), var(--max));
          margin: 82px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
          padding: 34px;
          border: 1px solid rgba(156,240,0,.3);
          border-radius: 18px;
          background: #090a0b;
        }

        .finalCta > div {
          max-width: 700px;
        }

        .finalCta p {
          margin: 13px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .footer {
          width: min(calc(100% - 64px), var(--max));
          margin: 82px auto 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 42px;
          padding: 40px 0 28px;
          border-top: 1px solid var(--line);
        }

        .footerBrand p {
          max-width: 380px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .footerLinks {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 11px 28px;
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
          color: #73787d;
          font-size: 9px;
        }

        @media (max-width: 1020px) {
          .desktopNav {
            display: none;
          }

          .serviceGrid,
          .steps {
            grid-template-columns: 1fr;
          }

          .featuredBusiness {
            grid-template-columns: 1fr;
          }

          .featuredActions {
            min-width: 0;
            max-width: 420px;
          }

          .areaGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .areaGrid a:nth-child(4n) {
            border-right: 1px solid var(--line);
          }

          .areaGrid a:nth-child(even) {
            border-right: 0;
          }
        }

        @media (max-width: 760px) {
          .header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 88px;
            padding: 0 19px;
            transform: none;
            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,.95),
                rgba(0,0,0,.55),
                transparent
              );
          }

          .brand {
            gap: 8px;
          }

          .brandMark {
            font-size: 23px;
          }

          .brandText {
            font-size: 22px;
          }

          .brandText small {
            font-size: 5px;
            letter-spacing: 1.4px;
          }

          .topButton {
            min-height: 42px;
            margin-left: auto;
            padding: 0 14px;
            border-radius: 999px;
            gap: 12px;
            font-size: 10px;
            white-space: nowrap;
          }

          .mobileNav {
            position: absolute;
            z-index: 29;
            top: 88px;
            left: 0;
            width: 100%;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 6px 15px 9px;
            scrollbar-width: none;
          }

          .mobileNav::-webkit-scrollbar {
            display: none;
          }

          .mobileNav a {
            flex: 0 0 auto;
            min-height: 34px;
            display: inline-flex;
            align-items: center;
            padding: 0 13px;
            border: 1px solid rgba(255,255,255,.15);
            border-radius: 999px;
            background: rgba(0,0,0,.7);
            color: rgba(255,255,255,.9);
            backdrop-filter: blur(11px);
            -webkit-backdrop-filter: blur(11px);
            font-size: 10px;
            font-weight: 850;
          }

          .mobileNav a:first-child {
            color: var(--green);
            border-color: rgba(156,240,0,.42);
          }

          .hero {
            min-height: auto;
            display: block;
            background: #000;
          }

          .heroImage {
            position: relative;
            inset: auto;
            z-index: 1;
            width: 100%;
            height: 430px;
            background-position: 56% center;
          }

          .heroShade {
            display: none;
          }

          .heroContent {
            width: 100%;
            margin: 0;
            padding: 27px 24px 38px;
            background: #000;
          }

          .eyebrow {
            margin-bottom: 17px;
            font-size: 7px;
            letter-spacing: 1.1px;
          }

          .hero h1 {
            font-size: clamp(43px, 12.2vw, 56px);
            line-height: .92;
            letter-spacing: -3.6px;
          }

          .hero p {
            margin: 20px 0 23px;
            font-size: 14px;
            line-height: 1.68;
          }

          .heroButtons {
            grid-template-columns: 1fr;
          }

          .primaryButton,
          .secondaryButton {
            min-height: 61px;
            font-size: 13px;
          }

          .quickStrip,
          .servicesSection,
          .simpleSteps,
          .areasSection,
          .featuredBusiness,
          .finalCta,
          .footer {
            width: calc(100% - 30px);
          }

          .quickStrip {
            margin-top: 15px;
            grid-template-columns: 1fr;
          }

          .quickStrip article {
            min-height: 72px;
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .quickStrip article:last-child {
            border-bottom: 0;
          }

          .servicesSection {
            padding-top: 62px;
          }

          .simpleSteps,
          .areasSection {
            padding-top: 66px;
          }

          .serviceGrid {
            gap: 14px;
          }

          .serviceCard {
            display: grid;
            grid-template-columns: 42% 58%;
            min-height: 170px;
          }

          .serviceImage {
            height: 100%;
            min-height: 170px;
          }

          .serviceBody {
            min-height: 170px;
            padding: 18px;
          }

          .serviceBody h3 {
            font-size: 19px;
          }

          .serviceBody p {
            font-size: 10px;
          }

          .serviceBody > span {
            margin-top: 18px;
            font-size: 10px;
          }

          .featuredBusiness {
            margin-top: 66px;
            padding: 25px 21px;
            background: #090a0b;
          }

          .featuredCopy h2,
          .sectionHeading h2,
          .finalCta h2 {
            font-size: 38px;
            letter-spacing: -2.8px;
          }

          .steps {
            gap: 12px;
          }

          .steps article {
            padding: 21px;
          }

          .areaGrid {
            grid-template-columns: 1fr;
          }

          .areaGrid a {
            border-right: 0 !important;
          }

          .finalCta {
            margin-top: 66px;
            align-items: flex-start;
            flex-direction: column;
            padding: 26px 22px;
          }

          .footer {
            margin-top: 66px;
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
            height: 395px;
            background-position: 57% center;
          }

          .hero h1 {
            font-size: 42px;
            letter-spacing: -3px;
          }

          .topButton {
            padding: 0 11px;
            font-size: 9px;
          }

          .serviceCard {
            grid-template-columns: 40% 60%;
          }
        }
      `}</style>
    </>
  );
}
