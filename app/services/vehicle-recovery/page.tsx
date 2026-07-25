import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  metadataBase: new URL("https://adforge.uk"),

  title:
    "Vehicle Recovery, Breakdown Recovery & Towing Services | AdForge",

  description:
    "Find vehicle recovery, emergency towing, breakdown recovery, roadside assistance and vehicle transport services across Liverpool, Merseyside and surrounding areas.",

  alternates: {
    canonical: "/services/vehicle-recovery",
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
    title: "Find Vehicle Recovery & Towing Services | AdForge",
    description:
      "Browse local breakdown recovery, emergency towing and vehicle recovery pages across Liverpool, Merseyside and nearby areas.",
    url: "https://adforge.uk/services/vehicle-recovery",
    siteName: "AdForge",
    type: "website",
    locale: "en_GB",
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LandingPage = {
  slug: string;
  headline: string | null;
  title_tag: string | null;
  meta_description: string | null;
};

function readableName(page: LandingPage) {
  if (page.headline?.trim()) {
    return page.headline.trim();
  }

  if (page.title_tag?.trim()) {
    return page.title_tag.trim();
  }

  return page.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function VehicleRecoveryHubPage() {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("slug, headline, title_tag, meta_description")
    .eq("active", true)
    .or(
      [
        "slug.ilike.%recovery%",
        "slug.ilike.%towing%",
        "slug.ilike.%breakdown%",
        "slug.ilike.%roadside-assistance%",
        "slug.ilike.%vehicle-transport%",
        "slug.ilike.%car-transport%",
      ].join(",")
    )
    .order("slug", { ascending: true })
    .limit(1000);

  const pages: LandingPage[] = data || [];

  const uniquePages = Array.from(
    new Map(pages.map((page) => [page.slug, page])).values()
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vehicle Recovery and Towing Services",
    description:
      "Browse vehicle recovery, towing, breakdown recovery, roadside assistance and vehicle transport pages on AdForge.",
    url: "https://adforge.uk/services/vehicle-recovery",
    isPartOf: {
      "@type": "WebSite",
      name: "AdForge",
      url: "https://adforge.uk",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main className="page">
        <header className="header">
          <div className="wrap headerInner">
            <Link href="/" className="brand">
              <small>LOCAL SERVICE PLATFORM</small>

              <strong>
                Ad<span>Forge</span>
              </strong>
            </Link>

            <div className="headerLinks">
              <Link href="/">Home</Link>

              <Link href="/services/mobile-tyre-fitting">
                Tyre Services
              </Link>

              <Link href="/businesses">
                Businesses
              </Link>

              <Link href="/login" className="loginButton">
                Login
              </Link>
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="heroGlow" />

          <div className="wrap heroInner">
            <div className="badge">
              <span />
              VEHICLE RECOVERY DIRECTORY
            </div>

            <h1>
              Find Vehicle Recovery
              <br />
              <span>& Towing Services</span>
            </h1>

            <p>
              Browse active vehicle recovery, emergency towing, breakdown
              recovery, roadside assistance and vehicle transport pages across
              Liverpool, Merseyside and surrounding areas.
            </p>

            <div className="heroButtons">
              <a href="#recovery-pages" className="primaryButton">
                Browse Recovery Areas
                <span>↓</span>
              </a>

              <Link href="/businesses" className="secondaryButton">
                Find Local Businesses
              </Link>
            </div>

            <div className="stats">
              <div>
                <strong>{uniquePages.length}</strong>
                <span>Active recovery pages</span>
              </div>

              <div>
                <strong>Local</strong>
                <span>Area-based coverage</span>
              </div>

              <div>
                <strong>24-Hour</strong>
                <span>Emergency service pages</span>
              </div>
            </div>
          </div>
        </section>

        <section className="introSection">
          <div className="wrap introGrid">
            <div>
              <span className="sectionLabel">RECOVERY SERVICES</span>

              <h2>Find the right recovery service near you</h2>
            </div>

            <div className="introText">
              <p>
                AdForge contains public pages covering vehicle recovery,
                emergency towing, breakdown assistance, accident recovery,
                roadside support and vehicle transportation.
              </p>

              <p>
                Select a local area below to view the available service
                information and contact options for that location.
              </p>
            </div>
          </div>
        </section>

        <section className="pagesSection" id="recovery-pages">
          <div className="wrap">
            <div className="sectionHeading">
              <div>
                <span className="sectionLabel">ALL ACTIVE PAGES</span>

                <h2>Recovery and towing locations</h2>
              </div>

              <p>
                This directory updates automatically whenever an active
                recovery or towing page is added to AdForge.
              </p>
            </div>

            {error ? (
              <div className="messageCard">
                Recovery pages could not be loaded.
              </div>
            ) : uniquePages.length === 0 ? (
              <div className="messageCard">
                No active recovery pages were found.
              </div>
            ) : (
              <div className="pageGrid">
                {uniquePages.map((page) => (
                  <article className="serviceCard" key={page.slug}>
                    <span className="cardLabel">
                      LOCAL RECOVERY SERVICE
                    </span>

                    <h3>{readableName(page)}</h3>

                    <p>
                      {page.meta_description ||
                        "View local vehicle recovery and towing service information for this area."}
                    </p>

                    <Link href={`/seo/${page.slug}`}>
                      View service page
                      <span>→</span>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="contentSection">
          <div className="wrap contentCard">
            <span className="sectionLabel">ABOUT VEHICLE RECOVERY</span>

            <h2>
              Local recovery support for breakdowns, accidents and transport
            </h2>

            <p>
              Vehicle recovery services can assist when a car, van or other
              vehicle cannot continue its journey. Common reasons include
              mechanical failure, battery problems, accident damage, punctures
              and vehicles that require transportation to a garage or another
              destination.
            </p>

            <p>
              AdForge organises recovery and towing pages by service and
              location, helping customers find relevant local information
              without searching through unrelated areas.
            </p>

            <p>
              Service availability, response times and pricing are determined
              by the individual business providing the recovery service.
              Customers should confirm the collection location, destination,
              vehicle details and charges directly with the provider.
            </p>
          </div>
        </section>

        <footer className="footer">
          <div className="wrap footerInner">
            <div>
              <Link href="/" className="brand">
                <small>LOCAL SERVICE PLATFORM</small>

                <strong>
                  Ad<span>Forge</span>
                </strong>
              </Link>

              <p>
                Find vehicle recovery, towing services, mobile tyre fitting and
                local businesses.
              </p>
            </div>

            <div className="footerLinks">
              <Link href="/">Homepage</Link>

              <Link href="/services/mobile-tyre-fitting">
                Mobile Tyre Fitting
              </Link>

              <Link href="/businesses">
                Local Businesses
              </Link>

              <Link href="/signup">
                List Your Business
              </Link>
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

        .page {
          min-height: 100vh;
          overflow: hidden;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(50, 255, 115, 0.1),
              transparent 28%
            ),
            #05070d;
          font-family: Arial, Helvetica, sans-serif;
        }

        .wrap {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
        }

        .header {
          position: relative;
          z-index: 20;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(5, 7, 13, 0.84);
          backdrop-filter: blur(22px);
        }

        .headerInner {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .brand {
          display: inline-flex;
          flex-direction: column;
        }

        .brand small {
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 4px;
        }

        .brand strong {
          font-size: 34px;
          font-weight: 950;
          letter-spacing: -2px;
          line-height: 1;
        }

        .brand strong span {
          color: #32ff73;
          text-shadow: 0 0 24px rgba(50, 255, 115, 0.4);
        }

        .headerLinks {
          display: flex;
          align-items: center;
          gap: 26px;
        }

        .headerLinks a {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 800;
        }

        .loginButton {
          min-height: 42px;
          padding: 0 18px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
        }

        .hero {
          position: relative;
          min-height: 610px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .hero::before {
          position: absolute;
          inset: 0;
          content: "";
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
          opacity: 0.4;
        }

        .heroGlow {
          position: absolute;
          top: 5%;
          right: 5%;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: rgba(50, 255, 115, 0.13);
          filter: blur(100px);
        }

        .heroInner {
          position: relative;
          z-index: 2;
          padding: 90px 0;
        }

        .badge,
        .sectionLabel {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #32ff73;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .badge {
          min-height: 39px;
          padding: 0 15px;
          border: 1px solid rgba(50, 255, 115, 0.23);
          border-radius: 999px;
          background: rgba(50, 255, 115, 0.055);
        }

        .badge span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #32ff73;
          box-shadow: 0 0 15px #32ff73;
        }

        .hero h1 {
          max-width: 880px;
          margin: 27px 0 24px;
          font-size: clamp(58px, 7vw, 92px);
          font-weight: 950;
          letter-spacing: -6px;
          line-height: 0.93;
        }

        .hero h1 span {
          color: rgba(255, 255, 255, 0.34);
        }

        .hero p {
          max-width: 720px;
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 18px;
          line-height: 1.75;
        }

        .heroButtons {
          margin-top: 35px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 57px;
          padding: 0 24px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
          font-size: 13px;
          font-weight: 950;
        }

        .primaryButton {
          color: #05070d;
          background: #32ff73;
          box-shadow: 0 0 32px rgba(50, 255, 115, 0.2);
        }

        .secondaryButton {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.035);
        }

        .stats {
          margin-top: 45px;
          display: flex;
          flex-wrap: wrap;
          gap: 45px;
        }

        .stats div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stats strong {
          font-size: 17px;
        }

        .stats span {
          color: rgba(255, 255, 255, 0.38);
          font-size: 11px;
        }

        .introSection,
        .pagesSection,
        .contentSection {
          padding: 105px 0;
        }

        .introGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }

        .introGrid h2,
        .sectionHeading h2,
        .contentCard h2 {
          max-width: 830px;
          margin: 16px 0 0;
          font-size: clamp(40px, 5vw, 66px);
          font-weight: 950;
          letter-spacing: -4px;
          line-height: 0.97;
        }

        .introText p,
        .contentCard p {
          margin: 0 0 18px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 14px;
          line-height: 1.8;
        }

        .pagesSection {
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(50, 255, 115, 0.045),
              transparent 32%
            ),
            #070910;
        }

        .sectionHeading {
          margin-bottom: 46px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .sectionHeading > p {
          max-width: 430px;
          margin: 0;
          color: rgba(255, 255, 255, 0.43);
          font-size: 14px;
          line-height: 1.7;
        }

        .pageGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .serviceCard {
          min-height: 275px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 26px;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(50, 255, 115, 0.06),
              transparent 30%
            ),
            rgba(255, 255, 255, 0.02);
        }

        .cardLabel {
          color: #32ff73;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
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
          line-height: 1.7;
        }

        .serviceCard a {
          margin-top: auto;
          padding-top: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 900;
        }

        .serviceCard a span {
          color: #32ff73;
        }

        .messageCard {
          padding: 35px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 24px;
          color: rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.02);
        }

        .contentSection {
          padding-top: 0;
          background: #070910;
        }

        .contentCard {
          padding: 50px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.02);
        }

        .contentCard h2 {
          max-width: 950px;
          font-size: clamp(36px, 4.4vw, 56px);
        }

        .contentCard p {
          max-width: 950px;
          margin-top: 22px;
          margin-bottom: 0;
        }

        .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.075);
          background: #03050a;
        }

        .footerInner {
          padding: 65px 0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 60px;
        }

        .footerInner p {
          max-width: 430px;
          color: rgba(255, 255, 255, 0.38);
          font-size: 12px;
          line-height: 1.7;
        }

        .footerLinks {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .footerLinks a {
          color: rgba(255, 255, 255, 0.42);
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .pageGrid {
            grid-template-columns: 1fr 1fr;
          }

          .introGrid {
            grid-template-columns: 1fr;
            gap: 35px;
          }
        }

        @media (max-width: 720px) {
          .wrap {
            width: min(100% - 28px, 1200px);
          }

          .headerInner {
            min-height: 76px;
          }

          .brand small {
            font-size: 6px;
            letter-spacing: 2px;
          }

          .brand strong {
            font-size: 28px;
          }

          .headerLinks > a:not(.loginButton) {
            display: none;
          }

          .hero {
            min-height: auto;
          }

          .heroInner {
            padding: 68px 0;
          }

          .hero h1 {
            font-size: clamp(48px, 15vw, 68px);
            letter-spacing: -4px;
          }

          .hero p {
            font-size: 15px;
          }

          .heroButtons {
            display: grid;
            grid-template-columns: 1fr;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }

          .stats strong {
            font-size: 13px;
          }

          .stats span {
            font-size: 8px;
          }

          .introSection,
          .pagesSection,
          .contentSection {
            padding: 78px 0;
          }

          .sectionHeading {
            display: block;
          }

          .sectionHeading > p {
            margin-top: 18px;
          }

          .introGrid h2,
          .sectionHeading h2,
          .contentCard h2 {
            font-size: 42px;
            letter-spacing: -2.6px;
          }

          .pageGrid {
            grid-template-columns: 1fr;
          }

          .contentCard {
            padding: 32px 23px;
          }

          .footerInner {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}