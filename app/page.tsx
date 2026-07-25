import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://adforge.uk"),

  title: {
    absolute:
      "AdForge | Mobile Tyre Fitting, Vehicle Recovery & Local Businesses",
  },

  description:
    "Find mobile tyre fitting, emergency tyre services, vehicle recovery and local businesses across Liverpool, Wirral, Merseyside and surrounding areas with AdForge.",

  applicationName: "AdForge",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://adforge.uk/",
    siteName: "AdForge",
    title:
      "AdForge | Mobile Tyre Fitting, Vehicle Recovery & Local Businesses",
    description:
      "Find local tyre fitting, recovery services and businesses across Liverpool, Wirral and Merseyside.",
  },

  twitter: {
    card: "summary_large_image",
    title: "AdForge | Find Local Services",
    description:
      "Find mobile tyre fitting, vehicle recovery and local businesses near you.",
  },

  category: "Local business directory",
};

const tyreLocations = [
  {
    name: "Liverpool",
    href: "/seo/mobile-tyre-fitting-liverpool",
  },
  {
    name: "Wirral",
    href: "/seo/mobile-tyre-fitting-wirral",
  },
  {
    name: "Bootle",
    href: "/seo/mobile-tyre-fitting-bootle",
  },
  {
    name: "Huyton",
    href: "/seo/mobile-tyre-fitting-huyton",
  },
  {
    name: "Kirkby",
    href: "/seo/mobile-tyre-fitting-kirkby",
  },
  {
    name: "St Helens",
    href: "/seo/mobile-tyre-fitting-st-helens",
  },
];

const recoveryLocations = [
  {
    name: "Liverpool",
    href: "/seo/vehicle-recovery-liverpool",
  },
  {
    name: "Wirral",
    href: "/seo/vehicle-recovery-wirral",
  },
  {
    name: "Widnes",
    href: "/seo/vehicle-recovery-widnes",
  },
  {
    name: "Warrington",
    href: "/seo/vehicle-recovery-warrington",
  },
  {
    name: "St Helens",
    href: "/seo/vehicle-recovery-st-helens",
  },
  {
    name: "Merseyside",
    href: "/seo/vehicle-recovery-merseyside",
  },
];

const services = [
  {
    number: "01",
    label: "TYRE SERVICES",
    title: "Mobile Tyre Fitting",
    description:
      "Find mobile tyre fitting for flat tyres, damaged tyres, punctures and replacement tyres at home, work or the roadside.",
    href: "/services/mobile-tyre-fitting",
    button: "Find tyre fitting",
  },
  {
    number: "02",
    label: "EMERGENCY HELP",
    title: "Emergency Tyre Assistance",
    description:
      "Find urgent roadside tyre help, puncture repair, locking wheel nut removal and tyre replacement near your location.",
    href: "/seo/emergency-tyre-fitting-liverpool",
    button: "Find emergency help",
  },
  {
    number: "03",
    label: "RECOVERY SERVICES",
    title: "Vehicle Recovery",
    description:
      "Find breakdown recovery, accident recovery, roadside assistance and vehicle transport across the local area.",
   href: "/services/vehicle-recovery",
    button: "Find vehicle recovery",
  },
  {
    number: "04",
    label: "BUSINESS DIRECTORY",
    title: "Local Businesses",
    description:
      "Browse public business profiles, services, coverage areas, contact information and recent business adverts.",
    href: "/businesses",
    button: "Browse businesses",
  },
];

const popularLinks = [
  {
    title: "Puncture Repair",
    href: "/seo/puncture-repair-liverpool",
  },
  {
    title: "Locking Nut Removal",
    href: "/seo/locking-wheel-nut-removal-liverpool",
  },
  {
    title: "Flat Tyre Assistance",
    href: "/seo/flat-tyre-assistance-liverpool",
  },
  {
    title: "Breakdown Recovery",
    href: "/seo/breakdown-recovery-liverpool",
  },
  {
    title: "Accident Recovery",
    href: "/seo/accident-recovery-liverpool",
  },
  {
    title: "Vehicle Transport",
    href: "/seo/vehicle-transport-liverpool",
  },
];

const faqs = [
  {
    question: "What services can I find through AdForge?",
    answer:
      "AdForge contains public pages for mobile tyre fitting, emergency tyre assistance, puncture repair, locking wheel nut removal, breakdown recovery, accident recovery, vehicle transport and other local business services.",
  },
  {
    question: "Which locations are covered?",
    answer:
      "AdForge contains service pages covering Liverpool, Wirral, Bootle, Huyton, Kirkby, St Helens, Widnes, Warrington and surrounding areas. Availability depends on the businesses operating in each location.",
  },
  {
    question: "Can I list my business on AdForge?",
    answer:
      "Yes. Business owners can create an account, enter their business information and create a public business listing on AdForge.",
  },
  {
    question: "Does AdForge provide the services directly?",
    answer:
      "AdForge is an online platform that helps customers discover and contact local service providers. The business shown on an individual listing or service page is responsible for delivering the service.",
  },
];

