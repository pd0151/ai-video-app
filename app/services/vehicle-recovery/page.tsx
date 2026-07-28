import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "24-Hour Vehicle Recovery Liverpool | AdForge",
  description:
    "Browse 24-hour vehicle recovery, breakdown recovery, accident recovery, towing service, roadside assistance and vehicle transport pages across Liverpool, Wirral and Merseyside.",
  alternates: {
    canonical: "https://adforge.uk/services/vehicle-recovery",
  },
  openGraph: {
    title: "24-Hour Vehicle Recovery Liverpool | AdForge",
    description:
      "Find breakdown recovery, towing and roadside assistance across Liverpool, Wirral and Merseyside.",
    url: "https://adforge.uk/services/vehicle-recovery",
    siteName: "AdForge",
    type: "website",
    images: ["/images/recovery-truck.jpg"],
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

async function getRecoveryPages() {
  const { data } = await supabase
    .from("landing_pages")
    .select("slug,headline,meta_description,created_at")
    .eq("active", true)
    .or(
      "slug.ilike.%recovery%,slug.ilike.%towing%,slug.ilike.%breakdown%,slug.ilike.%roadside-assistance%,slug.ilike.%vehicle-transport%"
    )
    .order("created_at", { ascending: false })
    .limit(1000);

  return data ?? [];
}

const areas = [
  "Liverpool","Wirral","Bootle","Huyton","Kirkby","St Helens","Widnes",
  "Warrington","Wallasey","Birkenhead","Speke","Prescot"
];

export default async function VehicleRecoveryHubPage() {
  const pages = await getRecoveryPages();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vehicle Recovery Liverpool",
    url: "https://adforge.uk/services/vehicle-recovery",
    description:
      "AdForge 24-hour vehicle recovery, breakdown recovery and towing service directory.",
    isPartOf: {
      "@type": "WebSite",
      name: "AdForge",
      url: "https://adforge.uk/",
    },
  };

  return (
    <>
      <main className="page">
        <header className="topbar">
          <Link href="/" className="brand">
            <span className="mark">AF</span>
            <span className="brandWords">
              <b>Ad<span>Forge</span></b>
              <small>LOCAL SERVICE PLATFORM</small>
            </span>
          </Link>

          <nav>
            <Link href="/">Home</Link>
            <Link href="/services/mobile-tyre-fitting">Mobile Tyres</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/signup">List Business</Link>
          </nav>

          <Link href="/login" className="login">Login</Link>
        </header>

        <section className="hero">
          <div className="heroImage" />
          <div className="heroShade" />

          <div className="heroInner">
            <div className="pill"><i /> VEHICLE RECOVERY SERVICE DIRECTORY</div>
            <h1>
              24-Hour Vehicle Recovery
              <span>Liverpool &amp; Merseyside</span>
            </h1>
            <p>
              Browse active AdForge pages for 24-hour recovery service, breakdown
              recovery, breakdown service, accident recovery, towing service,
              roadside assistance and vehicle transport across Liverpool, Wirral
              and Merseyside.
            </p>

            <div className="heroButtons">
              <a href="#recovery-pages" className="primary">Browse Recovery Areas ↓</a>
              <Link href="/businesses" className="secondary">Find Local Businesses →</Link>
            </div>
          </div>
        </section>

        <section className="stats">
          <article><b>{pages.length}+</b><span>Active recovery pages</span></article>
          <article><b>24/7</b><span>Emergency recovery help</span></article>
          <article><b>Local</b><span>Area-based coverage</span></article>
          <article><b>Direct</b><span>Contact local providers</span></article>
        </section>

        <section className="section">
          <div className="heading">
            <small>VEHICLE RECOVERY SERVICES</small>
            <h2>Help when your vehicle cannot continue.</h2>
            <p>
              AdForge helps drivers find local recovery providers for breakdowns,
              accidents, towing and vehicle transport across Liverpool and
              surrounding areas.
            </p>
          </div>

          <div className="featureGrid">
            <article>
              <b>01</b>
              <h3>Breakdown Recovery</h3>
              <p>Find a breakdown service when a vehicle will not start or cannot continue safely.</p>
            </article>
            <article>
              <b>02</b>
              <h3>Towing Service</h3>
              <p>Arrange towing to a home address, garage, storage site or another safe destination.</p>
            </article>
            <article>
              <b>03</b>
              <h3>Accident &amp; Transport</h3>
              <p>Browse accident recovery, roadside assistance and planned vehicle transport services.</p>
            </article>
          </div>

          <div className="accordion">
            <details open>
              <summary>
                <span><b>24-Hour Vehicle Recovery</b><small>Local recovery day and night</small></span>
                <i>+</i>
              </summary>
              <div className="detail">
                <p>
                  AdForge helps drivers find a 24-hour recovery service across
                  Liverpool, Wirral and Merseyside. Recovery providers may attend
                  roadside breakdowns, accident scenes, homes, workplaces and
                  other safe collection points.
                </p>
                <p>
                  A vehicle may be transported to a garage, home address, storage
                  facility or another agreed destination when it cannot be driven.
                </p>
                <a href="#recovery-pages">Browse local recovery pages →</a>
              </div>
            </details>

            <details>
              <summary>
                <span><b>Breakdown Recovery &amp; Roadside Assistance</b><small>Help when a vehicle stops unexpectedly</small></span>
                <i>+</i>
              </summary>
              <div className="detail">
                <p>
                  A breakdown service can assist when a vehicle has a mechanical
                  fault, flat battery, tyre problem or another issue that prevents
                  it from continuing. Where roadside repair is not possible,
                  breakdown recovery can move the vehicle safely.
                </p>
                <p>
                  AdForge helps customers search for roadside assistance and
                  breakdown recovery across Liverpool and surrounding Merseyside
                  areas.
                </p>
                <a href="#recovery-pages">Find breakdown recovery pages →</a>
              </div>
            </details>

            <details>
              <summary>
                <span><b>Towing, Accident Recovery &amp; Transport</b><small>Safe vehicle movement and collection</small></span>
                <i>+</i>
              </summary>
              <div className="detail">
                <p>
                  A towing service may be needed after a breakdown, accident or
                  mechanical failure. Accident recovery providers can collect
                  damaged vehicles and transport them to a suitable destination.
                </p>
                <p>
                  Vehicle transport can also be used for garage transfers,
                  non-running vehicles, purchases, relocations and planned moves
                  across Liverpool, Wirral and Merseyside.
                </p>
                <a href="#recovery-pages">Browse towing and transport pages →</a>
              </div>
            </details>
          </div>

          <div className="areaTags">
            {areas.map((area) => (
              <Link key={area} href={`/businesses?location=${encodeURIComponent(area)}`}>{area}</Link>
            ))}
          </div>
        </section>

        <section className="pageList" id="recovery-pages">
          <div className="listHeader">
            <div className="heading">
              <small>ACTIVE ADFORGE RECOVERY PAGES</small>
              <h2>Browse vehicle recovery areas.</h2>
            </div>
            <p>{pages.length} active recovery-related pages found</p>
          </div>

          {pages.length > 0 ? (
            <div className="linksGrid">
              {pages.map((page) => (
                <Link key={page.slug} href={`/seo/${page.slug}`}>
                  <b>{page.headline || page.slug.replaceAll("-", " ")}</b>
                  <span>→</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty">No active recovery pages were returned from Supabase.</div>
          )}
        </section>

        <footer className="footer">
          <div>
            <Link href="/" className="brand">
              <span className="mark">AF</span>
              <span className="brandWords">
                <b>Ad<span>Forge</span></b>
                <small>LOCAL SERVICE PLATFORM</small>
              </span>
            </Link>
            <p>
              AdForge helps drivers find 24-hour vehicle recovery, breakdown
              recovery and towing services across Liverpool, Wirral and Merseyside.
            </p>
          </div>
          <nav>
            <Link href="/">Homepage</Link>
            <Link href="/services/mobile-tyre-fitting">Mobile Tyre Hub</Link>
            <Link href="/businesses">Local Businesses</Link>
          </nav>
        </footer>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <style>{`
        :root{--g:#32ff73;--p:#090b0e;--l:rgba(255,255,255,.11);--m:#a9adb5;--max:1380px}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#000;color:#fff;font-family:Inter,system-ui,sans-serif}a{text-decoration:none;color:inherit}.page{min-height:100vh;background:#000;overflow:hidden}
        .topbar{width:min(calc(100% - 56px),var(--max));height:86px;margin:auto;display:flex;align-items:center;gap:24px}.brand{display:flex;align-items:center;gap:10px}.mark{font-size:28px;font-style:italic;font-weight:1000;letter-spacing:-5px}.brandWords{display:flex;flex-direction:column;line-height:.9}.brandWords b{font-size:27px;letter-spacing:-2px}.brandWords b span{color:var(--g)}.brandWords small{margin-top:7px;color:#878c93;font-size:6px;letter-spacing:2px;font-weight:900}.topbar nav{margin-left:auto;display:flex;gap:21px}.topbar nav a{font-size:11px;font-weight:800}.login{min-height:44px;padding:0 18px;display:flex;align-items:center;border:1px solid var(--l);border-radius:999px;font-size:11px;font-weight:900}
        .hero{position:relative;isolation:isolate;min-height:610px;display:flex;align-items:flex-end}.heroImage{position:absolute;inset:0;z-index:-3;background:url("/images/recovery-truck.jpg") center/cover no-repeat}.heroShade{position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(0,0,0,.96),rgba(0,0,0,.7) 42%,rgba(0,0,0,.1)),linear-gradient(0deg,#000,transparent 27%)}.heroInner{width:min(calc(100% - 56px),var(--max));margin:auto;padding:110px 0 64px}.heroInner>*{max-width:760px}.pill{width:max-content;padding:10px 15px;display:flex;align-items:center;gap:10px;border:1px solid rgba(50,255,115,.4);border-radius:999px;background:rgba(0,0,0,.62);color:var(--g);font-size:8px;letter-spacing:2px;font-weight:950}.pill i{width:8px;height:8px;border-radius:50%;background:var(--g);box-shadow:0 0 12px var(--g)}h1{margin:19px 0 0;font-size:clamp(55px,6.4vw,94px);line-height:.88;letter-spacing:-5px;font-weight:1000}h1 span{display:block;color:var(--g)}.heroInner p{margin:22px 0 0;color:#c1c6cc;font-size:15px;line-height:1.75}.heroButtons{margin-top:28px;display:flex;gap:12px}.primary,.secondary{min-height:58px;padding:0 22px;display:flex;align-items:center;border-radius:11px;font-size:12px;font-weight:950}.primary{background:var(--g);color:#031006}.secondary{border:1px solid rgba(50,255,115,.4);background:rgba(0,0,0,.7)}
        .stats,.section,.pageList,.footer{width:min(calc(100% - 56px),var(--max));margin-left:auto;margin-right:auto}.stats{position:relative;z-index:4;margin-top:-16px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--l);border-radius:16px;background:var(--p)}.stats article{padding:20px 22px;border-right:1px solid var(--l)}.stats article:last-child{border-right:0}.stats b{display:block;color:var(--g);font-size:19px}.stats span{color:var(--m);font-size:10px}.section{padding-top:76px}.heading{max-width:790px}.heading small{display:block;margin-bottom:10px;color:var(--g);font-size:8px;letter-spacing:2px;font-weight:950}.heading h2{margin:0;font-size:clamp(38px,4vw,58px);line-height:.98;letter-spacing:-3px}.heading p{margin:15px 0 0;color:var(--m);font-size:13px;line-height:1.75}.featureGrid{margin-top:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.featureGrid article{padding:25px;border:1px solid var(--l);border-radius:16px;background:var(--p)}.featureGrid b{color:var(--g);font-size:11px}.featureGrid h3{margin:14px 0 8px;font-size:21px}.featureGrid p{margin:0;color:var(--m);font-size:11px;line-height:1.65}.accordion{margin-top:29px;display:grid;gap:12px}.accordion details{overflow:hidden;border:1px solid var(--l);border-radius:17px;background:var(--p)}.accordion details[open]{border-color:rgba(50,255,115,.4)}.accordion summary{min-height:88px;padding:17px 21px;display:flex;align-items:center;justify-content:space-between;list-style:none;cursor:pointer}.accordion summary::-webkit-details-marker{display:none}.accordion summary span{display:flex;flex-direction:column;gap:4px}.accordion summary b{font-size:16px}.accordion summary small{color:var(--m);font-size:9px}.accordion summary i{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(50,255,115,.28);border-radius:50%;color:var(--g);font-size:19px;font-style:normal}.accordion details[open] summary i{transform:rotate(45deg)}.detail{padding:0 22px 24px;border-top:1px solid rgba(255,255,255,.07)}.detail p{margin:18px 0 0;color:#bcc1c7;font-size:13px;line-height:1.8}.detail a{display:block;width:max-content;margin-top:20px;color:var(--g);font-size:11px;font-weight:950}.areaTags{margin-top:25px;display:flex;flex-wrap:wrap;gap:9px}.areaTags a{padding:10px 13px;border:1px solid var(--l);border-radius:999px;background:var(--p);font-size:10px}
        .pageList{padding-top:76px}.listHeader{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.listHeader p{margin:0;color:var(--m);font-size:11px}.linksGrid{margin-top:25px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.linksGrid a{min-height:74px;padding:16px 17px;display:flex;align-items:center;justify-content:space-between;gap:14px;border:1px solid var(--l);border-radius:13px;background:var(--p)}.linksGrid a:hover{border-color:rgba(50,255,115,.38)}.linksGrid b{font-size:12px}.linksGrid span{color:var(--g)}.empty{margin-top:25px;padding:24px;border:1px solid var(--l);border-radius:14px;color:var(--m);background:var(--p)}.footer{margin-top:76px;padding:35px 0 28px;display:flex;justify-content:space-between;gap:25px;border-top:1px solid var(--l)}.footer p{max-width:520px;color:var(--m);font-size:11px}.footer nav{display:grid;gap:9px}.footer nav a{font-size:10px;color:#b3b7bd}
        @media(max-width:980px){.topbar nav{display:none}.featureGrid,.linksGrid{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr 1fr}.stats article:nth-child(2){border-right:0}}
        @media(max-width:760px){.topbar{width:100%;height:76px;padding:0 20px}.mark{font-size:23px}.brandWords b{font-size:21px}.brandWords small{font-size:5px}.login{margin-left:auto}.hero{display:block;min-height:auto}.heroImage{position:relative;inset:auto;z-index:1;height:390px;background-position:center}.heroShade{display:none}.heroInner{width:100%;padding:28px 24px 38px;background:#000}.pill{font-size:7px;letter-spacing:1.2px}h1{font-size:clamp(43px,12vw,57px);letter-spacing:-3.6px}.heroInner p{font-size:14px}.heroButtons{display:grid}.primary,.secondary{min-height:61px;font-size:13px}.stats,.section,.pageList,.footer{width:calc(100% - 30px)}.stats{margin-top:14px}.stats article{padding:16px}.section,.pageList{padding-top:62px}.featureGrid,.linksGrid{grid-template-columns:1fr}.accordion summary{padding:14px}.accordion summary b{font-size:14px}.detail{padding:0 15px 20px}.detail p{font-size:12px}.listHeader{align-items:flex-start;flex-direction:column}.footer{margin-top:62px;flex-direction:column}}
      `}</style>
    </>
  );
}
