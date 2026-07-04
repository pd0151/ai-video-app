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
.eq("slug", params.slug)
.eq("active", true)
.single();

const title = data?.title_tag || data?.headline || "AdForge";
const description = data?.meta_description || "";
const url = `${SITE_URL}/seo/${params.slug}`;

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
images: ["/icon.png"],
},
twitter: {
card: "summary_large_image",
title,
description,
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

<section className="hero">
<img src={heroImageSrc} alt={title} className="heroImg" />
<div className="heroOverlay" />

<div className="heroInner">
<div className="topBar">
<div>
<div className="brand">Ad<span>Forge</span></div>
<p>LOCAL EMERGENCY SERVICE</p>
</div>
<a href={`tel:${phone}`} className="topCall">Call Now</a>
</div>

<div className="heroText">
<h2 className="greenPill">{greenHeading}</h2>
<h1>{title}</h1>
<p className="intro">{description}</p>

<p className="searchTags">
{searchTags.map((tag, index) => (
<React.Fragment key={tag}>
<a href={`/seo/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{tag}</a>
{index < searchTags.length - 1 && <span> • </span>}
</React.Fragment>
))}
</p>

<div className="heroButtons">
<a href={`tel:${phone}`} className="whiteBtn">Call Now</a>
<a href="#services" className="glassBtn">View Services</a>
</div>

<div className="trustGrid">
<div>24/7 <span>Available</span></div>
<div>Fast <span>Response</span></div>
<div>Local <span>Coverage</span></div>
<div>Fully <span>Insured</span></div>
</div>
</div>
</div>
</section>

<section id="services" className="section">
<p className="label">OUR SERVICES</p>
<h2>Choose what you need</h2>

<div className="services">
{serviceCards.map((service) => (
<a key={service} href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="serviceCard">
<h3>{service}</h3>
<p>Fast local support available with simple contact options and rapid response.</p>
</a>
))}
</div>
</section>

<section className="section">
<details>
<summary>Read more about this service</summary>

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
</details>

<details>
<summary>Popular searches for this service</summary>

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
</details>

<details>
<summary>Why choose local help?</summary>

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
</details>

<details>
<summary>Areas and nearby towns covered</summary>

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
</details>

<details>
<summary>Roads and motorway coverage</summary>

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
</details>

<details>
<summary>Common problems customers need help with</summary>

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
</details>

<details>
<summary>{isTyrePage ? "Mobile tyre fitting information" : "Vehicle recovery information"}</summary>

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
</details>

<details>
<summary>How the service works</summary>

<p>
The process is simple. A customer finds the AdForge page, checks the service and location,
then uses the call button to request help. The customer should explain what has happened,
where the vehicle is, whether it is safe, and what type of vehicle needs assistance.
{"\n\n"}
AdForge pages are made to reduce confusion by giving customers a simple page, clear call
buttons, service details and local information all in one place.
</p>
</details>

<details>
<summary>Emergency advice</summary>

<p>
If you have broken down or suffered a tyre problem, avoid driving if the vehicle feels
unsafe. Pull over where it is safe, switch on hazard lights and keep passengers away from
moving traffic.
{"\n\n"}
When calling for help through an AdForge local service page, give your location clearly.
Mention the road name, direction of travel, junction number, nearest exit, postcode,
what3words if available, nearby landmark or any shops, garages or buildings nearby.
</p>
</details>

<details>
<summary>Frequently asked questions</summary>

<h3>Is this service available 24/7?</h3>
<p>Emergency help may be available day and night depending on local provider availability.</p>

<h3>How quickly can someone arrive?</h3>
<p>Response times depend on location, traffic, weather, demand and provider availability.</p>

<h3>Do you cover nearby towns?</h3>
<p>Yes, nearby areas and surrounding towns may be covered depending on the local provider.</p>

<h3>Can I call now?</h3>
<p>Yes. Use the call button on this AdForge page to arrange help quickly.</p>

<h3>Can help come to my workplace?</h3>
<p>Many services can attend homes, workplaces, yards, car parks and roadside locations.</p>

<h3>Do you cover motorways?</h3>
<p>Motorway support may be available depending on location and safety requirements.</p>

<h3>Can vans be helped?</h3>
<p>Cars, vans, SUVs, 4x4s and light commercial vehicles may be supported.</p>

<h3>Why is AdForge showing this page?</h3>
<p>AdForge creates local service pages to help customers find trusted local help faster.</p>

<h3>Can businesses advertise on AdForge?</h3>
<p>Yes. Local businesses can use AdForge to advertise services, create pages and attract customers.</p>
</details>
</section>

<section className="section">
<p className="label">NEARBY PAGES</p>
<h2>Related local pages</h2>
<div className="related">
{relatedPages?.map((p) => (
<a key={p.slug} href={`/seo/${p.slug}`}>{p.headline}</a>
))}
</div>
</section>

<style>{`
* { box-sizing: border-box; }

.page {
min-height: 100vh;
background: #05070d;
color: white;
padding-bottom: 130px;
font-family: Inter, Arial, sans-serif;
}

.hero {
position: relative;
min-height: 700px;
overflow: hidden;
}

.heroImg {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: contain;
object-position: 76% center;
opacity: 1;
}

.heroOverlay {
position: absolute;
inset: 0;
background:
radial-gradient(circle at 78% 18%, rgba(50,255,115,.13), transparent 28%),
linear-gradient(90deg, rgba(5,7,13,.74), rgba(5,7,13,.20), rgba(5,7,13,.08)),
linear-gradient(180deg, rgba(5,7,13,.02), rgba(5,7,13,.22), #05070d 98%);
}

.heroInner, .section {
position: relative;
z-index: 2;
max-width: 1180px;
margin: 0 auto;
padding: 28px 22px;
}

.topBar {
display: flex;
justify-content: space-between;
gap: 18px;
margin-bottom: 48px;
}

.brand {
font-size: 44px;
font-weight: 1000;
letter-spacing: -2.5px;
line-height: .9;
}

.brand span {
color: #32ff73;
text-shadow: 0 0 25px rgba(50,255,115,.55);
}

.topBar p {
margin: 8px 0 0;
font-size: 12px;
letter-spacing: 3px;
font-weight: 900;
color: rgba(255,255,255,.8);
}

.topCall, .whiteBtn {
display: inline-flex;
align-items: center;
justify-content: center;
padding: 14px 24px;
border-radius: 999px;
background: white;
color: #05070d;
font-weight: 1000;
text-decoration: none;
}

.heroText {
max-width: 600px;
}

.greenPill {
display: inline-flex;
padding: 11px 18px;
border-radius: 999px;
background: #32ff73;
color: #05070d;
font-size: 13px;
font-weight: 1000;
letter-spacing: 1.2px;
box-shadow: 0 0 34px rgba(50,255,115,.5);
}

h1 {
font-size: clamp(46px, 6vw, 76px);
line-height: .94;
letter-spacing: -3px;
margin: 24px 0 16px;
font-weight: 1000;
max-width: 700px;
}

.intro {
font-size: 18px;
line-height: 1.55;
max-width: 560px;
color: rgba(255,255,255,.9);
}

.searchTags {
margin: 14px 0 0;
font-size: 15px;
line-height: 1.5;
font-weight: 900;
}

.searchTags a {
color: #dfffe8;
text-decoration: none;
}

.searchTags span {
color: rgba(255,255,255,.45);
}

.heroButtons {
display: flex;
gap: 14px;
flex-wrap: wrap;
margin-top: 24px;
}

.glassBtn {
padding: 14px 24px;
border-radius: 999px;
color: white;
background: rgba(255,255,255,.1);
border: 1px solid rgba(255,255,255,.22);
text-decoration: none;
font-weight: 950;
}

.trustGrid {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 14px;
margin-top: 34px;
}

.trustGrid div, .serviceCard, details, .related a {
background: rgba(255,255,255,.08);
border: 1px solid rgba(255,255,255,.14);
border-radius: 22px;
}

.trustGrid div {
padding: 16px 20px;
font-weight: 1000;
}

.trustGrid span {
display: block;
font-size: 14px;
opacity: .75;
margin-top: 4px;
}

.label {
color: #32ff73;
letter-spacing: 2.4px;
font-weight: 1000;
font-size: 13px;
}

.section h2 {
font-size: clamp(30px, 4vw, 44px);
line-height: 1;
margin: 0 0 22px;
font-weight: 1000;
}

.services {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 14px;
}

.serviceCard {
padding: 22px;
color: white;
text-decoration: none;
}

.serviceCard h3 {
font-size: 23px;
margin: 0 0 14px;
}

.serviceCard p, details p {
color: rgba(255,255,255,.78);
line-height: 1.65;
font-size: 16px;
white-space: pre-line;
}

details {
padding: 24px;
margin-bottom: 16px;
}

summary {
cursor: pointer;
font-size: 20px;
font-weight: 1000;
}

.keywordGrid {
display: flex;
flex-wrap: wrap;
gap: 10px;
margin: 18px 0;
}

.keywordGrid span {
padding: 11px 15px;
border-radius: 999px;
background: rgba(50,255,115,.12);
border: 1px solid rgba(50,255,115,.25);
font-weight: 900;
}

.related {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 12px;
}

.related a {
padding: 16px 18px;
color: white;
text-decoration: none;
font-weight: 900;
}

@media (max-width: 760px) {
.hero { min-height: 660px; }
.heroInner, .section { padding: 22px 20px; }
.brand { font-size: 38px; }
h1 { font-size: 40px; max-width: 330px; }
.intro { font-size: 15.5px; max-width: 310px; }
.searchTags { font-size: 13px; }
.trustGrid { grid-template-columns: repeat(2, 1fr); }
.services { grid-template-columns: 1fr; }
}
`}</style>
</main>
);
}