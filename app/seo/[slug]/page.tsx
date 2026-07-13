import React from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Script from "next/script";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const phone = "+447576579923";
const SITE_URL = "https://adforge.uk";

export async function generateMetadata({ params }: any) {
  const { data } = await supabase
    .from("landing_pages")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 4999)
    .eq("slug", params.slug)
    .eq("active", true)
    .single();

  const slug = String(params.slug || "");

  const isTyrePage =
    slug.includes("tyre") ||
    slug.includes("puncture") ||
    slug.includes("locking-nut") ||
    slug.includes("wheel-nut") ||
    slug.includes("flat-tyre") ||
    slug.includes("run-flat");

  const imageUrl = isTyrePage
    ? `${SITE_URL}/images/mobile-tyre-fitting.jpg`
    : `${SITE_URL}/images/recovery-truck.jpg`;

  const title = data?.title_tag || data?.headline || "AdForge";
  const description = data?.meta_description || "";
  const url = `${SITE_URL}/seo/${slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "AdForge",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

function titleCase(value: string) {
return String(value || "")
.replace(/-/g, " ")
.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function LandingPage({ params }: any) {
const { data: page } = await supabase
.from("landing_pages")
.select("*")
.eq("slug", params.slug)
.eq("active", true)
.single();

if (!page) notFound();

const slug = page.slug || "";
const title = page.headline;
const description =
page.meta_description ||
"Fast local service available across your area with rapid response.";

const isTyrePage =
slug.includes("tyre") ||
slug.includes("puncture") ||
slug.includes("locking-nut") ||
slug.includes("wheel-nut") ||
slug.includes("flat-tyre") ||
slug.includes("run-flat");

const isRecoveryPage =
slug.includes("recovery") ||
slug.includes("breakdown") ||
slug.includes("towing") ||
slug.includes("vehicle-transport") ||
slug.includes("roadside-assistance");

const heroImageSrc = isTyrePage
? "/images/mobile-tyre-fitting.jpg"
: "/images/recovery-truck.jpg";

const schemaImage = `${SITE_URL}${heroImageSrc}`;

const serviceName = isTyrePage
? "mobile tyre fitting"
: isRecoveryPage
? "vehicle recovery"
: titleCase(slug);

const greenHeading = isTyrePage
? "24 HOUR MOBILE TYRE FITTING"
: isRecoveryPage
? "24 HOUR EMERGENCY RECOVERY"
: "LOCAL EMERGENCY SERVICE";

const searchTags = isTyrePage
? ["24 Hour Tyre Fitting", "Puncture Repair", "Mobile Tyre Fitter Near Me", "Roadside Tyre Replacement"]
: ["24 Hour Vehicle Recovery", "Breakdown Recovery", "Car Towing", "Roadside Assistance", "Recovery Near Me"];

const serviceCards = isTyrePage
? ["Mobile Tyre Fitting", "Emergency Tyre Fitting", "Puncture Repair", "Tyre Replacement"]
: ["Breakdown Recovery", "Accident Recovery", "Vehicle Transport", "Roadside Assistance"];

const serviceImageMap: Record<string, string> = {
"Mobile Tyre Fitting": "/images/services/mobile-tyre-fitting.svg",
"Emergency Tyre Fitting": "/images/services/new-tyres.svg",
"Puncture Repair": "/images/services/puncture-repair.svg",
"Tyre Replacement": "/images/services/new-tyres.svg",
"Breakdown Recovery": "/images/services/breakdown-recovery.svg",
"Accident Recovery": "/images/services/accident-recovery.svg",
"Vehicle Transport": "/images/services/vehicle-transport.svg",
"Roadside Assistance": "/images/services/motorway-recovery.svg",
};

function getServiceImage(service: string) {
return serviceImageMap[service] || heroImageSrc;
}

const galleryImages = isTyrePage
? [
"/images/services/mobile-tyre-fitting.svg",
"/images/services/puncture-repair.svg",
"/images/services/new-tyres.svg",
]
: [
"/images/services/breakdown-recovery.svg",
"/images/services/accident-recovery.svg",
"/images/services/vehicle-transport.svg",
];

const areas = [
"Liverpool", "Bootle", "Huyton", "Kirkby", "Speke", "Widnes", "St Helens",
"Wirral", "Wallasey", "Sefton", "Knowsley", "Southport", "Crosby", "Maghull",
"Aintree", "Prescot", "Halewood", "Birkenhead", "Warrington", "M57", "M58", "M62"
];

const roads = ["M62", "M57", "M58", "M53", "M56", "A580", "A59", "A565", "Queens Drive", "East Lancs Road"];

const commonProblems = isTyrePage
? ["Flat tyre", "Puncture", "Tyre blowout", "Damaged sidewall", "Slow puncture", "Locking wheel nut issue", "Run flat tyre", "Emergency tyre replacement"]
: ["Vehicle breakdown", "Car will not start", "Flat battery", "Accident recovery", "Vehicle transport", "Motorway recovery", "Roadside assistance", "Non-runner vehicle"];

const { data: relatedPages } = await supabase
.from("landing_pages")
.select("slug, headline")
.neq("slug", params.slug)
.eq("active", true)
.ilike("slug", isTyrePage ? "%tyre%" : "%recovery%")
.limit(30);

const pageUrl = `${SITE_URL}/seo/${slug}`;

const schema = {
"@context": "https://schema.org",
"@graph": [
{
"@type": "Organization",
"@id": `${SITE_URL}/#organization`,
name: "AdForge",
url: SITE_URL,
logo: `${SITE_URL}/icon.png`,
},
{
"@type": "WebSite",
"@id": `${SITE_URL}/#website`,
url: SITE_URL,
name: "AdForge",
alternateName: "AdForge Local Business Directory",
publisher: {
"@id": `${SITE_URL}/#organization`,
},
},
{
"@type": "WebPage",
"@id": `${pageUrl}#webpage`,
url: pageUrl,
name: title,
headline: title,
description,
image: {
  "@type": "ImageObject",
  url: schemaImage,
  contentUrl: schemaImage,
  caption: page.headline,
},
isPartOf: {
"@id": `${SITE_URL}/#website`,
},
publisher: {
"@id": `${SITE_URL}/#organization`,
},
breadcrumb: {
"@id": `${pageUrl}#breadcrumb`,
},
},
{
"@type": "BreadcrumbList",
"@id": `${pageUrl}#breadcrumb`,
itemListElement: [
{
"@type": "ListItem",
position: 1,
name: "AdForge",
item: SITE_URL,
},
{
"@type": "ListItem",
position: 2,
name: isTyrePage ? "Mobile Tyre Services" : "Recovery Services",
item: `${SITE_URL}/seo`,
},
{
"@type": "ListItem",
position: 3,
name: title,
item: pageUrl,
},
],
},
{
"@type": "Service",
name: title,
description,
image: schemaImage,
areaServed: areas,
provider: {
"@id": `${SITE_URL}/#organization`,
},
url: pageUrl,
},
],
};