export default function PublicHomePage() {
  const organisationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AdForge",
    url: "https://adforge.uk/",
    email: "info@adforge.uk",
    description:
      "AdForge helps customers find mobile tyre fitting, vehicle recovery and local businesses across Liverpool, Wirral and Merseyside.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AdForge",
    url: "https://adforge.uk/",
    inLanguage: "en-GB",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organisationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="publicPage">
        <header className="siteHeader">
          <div className="headerInner">
            <Link href="/" className="logo" aria-label="AdForge homepage">
              <span className="logoSmall">LOCAL SERVICE PLATFORM</span>

              <span className="logoMain">
                Ad<span>Forge</span>
              </span>
            </Link>

            <nav className="desktopNavigation" aria-label="Main navigation">
              <Link href="#services">Services</Link>
              <Link href="#locations">Locations</Link>
              <Link href="/businesses">Businesses</Link>
              <Link href="#business-listing">List Your Business</Link>
            </nav>

            <div className="headerButtons">
              <Link href="/login" className="loginLink">
                Login
              </Link>

              <Link href="/signup" className="headerSignup">
                List Business Free
              </Link>
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="heroGrid" />
          <div className="heroGlow heroGlowOne" />
          <div className="heroGlow heroGlowTwo" />

          <div className="heroInner">
            <div className="heroContent">
              <div className="heroBadge">
                <span className="pulseDot" />
                LOCAL SERVICES ACROSS MERSEYSIDE
              </div>

              <h1>
                Find Local Help.
                <br />
                <span>Get Moving Again.</span>
              </h1>

              <p className="heroDescription">
                Find mobile tyre fitting, emergency tyre assistance, vehicle
                recovery and local businesses across Liverpool, Wirral,
                Merseyside and surrounding areas.
              </p>

              <div className="heroButtons">
                <Link
                  href="/seo/mobile-tyre-fitting-liverpool"
                  className="primaryButton"
                >
                  Find Mobile Tyre Fitting
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                 href="/services/vehicle-recovery"
                  className="secondaryButton"
                >
                  Find Vehicle Recovery
                </Link>
              </div>

              <div className="heroStats">
                <div>
                  <strong>24-Hour</strong>
                  <span>Emergency service pages</span>
                </div>

                <div>
                  <strong>Local</strong>
                  <span>Area-based results</span>
                </div>

                <div>
                  <strong>Free</strong>
                  <span>Business listings</span>
                </div>
              </div>
            </div>

            <div className="heroVisual">
              <div className="searchCard">
                <div className="searchCardHeader">
                  <div>
                    <span className="cardEyebrow">ADFORGE LOCAL SEARCH</span>
                    <h2>Find a service near you</h2>
                  </div>

                  <span className="onlineStatus">
                    <span />
                    LIVE
                  </span>
                </div>

                <div className="searchFields">
                  <div className="searchField">
                    <span className="fieldIcon">01</span>

                    <div>
                      <small>Service required</small>
                      <strong>Mobile Tyre Fitting</strong>
                    </div>

                    <span className="fieldArrow">›</span>
                  </div>

                  <div className="searchField">
                    <span className="fieldIcon">02</span>

                    <div>
                      <small>Your location</small>
                      <strong>Liverpool & nearby</strong>
                    </div>

                    <span className="fieldArrow">›</span>
                  </div>
                </div>

                <Link href="/businesses" className="searchButton">
                  Search Local Businesses
                  <span>→</span>
                </Link>

                <div className="searchFooter">
                  <div>
                    <span className="miniDot" />
                    Tyre fitting
                  </div>

                  <div>
                    <span className="miniDot" />
                    Recovery
                  </div>

                  <div>
                    <span className="miniDot" />
                    Local trades
                  </div>
                </div>
              </div>

              <div className="floatingPanel panelTop">
                <span className="floatingNumber">24</span>

                <div>
                  <strong>Emergency Services</strong>
                  <small>Search by area</small>
                </div>
              </div>

              <div className="floatingPanel panelBottom">
                <span className="floatingNumber">UK</span>

                <div>
                  <strong>Local Coverage</strong>
                  <small>Liverpool & Merseyside</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quickLinks" aria-label="Popular local services">
          <div className="quickLinksInner">
            {popularLinks.map((item) => (
              <Link href={item.href} key={item.title}>
                {item.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="section servicesSection" id="services">
          <div className="sectionInner">
            <div className="sectionHeading">
              <div>
                <span className="sectionLabel">POPULAR SERVICES</span>

                <h2>
                  Find the local service
                  <br />
                  you need.
                </h2>
              </div>

              <p>
                Browse public service pages, select your location and contact a
                business operating in your area.
              </p>
            </div>

            <div className="servicesGrid">
              {services.map((service) => (
                <article className="serviceCard" key={service.title}>
                  <div className="serviceCardTop">
                    <span className="serviceNumber">{service.number}</span>
                    <span className="serviceLabel">{service.label}</span>
                  </div>

                  <div className="serviceIcon">
                    <span />
                    <span />
                    <span />
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <Link href={service.href}>
                    {service.button}
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section locationSection" id="locations">
          <div className="sectionInner">
            <div className="sectionHeading">
              <div>
                <span className="sectionLabel">LOCAL COVERAGE</span>

                <h2>
                  Explore services
                  <br />
                  by location.
                </h2>
              </div>

              <p>
                Start with one of our main areas and discover nearby towns,
                districts and service pages.
              </p>
            </div>

            <div className="locationGrid">
              <article className="locationCard">
                <div className="locationCardHeader">
                  <div>
                    <span>TYRE SERVICES</span>
                    <h3>Mobile Tyre Fitting</h3>
                  </div>

                  <span className="roundArrow">↗</span>
                </div>

                <p>
                  Find mobile tyre fitting, emergency tyre replacement,
                  puncture repair and roadside tyre assistance.
                </p>

                <div className="areaLinks">
                  {tyreLocations.map((location) => (
                    <Link href={location.href} key={location.name}>
                      <span>{location.name}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/seo/mobile-tyre-fitting-liverpool"
                  className="locationMainButton"
                >
                  View tyre fitting services
                </Link>
              </article>

              <article className="locationCard">
                <div className="locationCardHeader">
                  <div>
                    <span>RECOVERY SERVICES</span>
                    <h3>Vehicle Recovery</h3>
                  </div>

                  <span className="roundArrow">↗</span>
                </div>

                <p>
                  Find local breakdown recovery, accident recovery, roadside
                  assistance and vehicle transportation.
                </p>

                <div className="areaLinks">
                  {recoveryLocations.map((location) => (
                    <Link href={location.href} key={location.name}>
                      <span>{location.name}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/seo/vehicle-recovery-liverpool"
                  className="locationMainButton"
                >
                  View recovery services
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section processSection">
          <div className="sectionInner">
            <div className="processCard">
              <div className="processIntro">
                <span className="sectionLabel">HOW ADFORGE WORKS</span>

                <h2>Local help in three simple steps.</h2>

                <p>
                  Find a service, choose the most relevant location and contact
                  the local provider directly.
                </p>
              </div>

              <div className="processSteps">
                <article>
                  <span>01</span>

                  <div>
                    <h3>Choose a service</h3>
                    <p>
                      Select tyre fitting, vehicle recovery or another local
                      business service.
                    </p>
                  </div>
                </article>

                <article>
                  <span>02</span>

                  <div>
                    <h3>Select your area</h3>
                    <p>
                      Open a page covering your town, district or nearby
                      location.
                    </p>
                  </div>
                </article>

                <article>
                  <span>03</span>

                  <div>
                    <h3>Contact the business</h3>
                    <p>
                      Call or send an enquiry using the contact details
                      displayed on the page.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section businessSection"
          id="business-listing"
        >
          <div className="sectionInner">
            <div className="businessCard">
              <div className="businessGlow" />

              <div className="businessContent">
                <span className="sectionLabel">FOR BUSINESS OWNERS</span>

                <h2>
                  Get your business
                  <br />
                  discovered online.
                </h2>

                <p>
                  Create an AdForge account, add your company details and build
                  a public business listing customers can use to discover your
                  services.
                </p>

                <div className="businessFeatures">
                  <span>Public business profile</span>
                  <span>Services and coverage areas</span>
                  <span>Telephone and website details</span>
                  <span>Business images and adverts</span>
                </div>

                <div className="businessButtons">
                  <Link href="/signup" className="primaryButton">
                    Create Free Business Listing
                    <span>→</span>
                  </Link>

                  <Link href="/login" className="businessLogin">
                    Already registered? Login
                  </Link>
                </div>
              </div>

              <div className="listingPreview">
                <div className="listingWindow">
                  <div className="windowBar">
                    <span />
                    <span />
                    <span />

                    <small>adforge.uk/business</small>
                  </div>

                  <div className="listingImage">
                    <div className="listingImageGlow" />

                    <span>YOUR BUSINESS</span>
                  </div>

                  <div className="listingDetails">
                    <span className="listingBadge">
                      LOCAL BUSINESS LISTING
                    </span>

                    <h3>Your Business Name</h3>

                    <p>Services • Location • Contact information</p>

                    <div className="listingInfo">
                      <div>
                        <small>Coverage</small>
                        <strong>Liverpool & nearby</strong>
                      </div>

                      <div>
                        <small>Status</small>
                        <strong className="availableText">Available</strong>
                      </div>
                    </div>

                    <div className="listingButtons">
                      <span>Call Business</span>
                      <span>View Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section aboutSection">
          <div className="sectionInner">
            <div className="aboutGrid">
              <div>
                <span className="sectionLabel">ABOUT ADFORGE</span>

                <h2>
                  Built to connect customers
                  <br />
                  with local services.
                </h2>
              </div>

              <div className="aboutText">
                <p>
                  AdForge provides public service and location pages for mobile
                  tyre fitting, emergency tyre services, vehicle recovery and
                  local businesses.
                </p>

                <p>
                  Customers can browse services by area, view the information
                  available and contact a provider operating near their
                  location.
                </p>

                <p>
                  Business owners can create an account and enter their company
                  information to build a public AdForge listing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section faqSection">
          <div className="sectionInner">
            <div className="sectionHeading">
              <div>
                <span className="sectionLabel">COMMON QUESTIONS</span>
                <h2>AdForge FAQs</h2>
              </div>
            </div>

            <div className="faqList">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    <span>{faq.question}</span>
                    <span className="faqPlus">+</span>
                  </summary>

                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footerInner">
            <div className="footerMain">
              <div className="footerBrand">
                <Link href="/" className="logo">
                  <span className="logoSmall">LOCAL SERVICE PLATFORM</span>

                  <span className="logoMain">
                    Ad<span>Forge</span>
                  </span>
                </Link>

                <p>
                  Find mobile tyre fitting, vehicle recovery and local
                  businesses across Liverpool, Wirral and Merseyside.
                </p>
              </div>

              <div className="footerLinks">
                <div>
                  <h3>Services</h3>

                  <Link href="/seo/mobile-tyre-fitting-liverpool">
                    Mobile Tyre Fitting
                  </Link>

                  <Link href="/seo/puncture-repair-liverpool">
                    Puncture Repair
                  </Link>

                  <Link href="/seo/vehicle-recovery-liverpool">
                    Vehicle Recovery
                  </Link>

                  <Link href="/seo/breakdown-recovery-liverpool">
                    Breakdown Recovery
                  </Link>
                </div>

                <div>
                  <h3>AdForge</h3>

                  <Link href="/businesses">Find Businesses</Link>
                  <Link href="/signup">List Your Business</Link>
                  <Link href="/login">Business Login</Link>
                  <Link href="/home">Open AdForge App</Link>
                </div>

                <div>
                  <h3>Information</h3>

                  <Link href="/privacy">Privacy Policy</Link>
                  <Link href="/terms">Terms & Conditions</Link>
                  <Link href="/contact">Contact</Link>
                </div>
              </div>
            </div>

            <div className="footerBottom">
              <span>
                © {new Date().getFullYear()} AdForge. All rights reserved.
              </span>

              <span>info@adforge.uk</span>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #05070d;
        }

        body {
          margin: 0;
          background: #05070d;
          color: #ffffff;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        .publicPage {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(50, 255, 115, 0.09),
              transparent 28%
            ),
            #05070d;
          color: #ffffff;
          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
        }

        .siteHeader {
          position: relative;
          z-index: 50;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(5, 7, 13, 0.82);
          backdrop-filter: blur(24px);
        }

        .headerInner {
          width: min(1240px, calc(100% - 40px));
          min-height: 92px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .logo {
          display: inline-flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .logoSmall {
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 4px;
        }

        .logoMain {
          font-size: 35px;
          font-weight: 950;
          letter-spacing: -2.5px;
          line-height: 1;
        }

        .logoMain span {
          color: #32ff73;
          text-shadow: 0 0 28px rgba(50, 255, 115, 0.45);
        }

        .desktopNavigation {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .desktopNavigation a {
          color: rgba(255, 255, 255, 0.62);
          font-size: 13px;
          font-weight: 750;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .desktopNavigation a:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }

        .headerButtons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .loginLink,
        .headerSignup {
          min-height: 45px;
          padding: 0 19px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 900;
        }

        .loginLink {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.035);
        }

        .headerSignup {
          color: #05070d;
          background: #32ff73;
          box-shadow: 0 0 28px rgba(50, 255, 115, 0.2);
        }

        .hero {
          position: relative;
          min-height: 760px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .heroGrid {
          position: absolute;
          inset: 0;
          opacity: 0.4;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1),
            transparent
          );
        }

        .heroGlow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(100px);
        }

        .heroGlowOne {
          top: 8%;
          right: 4%;
          width: 520px;
          height: 520px;
          background: rgba(50, 255, 115, 0.13);
        }

        .heroGlowTwo {
          left: 15%;
          bottom: -35%;
          width: 600px;
          height: 600px;
          background: rgba(255, 255, 255, 0.045);
        }

        .heroInner {
          position: relative;
          z-index: 2;
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          padding: 100px 0;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(430px, 0.95fr);
          align-items: center;
          gap: 80px;
        }

        .heroBadge,
        .sectionLabel {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #32ff73;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .heroBadge {
          min-height: 40px;
          padding: 0 16px;
          border: 1px solid rgba(50, 255, 115, 0.23);
          border-radius: 999px;
          background: rgba(50, 255, 115, 0.055);
        }

        .pulseDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #32ff73;
          box-shadow: 0 0 17px rgba(50, 255, 115, 0.9);
        }

        .hero h1 {
          max-width: 800px;
          margin: 28px 0 25px;
          font-size: clamp(58px, 7vw, 94px);
          font-weight: 950;
          letter-spacing: -6px;
          line-height: 0.92;
        }

        .hero h1 span {
          color: rgba(255, 255, 255, 0.34);
        }

        .heroDescription {
          max-width: 690px;
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 18px;
          line-height: 1.75;
        }

        .heroButtons {
          margin-top: 37px;
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 59px;
          padding: 0 25px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          font-size: 14px;
          font-weight: 950;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .primaryButton {
          color: #05070d;
          background: #32ff73;
          box-shadow: 0 0 34px rgba(50, 255, 115, 0.2);
        }

        .primaryButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 45px rgba(50, 255, 115, 0.3);
        }

        .secondaryButton {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.035);
        }

        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .heroStats {
          margin-top: 48px;
          display: flex;
          flex-wrap: wrap;
          gap: 44px;
        }

        .heroStats div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .heroStats strong {
          font-size: 17px;
          font-weight: 950;
        }

        .heroStats span {
          color: rgba(255, 255, 255, 0.39);
          font-size: 11px;
        }

        .heroVisual {
          position: relative;
          min-height: 540px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .searchCard {
          position: relative;
          z-index: 3;
          width: min(100%, 480px);
          padding: 29px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 34px;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(50, 255, 115, 0.16),
              transparent 30%
            ),
            rgba(10, 13, 20, 0.88);
          box-shadow:
            0 50px 120px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(22px);
        }

        .searchCard::after {
          position: absolute;
          inset: -1px;
          z-index: -1;
          content: "";
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(50, 255, 115, 0.17),
            transparent 35%,
            rgba(255, 255, 255, 0.03)
          );
        }

        .searchCardHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .cardEyebrow {
          color: rgba(255, 255, 255, 0.38);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .searchCardHeader h2 {
          max-width: 310px;
          margin: 12px 0 0;
          font-size: 39px;
          font-weight: 950;
          letter-spacing: -2.5px;
          line-height: 1;
        }

        .onlineStatus {
          min-height: 31px;
          padding: 0 11px;
          border: 1px solid rgba(50, 255, 115, 0.19);
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #32ff73;
          background: rgba(50, 255, 115, 0.05);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .onlineStatus span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #32ff73;
          box-shadow: 0 0 10px #32ff73;
        }

        .searchFields {
          margin-top: 32px;
          padding: 7px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 23px;
          background: rgba(0, 0, 0, 0.24);
        }

        .searchField {
          min-height: 76px;
          padding: 0 14px;
          display: grid;
          grid-template-columns: 43px 1fr 20px;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .searchField:last-child {
          border-bottom: none;
        }

        .fieldIcon {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(50, 255, 115, 0.15);
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: #32ff73;
          background: rgba(50, 255, 115, 0.05);
          font-size: 9px;
          font-weight: 950;
        }

        .searchField div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .searchField small {
          color: rgba(255, 255, 255, 0.33);
          font-size: 9px;
        }

        .searchField strong {
          font-size: 13px;
        }

        .fieldArrow {
          color: rgba(255, 255, 255, 0.35);
          font-size: 23px;
        }

        .searchButton {
          min-height: 59px;
          margin-top: 16px;
          padding: 0 20px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #05070d;
          background: #32ff73;
          font-size: 13px;
          font-weight: 950;
        }

        .searchFooter {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 8px;
          font-weight: 750;
        }

        .searchFooter div {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .miniDot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #32ff73;
        }

        .floatingPanel {
          position: absolute;
          z-index: 4;
          min-width: 190px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(8, 11, 18, 0.93);
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(18px);
        }

        .panelTop {
          top: 30px;
          right: -22px;
        }

        .panelBottom {
          bottom: 26px;
          left: -20px;
        }

        .floatingNumber {
          width: 41px;
          height: 41px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: #05070d;
          background: #32ff73;
          font-size: 10px;
          font-weight: 950;
        }

        .floatingPanel div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .floatingPanel strong {
          font-size: 11px;
        }

        .floatingPanel small {
          color: rgba(255, 255, 255, 0.36);
          font-size: 9px;
        }

        .quickLinks {
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.012);
        }

        .quickLinksInner {
          width: min(1240px, calc(100% - 40px));
          min-height: 78px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          overflow-x: auto;
        }

        .quickLinksInner a {
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.39);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }

        .quickLinksInner a:hover {
          color: #32ff73;
        }

        .section {
          padding: 112px 0;
        }

        .sectionInner {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
        }

        .sectionHeading {
          margin-bottom: 50px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 60px;
        }

        .sectionHeading h2,
        .processIntro h2,
        .businessContent h2,
        .aboutGrid h2 {
          max-width: 850px;
          margin: 17px 0 0;
          font-size: clamp(42px, 5.3vw, 69px);
          font-weight: 950;
          letter-spacing: -4px;
          line-height: 0.96;
        }

        .sectionHeading > p {
          max-width: 450px;
          margin: 0;
          color: rgba(255, 255, 255, 0.43);
          font-size: 14px;
          line-height: 1.75;
        }

        .servicesSection {
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(50, 255, 115, 0.045),
              transparent 33%
            ),
            #070910;
        }

        .servicesGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .serviceCard {
          min-height: 405px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(50, 255, 115, 0.055),
              transparent 30%
            ),
            rgba(255, 255, 255, 0.02);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .serviceCard:hover {
          transform: translateY(-5px);
          border-color: rgba(50, 255, 115, 0.27);
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(50, 255, 115, 0.09),
              transparent 34%
            ),
            rgba(255, 255, 255, 0.03);
        }

        .serviceCardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .serviceNumber {
          width: 45px;
          height: 45px;
          border: 1px solid rgba(50, 255, 115, 0.15);
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #32ff73;
          background: rgba(50, 255, 115, 0.04);
          font-size: 10px;
          font-weight: 950;
        }

        .serviceLabel {
          color: rgba(255, 255, 255, 0.29);
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .serviceIcon {
          width: 65px;
          height: 65px;
          margin-top: 48px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 21px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.025);
        }

        .serviceIcon span {
          height: 3px;
          border-radius: 999px;
          background: #32ff73;
          box-shadow: 0 0 10px rgba(50, 255, 115, 0.25);
        }

        .serviceIcon span:nth-child(1) {
          width: 100%;
        }

        .serviceIcon span:nth-child(2) {
          width: 68%;
        }

        .serviceIcon span:nth-child(3) {
          width: 43%;
        }

        .serviceCard h3 {
          margin: 25px 0 13px;
          font-size: 22px;
          letter-spacing: -1px;
        }

        .serviceCard p {
          margin: 0;
          color: rgba(255, 255, 255, 0.42);
          font-size: 13px;
          line-height: 1.72;
        }

        .serviceCard > a {
          margin-top: auto;
          padding-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
        }

        .serviceCard > a span {
          color: #32ff73;
        }

        .locationSection {
          background: #05070d;
        }

        .locationGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .locationCard {
          padding: 35px;
          border: 1px solid rgba(255, 255, 255, 0.095);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(50, 255, 115, 0.075),
              transparent 30%
            ),
            rgba(255, 255, 255, 0.02);
        }

        .locationCardHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .locationCardHeader div > span {
          color: #32ff73;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .locationCard h3 {
          margin: 12px 0 0;
          font-size: 31px;
          letter-spacing: -1.8px;
        }

        .roundArrow {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #32ff73;
          background: rgba(255, 255, 255, 0.025);
        }

        .locationCard > p {
          max-width: 550px;
          margin: 22px 0 28px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 13px;
          line-height: 1.75;
        }

        .areaLinks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .areaLinks a {
          min-height: 54px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.18);
          font-size: 11px;
          font-weight: 850;
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .areaLinks a:hover {
          border-color: rgba(50, 255, 115, 0.23);
          background: rgba(50, 255, 115, 0.035);
        }

        .areaLinks a span:last-child {
          color: #32ff73;
        }

        .locationMainButton {
          min-height: 56px;
          margin-top: 18px;
          border-radius: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #05070d;
          background: #ffffff;
          font-size: 11px;
          font-weight: 950;
        }

        .processSection {
          padding-top: 0;
        }

        .processCard {
          padding: 64px;
          border: 1px solid rgba(255, 255, 255, 0.095);
          border-radius: 37px;
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 90px;
          background:
            radial-gradient(
              circle at 0% 100%,
              rgba(50, 255, 115, 0.08),
              transparent 35%
            ),
            #090c13;
        }

        .processIntro p,
        .businessContent > p {
          max-width: 610px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.45);
          font-size: 14px;
          line-height: 1.8;
        }

        .processSteps {
          display: flex;
          flex-direction: column;
        }

        .processSteps article {
          padding: 27px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.075);
          display: grid;
          grid-template-columns: 54px 1fr;
          gap: 21px;
        }

        .processSteps article:first-child {
          padding-top: 0;
        }

        .processSteps article:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .processSteps article > span {
          color: #32ff73;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .processSteps h3 {
          margin: 0 0 9px;
          font-size: 18px;
        }

        .processSteps p {
          margin: 0;
          color: rgba(255, 255, 255, 0.39);
          font-size: 12px;
          line-height: 1.7;
        }

        .businessSection {
          padding-top: 0;
        }

        .businessCard {
          position: relative;
          min-height: 600px;
          padding: 70px;
          border: 1px solid rgba(50, 255, 115, 0.17);
          border-radius: 40px;
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          align-items: center;
          gap: 90px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 88% 50%,
              rgba(50, 255, 115, 0.14),
              transparent 31%
            ),
            linear-gradient(135deg, #0a0d14, #070a10);
          box-shadow: 0 0 90px rgba(50, 255, 115, 0.04);
        }

        .businessGlow {
          position: absolute;
          right: -150px;
          top: 50%;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(50, 255, 115, 0.1);
          filter: blur(90px);
          transform: translateY(-50%);
        }

        .businessContent,
        .listingPreview {
          position: relative;
          z-index: 2;
        }

        .businessFeatures {
          margin-top: 29px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .businessFeatures span {
          position: relative;
          padding-left: 19px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
        }

        .businessFeatures span::before {
          position: absolute;
          top: 4px;
          left: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          content: "";
          background: #32ff73;
          box-shadow: 0 0 10px rgba(50, 255, 115, 0.55);
        }

        .businessButtons {
          margin-top: 37px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 23px;
        }

        .businessLogin {
          color: rgba(255, 255, 255, 0.48);
          font-size: 12px;
          font-weight: 750;
        }

        .listingPreview {
          display: flex;
          justify-content: center;
        }

        .listingWindow {
          width: min(100%, 400px);
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 29px;
          background: rgba(5, 7, 13, 0.89);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45);
          transform: rotate(2deg);
        }

        .windowBar {
          min-height: 34px;
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .windowBar > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .windowBar small {
          margin-left: auto;
          color: rgba(255, 255, 255, 0.25);
          font-size: 7px;
        }

        .listingImage {
          position: relative;
          height: 210px;
          border-radius: 20px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            linear-gradient(
              135deg,
              rgba(50, 255, 115, 0.11),
              rgba(255, 255, 255, 0.015)
            ),
            #10141c;
        }

        .listingImageGlow {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(50, 255, 115, 0.13);
          filter: blur(40px);
        }

        .listingImage > span {
          position: relative;
          z-index: 2;
          color: rgba(255, 255, 255, 0.27);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .listingDetails {
          padding: 22px 11px 10px;
        }

        .listingBadge {
          color: #32ff73;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .listingDetails h3 {
          margin: 12px 0 7px;
          font-size: 25px;
          letter-spacing: -1px;
        }

        .listingDetails > p {
          margin: 0;
          color: rgba(255, 255, 255, 0.36);
          font-size: 10px;
        }

        .listingInfo {
          margin-top: 19px;
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          background: rgba(255, 255, 255, 0.02);
        }

        .listingInfo div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .listingInfo small {
          color: rgba(255, 255, 255, 0.28);
          font-size: 7px;
        }

        .listingInfo strong {
          font-size: 9px;
        }

        .availableText {
          color: #32ff73;
        }

        .listingButtons {
          margin-top: 11px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .listingButtons span {
          min-height: 45px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: #05070d;
          background: #ffffff;
          font-size: 9px;
          font-weight: 950;
        }

        .listingButtons span:first-child {
          background: #32ff73;
        }

        .aboutSection {
          padding-top: 0;
        }

        .aboutGrid {
          padding: 55px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.075);
          border-bottom: 1px solid rgba(255, 255, 255, 0.075);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 90px;
        }

        .aboutGrid h2 {
          font-size: clamp(38px, 4.4vw, 59px);
        }

        .aboutText {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .aboutText p {
          margin: 0;
          color: rgba(255, 255, 255, 0.43);
          font-size: 14px;
          line-height: 1.8;
        }

        .faqSection {
          padding-top: 0;
        }

        .faqList {
          max-width: 940px;
        }

        .faqList details {
          border-bottom: 1px solid rgba(255, 255, 255, 0.085);
        }

        .faqList summary {
          min-height: 86px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          cursor: pointer;
          list-style: none;
          font-size: 16px;
          font-weight: 850;
        }

        .faqList summary::-webkit-details-marker {
          display: none;
        }

        .faqPlus {
          color: #32ff73;
          font-size: 23px;
          font-weight: 400;
        }

        .faqList details p {
          max-width: 800px;
          margin: -3px 0 28px;
          color: rgba(255, 255, 255, 0.43);
          font-size: 13px;
          line-height: 1.75;
        }

        .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.075);
          background: #03050a;
        }

        .footerInner {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          padding: 78px 0 30px;
        }

        .footerMain {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 100px;
        }

        .footerBrand p {
          max-width: 370px;
          margin: 22px 0 0;
          color: rgba(255, 255, 255, 0.36);
          font-size: 12px;
          line-height: 1.75;
        }

        .footerLinks {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footerLinks div {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footerLinks h3 {
          margin: 0 0 5px;
          font-size: 11px;
        }

        .footerLinks a {
          color: rgba(255, 255, 255, 0.37);
          font-size: 11px;
          transition: color 0.2s ease;
        }

        .footerLinks a:hover {
          color: #32ff73;
        }

        .footerBottom {
          margin-top: 65px;
          padding-top: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: rgba(255, 255, 255, 0.24);
          font-size: 10px;
        }

        @media (max-width: 1080px) {
          .desktopNavigation {
            display: none;
          }

          .heroInner {
            grid-template-columns: 1fr;
            gap: 65px;
          }

          .heroContent {
            max-width: 850px;
          }

          .heroVisual {
            width: min(100%, 600px);
            margin: 0 auto;
          }

          .servicesGrid {
            grid-template-columns: 1fr 1fr;
          }

          .processCard,
          .businessCard,
          .aboutGrid {
            grid-template-columns: 1fr;
          }

          .listingPreview {
            justify-content: flex-start;
          }

          .footerMain {
            grid-template-columns: 1fr;
            gap: 55px;
          }
        }

        @media (max-width: 760px) {
          .headerInner {
            width: min(100% - 28px, 1240px);
            min-height: 78px;
          }

          .logoSmall {
            font-size: 6px;
            letter-spacing: 2.5px;
          }

          .logoMain {
            font-size: 29px;
          }

          .loginLink {
            display: none;
          }

          .headerSignup {
            min-height: 41px;
            padding: 0 14px;
            font-size: 10px;
          }

          .hero {
            min-height: auto;
          }

          .heroInner {
            width: min(100% - 28px, 1240px);
            padding: 70px 0 68px;
            gap: 50px;
          }

          .heroBadge {
            min-height: 35px;
            padding: 0 13px;
            font-size: 7px;
            letter-spacing: 2px;
          }

          .hero h1 {
            margin-top: 23px;
            font-size: clamp(48px, 15vw, 68px);
            letter-spacing: -4px;
          }

          .heroDescription {
            font-size: 15px;
            line-height: 1.68;
          }

          .heroButtons {
            display: grid;
            grid-template-columns: 1fr;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
            min-height: 56px;
          }

          .heroStats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }

          .heroStats strong {
            font-size: 13px;
          }

          .heroStats span {
            font-size: 8px;
          }

          .heroVisual {
            min-height: 470px;
          }

          .searchCard {
            padding: 22px;
            border-radius: 27px;
          }

          .searchCardHeader h2 {
            font-size: 33px;
          }

          .floatingPanel {
            min-width: 165px;
            padding: 11px;
          }

          .panelTop {
            top: 0;
            right: -7px;
          }

          .panelBottom {
            bottom: 0;
            left: -7px;
          }

          .quickLinksInner,
          .sectionInner,
          .footerInner {
            width: min(100% - 28px, 1240px);
          }

          .quickLinksInner {
            justify-content: flex-start;
          }

          .section {
            padding: 80px 0;
          }

          .sectionHeading {
            margin-bottom: 35px;
            display: block;
          }

          .sectionHeading h2,
          .processIntro h2,
          .businessContent h2,
          .aboutGrid h2 {
            font-size: 43px;
            letter-spacing: -2.7px;
          }

          .sectionHeading > p {
            margin-top: 20px;
          }

          .servicesGrid,
          .locationGrid {
            grid-template-columns: 1fr;
          }

          .serviceCard {
            min-height: 355px;
          }

          .serviceIcon {
            margin-top: 38px;
          }

          .locationCard {
            padding: 25px;
          }

          .locationCard h3 {
            font-size: 27px;
          }

          .areaLinks {
            grid-template-columns: 1fr;
          }

          .processCard,
          .businessCard {
            padding: 35px 24px;
            border-radius: 30px;
            gap: 50px;
          }

          .businessFeatures {
            grid-template-columns: 1fr;
          }

          .businessButtons {
            display: grid;
            grid-template-columns: 1fr;
          }

          .businessLogin {
            text-align: center;
          }

          .listingWindow {
            transform: none;
          }

          .aboutGrid {
            gap: 35px;
          }

          .faqList summary {
            min-height: 76px;
            font-size: 14px;
          }

          .footerLinks {
            grid-template-columns: 1fr 1fr;
          }

          .footerBottom {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 430px) {
          .heroStats {
            grid-template-columns: 1fr;
          }

          .heroStats div {
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          }

          .floatingPanel {
            display: none;
          }

          .heroVisual {
            min-height: auto;
          }

          .searchFooter {
            flex-wrap: wrap;
            justify-content: flex-start;
          }

          .footerLinks {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}