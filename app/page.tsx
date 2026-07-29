import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mobile Tyre Fitting & Vehicle Recovery Liverpool | AdForge",
  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, vehicle recovery and roadside assistance across Liverpool, Wirral and Merseyside.",
  alternates: { canonical: "https://adforge.uk/" },
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

const PHONE = "+447576579923";
const DISPLAY_PHONE = "+44 7576 579923";

const quickServices = [
  ["Mobile Tyres", "Emergency mobile tyre fitting and roadside tyre replacement.", "/services/mobile-tyre-fitting"],
  ["Puncture Repair", "Local puncture repairs and emergency tyre assistance.", "/services/mobile-tyre-fitting"],
  ["Vehicle Recovery", "24-hour breakdown recovery and vehicle transport.", "/services/vehicle-recovery"],
  ["Roadside Help", "Fast roadside assistance across Liverpool and Merseyside.", "/services/vehicle-recovery"],
];

const areas = [
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
      "AdForge helps customers find mobile tyre fitting, vehicle recovery and local roadside services across Liverpool, Wirral and Merseyside.",
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

          <nav className="desktopNav">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <div className="headerActions">
            <a href={`tel:${PHONE}`} className="headerCallButton">
              <span>CALL NOW</span>
              <strong>{DISPLAY_PHONE}</strong>
            </a>

            <Link href="/signup" className="listButton">
              List Business Free <b>→</b>
            </Link>
          </div>
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
          <div className="heroShade" />

          <div className="heroContent">
            <div className="servicePill">
              <span /> 24/7 MOBILE TYRE &amp; RECOVERY SERVICES
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
              <a href={`tel:${PHONE}`} className="primaryButton">
                Call AdForge <b>→</b>
              </a>
              <Link href="/services/mobile-tyre-fitting" className="secondaryButton">
                Find Mobile Tyres <b>→</b>
              </Link>
              <Link href="/services/vehicle-recovery" className="secondaryButton">
                Find Recovery <b>→</b>
              </Link>
            </div>

            <div className="trustRow">
              <div><strong>24/7</strong><span>Emergency support</span></div>
              <div><strong>Local</strong><span>Liverpool coverage</span></div>
              <div><strong>Direct</strong><span>Calls through AdForge</span></div>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="sectionHeading">
            <span>FIND LOCAL SERVICES</span>
            <h2>What help do you need?</h2>
            <p>Browse active AdForge tyre and recovery services near you.</p>
          </div>

          <div className="serviceGrid">
            {quickServices.map(([title, description, href]) => (
              <Link href={href} className="serviceCard" key={title}>
                <div className="serviceIcon">AF</div>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <b>→</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="splitCards">
          <article className="infoCard">
            <div className="infoImage tyreImage"><span>MOBILE TYRE SERVICES</span></div>
            <div className="infoContent">
              <small>MOBILE TYRE FITTING</small>
              <h2>24-hour mobile tyre fitting across Liverpool</h2>
              <p>
                Find emergency mobile tyre fitting, puncture repairs, roadside tyre
                replacement, new and part-worn tyres, wheel balancing and locking
                wheel nut removal through AdForge.
              </p>
              <details>
                <summary>View tyre services <b>+</b></summary>
                <div className="detailsGrid">
                  <span>✓ 24-hour mobile tyre fitting</span>
                  <span>✓ Emergency tyre repair</span>
                  <span>✓ Puncture repairs</span>
                  <span>✓ New and part-worn tyres</span>
                  <span>✓ Wheel balancing</span>
                  <span>✓ Locking nut removal</span>
                </div>
              </details>
              <div className="smallButtons">
                <Link href="/services/mobile-tyre-fitting" className="smallPrimary">Browse Tyre Areas →</Link>
                <a href={`tel:${PHONE}`} className="smallSecondary">Call Now</a>
              </div>
            </div>
          </article>

          <article className="infoCard reverse">
            <div className="infoImage recoveryImage"><span>RECOVERY SERVICES</span></div>
            <div className="infoContent">
              <small>VEHICLE RECOVERY</small>
              <h2>Breakdown recovery and roadside assistance</h2>
              <p>
                Find 24-hour vehicle recovery, breakdown recovery, accident
                recovery, towing, roadside assistance and vehicle transport through
                the central AdForge number.
              </p>
              <details>
                <summary>View recovery services <b>+</b></summary>
                <div className="detailsGrid">
                  <span>✓ 24-hour vehicle recovery</span>
                  <span>✓ Breakdown recovery</span>
                  <span>✓ Accident recovery</span>
                  <span>✓ Towing service</span>
                  <span>✓ Roadside assistance</span>
                  <span>✓ Vehicle transport</span>
                </div>
              </details>
              <div className="smallButtons">
                <Link href="/services/vehicle-recovery" className="smallPrimary">Browse Recovery Areas →</Link>
                <a href={`tel:${PHONE}`} className="smallSecondary">Call Now</a>
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
            <span>LOCAL BUSINESS COVERING LIVERPOOL &amp; MERSEYSIDE</span>
            <h2>Total Tyres &amp; Recovery 247 Ltd</h2>
            <h3>Mobile Tyre Fitting &amp; Tyre Support</h3>
            <p>
              Emergency tyre replacement, puncture repairs, new and part-worn
              tyres, wheel balancing, locking nut removal and roadside tyre support.
            </p>

            <div className="featuredServices">
              <span>✓ Mobile Tyre Fitting</span>
              <span>✓ Puncture Repairs</span>
              <span>✓ New &amp; Part-Worn Tyres</span>
              <span>✓ Emergency Tyre Replacement</span>
              <span>✓ Wheel Balancing</span>
              <span>✓ Locking Nut Removal</span>
            </div>

            <div className="coverageBox"><strong>Coverage:</strong> Liverpool, Wirral &amp; Merseyside</div>

            <div className="featuredButtons">
              <a href={`tel:${PHONE}`} className="featuredPrimary">Call Through AdForge →</a>
              <Link href="/services/mobile-tyre-fitting" className="featuredSecondary">View Services →</Link>
            </div>
          </div>
        </section>

        <section className="section" id="areas">
          <div className="sectionHeading">
            <span>LOCAL COVERAGE</span>
            <h2>Tyre and recovery services near you</h2>
            <p>AdForge covers Liverpool, Wirral, Merseyside and surrounding towns.</p>
          </div>

          <div className="areaGrid">
            {areas.map((area) => (
              <Link href="/services/mobile-tyre-fitting" key={area}>{area}<span>→</span></Link>
            ))}
          </div>
        </section>

        <section className="businessCta">
          <div>
            <span>FOR LOCAL BUSINESSES</span>
            <h2>List your business free on AdForge</h2>
            <p>Create a public listing and upgrade later to advertising tools or the AdForge AI receptionist.</p>
          </div>
          <Link href="/signup" className="ctaButton">Create Free Listing →</Link>
        </section>

        <footer className="footer">
          <Link href="/" className="footerBrand">Ad<span>Forge</span></Link>
          <p>Mobile tyre fitting, vehicle recovery and trusted local services across Liverpool, Wirral and Merseyside.</p>
          <div>
            <Link href="/services/mobile-tyre-fitting">Mobile Tyres</Link>
            <Link href="/services/vehicle-recovery">Vehicle Recovery</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/signup">List Business Free</Link>
          </div>
          <small>© 2026 AdForge</small>
        </footer>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <style>{`
        :root{--g:#32ff73;--p:#080a0d;--l:rgba(255,255,255,.11);--m:#a6abb2}
        *{box-sizing:border-box}html{scroll-behavior:smooth;background:#000}body{margin:0;background:#000;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-decoration:none}.page{min-height:100vh;overflow:hidden;background:#000}
        .topbar{position:absolute;z-index:30;top:0;left:50%;transform:translateX(-50%);width:min(calc(100% - 56px),1380px);min-height:104px;padding:17px 0;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{display:flex;align-items:center;gap:10px}.brandMark{font-size:34px;font-style:italic;font-weight:1000;letter-spacing:-5px}.brandWords{display:flex;flex-direction:column;line-height:.9}.brandWords strong{font-size:27px;font-weight:1000;letter-spacing:-2px}.brandWords strong span{color:var(--g)}.brandWords small{margin-top:8px;color:#90959c;font-size:6px;font-weight:900;letter-spacing:2.2px}
        .desktopNav{display:flex;gap:6px}.desktopNav a{padding:11px 14px;border:1px solid var(--l);border-radius:999px;background:rgba(3,4,6,.76);font-size:11px;font-weight:850;white-space:nowrap}.headerActions{display:flex;align-items:center;gap:9px}.headerCallButton{min-width:168px;min-height:62px;padding:8px 16px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.2);border-radius:19px;background:rgba(5,7,10,.86)}.headerCallButton span{color:var(--g);font-size:9px;font-weight:950;letter-spacing:2.4px}.headerCallButton strong{margin-top:4px;font-size:14px;font-weight:950}.listButton{min-height:48px;padding:0 18px;display:flex;align-items:center;gap:14px;border:1px solid var(--g);border-radius:999px;background:var(--g);color:#031006;font-size:11px;font-weight:950;white-space:nowrap}.mobileNav{display:none}
        .hero{position:relative;min-height:1040px;display:flex;align-items:flex-end}.heroImage{position:absolute;inset:0 0 auto;height:730px;background:url('/images/hero-recovery.png') center 42%/cover no-repeat}.heroShade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.02) 0%,rgba(0,0,0,.03) 46%,#000 71%,#000 100%)}.heroContent{position:relative;z-index:4;width:min(calc(100% - 56px),1280px);margin:0 auto;padding:0 0 60px}.servicePill{width:max-content;max-width:100%;padding:11px 18px;display:flex;align-items:center;gap:10px;border:1px solid rgba(50,255,115,.42);border-radius:999px;background:rgba(2,5,3,.72);font-size:8px;font-weight:950;letter-spacing:2.2px}.servicePill span{width:9px;height:9px;border-radius:50%;background:var(--g);box-shadow:0 0 16px rgba(50,255,115,.9)}
        .hero h1{max-width:760px;margin:20px 0 0;font-size:clamp(52px,6vw,80px);font-weight:1000;line-height:.91;letter-spacing:-4px}.hero h1 span{display:block;color:var(--g)}.hero h2{margin:23px 0 0;font-size:21px}.heroIntro{max-width:750px;margin:14px 0 0;color:var(--m);font-size:16px;line-height:1.68}.heroButtons{margin-top:22px;display:flex;flex-wrap:wrap;gap:9px}.primaryButton,.secondaryButton{min-height:50px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-radius:12px;font-size:11px;font-weight:950}.primaryButton{min-width:170px;border:1px solid var(--g);background:var(--g);color:#021006}.secondaryButton{min-width:165px;border:1px solid rgba(50,255,115,.36);background:#050608}.trustRow{max-width:680px;margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--l);border-radius:14px;background:#07090c;overflow:hidden}.trustRow div{min-height:66px;padding:11px 15px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid var(--l)}.trustRow div:last-child{border-right:0}.trustRow strong{color:var(--g);font-size:17px}.trustRow span{margin-top:3px;color:#92979e;font-size:9px}
        .section,.splitCards,.featuredBusiness,.businessCta,.footer{width:min(calc(100% - 56px),1280px);margin-left:auto;margin-right:auto}.section{padding:78px 0 25px}.sectionHeading{max-width:700px}.sectionHeading>span,.infoContent>small,.featuredContent>span,.businessCta>div>span{color:var(--g);font-size:8px;font-weight:950;letter-spacing:2.8px}.sectionHeading h2{margin:13px 0 0;font-size:clamp(40px,5vw,64px);line-height:.96;letter-spacing:-3.5px}.sectionHeading p{margin:16px 0 0;color:var(--m);font-size:14px;line-height:1.65}.serviceGrid{margin-top:32px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.serviceCard{min-height:132px;padding:18px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:13px;border:1px solid var(--l);border-radius:17px;background:var(--p)}.serviceIcon{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(50,255,115,.42);border-radius:13px;color:var(--g);font-size:11px;font-style:italic;font-weight:950}.serviceCard h3{margin:0;font-size:16px}.serviceCard p{margin:6px 0 0;color:#92979e;font-size:10px;line-height:1.5}.serviceCard>b{color:var(--g);font-size:18px}
        .splitCards{padding:65px 0 30px;display:grid;gap:20px}.infoCard{min-height:490px;display:grid;grid-template-columns:46% 54%;overflow:hidden;border:1px solid var(--l);border-radius:24px;background:var(--p)}.infoCard.reverse{grid-template-columns:54% 46%}.infoCard.reverse .infoImage{order:2}.infoImage{position:relative;min-height:490px;background-size:cover;background-position:center}.infoImage span{position:absolute;top:24px;left:24px;padding:10px 14px;border:1px solid rgba(50,255,115,.44);border-radius:999px;background:rgba(5,7,9,.8);color:var(--g);font-size:8px;font-weight:950;letter-spacing:2px}.tyreImage{background-image:url('/images/mobile-tyre-fitting.jpg')}.recoveryImage{background-image:url('/images/recovery-truck.jpg')}.infoContent{padding:44px;display:flex;flex-direction:column;justify-content:center}.infoContent h2{margin:14px 0 0;font-size:clamp(34px,4.5vw,56px);line-height:.96;letter-spacing:-3.5px}.infoContent>p{margin:20px 0 0;color:#a8adb4;font-size:13px;line-height:1.68}details{margin-top:20px;border:1px solid var(--l);border-radius:13px;background:#050608}summary{min-height:54px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-size:11px;font-weight:900;list-style:none}summary::-webkit-details-marker{display:none}summary b{color:var(--g);font-size:19px}.detailsGrid{padding:0 16px 16px;display:grid;grid-template-columns:1fr 1fr;gap:9px;color:#d9dcdf;font-size:10px}.smallButtons{margin-top:16px;display:flex;gap:9px}.smallPrimary,.smallSecondary{min-height:46px;padding:0 15px;display:flex;align-items:center;border-radius:11px;font-size:10px;font-weight:950}.smallPrimary{background:var(--g);color:#031006}.smallSecondary{border:1px solid rgba(50,255,115,.32)}
        .featuredBusiness{margin-top:65px;display:grid;grid-template-columns:45% 55%;overflow:hidden;border:1px solid rgba(50,255,115,.5);border-radius:25px;background:var(--p)}.featuredImageWrap{position:relative;min-height:530px;overflow:hidden}.featuredImage{width:100%;height:100%;min-height:530px;display:block;object-fit:cover}.featuredBadge{position:absolute;z-index:2;top:24px;left:24px;padding:11px 15px;border:1px solid rgba(50,255,115,.5);border-radius:999px;background:rgba(8,10,13,.9);color:var(--g);font-size:8px;font-weight:950;letter-spacing:2px}.featuredContent{padding:42px;display:flex;flex-direction:column;justify-content:center}.featuredContent h2{margin:14px 0 0;font-size:clamp(37px,4.5vw,58px);line-height:.96;letter-spacing:-3.5px}.featuredContent h3{margin:13px 0 0;color:var(--g);font-size:21px}.featuredContent>p{margin:18px 0 0;color:#a8adb4;font-size:12px;line-height:1.68}.featuredServices{margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:9px 16px;font-size:11px;font-weight:850}.coverageBox{margin-top:20px;padding:13px 15px;border:1px solid var(--l);border-radius:12px;background:#0b0d10;color:#aeb3b9;font-size:11px}.featuredButtons{margin-top:15px;display:grid;grid-template-columns:1.4fr 1fr;gap:9px}.featuredPrimary,.featuredSecondary{min-height:49px;padding:0 16px;display:flex;align-items:center;border-radius:11px;font-size:10px;font-weight:950}.featuredPrimary{background:var(--g);color:#031006}.featuredSecondary{border:1px solid rgba(50,255,115,.32)}
        .areaGrid{margin-top:30px;display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.areaGrid a{min-height:54px;padding:0 15px;display:flex;align-items:center;justify-content:space-between;border:1px solid var(--l);border-radius:12px;background:var(--p);font-size:11px;font-weight:850}.areaGrid span{color:var(--g);font-size:16px}.businessCta{margin-top:70px;padding:42px;display:flex;align-items:center;justify-content:space-between;gap:36px;border:1px solid rgba(50,255,115,.35);border-radius:23px;background:var(--p)}.businessCta>div{max-width:720px}.businessCta h2{margin:13px 0 0;font-size:clamp(34px,4vw,52px);line-height:.96;letter-spacing:-3px}.businessCta p{margin:16px 0 0;color:var(--m);font-size:12px;line-height:1.65}.ctaButton{min-width:188px;min-height:50px;padding:0 17px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--g);color:#031006;font-size:11px;font-weight:950}.footer{margin-top:85px;padding:42px 0 38px;border-top:1px solid var(--l)}.footerBrand{font-size:29px;font-weight:1000;letter-spacing:-2px}.footerBrand span{color:var(--g)}.footer p{max-width:600px;color:#8e939a;font-size:11px;line-height:1.6}.footer>div{margin-top:20px;display:flex;flex-wrap:wrap;gap:10px 20px}.footer>div a{font-size:10px;font-weight:800}.footer small{display:block;margin-top:30px;color:#666b72;font-size:9px}
        @media(max-width:1180px){.desktopNav{display:none}.serviceGrid{grid-template-columns:1fr 1fr}}
        @media(max-width:980px){.topbar{width:calc(100% - 38px)}.listButton{display:none}.mobileNav{position:absolute;z-index:28;top:102px;left:0;width:100%;padding:0 18px 10px;display:flex;gap:7px;overflow-x:auto;scrollbar-width:none}.mobileNav::-webkit-scrollbar{display:none}.mobileNav a{min-height:42px;padding:0 17px;display:flex;align-items:center;flex:0 0 auto;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(5,7,9,.84);font-size:10px;font-weight:850}.infoCard,.infoCard.reverse,.featuredBusiness{grid-template-columns:1fr}.infoCard.reverse .infoImage{order:initial}.infoImage{min-height:370px}.featuredImageWrap,.featuredImage{min-height:440px}.areaGrid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:760px){.topbar{top:0;left:0;transform:none;width:100%;min-height:92px;padding:12px 17px}.brand{gap:7px}.brandMark{font-size:24px}.brandWords strong{font-size:20px}.brandWords small{font-size:5px;letter-spacing:1.6px}.headerCallButton{min-width:152px;min-height:56px;padding:7px 11px;border-radius:16px}.headerCallButton span{font-size:8px;letter-spacing:2px}.headerCallButton strong{font-size:13px}.mobileNav{top:92px}.hero{min-height:980px}.heroImage{height:650px;background-position:center top}.heroShade{background:linear-gradient(180deg,rgba(0,0,0,.02) 0%,rgba(0,0,0,.02) 43%,#000 65%,#000 100%)}.heroContent{width:100%;padding:0 21px 40px}.servicePill{padding:9px 13px;font-size:7px;letter-spacing:1.7px}.hero h1{margin-top:17px;font-size:44px;line-height:.93;letter-spacing:-2.8px}.hero h2{margin-top:20px;font-size:17px}.heroIntro{font-size:12px;line-height:1.64}.heroButtons{display:grid;grid-template-columns:1fr 1fr;margin-top:19px}.primaryButton{grid-column:1/-1}.primaryButton,.secondaryButton{min-width:0;min-height:47px;padding:0 13px;font-size:9px;gap:9px}.trustRow{grid-template-columns:1fr}.trustRow div{min-height:56px;border-right:0;border-bottom:1px solid var(--l)}.trustRow div:last-child{border-bottom:0}.section,.splitCards,.featuredBusiness,.businessCta,.footer{width:calc(100% - 34px)}.section{padding-top:60px}.sectionHeading h2{font-size:40px;letter-spacing:-2.8px}.sectionHeading p{font-size:11px}.serviceGrid{grid-template-columns:1fr}.serviceCard{min-height:105px;padding:16px}.splitCards{padding-top:50px}.infoCard{min-height:0}.infoImage{min-height:270px}.infoContent{padding:27px 19px}.infoContent h2{font-size:37px;letter-spacing:-2.8px}.infoContent>p{font-size:11px}.detailsGrid{grid-template-columns:1fr}.smallButtons{display:grid;grid-template-columns:1fr .65fr}.smallPrimary,.smallSecondary{min-height:44px;padding:0 11px;font-size:9px}.featuredBusiness{margin-top:52px}.featuredImageWrap{min-height:280px;max-height:320px}.featuredImage{min-height:280px;max-height:320px}.featuredBadge{top:17px;left:17px;padding:9px 13px;font-size:7px}.featuredContent{padding:25px 20px 29px}.featuredContent h2{font-size:37px;letter-spacing:-2.8px}.featuredContent h3{font-size:18px}.featuredContent>p{font-size:10px}.featuredServices{grid-template-columns:1fr;font-size:10px}.featuredButtons{grid-template-columns:1fr}.featuredPrimary,.featuredSecondary{min-height:47px}.areaGrid{grid-template-columns:1fr 1fr}.businessCta{margin-top:58px;padding:27px 20px;display:block}.businessCta h2{font-size:37px}.businessCta p{font-size:10px}.ctaButton{width:100%;min-width:0;min-height:48px;margin-top:21px}.footer{margin-top:65px}}
        @media(max-width:430px){.brandMark{display:none}.headerCallButton{min-width:145px}.hero h1{font-size:42px}.heroButtons{grid-template-columns:1fr}.primaryButton{grid-column:auto}.areaGrid{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}