return (
<main className="page">

<Script
id="seo-schema"
type="application/ld+json"
strategy="beforeInteractive"
dangerouslySetInnerHTML={{
__html: JSON.stringify(schema),
}}
/>

<header className="siteHeader">
<div className="headerInner">
<a href="/" className="brandLink">
<span className="brand">Ad<span>Forge</span></span>
<span className="brandSub">LOCAL EMERGENCY SERVICES</span>
</a>

<nav className="nav">
<a href="/">Home</a>
<a href="#services">Services</a>
<a href="#coverage">Areas We Cover</a>
<a href="#why">Why AdForge</a>
<a href="#faq">FAQs</a>
</nav>

<a href={`tel:${phone}`} className="headerCall">
<span className="callLabel">CALL NOW</span>
<span>{phone}</span>
</a>
</div>
</header>

<section className="hero">
<img src={heroImageSrc} alt={title} className="heroImg" />
<div className="heroShade" />
<div className="heroGlow" />

<div className="heroInner">
<div className="heroCopy">
<div className="greenPill">{greenHeading}</div>
<h1>{title}</h1>
<p className="intro">{description}</p>

<div className="heroButtons">
<a href={`tel:${phone}`} className="primaryBtn">Call Now</a>
<a href="#services" className="secondaryBtn">View Services</a>
</div>

<div className="heroTrust">
<div className="trustItem">
<strong>24/7</strong>
<span>Available</span>
<small>Local help day and night</small>
</div>
<div className="trustItem">
<strong>Fast</strong>
<span>Response</span>
<small>Simple call-out process</small>
</div>
<div className="trustItem">
<strong>Local</strong>
<span>Coverage</span>
<small>Across nearby towns</small>
</div>
<div className="trustItem">
<strong>Direct</strong>
<span>Contact</span>
<small>Speak to a local provider</small>
</div>
</div>
</div>
</div>
</section>

<section id="services" className="section sectionTop">
<div className="sectionHeading">
<div>
<p className="label">OUR SERVICES</p>
<h2>Local help when you need it</h2>
</div>
<p className="sectionIntro">
Fast, simple access to trusted local {serviceName} services.
</p>
</div>

<div className="serviceGrid">
{serviceCards.map((service, index) => (
<a
key={service}
href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
className="serviceCard"
>
<img src={getServiceImage(service)} alt={service} />
<div className="serviceShade" />
<div className="serviceContent">
<span className="serviceNumber">0{index + 1}</span>
<div>
<h3>{service}</h3>
<p>Fast local support with direct contact and clear service information.</p>
</div>
<span className="serviceArrow">→</span>
</div>
</a>
))}
</div>
</section>

<section id="why" className="section">
<div className="sectionHeading">
<div>
<p className="label">WHY CHOOSE ADFORGE</p>
<h2>Built around local response</h2>
</div>
</div>

<div className="featureGrid">
<div className="featureCard">
<span className="featureIcon">01</span>
<h3>Fast Response</h3>
<p>Clear contact options help customers reach local providers quickly.</p>
</div>
<div className="featureCard">
<span className="featureIcon">02</span>
<h3>Local Coverage</h3>
<p>Pages are matched to nearby towns, roads and service areas.</p>
</div>
<div className="featureCard">
<span className="featureIcon">03</span>
<h3>Simple Booking</h3>
<p>Call directly from the page without searching through outdated listings.</p>
</div>
<div className="featureCard">
<span className="featureIcon">04</span>
<h3>Useful Information</h3>
<p>Service details, nearby areas and common questions are all in one place.</p>
</div>
</div>
</section>

<section className="section gallerySection">
<div className="sectionHeading">
<div>
<p className="label">SERVICE AT A GLANCE</p>
<h2>Professional local support</h2>
</div>
</div>

<div className="galleryGrid">
<div className="galleryLarge">
<img src={galleryImages[0]} alt={serviceCards[0]} />
</div>
<div className="gallerySmall">
<img src={galleryImages[1]} alt={serviceCards[1]} />
</div>
<div className="gallerySmall">
<img src={galleryImages[2]} alt={serviceCards[2]} />
</div>
</div>
</section>

<section className="section twoColSection">
<div>
<p className="label">POPULAR SEARCHES</p>
<h2>Services customers look for</h2>
<div className="chipGrid">
{searchTags.map((tag) => (
<a key={tag} href={`/seo/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
{tag}
</a>
))}
{commonProblems.map((item) => (
<span key={item}>{item}</span>
))}
</div>
</div>

<div id="coverage">
<p className="label">AREAS WE COVER</p>
<h2>Local coverage</h2>
<div className="areaGrid">
{areas.map((area) => (
<span key={area}>{area}</span>
))}
</div>
</div>
</section>

<section id="faq" className="section contentSection">
<div className="sectionHeading">
<div>
<p className="label">SERVICE INFORMATION</p>
<h2>Everything you need to know</h2>
</div>
</div>

<details open>
<summary>Read more about this service</summary>
<div className="detailsBody">
<p>{page.content}</p>
<p>
AdForge helps customers find fast local help for {serviceName} when they need a clear,
simple way to contact a local provider. This page is built for people searching for
{` ${serviceName} near me`}, emergency help, same day support, out of hours service,
roadside assistance and local call-outs.
{"\n\n"}
Whether you are at home, at work, stuck on a roadside, waiting in a supermarket car park,
broken down near a motorway junction or trying to arrange urgent help for a customer,
AdForge is designed to make local services easier to find.
{"\n\n"}
Many customers do not search using one exact phrase. They may search for “open now”,
“near me”, “24 hour”, “emergency”, “same day”, “local company”, “fast response”,
“roadside help” or “urgent call-out”. This page includes those search terms naturally
so Google can understand the full meaning of the service.
</p>
</div>
</details>

<details>
<summary>Popular searches for this service</summary>
<div className="detailsBody">
<div className="keywordGrid">
{(isTyrePage
? [
"24 hour mobile tyre fitting",
"mobile tyre fitting near me",
"emergency mobile tyre fitting",
"mobile tyre replacement",
"roadside tyre fitting",
"same day tyre fitting",
"mobile puncture repair",
"flat tyre repair",
"emergency tyre replacement",
"home tyre fitting",
"workplace tyre fitting",
"run flat tyre replacement",
"locking wheel nut removal",
"mobile tyre fitter open now",
"cheap mobile tyre fitting",
"local mobile tyre company",
"mobile tyre service near me",
"out of hours tyre fitting",
"weekend mobile tyre fitting",
"blown tyre replacement",
"van tyre fitting",
"commercial tyre fitting",
"tyre change at home",
"tyre change at work",
]
: [
"24 hour recovery",
"vehicle recovery near me",
"breakdown recovery",
"car recovery",
"van recovery",
"roadside recovery",
"accident recovery",
"emergency vehicle recovery",
"car towing service",
"tow truck near me",
"vehicle transport",
"motorway recovery",
"flat battery recovery",
"jump start service",
"non runner recovery",
"breakdown service open now",
"local recovery company",
"recovery truck near me",
"car breakdown service",
"van breakdown recovery",
"roadside assistance near me",
"emergency towing service",
"vehicle breakdown help",
"24 hour towing",
]
).map((keyword) => (
<span key={keyword}>{keyword}</span>
))}
</div>

<p>
AdForge pages are written to match the different ways real customers search online.
Some people search by service, some search by location, some search by road name and
others search by urgency. That is why this page includes a wide mix of natural search
phrases connected to {serviceName}.
{"\n\n"}
For example, a customer may search for a fast local provider, an emergency call-out,
a same-day service, a company open now, a provider near their postcode, or help on a
main road or motorway. AdForge uses this type of local content to help each page become
more useful for both customers and search engines.
</p>
</div>
</details>

<details>
<summary>Why choose local help?</summary>
<div className="detailsBody">
<p>
Choosing local help matters because response time is often the biggest problem when
someone needs {serviceName}. A local provider may already know the surrounding roads,
nearby estates, car parks, business parks, retail parks, industrial areas and motorway
routes.
{"\n\n"}
AdForge is built to make that local connection easier. Instead of customers searching
through lots of websites, old listings or companies that may not cover the area, this
page gives them a clear local service page with a direct call option.
{"\n\n"}
Local pages also help Google understand the service area better. By mentioning nearby
towns, roads, common problems and customer search phrases, each AdForge page becomes
more relevant for local searches.
</p>
</div>
</details>

<details>
<summary>Areas and nearby towns covered</summary>
<div className="detailsBody">
<p>
This AdForge page can help customers across {areas.join(", ")} and surrounding local
areas. Coverage may include homes, workplaces, business parks, industrial estates,
supermarkets, retail parks, garages, car parks, roadside locations and nearby motorway
routes.
{"\n\n"}
A customer looking for {serviceName} may also search for help near Liverpool, Wirral,
Wallasey, Sefton, Knowsley, Bootle, Huyton, Kirkby, Prescot, St Helens, Widnes,
Southport, Crosby, Maghull, Aintree, Birkenhead, Warrington or nearby motorway routes.
</p>
</div>
</details>

<details>
<summary>Roads and motorway coverage</summary>
<div className="detailsBody">
<p>
Emergency services are often needed on busy roads and motorway routes such as
{` ${roads.join(", ")}`}. Customers may need help after a breakdown, accident,
flat battery, puncture, tyre blowout, warning light, engine fault, overheating,
clutch problem, gearbox fault or vehicle transport issue.
{"\n\n"}
AdForge pages include road and motorway terms because many urgent searches happen when
someone is already stranded. People may search for “recovery near M62”, “breakdown help
on M57”, “tyre fitter near M58”, “tow truck near me” or “roadside assistance open now”.
</p>
</div>
</details>

<details>
<summary>Common problems customers need help with</summary>
<div className="detailsBody">
<div className="keywordGrid">
{commonProblems.map((item) => (
<span key={item}>{item}</span>
))}
</div>

<p>
Customers usually search for {serviceName} because something has gone wrong quickly.
A vehicle may not start, a tyre may be flat, a battery may be dead, a warning light may
appear, a vehicle may be damaged after an accident, or the driver may not feel safe
continuing the journey.
{"\n\n"}
AdForge pages are designed to explain these problems clearly so customers can recognise
their situation and call for help. This helps the page cover more search intent than a
basic directory listing.
</p>
</div>
</details>

<details>
<summary>{isTyrePage ? "Mobile tyre fitting information" : "Vehicle recovery information"}</summary>
<div className="detailsBody">
{isTyrePage ? (
<p>
Mobile tyre fitting is useful when you need tyres fitted at home, work or roadside.
Customers may need help with a flat tyre, puncture, tyre blowout, damaged sidewall,
slow puncture, low tread, valve issue, run flat tyre, locking wheel nut problem,
damaged alloy, tyre pressure warning or emergency tyre replacement.
{"\n\n"}
AdForge includes mobile tyre fitting content because customers search in many different
ways. Some search for “mobile tyre fitting near me”, others search for “emergency tyre
replacement”, “puncture repair near me”, “roadside tyre fitting”, “same day tyres”,
“mobile tyre fitter open now”, “home tyre fitting” or “workplace tyre fitting”.
</p>
) : (
<p>
Vehicle recovery helps when a car, van, SUV, 4x4 or light commercial vehicle cannot be
driven safely. This may include breakdown recovery, accident recovery, car towing, van
recovery, vehicle transport, motorway recovery, non-runner recovery, flat battery help,
jump starts and roadside assistance.
{"\n\n"}
AdForge includes recovery keywords because customers search for help in different ways.
Some search for “24 hour recovery”, others search for “tow truck near me”, “vehicle
recovery near me”, “breakdown recovery”, “car recovery”, “van recovery”, “roadside
recovery”, “accident recovery”, “motorway recovery” or “breakdown service open now”.
</p>
)}
</div>
</details>

<details>
<summary>How the service works</summary>
<div className="detailsBody">
<p>
The process is simple. A customer finds the AdForge page, checks the service and location,
then uses the call button to request help. The customer should explain what has happened,
where the vehicle is, whether it is safe, and what type of vehicle needs assistance.
{"\n\n"}
AdForge pages are made to reduce confusion by giving customers a simple page, clear call
buttons, service details and local information all in one place.
</p>
</div>
</details>

<details>
<summary>Emergency advice</summary>
<div className="detailsBody">
<p>
If you have broken down or suffered a tyre problem, avoid driving if the vehicle feels
unsafe. Pull over where it is safe, switch on hazard lights and keep passengers away from
moving traffic.
{"\n\n"}
When calling for help through an AdForge local service page, give your location clearly.
Mention the road name, direction of travel, junction number, nearest exit, postcode,
what3words if available, nearby landmark or any shops, garages or buildings nearby.
</p>
</div>
</details>

<details>
<summary>Frequently asked questions</summary>
<div className="detailsBody faqGrid">
<div><h3>Is this service available 24/7?</h3><p>Emergency help may be available day and night depending on local provider availability.</p></div>
<div><h3>How quickly can someone arrive?</h3><p>Response times depend on location, traffic, weather, demand and provider availability.</p></div>
<div><h3>Do you cover nearby towns?</h3><p>Yes, nearby areas and surrounding towns may be covered depending on the local provider.</p></div>
<div><h3>Can I call now?</h3><p>Yes. Use the call button on this AdForge page to arrange help quickly.</p></div>
<div><h3>Can help come to my workplace?</h3><p>Many services can attend homes, workplaces, yards, car parks and roadside locations.</p></div>
<div><h3>Do you cover motorways?</h3><p>Motorway support may be available depending on location and safety requirements.</p></div>
<div><h3>Can vans be helped?</h3><p>Cars, vans, SUVs, 4x4s and light commercial vehicles may be supported.</p></div>
<div><h3>Why is AdForge showing this page?</h3><p>AdForge creates local service pages to help customers find trusted local help faster.</p></div>
<div><h3>Can businesses advertise on AdForge?</h3><p>Yes. Local businesses can use AdForge to advertise services, create pages and attract customers.</p></div>
</div>
</details>
</section>

<section className="section relatedSection">
<div className="sectionHeading">
<div>
<p className="label">NEARBY PAGES</p>
<h2>Related local pages</h2>
</div>
</div>

<div className="related">
{relatedPages?.map((p) => (
<a key={p.slug} href={`/seo/${p.slug}`}>
<span>{p.headline}</span>
<small>View local page →</small>
</a>
))}
</div>
</section>

<section className="ctaSection">
<div className="ctaInner">
<div>
<p className="label">NEED LOCAL HELP?</p>
<h2>Speak to a local provider now</h2>
<p>Fast direct contact for {serviceName} and emergency local services.</p>
</div>
<a href={`tel:${phone}`} className="primaryBtn">Call Now</a>
</div>
</section>

<footer className="footer">
<div className="footerInner">
<div>
<div className="brand footerBrand">Ad<span>Forge</span></div>
<p>Local services, faster connections and clear information.</p>
</div>
<div>
<strong>Services</strong>
<a href="#services">Local Services</a>
<a href="#coverage">Areas We Cover</a>
<a href="#faq">FAQs</a>
</div>
<div>
<strong>Contact</strong>
<a href={`tel:${phone}`}>{phone}</a>
<a href="/">adforge.uk</a>
</div>
</div>
</footer>

<style>{`
* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body { margin: 0; }

.page {
min-height: 100vh;
background: #05070d;
color: #fff;
font-family: Inter, Arial, sans-serif;
}

.siteHeader {
position: sticky;
top: 0;
z-index: 50;
background: rgba(5,7,13,.88);
backdrop-filter: blur(18px);
border-bottom: 1px solid rgba(255,255,255,.10);
}

.headerInner {
max-width: 1240px;
margin: 0 auto;
padding: 14px 22px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 24px;
}

.brandLink {
display: flex;
flex-direction: column;
color: #fff;
text-decoration: none;
}

.brand {
font-size: 34px;
font-weight: 1000;
letter-spacing: -2px;
line-height: .9;
}

.brand span {
color: #32ff73;
text-shadow: 0 0 24px rgba(50,255,115,.45);
}

.brandSub {
margin-top: 7px;
font-size: 9px;
letter-spacing: 2px;
font-weight: 900;
color: rgba(255,255,255,.58);
}

.nav {
display: flex;
align-items: center;
gap: 26px;
}

.nav a {
color: rgba(255,255,255,.84);
font-size: 13px;
font-weight: 800;
text-decoration: none;
}

.headerCall {
display: flex;
flex-direction: column;
align-items: flex-end;
padding: 10px 16px;
border: 1px solid rgba(255,255,255,.18);
border-radius: 12px;
color: #fff;
text-decoration: none;
background: rgba(255,255,255,.045);
font-weight: 900;
}

.callLabel {
font-size: 9px;
letter-spacing: 1.5px;
color: #32ff73;
}

.hero {
position: relative;
min-height: 650px;
overflow: hidden;
border-bottom: 1px solid rgba(255,255,255,.07);
}

.heroImg {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
filter: saturate(.9) contrast(1.05);
}

.heroShade {
position: absolute;
inset: 0;
background:
linear-gradient(90deg, rgba(5,7,13,.97) 0%, rgba(5,7,13,.88) 31%, rgba(5,7,13,.42) 57%, rgba(5,7,13,.18) 100%),
linear-gradient(180deg, rgba(5,7,13,.10), rgba(5,7,13,.2) 65%, #05070d 100%);
}

.heroGlow {
position: absolute;
inset: 0;
background: radial-gradient(circle at 73% 36%, rgba(255,255,255,.045), transparent 28%);
}

.heroInner {
position: relative;
z-index: 2;
max-width: 1240px;
margin: 0 auto;
padding: 76px 22px 44px;
}

.heroCopy {
max-width: 660px;
}

.greenPill {
display: inline-flex;
padding: 10px 16px;
border-radius: 999px;
border: 1px solid rgba(255,255,255,.18);
background: rgba(255,255,255,.06);
color: #32ff73;
font-size: 12px;
font-weight: 1000;
letter-spacing: 1.2px;
box-shadow: none;
}

h1 {
font-size: clamp(46px, 5.8vw, 76px);
line-height: .96;
letter-spacing: -3px;
margin: 24px 0 18px;
font-weight: 1000;
max-width: 760px;
}

.intro {
font-size: 18px;
line-height: 1.65;
max-width: 590px;
color: rgba(255,255,255,.82);
}

.heroButtons {
display: flex;
gap: 14px;
flex-wrap: wrap;
margin-top: 28px;
}

.primaryBtn,
.secondaryBtn {
display: inline-flex;
align-items: center;
justify-content: center;
min-width: 145px;
padding: 15px 24px;
border-radius: 10px;
font-weight: 1000;
text-decoration: none;
}

.primaryBtn {
background: #32ff73;
color: #05070d;
box-shadow: 0 10px 30px rgba(50,255,115,.18);
}

.secondaryBtn {
background: rgba(255,255,255,.07);
color: #fff;
border: 1px solid rgba(255,255,255,.24);
}

.heroTrust {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
margin-top: 42px;
max-width: 800px;
border: 1px solid rgba(255,255,255,.12);
border-radius: 14px;
overflow: hidden;
background: rgba(7,10,16,.86);
backdrop-filter: blur(14px);
}

.trustItem {
padding: 18px;
border-right: 1px solid rgba(255,255,255,.10);
}

.trustItem:last-child { border-right: 0; }

.trustItem strong {
display: block;
font-size: 20px;
color: #32ff73;
}

.trustItem span {
display: block;
font-weight: 900;
margin-top: 2px;
}

.trustItem small {
display: block;
margin-top: 6px;
font-size: 11px;
line-height: 1.4;
color: rgba(255,255,255,.55);
}

.section {
max-width: 1240px;
margin: 0 auto;
padding: 72px 22px;
}

.section + .section {
border-top: 1px solid rgba(255,255,255,.045);
}

.sectionTop { padding-top: 54px; }

.sectionHeading {
display: flex;
align-items: end;
justify-content: space-between;
gap: 28px;
margin-bottom: 26px;
}

.label {
margin: 0 0 10px;
color: #32ff73;
letter-spacing: 2.1px;
font-weight: 1000;
font-size: 12px;
}

.section h2,
.ctaInner h2 {
font-size: clamp(30px, 4vw, 46px);
line-height: 1;
margin: 0;
font-weight: 1000;
letter-spacing: -1.5px;
}

.sectionIntro {
max-width: 390px;
margin: 0;
color: rgba(255,255,255,.62);
line-height: 1.6;
}

.serviceGrid {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
gap: 14px;
}

.serviceCard {
position: relative;
min-height: 290px;
border-radius: 16px;
overflow: hidden;
border: 1px solid rgba(255,255,255,.11);
color: #fff;
text-decoration: none;
background: #090c12;
}

.serviceCard img {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: cover;
transition: transform .35s ease;
}

.serviceCard:hover img { transform: scale(1.04); }

.serviceShade {
position: absolute;
inset: 0;
background: linear-gradient(180deg, rgba(5,7,13,.05), rgba(5,7,13,.28) 38%, rgba(5,7,13,.96) 100%);
}

.serviceContent {
position: absolute;
inset: 0;
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 18px;
}

.serviceNumber,
.featureIcon {
display: inline-flex;
width: 40px;
height: 40px;
align-items: center;
justify-content: center;
border-radius: 999px;
background: rgba(255,255,255,.055);
border: 1px solid rgba(255,255,255,.14);
color: #32ff73;
font-size: 12px;
font-weight: 1000;
}

.serviceCard h3 {
font-size: 22px;
line-height: 1.05;
margin: 0 0 8px;
}

.serviceCard p {
margin: 0;
font-size: 13px;
line-height: 1.45;
color: rgba(255,255,255,.68);
}

.serviceArrow {
position: absolute;
right: 18px;
bottom: 18px;
color: #32ff73;
font-size: 24px;
}

.featureGrid {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
gap: 14px;
}

.featureCard {
padding: 24px;
border-radius: 16px;
border: 1px solid rgba(255,255,255,.11);
background: linear-gradient(180deg, #0b0e14, #080b11);
}

.featureCard h3 {
font-size: 18px;
margin: 18px 0 10px;
}

.featureCard p {
margin: 0;
color: rgba(255,255,255,.62);
line-height: 1.55;
font-size: 14px;
}

.gallerySection { padding-top: 30px; }

.galleryGrid {
display: grid;
grid-template-columns: 1.5fr .75fr .75fr;
gap: 12px;
height: 360px;
}

.galleryGrid > div {
border-radius: 16px;
overflow: hidden;
border: 1px solid rgba(255,255,255,.1);
}

.galleryGrid img {
width: 100%;
height: 100%;
object-fit: cover;
display: block;
}

.twoColSection {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 46px;
padding-top: 30px;
}

.chipGrid,
.areaGrid,
.keywordGrid {
display: flex;
flex-wrap: wrap;
gap: 10px;
}

.chipGrid a,
.chipGrid span,
.areaGrid span,
.keywordGrid span {
padding: 11px 14px;
border-radius: 9px;
border: 1px solid rgba(255,255,255,.12);
background: #0a0d13;
color: rgba(255,255,255,.84);
font-size: 13px;
font-weight: 800;
text-decoration: none;
}

.areaGrid span {
border-color: rgba(255,255,255,.13);
background: #0a0d13;
}

.contentSection { padding-top: 36px; }

details {
margin-bottom: 12px;
border: 1px solid rgba(255,255,255,.11);
border-radius: 14px;
background: #0a0d13;
overflow: hidden;
}

summary {
cursor: pointer;
padding: 19px 22px;
font-size: 16px;
font-weight: 950;
list-style: none;
}

summary::-webkit-details-marker { display: none; }

summary::after {
content: "+";
float: right;
font-size: 21px;
color: #32ff73;
}

details[open] summary::after { content: "−"; }

.detailsBody {
padding: 0 22px 22px;
border-top: 1px solid rgba(255,255,255,.08);
}

.detailsBody p {
color: rgba(255,255,255,.74);
line-height: 1.75;
font-size: 15px;
white-space: pre-line;
}

.faqGrid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 16px;
padding-top: 22px;
}

.faqGrid div {
padding: 18px;
border-radius: 12px;
background: #0a0d13;
border: 1px solid rgba(255,255,255,.08);
}

.faqGrid h3 {
margin: 0 0 8px;
font-size: 15px;
}

.faqGrid p { margin: 0; }

.related {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: 12px;
}

.related a {
display: flex;
flex-direction: column;
gap: 10px;
padding: 18px;
border-radius: 14px;
border: 1px solid rgba(255,255,255,.11);
background: #0a0d13;
color: #fff;
text-decoration: none;
font-weight: 900;
}

.related small {
color: #32ff73;
font-weight: 900;
}

.ctaSection {
padding: 20px 22px 80px;
}

.ctaInner {
max-width: 1196px;
margin: 0 auto;
padding: 34px;
border-radius: 18px;
border: 1px solid rgba(50,255,115,.24);
background:
radial-gradient(circle at 85% 0%, rgba(255,255,255,.05), transparent 35%),
#0a0d13;
display: flex;
align-items: center;
justify-content: space-between;
gap: 30px;
}

.ctaInner p {
margin: 12px 0 0;
color: rgba(255,255,255,.62);
}

.footer {
border-top: 1px solid rgba(255,255,255,.08);
background: #04060b;
}

.footerInner {
max-width: 1240px;
margin: 0 auto;
padding: 44px 22px;
display: grid;
grid-template-columns: 2fr 1fr 1fr;
gap: 40px;
}

.footerBrand { font-size: 30px; }

.footer p {
max-width: 330px;
color: rgba(255,255,255,.5);
line-height: 1.6;
}

.footer strong {
display: block;
margin-bottom: 14px;
}

.footer a {
display: block;
margin: 9px 0;
color: rgba(255,255,255,.65);
text-decoration: none;
font-size: 14px;
}

@media (max-width: 980px) {
.nav { display: none; }
.serviceGrid,
.featureGrid { grid-template-columns: repeat(2, minmax(0,1fr)); }
.galleryGrid { grid-template-columns: 1.2fr .8fr; }
.gallerySmall:last-child { display: none; }
}

@media (max-width: 760px) {
.page { padding-bottom: 120px; }
.headerInner { padding: 12px 16px; }
.brand { font-size: 29px; }
.brandSub { display: none; }
.headerCall { padding: 9px 12px; font-size: 12px; }

.hero { min-height: 680px; }
.heroImg { object-position: 67% center; }
.heroShade {
background:
linear-gradient(90deg, rgba(5,7,13,.94), rgba(5,7,13,.56)),
linear-gradient(180deg, rgba(5,7,13,.1), rgba(5,7,13,.35) 60%, #05070d 100%);
}
.heroInner { padding: 72px 18px 28px; }
.heroCopy { max-width: 100%; }
h1 { font-size: 42px; max-width: 350px; }
.intro { font-size: 15.5px; max-width: 335px; }
.heroTrust { grid-template-columns: repeat(2,1fr); }
.trustItem:nth-child(2) { border-right: 0; }
.trustItem:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,.1); }

.section { padding: 54px 18px; }
.sectionHeading { align-items: flex-start; flex-direction: column; }
.sectionIntro { max-width: 100%; }

.serviceGrid,
.featureGrid,
.twoColSection,
.faqGrid { grid-template-columns: 1fr; }

.serviceCard { min-height: 260px; }

.galleryGrid {
grid-template-columns: 1fr 1fr;
height: 300px;
}
.galleryLarge { grid-column: 1 / -1; }
.gallerySmall { height: 120px; }
.gallerySmall:last-child { display: block; }

.twoColSection { gap: 44px; }

.ctaInner {
padding: 28px;
align-items: flex-start;
flex-direction: column;
}

.footerInner { grid-template-columns: 1fr; gap: 24px; }
}
`}</style>
</main>
);
}