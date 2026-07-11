import React, { CSSProperties } from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PHONE = "+447576579923";
const DISPLAY_PHONE = "07576 579923";

type LandingPage = {
  id?: string;
  slug: string;
  headline: string;
  title_tag?: string | null;
  meta_description?: string | null;
  content?: string | null;
  active?: boolean | null;
};

type RelatedPage = { slug: string; headline: string };
type ServiceItem = { title: string; description: string; image: string; alt: string };

function titleCase(value: string) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

function extractLocation(page: LandingPage) {
  const source = page.headline || titleCase(page.slug);
  const cleaned = source
    .replace(/^24\s*hour\s*/i, "")
    .replace(/emergency\s*/i, "")
    .replace(/mobile\s*/i, "")
    .replace(/new\s+and\s+part\s+worn\s+tyres?\s*/i, "")
    .replace(/part\s+worn\s+tyres?\s*/i, "")
    .replace(/new\s+tyres?\s*/i, "")
    .replace(/tyre\s+replacement\s*/i, "")
    .replace(/tyre\s+repair\s*/i, "")
    .replace(/tyre\s+fitting\s*/i, "")
    .replace(/puncture\s+repair\s*/i, "")
    .replace(/locking\s+wheel\s+nut\s+removal\s*/i, "")
    .replace(/wheel\s+balancing\s*/i, "")
    .replace(/vehicle\s+breakdown\s+recovery\s+service\s*/i, "")
    .replace(/breakdown\s+recovery\s+service\s*/i, "")
    .replace(/vehicle\s+recovery\s+service\s*/i, "")
    .replace(/recovery\s+service\s*/i, "")
    .replace(/breakdown\s+recovery\s*/i, "")
    .replace(/vehicle\s+recovery\s*/i, "")
    .replace(/car\s+towing\s+service\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "your local area";
}

function pageType(page: LandingPage): "tyre" | "recovery" | "custom" {
  const text = `${page.slug} ${page.headline}`.toLowerCase();
  if (
    text.includes("tyre") || text.includes("puncture") ||
    text.includes("wheel-nut") || text.includes("wheel nut") ||
    text.includes("locking-nut") || text.includes("locking nut")
  ) return "tyre";
  if (
    text.includes("recovery") || text.includes("breakdown") ||
    text.includes("towing") || text.includes("vehicle transport")
  ) return "recovery";
  return "custom";
}

function splitContentSections(content: string) {
  const lines = String(content || "").split("\n");
  const sections: { title: string; body: string[] }[] = [];
  let current = { title: "Read more about this service", body: [] as string[] };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (current.body.length && current.body[current.body.length - 1] !== "") current.body.push("");
      continue;
    }
    if (line.startsWith("#")) {
      if (current.body.some(Boolean)) sections.push(current);
      current = { title: line.replace(/^#+\s*/, "").trim() || "Service information", body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.body.some(Boolean)) sections.push(current);
  return sections;
}

function tyreServices(location: string): ServiceItem[] {
  return [
    ["24 Hour Mobile Tyre Fitting", `AdForge helps customers find mobile tyre fitters in ${location} for home, workplace and roadside call-outs, including urgent 24 hour tyre fitting.`, "/images/seo-v4/mobile-tyre-fitting.svg"],
    ["New Tyres", "New tyres for cars, vans and commercial vehicles, with budget, mid-range and premium options available through local tyre fitters.", "/images/seo-v4/new-tyres.svg"],
    ["Part Worn Tyres", "Affordable part worn tyres for drivers who need a lower-cost replacement, subject to size, condition and local stock availability.", "/images/seo-v4/part-worn-tyres.svg"],
    ["Puncture Repairs", "Professional puncture repair for suitable tyre damage, including checks for nails, screws, slow punctures and valve leaks.", "/images/seo-v4/puncture-repair.svg"],
    ["Locking Wheel Nut Removal", "Help removing damaged, missing or seized locking wheel nuts so tyre replacement can continue without unnecessary delay.", "/images/seo-v4/locking-wheel-nut.svg"],
    ["Wheel Balancing", "Wheel balancing helps reduce vibration, improve comfort and support even tyre wear after fitting replacement tyres.", "/images/seo-v4/wheel-balancing.svg"],
    ["Run Flat Tyres", "Supply and fitting for run-flat tyres, including checks to determine whether replacement is required after pressure loss or damage.", "/images/seo-v4/new-tyres.svg"],
    ["Van and Commercial Tyres", "Mobile van tyre fitting for work vehicles and light commercial vehicles at depots, workplaces, homes or roadside locations.", "/images/seo-v4/mobile-tyre-fitting.svg"],
  ].map(([title, description, image]) => ({ title, description, image, alt: `${title} in ${location}` }));
}

function recoveryServices(location: string): ServiceItem[] {
  return [
    ["24 Hour Breakdown Recovery", `AdForge helps drivers find local breakdown recovery in ${location} for cars, vans and other vehicles that cannot continue safely.`, "/images/seo-v4/breakdown-recovery.svg"],
    ["Accident Recovery", "Vehicle collection after an accident, with options for transport to a garage, storage location, home address or approved destination.", "/images/seo-v4/accident-recovery.svg"],
    ["Vehicle Transport", "Local and long-distance vehicle transport for non-runners, purchased vehicles, garage transfers and planned vehicle movements.", "/images/seo-v4/vehicle-transport.svg"],
    ["Motorway Recovery", "Urgent recovery support near motorway routes and major roads when a vehicle is stranded or unsafe to drive.", "/images/seo-v4/motorway-recovery.svg"],
    ["Van Recovery", "Recovery for vans and light commercial vehicles, including work vehicles carrying tools, stock or equipment.", "/images/seo-v4/van-recovery.svg"],
    ["Jump Starts and Flat Batteries", "Roadside battery assistance and jump-start support when a vehicle will not start because of a weak or flat battery.", "/images/seo-v4/jump-start.svg"],
    ["Roadside Assistance", "Initial roadside support for common vehicle problems, with recovery arranged where the fault cannot be resolved safely at the scene.", "/images/seo-v4/breakdown-recovery.svg"],
    ["Long Distance Recovery", "Planned or emergency vehicle transport beyond the local area for home delivery, garage transfers and onward journeys.", "/images/seo-v4/vehicle-transport.svg"],
  ].map(([title, description, image]) => ({ title, description, image, alt: `${title} in ${location}` }));
}

const tyreFaqs = (location: string) => [
  ["Can AdForge help me find 24 hour mobile tyre fitting?", `Yes. AdForge pages help customers find mobile tyre fitters offering emergency call-outs in ${location} and nearby areas.`],
  ["Do mobile tyre fitters supply new tyres?", "Many mobile tyre fitters supply new tyres in budget, mid-range and premium brands."],
  ["Are part worn tyres available?", "Part worn tyres may be available depending on size and local stock. They should be checked for tread depth and structural condition before fitting."],
  ["Can a puncture be repaired at the roadside?", "Some punctures can be repaired if the damage is in a repairable area and the tyre remains structurally safe."],
  ["Can you remove a locking wheel nut without the key?", "Specialist locking wheel nut removal may be possible when the key is missing, damaged or no longer grips correctly."],
  ["Is wheel balancing available?", "Wheel balancing is commonly carried out after tyre replacement to reduce vibration and help the tyre wear evenly."],
  ["Can tyres be fitted at home or work?", "Yes. Mobile tyre fitting can usually be arranged at a home address, workplace, car park or safe roadside location."],
  ["Do mobile tyre fitters cover vans?", "Many mobile tyre fitters supply and fit van tyres and light commercial tyres."],
];

const recoveryFaqs = (location: string) => [
  ["Can AdForge help arrange breakdown recovery?", `Yes. AdForge local pages help drivers find recovery support in ${location} and surrounding areas.`],
  ["What information should I provide?", "Give your exact location, vehicle make and model, registration, the problem and where you need the vehicle transported."],
  ["Can a recovery operator collect a van?", "Many operators recover vans and light commercial vehicles, but size and weight should be confirmed first."],
  ["Do recovery services cover motorways?", "Motorway recovery is available through suitable operators. Give a marker post, junction or precise location."],
  ["Can a non-running vehicle be transported?", "Yes. Non-runners can often be moved using suitable loading equipment."],
  ["Is long-distance vehicle transport available?", "Many recovery providers offer longer-distance transport based on collection point, destination and vehicle type."],
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
    .from("landing_pages")
    .select("slug,headline,title_tag,meta_description,active")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!data) {
    return {
      title: "AdForge",
      description: "Find trusted local services with AdForge.",
    };
  }

  const title = data.title_tag || data.headline || "AdForge";
  const description = data.meta_description || "";
  const url = `https://adforge.uk/seo/${data.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AdForge",
      type: "website",
      images: [{ url: "https://adforge.uk/icon.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://adforge.uk/icon.png"],
    },
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
  };
}

export default async function SeoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) notFound();

  const page = data as LandingPage;
  const type = pageType(page);
  const location = extractLocation(page);
  const isTyre = type === "tyre";
  const isRecovery = type === "recovery";
  const services = isTyre ? tyreServices(location) : isRecovery ? recoveryServices(location) : [];
  const contentSections = splitContentSections(page.content || "");
  const faqs = isTyre ? tyreFaqs(location) : isRecovery ? recoveryFaqs(location) : [];

  const searchWord = isTyre ? "tyre" : isRecovery ? "recovery" : "";
  let relatedQuery = supabase
    .from("landing_pages")
    .select("slug,headline")
    .eq("active", true)
    .neq("slug", slug)
    .limit(24);

  if (searchWord) relatedQuery = relatedQuery.ilike("slug", `%${searchWord}%`);
  const { data: relatedData } = await relatedQuery;
  const relatedPages = (relatedData || []) as RelatedPage[];

  const heroImage = isTyre ? "/images/mobile-tyre-fitting.jpg" : "/images/recovery-truck.jpg";
  const intro = page.meta_description || (isTyre
    ? `Need mobile tyre fitting in ${location}? AdForge helps customers find local tyre fitters for new tyres, part worn tyres, puncture repairs, locking wheel nut removal, wheel balancing and emergency call-outs.`
    : `Need vehicle recovery in ${location}? AdForge helps drivers find breakdown recovery, accident recovery, vehicle transport and roadside assistance.`);
  const keywordLine = isTyre
    ? "New Tyres · Part Worn Tyres · Puncture Repairs · Locking Wheel Nut Removal · Wheel Balancing · 24 Hour Mobile Tyre Fitting"
    : "Breakdown Recovery · Accident Recovery · Vehicle Transport · Van Recovery · Motorway Recovery · Roadside Assistance";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.headline,
    description: page.meta_description || intro,
    areaServed: location,
    provider: { "@type": "Organization", name: "AdForge", url: "https://adforge.uk" },
    url: `https://adforge.uk/seo/${page.slug}`,
    serviceType: isTyre ? "Mobile tyre fitting" : isRecovery ? "Vehicle breakdown recovery" : page.headline,
  };

  return (
    <>
      <Script id={`service-schema-${page.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={styles.page}>
        <header style={styles.header} className="seo-header">
          <a href="/" style={styles.brandLink}><span style={styles.brandWhite}>Ad</span><span style={styles.brandGreen}>Forge</span><small style={styles.brandSub}>LOCAL EMERGENCY SERVICE</small></a>
          <nav style={styles.desktopNav} className="seo-nav">
            <a href="#services" style={styles.navLink}>Services</a>
            <a href="#why" style={styles.navLink}>Why AdForge</a>
            <a href="#areas" style={styles.navLink}>Areas</a>
            <a href="#faq" style={styles.navLink}>FAQs</a>
          </nav>
          <a href={`tel:${PHONE}`} style={styles.headerCall}><span>Call now</span><small>{DISPLAY_PHONE}</small></a>
        </header>

        <section style={styles.hero}>
          <img src={heroImage} alt="" style={styles.heroImage} />
          <div style={styles.heroShade} />
          <div style={styles.heroInner} className="seo-hero-inner">
            <div style={styles.heroCopy}>
              <div style={styles.eyebrow}>{isTyre ? "24 HOUR MOBILE TYRE FITTING" : isRecovery ? "24 HOUR VEHICLE RECOVERY" : "LOCAL SERVICE"}</div>
              <h1 style={styles.h1}>{page.headline}</h1>
              <p style={styles.heroText}>{intro}</p>
              <p style={styles.keywordLine}>{keywordLine}</p>
              <div style={styles.heroButtons}>
                <a href={`tel:${PHONE}`} style={styles.primaryButton}>Call now</a>
                <a href="#services" style={styles.secondaryButton}>View services</a>
              </div>
              <p style={styles.coverageLine}>Covering {location} and surrounding areas</p>
            </div>
            <div style={styles.heroBadge} className="seo-hero-badge"><span style={styles.heroBadgeTop}>ADFORGE</span><strong>Local service help</strong><small>Fast contact. Clear service information.</small></div>
          </div>
        </section>

        <section style={styles.trustGrid} className="seo-trust-grid">
          {[["24/7","Emergency availability"],["Fast","Direct contact"],["Local",`${location} coverage`],["AdForge","Service information"]].map(([top,bottom]) => <div key={top+bottom} style={styles.trustCard}><strong>{top}</strong><span>{bottom}</span></div>)}
        </section>

        {services.length > 0 && (
          <section id="services" style={styles.section}>
            <p style={styles.sectionLabel}>OUR SERVICES</p>
            <div style={styles.sectionHeadingRow} className="seo-section-heading-row">
              <div><h2 style={styles.h2}>{isTyre ? "Professional tyre services at your doorstep" : "Professional recovery services when you need help"}</h2><p style={styles.sectionIntro}>AdForge brings the main services together on one local page so customers can understand the job and make direct contact quickly.</p></div>
              <a href={`tel:${PHONE}`} style={styles.smallCallButton}>Call {DISPLAY_PHONE}</a>
            </div>
            <div style={styles.serviceGrid} className="seo-service-grid">
              {services.map((service) => <article key={service.title} style={styles.serviceCard}><div style={styles.serviceImageWrap}><img src={service.image} alt={service.alt} style={styles.serviceImage} /></div><h3 style={styles.h3}>{service.title}</h3><p style={styles.cardText}>{service.description}</p><a href={`tel:${PHONE}`} style={styles.cardLink}>Ask about this service →</a></article>)}
            </div>
          </section>
        )}

        <section id="why" style={styles.splitSection} className="seo-split-section">
          <div style={styles.splitCopy}>
            <p style={styles.sectionLabel}>WHY ADFORGE?</p>
            <h2 style={styles.h2}>A clearer way to find local {isTyre ? "tyre fitting" : isRecovery ? "recovery" : "service"} help</h2>
            <p style={styles.bodyText}>AdForge is designed to make local service searches simpler. Each AdForge page explains the service, highlights common jobs and gives a direct call option.</p>
            <p style={styles.bodyText}>This page focuses on {page.headline.toLowerCase()}. {isTyre ? "That includes new tyres, part worn tyres, puncture repairs, locking wheel nut removal, wheel balancing, roadside tyre replacement and 24 hour mobile tyre fitting." : "That includes breakdown recovery, accident recovery, vehicle transport, motorway recovery, van recovery, flat battery help and roadside assistance."}</p>
            <ul style={styles.checkList}><li>Clear service information before calling</li><li>Local pages built around real customer searches</li><li>Direct phone contact for urgent enquiries</li><li>Related local pages for nearby services and areas</li></ul>
          </div>
          <div style={styles.stockCard} className="seo-stock-card"><div><p style={styles.sectionLabel}>{isTyre ? "NEED TYRES TODAY?" : "NEED RECOVERY TODAY?"}</p><h2 style={styles.stockHeading}>{isTyre ? "New tyres, part worn tyres and emergency fitting" : "Breakdown help, recovery and vehicle transport"}</h2><p style={styles.bodyText}>Call now and explain the vehicle, location and service required. AdForge helps customers reach the right local service quickly.</p><a href={`tel:${PHONE}`} style={styles.primaryButton}>Call {DISPLAY_PHONE}</a></div><img src={isTyre ? "/images/seo-v4/new-tyres.svg" : "/images/seo-v4/breakdown-recovery.svg"} alt="" style={styles.stockImage} /></div>
        </section>

        {contentSections.length > 0 && (
          <section style={styles.section}>
            <p style={styles.sectionLabel}>DETAILED SERVICE INFORMATION</p>
            <h2 style={styles.h2}>Everything customers need to know</h2>
            <div style={styles.detailsGrid}>{contentSections.map((section,index) => <details key={`${section.title}-${index}`} style={styles.detailsCard} open={index===0}><summary style={styles.summary}>{section.title}</summary><div style={styles.detailsBody}>{section.body.map((line,lineIndex) => !line ? <div key={lineIndex} style={{height:8}} /> : <p key={lineIndex} style={line.startsWith("•") ? styles.bulletLine : styles.bodyText}>{line}</p>)}</div></details>)}</div>
          </section>
        )}

        <section id="areas" style={styles.areaSection}>
          <div><p style={styles.sectionLabel}>LOCAL COVERAGE</p><h2 style={styles.h2}>{location} and surrounding areas</h2><p style={styles.sectionIntro}>AdForge local pages cover towns, districts, roads, residential areas, workplaces, retail parks, industrial estates and suitable roadside locations around {location}.</p></div>
          <div style={styles.areaPills}>{[location,"Liverpool","Bootle","Kirkby","Huyton","Prescot","St Helens","Widnes","Runcorn","Wirral","Wallasey","Birkenhead","Aigburth","Allerton","Speke","Garston","Sefton","Knowsley","M57","M58","M62","M53"].filter((item,index,array)=>array.indexOf(item)===index).map(area => <span key={area} style={styles.areaPill}>{area}</span>)}</div>
        </section>

        <section id="faq" style={styles.threeColumnSection} className="seo-three-column">
          <div style={styles.panel}><p style={styles.sectionLabel}>POPULAR SEARCHES</p><h3 style={styles.panelHeading}>Customers also search for</h3>{(isTyre ? [`mobile tyre fitting ${location}`,`new tyres ${location}`,`part worn tyres ${location}`,`puncture repair ${location}`,`locking wheel nut removal ${location}`,`wheel balancing ${location}`,"24 hour tyre fitter near me"] : [`breakdown recovery ${location}`,`vehicle recovery ${location}`,"car recovery near me",`accident recovery ${location}`,`van recovery ${location}`,`vehicle transport ${location}`,"24 hour recovery near me"]).map(search => <div key={search} style={styles.searchRow}><span>⌕</span><span>{search}</span></div>)}</div>
          <div style={{...styles.panel,gridColumn:"span 2"}}><p style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</p><h3 style={styles.panelHeading}>Useful answers before you call</h3><div style={styles.faqList}>{faqs.map(([q,a]) => <details key={q} style={styles.faqItem}><summary style={styles.faqSummary}>{q}</summary><p style={styles.faqAnswer}>{a}</p></details>)}</div></div>
        </section>

        {relatedPages.length > 0 && <section style={styles.section}><p style={styles.sectionLabel}>NEARBY PAGES</p><h2 style={styles.h2}>Related local pages</h2><div style={styles.relatedGrid} className="seo-related-grid">{relatedPages.map(related => <a key={related.slug} href={`/seo/${related.slug}`} style={styles.relatedCard}>{related.headline}</a>)}</div></section>}

        <section style={styles.finalCta} className="seo-final-cta"><div><small style={styles.finalSmall}>DON&apos;T WASTE TIME RINGING AROUND</small><h2 style={styles.finalHeading}>Call now for fast local {isTyre ? "tyre help" : isRecovery ? "recovery help" : "service help"}</h2><p style={styles.finalText}>Tell us your location, vehicle and the service you need.</p></div><a href={`tel:${PHONE}`} style={styles.finalButton}>Call {DISPLAY_PHONE}</a></section>
        <footer style={styles.footer}><span>© {new Date().getFullYear()} AdForge</span><span>Local emergency service pages</span><a href="/" style={styles.footerLink}>Home</a></footer>
      </main>

      <style jsx global>{`
        *{box-sizing:border-box} html{scroll-behavior:smooth;background:#030508} body{margin:0;background:#030508;color:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif} a{color:inherit} summary::-webkit-details-marker{display:none}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:980px){.seo-nav{display:none!important}.seo-hero-inner{grid-template-columns:1fr!important;padding:54px 24px 80px!important}.seo-hero-badge{display:none!important}.seo-trust-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;margin-top:-28px!important}.seo-section-heading-row{align-items:flex-start!important;flex-direction:column!important}.seo-service-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.seo-split-section{grid-template-columns:1fr!important}.seo-three-column{grid-template-columns:1fr!important}.seo-related-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.seo-final-cta{align-items:flex-start!important;flex-direction:column!important}}
        @media(max-width:620px){.seo-header{padding:14px 18px!important}.seo-header>a:last-child small{display:none}.seo-service-grid,.seo-related-grid{grid-template-columns:1fr!important}.seo-trust-grid{width:calc(100% - 28px)!important;gap:9px!important}.seo-stock-card{grid-template-columns:1fr!important}.seo-stock-card img{max-width:180px;justify-self:end}}
      `}</style>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  page:{minHeight:"100vh",background:"radial-gradient(circle at 50% -10%, rgba(50,255,115,.1), transparent 28%), #030508",color:"#fff",paddingBottom:70},
  loading:{minHeight:"100vh",display:"grid",placeItems:"center",alignContent:"center",gap:16,background:"#030508",color:"#fff"},
  loader:{width:44,height:44,borderRadius:"50%",border:"4px solid rgba(255,255,255,.12)",borderTopColor:"#32ff73",animation:"spin 1s linear infinite"},
  header:{minHeight:86,padding:"16px clamp(20px,4vw,68px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,background:"rgba(3,5,8,.9)",borderBottom:"1px solid rgba(255,255,255,.08)",position:"relative",zIndex:20},
  brandLink:{textDecoration:"none",fontSize:"clamp(30px,3vw,45px)",lineHeight:.88,fontWeight:1000,letterSpacing:-2.5,display:"inline-flex",flexWrap:"wrap",maxWidth:260}, brandWhite:{color:"#fff"}, brandGreen:{color:"#32ff73"}, brandSub:{width:"100%",fontSize:10,letterSpacing:3,marginTop:9,color:"rgba(255,255,255,.78)"},
  desktopNav:{display:"flex",alignItems:"center",gap:28}, navLink:{textDecoration:"none",fontWeight:800,fontSize:14,color:"rgba(255,255,255,.82)"}, headerCall:{textDecoration:"none",display:"grid",gap:1,textAlign:"right",color:"#32ff73",fontWeight:1000,fontSize:16},
  hero:{minHeight:"min(720px,78vh)",position:"relative",overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,.09)"}, heroImage:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}, heroShade:{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(2,4,7,.98) 0%,rgba(2,4,7,.86) 40%,rgba(2,4,7,.22) 72%,rgba(2,4,7,.38) 100%),linear-gradient(0deg,rgba(2,4,7,.82),transparent 48%)"},
  heroInner:{position:"relative",zIndex:2,minHeight:"min(720px,78vh)",display:"grid",gridTemplateColumns:"minmax(0,760px) minmax(220px,1fr)",alignItems:"center",gap:30,padding:"70px clamp(24px,5vw,80px)"}, heroCopy:{maxWidth:760}, eyebrow:{display:"inline-flex",padding:"12px 20px",borderRadius:999,background:"#32ff73",color:"#041108",fontSize:13,letterSpacing:2,fontWeight:1000,boxShadow:"0 0 34px rgba(50,255,115,.25)"},
  h1:{margin:"26px 0 18px",fontSize:"clamp(50px,7.5vw,112px)",maxWidth:850,lineHeight:.92,letterSpacing:-5,fontWeight:1000,textWrap:"balance" as any}, heroText:{maxWidth:720,margin:0,fontSize:"clamp(17px,1.8vw,24px)",lineHeight:1.55,color:"rgba(255,255,255,.87)"}, keywordLine:{margin:"20px 0 0",maxWidth:760,fontWeight:900,lineHeight:1.5,color:"#eaffef"}, heroButtons:{marginTop:30,display:"flex",flexWrap:"wrap",gap:14},
  primaryButton:{display:"inline-flex",alignItems:"center",justifyContent:"center",minHeight:54,padding:"0 26px",borderRadius:12,background:"#32ff73",color:"#031007",textDecoration:"none",fontWeight:1000,boxShadow:"0 0 28px rgba(50,255,115,.18)"}, secondaryButton:{display:"inline-flex",alignItems:"center",justifyContent:"center",minHeight:54,padding:"0 26px",borderRadius:12,border:"1px solid rgba(255,255,255,.34)",background:"rgba(4,8,13,.54)",backdropFilter:"blur(12px)",textDecoration:"none",fontWeight:900}, coverageLine:{marginTop:20,color:"rgba(255,255,255,.72)",fontWeight:700},
  heroBadge:{justifySelf:"end",alignSelf:"start",maxWidth:260,padding:20,display:"grid",gap:7,borderRadius:16,border:"1px solid rgba(50,255,115,.25)",background:"rgba(4,8,13,.8)",backdropFilter:"blur(18px)"}, heroBadgeTop:{color:"#32ff73",fontWeight:1000,letterSpacing:2,fontSize:12},
  trustGrid:{margin:"-42px auto 0",width:"min(1240px,calc(100% - 40px))",position:"relative",zIndex:5,display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12}, trustCard:{minHeight:110,padding:22,display:"grid",alignContent:"center",gap:8,borderRadius:16,background:"linear-gradient(180deg,#11161d,#0b1016)",border:"1px solid rgba(255,255,255,.11)",boxShadow:"0 22px 60px rgba(0,0,0,.25)"},
  section:{width:"min(1320px,calc(100% - 40px))",margin:"0 auto",padding:"84px 0 0"}, sectionLabel:{margin:"0 0 9px",color:"#32ff73",fontWeight:1000,letterSpacing:2,fontSize:13}, sectionHeadingRow:{display:"flex",alignItems:"end",justifyContent:"space-between",gap:30,marginBottom:28}, h2:{margin:0,fontSize:"clamp(34px,4vw,62px)",lineHeight:1,letterSpacing:-2.5,fontWeight:1000,textWrap:"balance" as any}, sectionIntro:{maxWidth:820,margin:"16px 0 0",color:"rgba(255,255,255,.68)",lineHeight:1.7,fontSize:17}, smallCallButton:{flexShrink:0,minHeight:48,padding:"0 20px",display:"inline-flex",alignItems:"center",justifyContent:"center",textDecoration:"none",borderRadius:12,background:"#32ff73",color:"#031007",fontWeight:1000},
  serviceGrid:{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14}, serviceCard:{minHeight:330,padding:20,borderRadius:18,border:"1px solid rgba(255,255,255,.11)",background:"linear-gradient(180deg,rgba(18,24,31,.98),rgba(10,14,19,.98))",display:"flex",flexDirection:"column",boxShadow:"inset 0 1px rgba(255,255,255,.035)"}, serviceImageWrap:{width:74,height:74,borderRadius:16,display:"grid",placeItems:"center",background:"rgba(50,255,115,.07)",border:"1px solid rgba(50,255,115,.14)",overflow:"hidden"}, serviceImage:{width:"100%",height:"100%",objectFit:"cover"}, h3:{margin:"22px 0 10px",fontSize:22,lineHeight:1.15,fontWeight:1000}, cardText:{margin:0,color:"rgba(255,255,255,.65)",lineHeight:1.65}, cardLink:{marginTop:"auto",paddingTop:20,color:"#32ff73",textDecoration:"none",fontWeight:900},
  splitSection:{width:"min(1320px,calc(100% - 40px))",margin:"84px auto 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}, splitCopy:{padding:"clamp(26px,4vw,54px)",borderRadius:22,background:"#080c11",border:"1px solid rgba(255,255,255,.09)"}, bodyText:{margin:"18px 0 0",color:"rgba(255,255,255,.72)",lineHeight:1.82,fontSize:16}, checkList:{margin:"24px 0 0",paddingLeft:22,color:"rgba(255,255,255,.8)",lineHeight:1.9}, stockCard:{minHeight:460,padding:"clamp(26px,4vw,54px)",borderRadius:22,border:"1px solid rgba(50,255,115,.25)",background:"radial-gradient(circle at 100% 100%,rgba(50,255,115,.12),transparent 35%),#0b1016",display:"grid",gridTemplateColumns:"1fr 210px",gap:20,overflow:"hidden"}, stockHeading:{margin:0,fontSize:"clamp(34px,4vw,56px)",lineHeight:1,letterSpacing:-2}, stockImage:{width:"100%",alignSelf:"end",filter:"drop-shadow(0 0 28px rgba(50,255,115,.12))"},
  detailsGrid:{display:"grid",gap:14,marginTop:28}, detailsCard:{borderRadius:18,border:"1px solid rgba(255,255,255,.1)",background:"#0e1319",overflow:"hidden"}, summary:{cursor:"pointer",padding:"24px 28px",fontWeight:1000,fontSize:21,listStyle:"none"}, detailsBody:{padding:"0 28px 28px",borderTop:"1px solid rgba(255,255,255,.08)"}, bulletLine:{margin:"13px 0 0",color:"#dfffe8",lineHeight:1.65},
  areaSection:{width:"min(1320px,calc(100% - 40px))",margin:"84px auto 0",padding:"clamp(28px,4vw,52px)",borderRadius:22,background:"#080c11",border:"1px solid rgba(255,255,255,.09)"}, areaPills:{display:"flex",flexWrap:"wrap",gap:10,marginTop:28}, areaPill:{padding:"11px 15px",borderRadius:9,border:"1px solid rgba(255,255,255,.16)",background:"#10161d",color:"rgba(255,255,255,.84)",fontWeight:800},
  threeColumnSection:{width:"min(1320px,calc(100% - 40px))",margin:"18px auto 0",display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:18}, panel:{padding:28,borderRadius:20,border:"1px solid rgba(255,255,255,.1)",background:"#0b1016"}, panelHeading:{margin:"0 0 18px",fontSize:24,fontWeight:1000}, searchRow:{display:"flex",alignItems:"center",gap:10,padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.78)"}, faqList:{display:"grid",gap:10}, faqItem:{borderRadius:12,border:"1px solid rgba(255,255,255,.09)",background:"#10161c",overflow:"hidden"}, faqSummary:{cursor:"pointer",padding:"17px 18px",fontWeight:900,listStyle:"none"}, faqAnswer:{padding:"0 18px 18px",margin:0,color:"rgba(255,255,255,.66)",lineHeight:1.7},
  relatedGrid:{marginTop:28,display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12}, relatedCard:{minHeight:88,padding:20,display:"flex",alignItems:"center",borderRadius:16,border:"1px solid rgba(255,255,255,.11)",background:"#10151b",color:"#fff",textDecoration:"none",fontWeight:900},
  finalCta:{width:"min(1320px,calc(100% - 40px))",margin:"84px auto 0",padding:"28px clamp(24px,4vw,44px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,borderRadius:20,border:"1px solid rgba(50,255,115,.2)",background:"linear-gradient(90deg,rgba(50,255,115,.12),transparent 30%),#0d1319"}, finalSmall:{color:"#32ff73",fontWeight:1000,letterSpacing:2}, finalHeading:{margin:"5px 0",fontSize:"clamp(28px,3vw,44px)",lineHeight:1}, finalText:{margin:0,color:"rgba(255,255,255,.65)"}, finalButton:{flexShrink:0,minHeight:62,padding:"0 30px",display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:12,background:"#32ff73",color:"#031007",textDecoration:"none",fontWeight:1000,fontSize:18},
  footer:{width:"min(1320px,calc(100% - 40px))",margin:"28px auto 0",padding:"24px 0",display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:16,color:"rgba(255,255,255,.48)",borderTop:"1px solid rgba(255,255,255,.08)"}, footerLink:{color:"rgba(255,255,255,.7)",textDecoration:"none"},
};