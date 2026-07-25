import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  metadataBase: new URL("https://adforge.uk"),
  title: "Mobile Tyre Fitting & Emergency Tyre Services | AdForge",
  description:
    "Find mobile tyre fitting, puncture repair, emergency tyre fitting, flat tyre assistance and locking wheel nut removal across Liverpool, Wirral, Merseyside and nearby areas.",
  alternates: { canonical: "/services/mobile-tyre-fitting" },
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
    title: "Find Mobile Tyre Fitting Services | AdForge",
    description:
      "Browse local mobile tyre fitting, puncture repair and emergency tyre service pages.",
    url: "https://adforge.uk/services/mobile-tyre-fitting",
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
  if (page.headline?.trim()) return page.headline.trim();
  if (page.title_tag?.trim()) return page.title_tag.trim();

  return page.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function MobileTyreFittingHub() {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("slug, headline, title_tag, meta_description")
    .eq("active", true)
    .or(
      [
        "slug.ilike.%tyre%",
        "slug.ilike.%puncture%",
        "slug.ilike.%flat-tyre%",
        "slug.ilike.%locking-wheel-nut%",
        "slug.ilike.%wheel-nut%",
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
    name: "Mobile Tyre Fitting and Emergency Tyre Services",
    url: "https://adforge.uk/services/mobile-tyre-fitting",
    description:
      "Browse mobile tyre fitting, puncture repair, flat tyre assistance and locking wheel nut removal pages on AdForge.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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

            <nav>
              <Link href="/">Home</Link>
              <Link href="/services/vehicle-recovery">Recovery</Link>
              <Link href="/businesses">Businesses</Link>
              <Link href="/login" className="login">
                Login
              </Link>
            </nav>
          </div>
        </header>

        <section className="hero">
          <div className="glow" />

          <div className="wrap heroInner">
            <div className="badge">
              <i />
              MOBILE TYRE SERVICE DIRECTORY
            </div>

            <h1>
              Find Mobile Tyre Fitting
              <span>& Emergency Tyre Help</span>
            </h1>

            <p>
              Browse active mobile tyre fitting, puncture repair, flat tyre
              assistance and locking wheel nut removal pages across Liverpool,
              Wirral, Merseyside and surrounding areas.
            </p>

            <div className="buttons">
              <a href="#tyre-pages" className="primary">
                Browse Tyre Areas <b>↓</b>
              </a>
              <Link href="/businesses" className="secondary">
                Find Local Businesses
              </Link>
            </div>

            <div className="stats">
              <div>
                <strong>{uniquePages.length}</strong>
                <span>Active tyre pages</span>
              </div>
              <div>
                <strong>Local</strong>
                <span>Area-based coverage</span>
              </div>
              <div>
                <strong>24-Hour</strong>
                <span>Emergency tyre pages</span>
              </div>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap introGrid">
            <div>
              <span className="label">TYRE SERVICES</span>
              <h2>Find the right tyre service near you.</h2>
            </div>

            <div className="introText">
              <p>
                AdForge contains public pages for mobile tyre fitting,
                emergency tyre replacement, puncture repair, flat tyre help and
                locking wheel nut removal.
              </p>
              <p>
                Select a local page below to view service information and
                contact options for that location.
              </p>
            </div>
          </div>
        </section>

        <section className="directory" id="tyre-pages">
          <div className="wrap">
            <div className="heading">
              <div>
                <span className="label">ALL ACTIVE PAGES</span>
                <h2>Tyre fitting and puncture locations.</h2>
              </div>
              <p>
                This directory updates automatically whenever an active tyre
                page is added to AdForge.
              </p>
            </div>

            {error ? (
              <div className="message">Tyre pages could not be loaded.</div>
            ) : uniquePages.length === 0 ? (
              <div className="message">No active tyre pages were found.</div>
            ) : (
              <div className="grid">
                {uniquePages.map((page) => (
                  <article className="card" key={page.slug}>
                    <span className="cardLabel">LOCAL TYRE SERVICE</span>
                    <h3>{readableName(page)}</h3>
                    <p>
                      {page.meta_description ||
                        "View local mobile tyre fitting and emergency tyre service information for this area."}
                    </p>
                    <Link href={`/seo/${page.slug}`}>
                      View service page <b>→</b>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="content">
          <div className="wrap contentCard">
            <span className="label">ABOUT MOBILE TYRE FITTING</span>
            <h2>
              Local tyre support for punctures, damaged tyres and emergency
              call-outs.
            </h2>
            <p>
              Mobile tyre fitting can help when a vehicle has a flat, puncture,
              damaged tyre or needs a replacement tyre fitted at home, work or
              the roadside.
            </p>
            <p>
              Availability, arrival times, tyre stock and pricing are set by
              the individual provider. Confirm the vehicle, tyre size, location
              and charges directly with the business.
            </p>
          </div>
        </section>

        <footer>
          <div className="wrap footerInner">
            <div>
              <Link href="/" className="brand">
                <small>LOCAL SERVICE PLATFORM</small>
                <strong>
                  Ad<span>Forge</span>
                </strong>
              </Link>
              <p>
                Find mobile tyre fitting, vehicle recovery and local businesses.
              </p>
            </div>

            <div className="footerLinks">
              <Link href="/">Homepage</Link>
              <Link href="/services/vehicle-recovery">Vehicle Recovery</Link>
              <Link href="/businesses">Local Businesses</Link>
              <Link href="/signup">List Your Business</Link>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth;background:#05070d}
        body{margin:0;background:#05070d;color:#fff}a{color:inherit;text-decoration:none}
        .page{min-height:100vh;overflow:hidden;font-family:Arial,Helvetica,sans-serif;background:radial-gradient(circle at 50% -10%,rgba(50,255,115,.1),transparent 28%),#05070d}
        .wrap{width:min(1200px,calc(100% - 40px));margin:0 auto}
        .header{border-bottom:1px solid rgba(255,255,255,.08);background:rgba(5,7,13,.84);backdrop-filter:blur(22px)}
        .headerInner{min-height:88px;display:flex;align-items:center;justify-content:space-between;gap:30px}
        .brand{display:inline-flex;flex-direction:column}.brand small{margin-bottom:4px;color:rgba(255,255,255,.42);font-size:8px;font-weight:900;letter-spacing:4px}
        .brand strong{font-size:34px;font-weight:950;letter-spacing:-2px;line-height:1}.brand strong span{color:#32ff73;text-shadow:0 0 24px rgba(50,255,115,.4)}
        nav{display:flex;align-items:center;gap:25px}nav a{color:rgba(255,255,255,.6);font-size:12px;font-weight:800}
        .login{min-height:42px;padding:0 18px;border:1px solid rgba(255,255,255,.13);border-radius:999px;display:inline-flex;align-items:center}
        .hero{position:relative;min-height:610px;display:flex;align-items:center;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.07)}
        .hero:before{position:absolute;inset:0;content:"";background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:80px 80px;opacity:.4}
        .glow{position:absolute;top:5%;right:5%;width:520px;height:520px;border-radius:50%;background:rgba(50,255,115,.13);filter:blur(100px)}
        .heroInner{position:relative;z-index:2;padding:90px 0}.badge,.label{display:inline-flex;align-items:center;gap:10px;color:#32ff73;font-size:10px;font-weight:950;letter-spacing:3px}
        .badge{min-height:39px;padding:0 15px;border:1px solid rgba(50,255,115,.23);border-radius:999px;background:rgba(50,255,115,.055)}
        .badge i{width:8px;height:8px;border-radius:50%;background:#32ff73;box-shadow:0 0 15px #32ff73}
        .hero h1{max-width:950px;margin:27px 0 24px;font-size:clamp(58px,7vw,92px);font-weight:950;letter-spacing:-6px;line-height:.93}
        .hero h1 span{display:block;color:rgba(255,255,255,.34)}.hero p{max-width:760px;margin:0;color:rgba(255,255,255,.58);font-size:18px;line-height:1.75}
        .buttons{margin-top:35px;display:flex;flex-wrap:wrap;gap:12px}.primary,.secondary{min-height:57px;padding:0 24px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:25px;font-size:13px;font-weight:950}
        .primary{color:#05070d;background:#32ff73;box-shadow:0 0 32px rgba(50,255,115,.2)}.secondary{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.035)}
        .stats{margin-top:45px;display:flex;flex-wrap:wrap;gap:45px}.stats div{display:flex;flex-direction:column;gap:6px}.stats strong{font-size:17px}.stats span{color:rgba(255,255,255,.38);font-size:11px}
        .intro,.directory,.content{padding:105px 0}.introGrid{display:grid;grid-template-columns:1fr 1fr;gap:80px}
        .intro h2,.heading h2,.content h2{max-width:880px;margin:16px 0 0;font-size:clamp(40px,5vw,66px);font-weight:950;letter-spacing:-4px;line-height:.97}
        .introText p,.contentCard p{margin:0 0 18px;color:rgba(255,255,255,.45);font-size:14px;line-height:1.8}
        .directory{background:radial-gradient(circle at 50% 0%,rgba(50,255,115,.045),transparent 32%),#070910}
        .heading{margin-bottom:46px;display:flex;align-items:flex-end;justify-content:space-between;gap:50px}.heading>p{max-width:430px;margin:0;color:rgba(255,255,255,.43);font-size:14px;line-height:1.7}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{min-height:275px;padding:25px;border:1px solid rgba(255,255,255,.09);border-radius:26px;display:flex;flex-direction:column;background:radial-gradient(circle at 100% 0%,rgba(50,255,115,.06),transparent 30%),rgba(255,255,255,.02)}
        .cardLabel{color:#32ff73;font-size:8px;font-weight:950;letter-spacing:2px}.card h3{margin:25px 0 13px;font-size:22px;letter-spacing:-1px}.card p{margin:0;color:rgba(255,255,255,.42);font-size:13px;line-height:1.7}
        .card a{margin-top:auto;padding-top:25px;display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:900}.card a b{color:#32ff73}
        .message{padding:35px;border:1px solid rgba(255,255,255,.09);border-radius:24px;color:rgba(255,255,255,.55);background:rgba(255,255,255,.02)}
        .content{padding-top:0;background:#070910}.contentCard{padding:50px;border:1px solid rgba(255,255,255,.09);border-radius:30px;background:rgba(255,255,255,.02)}
        .content h2{font-size:clamp(36px,4.4vw,56px)}.contentCard p{max-width:950px;margin-top:22px;margin-bottom:0}
        footer{border-top:1px solid rgba(255,255,255,.075);background:#03050a}.footerInner{padding:65px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:60px}
        .footerInner p{max-width:430px;color:rgba(255,255,255,.38);font-size:12px;line-height:1.7}.footerLinks{display:flex;flex-direction:column;gap:13px}.footerLinks a{color:rgba(255,255,255,.42);font-size:11px}
        @media(max-width:900px){.grid{grid-template-columns:1fr 1fr}.introGrid{grid-template-columns:1fr;gap:35px}}
        @media(max-width:720px){.wrap{width:min(100% - 28px,1200px)}.headerInner{min-height:76px}.brand small{font-size:6px;letter-spacing:2px}.brand strong{font-size:28px}nav>a:not(.login){display:none}
        .hero{min-height:auto}.heroInner{padding:68px 0}.hero h1{font-size:clamp(48px,15vw,68px);letter-spacing:-4px}.hero p{font-size:15px}.buttons{display:grid;grid-template-columns:1fr}.primary,.secondary{width:100%}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.stats strong{font-size:13px}.stats span{font-size:8px}.intro,.directory,.content{padding:78px 0}.heading{display:block}.heading>p{margin-top:18px}
        .intro h2,.heading h2,.content h2{font-size:42px;letter-spacing:-2.6px}.grid{grid-template-columns:1fr}.contentCard{padding:32px 23px}.footerInner{flex-direction:column}}
      `}</style>
    </>
  );
}
