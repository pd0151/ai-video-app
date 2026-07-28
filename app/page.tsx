import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",
  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, new and part-worn tyres, locking nut removal, wheel balancing, vehicle recovery, breakdown recovery and towing services across Liverpool, Wirral and Merseyside.",
  alternates: { canonical: "https://adforge.uk/" },
  openGraph: {
    title: "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",
    description:
      "AdForge helps drivers find mobile tyre fitting, emergency tyre repair, vehicle recovery, breakdown recovery and towing across Liverpool, Wirral and Merseyside.",
    url: "https://adforge.uk/",
    siteName: "AdForge",
    type: "website",
    images: ["/images/hero-recovery.png"],
  },
};

const cards = [
  {
    title: "Mobile Tyre Fitting",
    text: "24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, new and part-worn tyres, locking nut removal and wheel balancing.",
    image: "/images/mobile-tyre-fitting.jpg",
    href: "/services/mobile-tyre-fitting",
  },
  {
    title: "Vehicle Recovery",
    text: "24-hour vehicle recovery, breakdown recovery, accident recovery, towing service, roadside assistance and vehicle transport.",
    image: "/images/recovery-truck.jpg",
    href: "/services/vehicle-recovery",
  },
  {
    title: "Local Businesses",
    text: "Browse trusted local businesses across Liverpool, Wirral, Merseyside and surrounding areas.",
    image: "/images/hero-recovery.png",
    href: "/businesses",
  },
];

const areas = ["Liverpool","Wirral","Bootle","Huyton","Kirkby","St Helens","Widnes","Warrington"];

