import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",

  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, vehicle recovery, breakdown recovery and local roadside assistance across Liverpool, Wirral and Merseyside.",

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

const ADFORGE_PHONE = "+447576579923";
const DISPLAY_PHONE = "+44 7576 579923";

const quickServices = [
  {
    title: "Mobile Tyres",
    description: "Emergency mobile tyre fitting and roadside tyre replacement.",
    href: "/services/mobile-tyre-fitting",
  },
  {
    title: "Puncture Repair",
    description: "Local puncture repairs and emergency tyre assistance.",
    href: "/services/mobile-tyre-fitting",
  },
  {
    title: "Vehicle Recovery",
    description: "24-hour breakdown recovery and vehicle transport.",
    href: "/services/vehicle-recovery",
  },
  {
    title: "Roadside Help",
    description: "Fast roadside assistance across Liverpool and Merseyside.",
    href: "/services/vehicle-recovery",
  },
];

const tyreServices = [
  "24-hour mobile tyre fitting",
  "Emergency tyre repair",
  "Puncture repairs",
  "New and part-worn tyres",
  "Roadside tyre replacement",
  "Locking-wheel-nut removal",
  "Wheel balancing",
];

const recoveryServices = [
  "24-hour vehicle recovery",
  "Breakdown recovery",
  "Accident recovery",
  "Towing service",
  "Roadside assistance",
  "Vehicle transport",
  "Liverpool, Wirral and Merseyside coverage",
];

