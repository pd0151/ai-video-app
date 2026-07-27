import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",

  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, new and part-worn tyres, locking nut removal, wheel balancing, breakdown recovery and towing services across Liverpool, Wirral and Merseyside.",

  alternates: {
    canonical: "https://adforge.uk/",
  },

  openGraph: {
    title:
      "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",

    description:
      "Find 24-hour mobile tyre fitting, emergency tyre assistance, vehicle recovery and trusted local businesses across Liverpool, Wirral and Merseyside.",

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
              Mobile Tyre Fitting &amp;
              <span>Vehicle Recovery Liverpool</span>
            </h1>

            <p className="heroTagline">
              Find local help. Get moving again.
            </p>

            <p className="heroDescription">
              AdForge helps drivers find 24-hour mobile tyre fitting, emergency
              tyre repair, puncture repairs, mobile tyres, vehicle recovery,
              towing services and roadside assistance across Liverpool, Wirral
              and Merseyside.
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


        <section className="seoServiceInfo">
          <div className="sectionHeading">
            <span>ADFORGE SERVICE INFORMATION</span>
            <h2>Tyre fitting and recovery help, explained clearly.</h2>
            <p>
              Open each premium information box to read about the 24-hour
              mobile tyre fitting and vehicle recovery services available
              through AdForge across Liverpool, Wirral and Merseyside.
            </p>
          </div>

          <div className="seoAccordion">
            <details open>
              <summary>
                <div><small>01</small><span><b>24-Hour Mobile Tyre Fitting</b><em>Emergency call-outs, mobile tyres and roadside fitting</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  AdForge helps people find a 24-hour mobile tyre fitting service
                  for flat tyres, damaged tyres and urgent roadside problems. A
                  mobile tyre fitter can attend at home, at work or at the
                  roadside across Liverpool, Wirral and Merseyside.
                </p>
                <p>
                  Services available through AdForge include 24-hour emergency
                  call-out, mobile tyres, emergency tyre repair, puncture
                  repairs, roadside tyre replacement, new and part-worn tyres,
                  locking nut removal and wheel balancing.
                </p>
                <div className="seoTags">
                  <span>24-hour emergency call-out</span><span>24-hour mobile tyre fitting service</span><span>Mobile tyres</span><span>Emergency tyre repair</span><span>Puncture repairs</span><span>New and part-worn tyres</span><span>Roadside tyre replacement</span><span>Locking nut removal</span><span>Wheel balancing</span>
                </div>
                <Link href="/services/mobile-tyre-fitting" className="seoMore">Browse mobile tyre fitting services <b>→</b></Link>
              </div>
            </details>

            <details>
              <summary>
                <div><small>02</small><span><b>Puncture Repairs &amp; Emergency Tyre Repair</b><em>Fast tyre help wherever your vehicle is located</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  AdForge helps drivers find puncture repairs and emergency tyre
                  repair when a tyre loses pressure or becomes damaged. A local
                  mobile tyre fitting provider can inspect the tyre and confirm
                  whether it can be repaired safely or needs replacing.
                </p>
                <p>
                  When repair is not possible, roadside tyre replacement can be
                  arranged using new or part-worn tyres. AdForge makes it easier
                  to find local mobile tyres and emergency tyre services across
                  Liverpool, Wirral and Merseyside.
                </p>
                <Link href="/services/mobile-tyre-fitting" className="seoMore">Find emergency tyre repair <b>→</b></Link>
              </div>
            </details>

            <details>
              <summary>
                <div><small>03</small><span><b>New &amp; Part-Worn Tyres</b><em>Replacement tyres supplied and fitted at your location</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  AdForge helps customers find new and part-worn tyres for cars
                  and vans. Mobile tyre fitting providers can confirm the tyre
                  size, discuss available options and fit replacement tyres at
                  home, work or the roadside.
                </p>
                <p>
                  Mobile tyre services may also include wheel balancing, locking
                  nut removal, puncture repairs and emergency tyre replacement.
                  These services are available across Liverpool, Wirral and
                  Merseyside through AdForge.
                </p>
                <Link href="/services/mobile-tyre-fitting" className="seoMore">Find new and part-worn tyres <b>→</b></Link>
              </div>
            </details>

            <details>
              <summary>
                <div><small>04</small><span><b>Locking Nut Removal &amp; Wheel Balancing</b><em>Extra mobile tyre services for safer driving</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  A damaged or missing locking wheel nut key can stop a tyre from
                  being removed. AdForge helps drivers find locking nut removal
                  specialists so mobile tyre fitting or wheel repairs can
                  continue without unnecessary delay.
                </p>
                <p>
                  Wheel balancing may be completed after fitting new or
                  part-worn tyres. Correct balancing can reduce vibration and
                  help tyres wear more evenly.
                </p>
                <Link href="/services/mobile-tyre-fitting" className="seoMore">Find locking nut removal and wheel balancing <b>→</b></Link>
              </div>
            </details>

            <details>
              <summary>
                <div><small>05</small><span><b>24-Hour Vehicle Recovery</b><em>Breakdown recovery, accident recovery and towing</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  AdForge helps customers find a 24-hour recovery service when a
                  vehicle cannot be driven safely. Recovery providers can attend
                  breakdowns, accidents and roadside emergencies across
                  Liverpool, Wirral and Merseyside.
                </p>
                <p>
                  Services include breakdown recovery, accident recovery,
                  roadside assistance, towing service, breakdown service and
                  vehicle transport. AdForge helps customers contact local
                  recovery providers quickly.
                </p>
                <div className="seoTags">
                  <span>24-hour recovery service</span><span>Breakdown recovery</span><span>Breakdown service</span><span>Accident recovery</span><span>Towing service</span><span>Roadside assistance</span><span>Vehicle transport</span><span>Liverpool recovery</span><span>Wirral recovery</span>
                </div>
                <Link href="/services/vehicle-recovery" className="seoMore">Browse vehicle recovery services <b>→</b></Link>
              </div>
            </details>

            <details>
              <summary>
                <div><small>06</small><span><b>Breakdown Service &amp; Towing Service</b><em>Local help when your vehicle will not start or move</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  A breakdown service can help with mechanical faults, flat
                  batteries, tyre problems and other issues that stop a vehicle
                  from continuing. AdForge connects drivers with local breakdown
                  recovery and roadside assistance providers.
                </p>
                <p>
                  If a vehicle cannot be repaired at the roadside, a towing
                  service or recovery truck can transport it to a garage, home
                  address or another destination across Liverpool, Wirral and
                  Merseyside.
                </p>
                <Link href="/services/vehicle-recovery" className="seoMore">Find breakdown and towing services <b>→</b></Link>
              </div>
            </details>

            <details>
              <summary>
                <div><small>07</small><span><b>Why Use AdForge?</b><em>A simple way to find trusted local service providers</em></span></div>
                <i>+</i>
              </summary>
              <div className="seoDetail">
                <p>
                  AdForge is a local service platform connecting customers with
                  mobile tyre fitting providers, vehicle recovery operators and
                  trusted local businesses. Customers can browse services by
                  area and contact providers directly.
                </p>
                <p>
                  AdForge covers 24-hour mobile tyre fitting, emergency tyre
                  repair, mobile tyres, puncture repairs, new and part-worn
                  tyres, wheel balancing, locking nut removal, 24-hour vehicle
                  recovery, breakdown recovery, towing service and roadside
                  assistance across Liverpool, Wirral and Merseyside.
                </p>
                <Link href="/businesses" className="seoMore">Browse businesses on AdForge <b>→</b></Link>
              </div>
            </details>
          </div>
        </section>

        <section className="featuredBusiness">
          <div className="featuredImageWrap">
            <div className="featuredBadge">FEATURED LOCAL PROVIDER</div>
            <img
              src="/images/total-tyres-van.jpg"
              alt="Total Tyres mobile tyre fitting van providing local tyre support"
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

            <div className="providerServices">
              <span>✓ Mobile Tyre Fitting</span>
              <span>✓ Puncture Repairs</span>
              <span>✓ New &amp; Part-Worn Tyres</span>
              <span>✓ Emergency Tyre Replacement</span>
              <span>✓ Wheel Balancing</span>
              <span>✓ Locking Nut Removal</span>
            </div>

            <div className="coverageBox">
              <b>Coverage:</b> Liverpool, Wirral &amp; Merseyside
            </div>

            <div className="featuredActions">
              <a href="tel:+447576579923" className="primaryButton">
                Call Through AdForge <span>→</span>
              </a>

              <Link href="/request-service" className="secondaryButton">
                Request Help <span>→</span>
              </Link>
            </div>

            <p className="providerNote">
              Calls and enquiries go through AdForge. We collect the job
              details and arrange the right local support without publishing
              the provider&apos;s private number.
            </p>
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
          --green: #32ff73;
          --green-bright: #32ff73;
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
          color: #32ff73;
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
          background: linear-gradient(135deg, var(--green-bright), #19dd5e);
        }

        .topButton {
          min-height: 46px;
          margin-left: 8px;
        }

        .secondaryButton {
          border: 1px solid rgba(50,255,115,.42);
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
          border: 1px solid rgba(50,255,115,.36);
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

        .heroTagline {
          margin: 20px 0 8px;
          color: #fff;
          font-size: 16px;
          line-height: 1.4;
          font-weight: 850;
        }

        .heroDescription {
          margin: 0 0 27px;
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
          border-color: rgba(50,255,115,.38);
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


        .seoServiceInfo {
          width: min(calc(100% - 64px), var(--max));
          margin: 0 auto;
          padding-top: 82px;
        }

        .seoAccordion {
          margin-top: 30px;
          display: grid;
          gap: 12px;
        }

        .seoAccordion details {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: #090a0b;
        }

        .seoAccordion details[open] {
          border-color: rgba(50,255,115,.38);
          background: radial-gradient(circle at top right, rgba(50,255,115,.08), transparent 34%), #0b0d0e;
        }

        .seoAccordion summary {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 20px 24px;
          cursor: pointer;
          list-style: none;
        }

        .seoAccordion summary::-webkit-details-marker { display: none; }
        .seoAccordion summary > div { display: flex; align-items: center; gap: 17px; }
        .seoAccordion summary small { width: 46px; height: 46px; flex: 0 0 46px; display: grid; place-items: center; border: 1px solid rgba(50,255,115,.3); border-radius: 13px; color: var(--green); font-size: 10px; font-weight: 950; }
        .seoAccordion summary span { display: flex; flex-direction: column; gap: 5px; }
        .seoAccordion summary b { font-size: 17px; }
        .seoAccordion summary em { color: var(--muted); font-size: 10px; font-style: normal; line-height: 1.5; }
        .seoAccordion summary > i { width: 38px; height: 38px; flex: 0 0 38px; display: grid; place-items: center; border: 1px solid rgba(50,255,115,.28); border-radius: 50%; color: var(--green); font-size: 20px; font-style: normal; transition: .2s ease; }
        .seoAccordion details[open] summary > i { transform: rotate(45deg); }

        .seoDetail {
          padding: 0 24px 27px 88px;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .seoDetail p { max-width: 1050px; margin: 19px 0 0; color: #bcc1c6; font-size: 13px; line-height: 1.8; }
        .seoTags { margin-top: 21px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
        .seoTags span { min-height: 42px; display: flex; align-items: center; padding: 9px 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; color: #dfe3e6; background: rgba(255,255,255,.018); font-size: 10px; }
        .seoMore { width: fit-content; margin-top: 23px; display: flex; align-items: center; gap: 18px; color: var(--green); font-size: 11px; font-weight: 950; }

        .featuredBusiness {
          width: min(calc(100% - 64px), var(--max));
          margin: 82px auto 0;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(330px, 44%) 1fr;
          border: 1px solid rgba(50,255,115,.42);
          border-radius: 22px;
          background: #080a0d;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.02) inset,
            0 30px 80px rgba(0,0,0,.44);
        }

        .featuredImageWrap {
          position: relative;
          min-height: 470px;
          overflow: hidden;
          background: #05070a;
        }

        .featuredImageWrap::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent 60%, #080a0d 100%),
            linear-gradient(0deg, rgba(0,0,0,.32), transparent 42%);
          pointer-events: none;
        }

        .featuredBadge {
          position: absolute;
          z-index: 2;
          top: 20px;
          left: 20px;
          padding: 10px 16px;
          border: 1px solid rgba(50,255,115,.45);
          border-radius: 999px;
          background: rgba(5,8,12,.88);
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.8px;
          backdrop-filter: blur(12px);
        }

        .featuredImage {
          width: 100%;
          height: 100%;
          min-height: 470px;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .featuredContent {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 38px;
        }

        .featuredKicker {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .featuredContent h2 {
          margin: 12px 0 5px;
          font-size: clamp(32px, 4vw, 54px);
          line-height: .98;
          letter-spacing: -3px;
        }

        .featuredContent h3 {
          margin: 0;
          color: var(--green);
          font-size: 18px;
          letter-spacing: -.5px;
        }

        .featuredContent > p {
          max-width: 700px;
          margin: 18px 0;
          color: #bfc5ca;
          font-size: 12px;
          line-height: 1.75;
        }

        .providerServices {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 18px;
          margin: 4px 0 20px;
        }

        .providerServices span {
          color: #f3f5f6;
          font-size: 11px;
          font-weight: 800;
        }

        .providerServices span::first-letter {
          color: var(--green);
        }

        .coverageBox {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255,255,255,.025);
          color: #aeb4b9;
          font-size: 11px;
        }

        .coverageBox b {
          color: #fff;
        }

        .featuredActions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }

        .providerNote {
          margin: 15px 0 0 !important;
          color: #858c92 !important;
          font-size: 10px !important;
          line-height: 1.6 !important;
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
          border: 1px solid rgba(50,255,115,.3);
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


          .seoServiceInfo {
            width: calc(100% - 30px);
            padding-top: 62px;
          }

          .seoAccordion summary { min-height: 82px; padding: 15px; }
          .seoAccordion summary > div { gap: 11px; }
          .seoAccordion summary small { width: 39px; height: 39px; flex-basis: 39px; }
          .seoAccordion summary b { font-size: 14px; }
          .seoAccordion summary em { font-size: 9px; }
          .seoAccordion summary > i { width: 32px; height: 32px; flex-basis: 32px; }
          .seoDetail { padding: 0 16px 21px; }
          .seoDetail p { font-size: 12px; line-height: 1.75; }
          .seoTags { grid-template-columns: 1fr; }

          .featuredBusiness {
            grid-template-columns: 1fr;
          }

          .featuredImageWrap,
          .featuredImage {
            min-height: 360px;
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
            border-color: rgba(50,255,115,.42);
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

          .heroTagline {
            margin: 18px 0 7px;
            font-size: 15px;
            line-height: 1.4;
          }

          .heroDescription {
            margin: 0 0 23px;
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
            display: block;
          }

          .featuredImageWrap,
          .featuredImage {
            min-height: 300px;
          }

          .featuredImageWrap::after {
            background: linear-gradient(0deg, #080a0d 0%, transparent 48%);
          }

          .featuredContent {
            padding: 24px 21px 25px;
          }

          .providerServices {
            grid-template-columns: 1fr 1fr;
            gap: 9px 12px;
          }

          .featuredActions {
            grid-template-columns: 1fr;
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