export default function PublicHomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://adforge.uk/#website",
        url: "https://adforge.uk/",
        name: "AdForge",
      },
      {
        "@type": "Organization",
        "@id": "https://adforge.uk/#organization",
        name: "AdForge",
        url: "https://adforge.uk/",
        logo: "https://adforge.uk/images/adforge-logo.png",
        areaServed: ["Liverpool","Wirral","Merseyside"],
      },
    ],
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

          <nav className="desktopNav">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <Link href="/signup" className="listBtn">List Business Free →</Link>
        </header>

        <nav className="mobileNav">
          <Link href="#services">Services</Link>
          <Link href="/businesses">Businesses</Link>
          <Link href="/ai-receptionist">AI Receptionist</Link>
          <Link href="#areas">Areas</Link>
          <Link href="/home">Open App</Link>
        </nav>

        <section className="hero">
          <div className="heroImage" />
          <div className="heroFade" />
          <div className="heroCopy">
            <div className="pill"><i /> 24/7 MOBILE TYRE &amp; RECOVERY SERVICES</div>
            <h1>
              Mobile Tyre Fitting &amp;
              <span>Vehicle Recovery Liverpool</span>
            </h1>
            <strong>Find local help. Get moving again.</strong>
            <p>
              AdForge helps drivers find 24-hour mobile tyre fitting, emergency tyre repair,
              puncture repairs, mobile tyres, new and part-worn tyres, vehicle recovery,
              breakdown recovery, towing services and roadside assistance across Liverpool,
              Wirral and Merseyside.
            </p>
            <div className="heroButtons">
              <Link href="/services/mobile-tyre-fitting" className="primary">Find Mobile Tyres →</Link>
              <Link href="/services/vehicle-recovery" className="secondary">Find Vehicle Recovery →</Link>
            </div>
          </div>
        </section>

        <section className="trust">
          <article><b>24/7</b><span>Emergency call-out support</span></article>
          <article><b>Local</b><span>Liverpool, Wirral &amp; Merseyside</span></article>
          <article><b>Direct</b><span>Contact local providers</span></article>
          <article><b>Free</b><span>Browse AdForge services</span></article>
        </section>

        <section className="section" id="services">
          <div className="heading">
            <small>POPULAR SERVICES</small>
            <h2>Find the service you need.</h2>
            <p>
              AdForge connects customers with mobile tyre fitting, vehicle recovery and
              trusted local businesses without clutter or complicated forms.
            </p>
          </div>

          <div className="cardGrid">
            {cards.map((card) => (
              <Link href={card.href} className="card" key={card.title}>
                <div className="cardImage" style={{ backgroundImage: `url("${card.image}")` }} />
                <div className="cardBody">
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                  <b>Explore service <span>→</span></b>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="heading">
            <small>ADFORGE SERVICE GUIDE</small>
            <h2>Useful information in clean open boxes.</h2>
            <p>
              Open each section for detailed mobile tyre fitting and vehicle recovery
              information while keeping the homepage simple and premium.
            </p>
          </div>

          <div className="accordion">
            <details open>
              <summary><span><b>24-Hour Mobile Tyre Fitting</b><small>Mobile tyres at home, work or roadside</small></span><i>+</i></summary>
              <div className="detail">
                <p>
                  AdForge helps customers find a 24-hour mobile tyre fitting service across
                  Liverpool, Wirral and Merseyside. Mobile tyre fitters can attend at home,
                  at work or at the roadside for flat tyres, damaged tyres and urgent
                  replacement tyres.
                </p>
                <p>
                  Available services may include emergency tyre repair, puncture repairs,
                  new and part-worn tyres, roadside tyre replacement, locking nut removal
                  and wheel balancing. A 24-hour emergency call-out can help drivers get
                  moving again without travelling to a garage.
                </p>
                <Link href="/services/mobile-tyre-fitting">Browse mobile tyre services →</Link>
              </div>
            </details>

            <details>
              <summary><span><b>Emergency Tyre Repair &amp; Punctures</b><small>Fast help for flat or damaged tyres</small></span><i>+</i></summary>
              <div className="detail">
                <p>
                  A puncture does not always require a replacement tyre. AdForge helps
                  drivers find puncture repair and emergency tyre repair providers who can
                  inspect the damage and confirm whether a safe repair is possible.
                </p>
                <p>
                  Where repair is unsuitable, a mobile tyre fitting provider can arrange
                  roadside tyre replacement using new or part-worn tyres. Mobile tyres,
                  valve replacement, wheel balancing and locking nut removal may also be
                  available.
                </p>
                <Link href="/services/mobile-tyre-fitting">Find emergency tyre repair →</Link>
              </div>
            </details>

            <details>
              <summary><span><b>24-Hour Vehicle Recovery</b><small>Breakdown recovery, towing and transport</small></span><i>+</i></summary>
              <div className="detail">
                <p>
                  AdForge helps drivers find a 24-hour recovery service when a vehicle
                  cannot be driven safely. Local providers may attend breakdowns,
                  accidents and roadside emergencies throughout Liverpool, Wirral and
                  Merseyside.
                </p>
                <p>
                  Services may include breakdown recovery, breakdown service, accident
                  recovery, towing service, roadside assistance and vehicle transport to
                  a home address, garage or another safe destination.
                </p>
                <Link href="/services/vehicle-recovery">Browse recovery services →</Link>
              </div>
            </details>

            <details>
              <summary><span><b>Why Customers Use AdForge</b><small>Local service discovery made simple</small></span><i>+</i></summary>
              <div className="detail">
                <p>
                  AdForge is a local service platform connecting customers with mobile
                  tyre fitting providers, vehicle recovery operators and trusted local
                  businesses. Customers can search by service and location and contact a
                  provider directly.
                </p>
                <p>
                  AdForge covers Liverpool, Wirral and Merseyside for mobile tyres,
                  emergency tyre repair, puncture repairs, new and part-worn tyres, wheel
                  balancing, locking nut removal, breakdown recovery and towing.
                </p>
                <Link href="/businesses">Browse businesses on AdForge →</Link>
              </div>
            </details>
          </div>
        </section>

        <section className="featured">
          <div className="featuredImage">
            <span>FEATURED LOCAL PROVIDER</span>
            <img src="/images/totaltyres.jpeg" alt="Total Tyres mobile tyre fitting van in Liverpool" />
          </div>
          <div className="featuredCopy">
            <small>LOCAL BUSINESS COVERING LIVERPOOL &amp; MERSEYSIDE</small>
            <h2>Total Tyres &amp; Recovery 247 Ltd</h2>
            <h3>Mobile Tyre Fitting &amp; Tyre Support</h3>
            <p>
              Local mobile tyre fitting provider offering emergency tyre replacement,
              puncture repairs, new and part-worn tyres, wheel balancing, locking nut
              removal and roadside tyre support.
            </p>
            <div className="checks">
              <span>✓ Mobile Tyre Fitting</span><span>✓ Puncture Repairs</span>
              <span>✓ New &amp; Part-Worn Tyres</span><span>✓ Emergency Tyre Replacement</span>
              <span>✓ Wheel Balancing</span><span>✓ Locking Nut Removal</span>
            </div>
            <div className="coverage"><b>Coverage:</b> Liverpool, Wirral &amp; Merseyside</div>
            <div className="featuredButtons">
              <a href="tel:07385182500" className="primary">Call Through AdForge →</a>
              <Link href="/services/mobile-tyre-fitting" className="secondary">View Services →</Link>
            </div>
          </div>
        </section>

        <section className="section" id="areas">
          <div className="heading">
            <small>LOCAL COVERAGE</small>
            <h2>Tyre fitting and recovery across Merseyside.</h2>
          </div>
          <div className="areas">
            {areas.map((area) => (
              <Link key={area} href={`/businesses?location=${encodeURIComponent(area)}`}>{area}<span>→</span></Link>
            ))}
          </div>
        </section>

        <section className="cta">
          <div>
            <small>FOR LOCAL BUSINESSES</small>
            <h2>Get discovered on AdForge.</h2>
            <p>List your business free and appear alongside local tyre fitting and recovery providers.</p>
          </div>
          <Link href="/signup" className="primary">List Business Free →</Link>
        </section>

        <footer className="footer">
          <Link href="/" className="brand">
            <span className="mark">AF</span>
            <span className="brandWords"><b>Ad<span>Forge</span></b><small>LOCAL SERVICE PLATFORM</small></span>
          </Link>
          <div>
            <Link href="/services/mobile-tyre-fitting">Mobile Tyre Fitting</Link>
            <Link href="/services/vehicle-recovery">Vehicle Recovery</Link>
            <Link href="/businesses">Local Businesses</Link>
          </div>
        </footer>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <style>{`
        :root{--g:#32ff73;--p:#090b0e;--l:rgba(255,255,255,.11);--m:#a9adb5;--max:1380px}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#000;color:#fff;font-family:Inter,system-ui,sans-serif}a{text-decoration:none;color:inherit}.page{background:#000;min-height:100vh;overflow:hidden}
        .topbar{position:absolute;z-index:30;top:0;left:50%;transform:translateX(-50%);width:min(calc(100% - 56px),var(--max));height:88px;display:flex;align-items:center;gap:25px}.brand{display:flex;align-items:center;gap:10px}.mark{font-size:29px;font-style:italic;font-weight:1000;letter-spacing:-5px}.brandWords{display:flex;flex-direction:column;line-height:.9}.brandWords b{font-size:27px;letter-spacing:-2px}.brandWords b span{color:var(--g)}.brandWords small{margin-top:7px;color:#858b92;font-size:6px;letter-spacing:2px;font-weight:900}.desktopNav{margin-left:auto;display:flex;gap:22px}.desktopNav a{font-size:11px;font-weight:800}.listBtn,.primary,.secondary{display:flex;align-items:center;justify-content:space-between;border-radius:11px;font-weight:900}.listBtn{min-height:46px;padding:0 19px;background:var(--g);color:#031006;font-size:11px}.mobileNav{display:none}
        .hero{position:relative;min-height:720px;display:flex;align-items:flex-end;isolation:isolate}.heroImage{position:absolute;inset:0;z-index:-3;background:url("/images/hero-recovery.png") center 55%/cover no-repeat}.heroFade{position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(0,0,0,.96),rgba(0,0,0,.7) 38%,rgba(0,0,0,.12) 68%,transparent),linear-gradient(0deg,#000,transparent 30%)}.heroCopy{width:min(calc(100% - 56px),var(--max));margin:auto;padding:145px 0 70px}.heroCopy>*{max-width:710px}.pill{width:max-content;max-width:100%;display:flex;align-items:center;gap:10px;padding:10px 15px;border:1px solid rgba(50,255,115,.4);border-radius:999px;background:rgba(0,0,0,.6);font-size:8px;letter-spacing:1.7px;font-weight:950}.pill i{width:8px;height:8px;border-radius:50%;background:var(--g);box-shadow:0 0 12px var(--g)}h1{margin:19px 0 0;font-size:clamp(54px,6vw,88px);line-height:.9;letter-spacing:-5px;font-weight:1000}h1 span{display:block;color:var(--g)}.heroCopy>strong{display:block;margin:21px 0 8px;font-size:17px}.heroCopy>p{margin:0 0 26px;color:#c1c5cb;font-size:15px;line-height:1.7}.heroButtons,.featuredButtons{display:grid;grid-template-columns:1fr 1fr;gap:11px}.primary,.secondary{min-height:58px;padding:0 22px;font-size:12px}.primary{background:var(--g);color:#031006;border:1px solid var(--g)}.secondary{background:rgba(0,0,0,.74);border:1px solid rgba(50,255,115,.4)}
        .trust,.section,.featured,.cta,.footer{width:min(calc(100% - 56px),var(--max));margin-left:auto;margin-right:auto}.trust{position:relative;z-index:4;margin-top:-18px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--l);border-radius:16px;background:var(--p)}.trust article{padding:19px 22px;border-right:1px solid var(--l)}.trust article:last-child{border-right:0}.trust b{display:block;color:var(--g);font-size:18px}.trust span{color:var(--m);font-size:10px}.section{padding-top:76px}.heading{max-width:790px}.heading small,.featuredCopy>small,.cta small{display:block;margin-bottom:10px;color:var(--g);font-size:8px;letter-spacing:2px;font-weight:950}.heading h2,.featuredCopy h2,.cta h2{margin:0;font-size:clamp(38px,4vw,58px);line-height:.98;letter-spacing:-3px}.heading p{margin:15px 0 0;color:var(--m);font-size:13px;line-height:1.75}.cardGrid{margin-top:29px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{overflow:hidden;border:1px solid var(--l);border-radius:17px;background:var(--p)}.cardImage{height:220px;background-position:center;background-size:cover}.cardBody{min-height:205px;padding:22px;display:flex;flex-direction:column;justify-content:space-between}.cardBody h3{margin:0 0 9px;font-size:22px}.cardBody p{margin:0;color:var(--m);font-size:12px;line-height:1.65}.cardBody>b{display:flex;justify-content:space-between;color:var(--g);font-size:11px}.accordion{margin-top:29px;display:grid;gap:12px}.accordion details{overflow:hidden;border:1px solid var(--l);border-radius:17px;background:var(--p)}.accordion details[open]{border-color:rgba(50,255,115,.4)}.accordion summary{min-height:88px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;list-style:none;cursor:pointer}.accordion summary::-webkit-details-marker{display:none}.accordion summary span{display:flex;flex-direction:column;gap:5px}.accordion summary b{font-size:16px}.accordion summary small{color:var(--m);font-size:9px}.accordion summary i{width:34px;height:34px;display:grid;place-items:center;border:1px solid rgba(50,255,115,.3);border-radius:50%;color:var(--g);font-size:19px;font-style:normal}.accordion details[open] summary i{transform:rotate(45deg)}.detail{padding:0 22px 24px;border-top:1px solid rgba(255,255,255,.07)}.detail p{margin:18px 0 0;color:#bcc1c7;font-size:13px;line-height:1.8}.detail a{display:block;width:max-content;margin-top:20px;color:var(--g);font-size:11px;font-weight:950}
        .featured{margin-top:76px;display:grid;grid-template-columns:42% 58%;overflow:hidden;border:1px solid rgba(50,255,115,.45);border-radius:20px;background:#080a0d}.featuredImage{position:relative;min-height:430px}.featuredImage>span{position:absolute;z-index:2;top:22px;left:22px;padding:10px 15px;border:1px solid rgba(50,255,115,.45);border-radius:999px;background:#0b0d10;color:var(--g);font-size:8px;letter-spacing:2px;font-weight:950}.featuredImage img{width:100%;height:100%;display:block;object-fit:cover}.featuredCopy{padding:31px}.featuredCopy h2{font-size:44px}.featuredCopy h3{margin:7px 0 0;color:var(--g);font-size:19px}.featuredCopy p{margin:16px 0;color:#bfc4ca;font-size:12px;line-height:1.7}.checks{display:grid;grid-template-columns:1fr 1fr;gap:9px;font-size:11px;font-weight:800}.checks span::first-letter{color:var(--g)}.coverage{margin:17px 0;padding:13px 15px;border:1px solid var(--l);border-radius:11px;color:#adb2b8;font-size:11px}.areas{margin-top:25px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--l)}.areas a{min-height:60px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;border-right:1px solid var(--l);border-bottom:1px solid var(--l);font-size:11px;font-weight:800}.areas a:nth-child(4n){border-right:0}.areas span{color:var(--g)}.cta{margin-top:76px;padding:31px;display:flex;align-items:center;justify-content:space-between;gap:30px;border:1px solid rgba(50,255,115,.35);border-radius:18px;background:var(--p)}.cta>div{max-width:760px}.cta p{margin:13px 0 0;color:var(--m);font-size:12px}.footer{margin-top:76px;padding:35px 0 28px;display:flex;justify-content:space-between;border-top:1px solid var(--l)}.footer>div{display:grid;gap:9px}.footer>div a{font-size:10px;color:#b3b7bd}
        @media(max-width:980px){.desktopNav{display:none}.cardGrid{grid-template-columns:1fr}.featured{grid-template-columns:1fr}.trust{grid-template-columns:1fr 1fr}.trust article:nth-child(2){border-right:0}}
        .featuredImageWrap {
  min-height: 280px;
  max-height: 320px;
}

.featuredImage {
  min-height: 280px;
  max-height: 320px;
  object-fit: cover;
  object-position: center;
}
        @media(max-width:760px){.topbar{top:0;left:0;transform:none;width:100%;height:76px;padding:0 20px;background:linear-gradient(180deg,rgba(0,0,0,.96),rgba(0,0,0,.54),transparent)}.mark{font-size:23px}.brandWords b{font-size:21px}.brandWords small{font-size:5px}.listBtn{margin-left:auto;min-height:42px;padding:0 14px;border-radius:999px;font-size:10px}.mobileNav{position:absolute;z-index:29;top:74px;left:0;width:100%;display:flex;gap:8px;overflow-x:auto;padding:2px 14px 8px;scrollbar-width:none}.mobileNav a{flex:0 0 auto;min-height:34px;padding:0 13px;display:flex;align-items:center;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(0,0,0,.72);font-size:10px;font-weight:850}.hero{display:block;min-height:auto}.heroImage{position:relative;inset:auto;z-index:1;height:450px;background-position:56% center}.heroFade{display:none}.heroCopy{width:100%;padding:25px 24px 38px;background:#000}.pill{font-size:7px;letter-spacing:1.1px}h1{font-size:clamp(42px,11.6vw,54px);letter-spacing:-3.6px}.heroCopy>strong{font-size:15px}.heroCopy>p{font-size:14px}.heroButtons,.featuredButtons{grid-template-columns:1fr}.primary,.secondary{min-height:61px;font-size:13px}.trust,.section,.featured,.cta,.footer{width:calc(100% - 30px)}.trust{margin-top:14px}.section{padding-top:62px}.card{display:grid;grid-template-columns:42% 58%;min-height:190px}.cardImage{height:100%;min-height:190px}.cardBody{min-height:190px;padding:17px}.cardBody h3{font-size:19px}.cardBody p{font-size:10px}.accordion summary{padding:15px}.accordion summary b{font-size:14px}.detail{padding:0 15px 20px}.detail p{font-size:12px}.featured{margin-top:62px}.featuredImage{min-height:260px}.featuredCopy{padding:23px 20px}.featuredCopy h2{font-size:35px}.checks{grid-template-columns:1fr}.areas{grid-template-columns:1fr}.areas a{border-right:0!important}.cta{margin-top:62px;flex-direction:column;align-items:flex-start;padding:24px 20px}.footer{margin-top:62px;flex-direction:column;gap:25px}}
      `}</style>
    </>
  );
}