const serviceAreas = [
  "Liverpool",
  "Wirral",
  "Bootle",
  "Huyton",
  "Kirkby",
  "Knowsley",
  "Sefton",
  "Wallasey",
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
    potentialAction: {
      "@type": "SearchAction",
      target: "https://adforge.uk/businesses?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <main className="page">
        <header className="topbar">
          <Link href="/" className="brand" aria-label="AdForge homepage">
            <span className="brandMark">AF</span>

            <span className="brandWords">
              <strong>
                Ad<span>Forge</span>
              </strong>

              <small>LOCAL SERVICE PLATFORM</small>
            </span>
          </Link>

          <nav className="desktopNav" aria-label="Main navigation">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <div className="headerActions">
            <a
              href={`tel:${ADFORGE_PHONE}`}
              className="headerCallButton"
              aria-label={`Call AdForge on ${DISPLAY_PHONE}`}
            >
              <span>CALL NOW</span>
              <strong>{DISPLAY_PHONE}</strong>
            </a>

            <Link href="/signup" className="listButton">
              List Business Free
              <b>→</b>
            </Link>
          </div>
        </header>

        <nav className="mobileNav" aria-label="Mobile navigation">
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
            <div className="servicePill">
              <span />
              24/7 MOBILE TYRE &amp; RECOVERY SERVICES
            </div>

            <h1>
              Mobile Tyre Fitting &amp;
              <span>Vehicle Recovery Liverpool</span>
            </h1>

            <h2>Find local help. Get moving again.</h2>

            <p className="heroIntro">
              AdForge helps drivers find 24-hour mobile tyre fitting, emergency
              tyre repair, puncture repairs, mobile tyres, new and part-worn
              tyres, vehicle recovery, breakdown recovery, towing services and
              roadside assistance across Liverpool, Wirral and Merseyside.
            </p>

            <div className="heroButtons">
              <a href={`tel:${ADFORGE_PHONE}`} className="primaryButton">
                <span>Call AdForge</span>
                <b>→</b>
              </a>

              <Link
                href="/services/mobile-tyre-fitting"
                className="secondaryButton"
              >
                <span>Find Mobile Tyres</span>
                <b>→</b>
              </Link>

              <Link
                href="/services/vehicle-recovery"
                className="secondaryButton"
              >
                <span>Find Recovery</span>
                <b>→</b>
              </Link>
            </div>

            <div className="trustRow">
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
                <span>Call through AdForge</span>
              </div>
            </div>
          </div>
        </section>

        <section className="quickFind" id="services">
          <div className="sectionHeading">
            <span>FIND LOCAL SERVICES</span>

            <h2>What help do you need?</h2>

            <p>
              Choose a service below to browse active AdForge tyre and recovery
              pages near you.
            </p>
          </div>

          <div className="serviceGrid">
            {quickServices.map((service) => (
              <Link
                href={service.href}
                className="serviceCard"
                key={service.title}
              >
                <div className="serviceIcon">AF</div>

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                <b>→</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="serviceInformation">
          <article className="informationCard">
            <div className="cardImage tyreImage">
              <span>MOBILE TYRE SERVICES</span>
            </div>

            <div className="cardContent">
              <span className="cardKicker">MOBILE TYRE FITTING</span>

              <h2>24-hour mobile tyre fitting across Liverpool</h2>

              <p>
                AdForge helps customers find emergency mobile tyre fitting,
                puncture repairs, emergency tyre repair and roadside tyre
                replacement. Local tyre services may provide new and part-worn
                tyres, wheel balancing and locking-wheel-nut removal at your
                home, workplace or roadside location.
              </p>

              <details>
                <summary>
                  View mobile tyre services
                  <b>+</b>
                </summary>

                <div className="detailContent">
                  {tyreServices.map((service) => (
                    <span key={service}>✓ {service}</span>
                  ))}
                </div>
              </details>

              <div className="cardButtons">
                <Link
                  href="/services/mobile-tyre-fitting"
                  className="smallPrimaryButton"
                >
                  Browse Tyre Areas
                  <b>→</b>
                </Link>

                <a
                  href={`tel:${ADFORGE_PHONE}`}
                  className="smallSecondaryButton"
                >
                  Call Now
                </a>
              </div>
            </div>
          </article>

          <article className="informationCard reverse">
            <div className="cardImage recoveryImage">
              <span>RECOVERY SERVICES</span>
            </div>

            <div className="cardContent">
              <span className="cardKicker">VEHICLE RECOVERY</span>

              <h2>Breakdown recovery and roadside assistance</h2>

              <p>
                Find 24-hour vehicle recovery, towing services, accident
                recovery, roadside assistance and vehicle transport through
                AdForge. Calls come through the AdForge number so the job can be
                directed to an approved local provider covering Liverpool,
                Wirral or Merseyside.
              </p>

              <details>
                <summary>
                  View recovery services
                  <b>+</b>
                </summary>

                <div className="detailContent">
                  {recoveryServices.map((service) => (
                    <span key={service}>✓ {service}</span>
                  ))}
                </div>
              </details>

              <div className="cardButtons">
                <Link
                  href="/services/vehicle-recovery"
                  className="smallPrimaryButton"
                >
                  Browse Recovery Areas
                  <b>→</b>
                </Link>

                <a
                  href={`tel:${ADFORGE_PHONE}`}
                  className="smallSecondaryButton"
                >
                  Call Now
                </a>
              </div>
            </div>
          </article>
        </section>

        <section className="featuredBusiness">
          <div className="featuredImageWrap">
            <div className="featuredBadge">FEATURED LOCAL PROVIDER</div>

            <img
              src="/images/totaaltyres.jpeg"
              alt="Total Tyres mobile tyre fitting van in Liverpool"
              className="featuredImage"
            />
          </div>

          <div className="featuredContent">
            <span className="featuredKicker">
              LOCAL BUSINESS COVERING LIVERPOOL &amp; MERSEYSIDE
            </span>

            <h2>Total Tyres &amp; Recovery 247 Ltd</h2>

            <h3>Mobile Tyre Fitting &amp; Tyre Support</h3>

            <p>
              Local mobile tyre fitting provider offering emergency tyre
              replacement, puncture repairs, new and part-worn tyres, wheel
              balancing, locking nut removal and roadside tyre support across
              Liverpool and nearby areas.
            </p>

            <div className="featuredServices">
              <span>✓ Mobile Tyre Fitting</span>
              <span>✓ Puncture Repairs</span>
              <span>✓ New &amp; Part-Worn Tyres</span>
              <span>✓ Emergency Tyre Replacement</span>
              <span>✓ Wheel Balancing</span>
              <span>✓ Locking Nut Removal</span>
            </div>

            <div className="coverageBox">
              <strong>Coverage:</strong> Liverpool, Wirral &amp; Merseyside
            </div>

            <div className="featuredButtons">
              <a href={`tel:${ADFORGE_PHONE}`} className="featuredPrimary">
                Call Through AdForge
                <b>→</b>
              </a>

              <Link
                href="/services/mobile-tyre-fitting"
                className="featuredSecondary"
              >
                View Services
                <b>→</b>
              </Link>
            </div>

            <small>
              Calls and enquiries go through AdForge so job details can be
              collected and assigned to the correct provider.
            </small>
          </div>
        </section>

        <section className="areasSection" id="areas">
          <div className="sectionHeading">
            <span>LOCAL COVERAGE</span>

            <h2>Tyre and recovery services near you</h2>

            <p>
              AdForge service pages cover Liverpool, Wirral, Merseyside and
              surrounding towns.
            </p>
          </div>

          <div className="areaLinks">
            {serviceAreas.map((area) => (
              <Link
                href={`/services/mobile-tyre-fitting`}
                key={area}
              >
                {area}
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="businessCta">
          <div>
            <span>FOR LOCAL BUSINESSES</span>

            <h2>List your business free on AdForge</h2>

            <p>
              Create a public business listing, appear in the AdForge directory
              and upgrade later to advertising tools or the AdForge AI
              receptionist.
            </p>
          </div>

          <Link href="/signup" className="ctaButton">
            Create Free Listing
            <b>→</b>
          </Link>
        </section>

        <footer className="footer">
          <Link href="/" className="footerBrand">
            Ad<span>Forge</span>
          </Link>

          <p>
            Mobile tyre fitting, vehicle recovery and trusted local services
            across Liverpool, Wirral and Merseyside.
          </p>

          <div>
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
          --black: #000000;
          --panel: #080a0d;
          --panel-light: #0d1014;
          --line: rgba(255, 255, 255, 0.11);
          --muted: #a6abb2;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #000000;
        }

        body {
          margin: 0;
          background: #000000;
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background: #000000;
        }

        .topbar {
          position: absolute;
          z-index: 30;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(calc(100% - 56px), 1380px);
          min-height: 106px;
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .brand {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brandMark {
          font-size: 35px;
          font-style: italic;
          font-weight: 1000;
          letter-spacing: -5px;
        }

        .brandWords {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
        }

        .brandWords strong {
          font-size: 28px;
          font-weight: 1000;
          letter-spacing: -2px;
        }

        .brandWords strong span {
          color: var(--green);
        }

        .brandWords small {
          margin-top: 8px;
          color: #90959c;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2.3px;
        }

        .desktopNav {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .desktopNav a {
          padding: 12px 15px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 999px;
          background: rgba(3, 4, 6, 0.76);
          backdrop-filter: blur(15px);
          font-size: 12px;
          font-weight: 850;
          white-space: nowrap;
        }

        .desktopNav a:hover {
          border-color: rgba(50, 255, 115, 0.45);
          color: var(--green);
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .headerCallButton {
          min-width: 170px;
          min-height: 64px;
          padding: 9px 17px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          background: rgba(5, 7, 10, 0.86);
          backdrop-filter: blur(18px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .headerCallButton span {
          color: var(--green);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .headerCallButton strong {
          margin-top: 4px;
          font-size: 15px;
          font-weight: 950;
        }

        .listButton {
          min-height: 50px;
          padding: 0 19px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid var(--green);
          border-radius: 999px;
          background: var(--green);
          color: #031006;
          font-size: 12px;
          font-weight: 950;
          white-space: nowrap;
        }

        .listButton b {
          font-size: 17px;
        }

        .mobileNav {
          display: none;
        }

        .hero {
          position: relative;
          min-height: 1080px;
          display: flex;
          align-items: flex-end;
          background: #000000;
        }

        .heroImage {
          position: absolute;
          inset: 0 0 auto;
          height: 780px;
          background-image: url("/images/hero-recovery.png");
          background-size: cover;
          background-position: center 42%;
          background-repeat: no-repeat;
        }

        .heroShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.02) 0%,
              rgba(0, 0, 0, 0.03) 48%,
              #000000 73%,
              #000000 100%
            ),
            radial-gradient(
              circle at 20% 70%,
              rgba(50, 255, 115, 0.09),
              transparent 28%
            );
        }

        .heroContent {
          position: relative;
          z-index: 4;
          width: min(calc(100% - 56px), 1280px);
          margin: 0 auto;
          padding: 0 0 85px;
        }

        .servicePill {
          width: max-content;
          max-width: 100%;
          padding: 13px 21px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(50, 255, 115, 0.42);
          border-radius: 999px;
          background: rgba(2, 5, 3, 0.72);
          color: #ffffff;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .servicePill span {
          width: 10px;
          height: 10px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 17px rgba(50, 255, 115, 0.9);
        }

        .hero h1 {
          max-width: 920px;
          margin: 30px 0 0;
          font-size: clamp(68px, 8vw, 120px);
          font-weight: 1000;
          line-height: 0.86;
          letter-spacing: -7px;
        }

        .hero h1 span {
          display: block;
          color: var(--green);
        }

        .hero h2 {
          margin: 31px 0 0;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .heroIntro {
          max-width: 780px;
          margin: 17px 0 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.75;
        }

        .heroButtons {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 56px;
          padding: 0 19px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 950;
        }

        .primaryButton {
          min-width: 190px;
          border: 1px solid var(--green);
          background: var(--green);
          color: #021006;
        }

        .secondaryButton {
          min-width: 185px;
          border: 1px solid rgba(50, 255, 115, 0.36);
          background: #050608;
          color: #ffffff;
        }

        .primaryButton b,
        .secondaryButton b {
          font-size: 19px;
        }

        .trustRow {
          max-width: 760px;
          margin-top: 25px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--line);
          border-radius: 16px;
          background: #07090c;
          overflow: hidden;
        }

        .trustRow div {
          min-height: 79px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid var(--line);
        }

        .trustRow div:last-child {
          border-right: 0;
        }

        .trustRow strong {
          color: var(--green);
          font-size: 19px;
        }

        .trustRow span {
          margin-top: 3px;
          color: #92979e;
          font-size: 10px;
        }

        .quickFind,
        .serviceInformation,
        .featuredBusiness,
        .areasSection,
        .businessCta,
        .footer {
          width: min(calc(100% - 56px), 1280px);
          margin-left: auto;
          margin-right: auto;
        }

        .quickFind {
          padding: 92px 0 30px;
        }

        .sectionHeading {
          max-width: 710px;
        }

        .sectionHeading > span,
        .cardKicker,
        .featuredKicker,
        .businessCta > div > span {
          color: var(--green);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .sectionHeading h2 {
          margin: 14px 0 0;
          font-size: clamp(44px, 5vw, 70px);
          line-height: 0.95;
          letter-spacing: -4px;
        }

        .sectionHeading p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
        }

        .serviceGrid {
          margin-top: 37px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }

        .serviceCard {
          min-height: 155px;
          padding: 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 15px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: #080a0d;
        }

        .serviceCard:hover {
          border-color: rgba(50, 255, 115, 0.44);
          transform: translateY(-2px);
        }

        .serviceIcon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50, 255, 115, 0.42);
          border-radius: 14px;
          color: var(--green);
          font-size: 12px;
          font-style: italic;
          font-weight: 950;
        }

        .serviceCard h3 {
          margin: 0;
          font-size: 18px;
        }

        .serviceCard p {
          margin: 7px 0 0;
          color: #92979e;
          font-size: 11px;
          line-height: 1.55;
        }

        .serviceCard > b {
          color: var(--green);
          font-size: 20px;
        }

        .serviceInformation {
          padding: 80px 0 40px;
          display: grid;
          gap: 22px;
        }

        .informationCard {
          min-height: 560px;
          display: grid;
          grid-template-columns: 46% 54%;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 25px;
          background: #080a0d;
        }

        .informationCard.reverse {
          grid-template-columns: 54% 46%;
        }

        .informationCard.reverse .cardImage {
          order: 2;
        }

        .cardImage {
          position: relative;
          min-height: 560px;
          background-size: cover;
          background-position: center;
        }

        .cardImage::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.3)
          );
        }

        .cardImage > span {
          position: absolute;
          z-index: 2;
          top: 27px;
          left: 27px;
          padding: 11px 15px;
          border: 1px solid rgba(50, 255, 115, 0.44);
          border-radius: 999px;
          background: rgba(5, 7, 9, 0.78);
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .tyreImage {
          background-image: url("/images/mobile-tyre-fitting.jpg");
        }

        .recoveryImage {
          background-image: url("/images/recovery-truck.jpg");
        }

        .cardContent {
          padding: 54px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cardContent h2 {
          max-width: 600px;
          margin: 15px 0 0;
          font-size: clamp(38px, 4.5vw, 65px);
          line-height: 0.95;
          letter-spacing: -4px;
        }

        .cardContent > p {
          margin: 24px 0 0;
          color: #a8adb4;
          font-size: 15px;
          line-height: 1.75;
        }

        details {
          margin-top: 24px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: #050608;
        }

        summary {
          min-height: 58px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          list-style: none;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        summary b {
          color: var(--green);
          font-size: 20px;
        }

        .detailContent {
          padding: 0 18px 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
          color: #b9bec5;
          font-size: 11px;
        }

        .detailContent span {
          color: #d9dcdf;
        }

        .cardButtons {
          margin-top: 19px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .smallPrimaryButton,
        .smallSecondaryButton {
          min-height: 50px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          gap: 25px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 950;
        }

        .smallPrimaryButton {
          border: 1px solid var(--green);
          background: var(--green);
          color: #031006;
        }

        .smallSecondaryButton {
          border: 1px solid rgba(50, 255, 115, 0.32);
          background: transparent;
        }

        .featuredBusiness {
          margin-top: 80px;
          display: grid;
          grid-template-columns: 45% 55%;
          overflow: hidden;
          border: 1px solid rgba(50, 255, 115, 0.5);
          border-radius: 26px;
          background: #080a0d;
        }

        .featuredImageWrap {
          position: relative;
          min-height: 610px;
          overflow: hidden;
          background: #07090c;
        }

        .featuredImage {
          width: 100%;
          height: 100%;
          min-height: 610px;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .featuredBadge {
          position: absolute;
          z-index: 2;
          top: 27px;
          left: 27px;
          padding: 12px 17px;
          border: 1px solid rgba(50, 255, 115, 0.5);
          border-radius: 999px;
          background: rgba(8, 10, 13, 0.9);
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .featuredContent {
          padding: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .featuredContent h2 {
          margin: 15px 0 0;
          font-size: clamp(42px, 4.8vw, 68px);
          line-height: 0.95;
          letter-spacing: -4px;
        }

        .featuredContent h3 {
          margin: 14px 0 0;
          color: var(--green);
          font-size: 24px;
        }

        .featuredContent > p {
          margin: 21px 0 0;
          color: #a8adb4;
          font-size: 14px;
          line-height: 1.75;
        }

        .featuredServices {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 20px;
          font-size: 12px;
          font-weight: 850;
        }

        .featuredServices span {
          color: #f1f2f3;
        }

        .featuredServices span::first-letter {
          color: var(--green);
        }

        .coverageBox {
          margin-top: 25px;
          padding: 15px 17px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: #0b0d10;
          color: #aeb3b9;
          font-size: 12px;
        }

        .coverageBox strong {
          color: #ffffff;
        }

        .featuredButtons {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 10px;
        }

        .featuredPrimary,
        .featuredSecondary {
          min-height: 54px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 950;
        }

        .featuredPrimary {
          border: 1px solid var(--green);
          background: var(--green);
          color: #031006;
        }

        .featuredSecondary {
          border: 1px solid rgba(50, 255, 115, 0.32);
          background: #050608;
        }

        .featuredContent > small {
          margin-top: 15px;
          color: #7f848b;
          font-size: 9px;
          line-height: 1.6;
        }

        .areasSection {
          padding: 110px 0 50px;
        }

        .areaLinks {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .areaLinks a {
          min-height: 59px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: #080a0d;
          font-size: 12px;
          font-weight: 850;
        }

        .areaLinks span {
          color: var(--green);
          font-size: 17px;
        }

        .businessCta {
          margin-top: 90px;
          padding: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          border: 1px solid rgba(50, 255, 115, 0.35);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 88% 10%,
              rgba(50, 255, 115, 0.11),
              transparent 29%
            ),
            #080a0d;
        }

        .businessCta > div {
          max-width: 750px;
        }

        .businessCta h2 {
          margin: 14px 0 0;
          font-size: clamp(38px, 4vw, 60px);
          line-height: 0.95;
          letter-spacing: -3px;
        }

        .businessCta p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .ctaButton {
          min-width: 205px;
          min-height: 56px;
          padding: 0 19px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--green);
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 12px;
          font-weight: 950;
        }

        .footer {
          margin-top: 110px;
          padding: 50px 0 45px;
          border-top: 1px solid var(--line);
        }

        .footerBrand {
          font-size: 32px;
          font-weight: 1000;
          letter-spacing: -2px;
        }

        .footerBrand span {
          color: var(--green);
        }

        .footer p {
          max-width: 620px;
          color: #8e939a;
          font-size: 12px;
          line-height: 1.65;
        }

        .footer > div {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 24px;
        }

        .footer > div a {
          color: #d8dade;
          font-size: 11px;
          font-weight: 800;
        }

        .footer small {
          display: block;
          margin-top: 38px;
          color: #666b72;
          font-size: 9px;
        }

        @media (max-width: 1180px) {
          .desktopNav {
            display: none;
          }

          .serviceGrid {
            grid-template-columns: 1fr 1fr;
          }

          .hero h1 {
            max-width: 800px;
          }
        }

        @media (max-width: 980px) {
          .topbar {
            width: calc(100% - 38px);
          }

          .listButton {
            display: none;
          }

          .mobileNav {
            position: absolute;
            z-index: 28;
            top: 104px;
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
            min-height: 47px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 999px;
            background: rgba(5, 7, 9, 0.84);
            backdrop-filter: blur(16px);
            font-size: 11px;
            font-weight: 850;
          }

          .informationCard,
          .informationCard.reverse,
          .featuredBusiness {
            grid-template-columns: 1fr;
          }

          .informationCard.reverse .cardImage {
            order: initial;
          }

          .cardImage {
            min-height: 420px;
          }

          .featuredImageWrap,
          .featuredImage {
            min-height: 500px;
          }

          .areaLinks {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .topbar {
            top: 0;
            left: 0;
            transform: none;
            width: 100%;
            min-height: 96px;
            padding: 14px 18px;
          }

          .brand {
            gap: 8px;
          }

          .brandMark {
            font-size: 26px;
          }

          .brandWords strong {
            font-size: 21px;
          }

          .brandWords small {
            font-size: 5px;
            letter-spacing: 1.7px;
          }

          .headerCallButton {
            min-width: 160px;
            min-height: 61px;
            padding: 8px 13px;
            border-radius: 18px;
          }

          .headerCallButton span {
            font-size: 8px;
            letter-spacing: 2.4px;
          }

          .headerCallButton strong {
            font-size: 14px;
          }

          .mobileNav {
            top: 96px;
          }

          .hero {
            min-height: 1240px;
          }

          .heroImage {
            height: 760px;
            background-position: center top;
          }

          .heroShade {
            background:
              linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.02) 0%,
                rgba(0, 0, 0, 0.02) 47%,
                #000000 68%,
                #000000 100%
              ),
              radial-gradient(
                circle at 20% 70%,
                rgba(50, 255, 115, 0.07),
                transparent 26%
              );
          }

          .heroContent {
            width: 100%;
            padding: 0 22px 72px;
          }

          .servicePill {
            padding: 11px 15px;
            font-size: 7px;
            letter-spacing: 2px;
          }

          .hero h1 {
            margin-top: 25px;
            font-size: clamp(54px, 15vw, 76px);
            line-height: 0.89;
            letter-spacing: -4.6px;
          }

          .hero h2 {
            margin-top: 26px;
            font-size: 19px;
          }

          .heroIntro {
            font-size: 14px;
            line-height: 1.72;
          }

          .heroButtons {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .primaryButton {
            grid-column: 1 / -1;
          }

          .primaryButton,
          .secondaryButton {
            min-width: 0;
            min-height: 54px;
            padding: 0 15px;
            font-size: 11px;
            gap: 12px;
          }

          .trustRow {
            grid-template-columns: 1fr;
          }

          .trustRow div {
            min-height: 64px;
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .trustRow div:last-child {
            border-bottom: 0;
          }

          .quickFind,
          .serviceInformation,
          .featuredBusiness,
          .areasSection,
          .businessCta,
          .footer {
            width: calc(100% - 34px);
          }

          .quickFind {
            padding-top: 75px;
          }

          .sectionHeading h2 {
            font-size: 46px;
            letter-spacing: -3px;
          }

          .sectionHeading p {
            font-size: 13px;
          }

          .serviceGrid {
            grid-template-columns: 1fr;
          }

          .serviceCard {
            min-height: 119px;
            padding: 18px;
          }

          .serviceCard p {
            font-size: 10px;
          }

          .serviceInformation {
            padding-top: 62px;
          }

          .informationCard {
            min-height: 0;
          }

          .cardImage {
            min-height: 310px;
          }

          .cardContent {
            padding: 32px 21px;
          }

          .cardContent h2 {
            font-size: 43px;
            letter-spacing: -3px;
          }

          .cardContent > p {
            font-size: 13px;
          }

          .detailContent {
            grid-template-columns: 1fr;
          }

          .cardButtons {
            display: grid;
            grid-template-columns: 1fr 0.65fr;
          }

          .smallPrimaryButton,
          .smallSecondaryButton {
            min-height: 49px;
            padding: 0 13px;
            font-size: 10px;
          }

          .featuredBusiness {
            margin-top: 65px;
          }

          .featuredImageWrap {
            min-height: 280px;
            max-height: 320px;
          }

          .featuredImage {
            min-height: 280px;
            max-height: 320px;
            object-position: center;
          }

          .featuredBadge {
            top: 18px;
            left: 18px;
            padding: 10px 14px;
            font-size: 7px;
          }

          .featuredContent {
            padding: 29px 22px 33px;
          }

          .featuredContent h2 {
            font-size: 42px;
            letter-spacing: -3px;
          }

          .featuredContent h3 {
            font-size: 20px;
          }

          .featuredContent > p {
            font-size: 12px;
          }

          .featuredServices {
            grid-template-columns: 1fr;
            font-size: 11px;
          }

          .featuredButtons {
            grid-template-columns: 1fr;
          }

          .featuredPrimary,
          .featuredSecondary {
            min-height: 52px;
          }

          .areasSection {
            padding-top: 88px;
          }

          .areaLinks {
            grid-template-columns: 1fr 1fr;
          }

          .businessCta {
            margin-top: 70px;
            padding: 32px 22px;
            display: block;
          }

          .businessCta h2 {
            font-size: 43px;
          }

          .businessCta p {
            font-size: 12px;
          }

          .ctaButton {
            width: 100%;
            min-width: 0;
            margin-top: 25px;
          }

          .footer {
            margin-top: 80px;
          }
        }

        @media (max-width: 430px) {
          .brandMark {
            display: none;
          }

          .headerCallButton {
            min-width: 150px;
          }

          .hero h1 {
            font-size: 53px;
          }

          .heroButtons {
            grid-template-columns: 1fr;
          }

          .primaryButton {
            grid-column: auto;
          }

          .areaLinks {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}