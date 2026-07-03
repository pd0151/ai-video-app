import React from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const phone = "+447576579923";

export async function generateMetadata({ params }: any) {
const { data } = await supabase
.from("landing_pages")
.select("*")
.eq("slug", params.slug)
.eq("active", true)
.single();

return {
title: data?.title_tag || data?.headline || "AdForge",
description: data?.meta_description || "",
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

return (
<main className="page">
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
<div className="greenPill">{greenHeading}</div>
<h1>{title}</h1>
<p className="intro">{description}</p>

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
</details>

<details>
<summary>Why customers choose this service</summary>
<p>
When customers search for {serviceName} near them, they usually need help quickly. This page is designed to give clear local information, simple call options and fast access to support across Liverpool, Wirral, Sefton, Knowsley and surrounding areas.
{"\n\n"}
Local service matters because response times can depend on traffic, road access, nearby providers and the exact location of the customer. Whether the problem happens at home, work, roadside, a car park, retail park, business estate or motorway, having a clear page for the local area helps customers act quickly.
{"\n\n"}
AdForge pages are built to help people find the right local service without scrolling through outdated listings or ringing multiple companies. Each page focuses on the service, the location, nearby towns, common problems and the main reasons customers need urgent help.
</p>
</details>

<details>
<summary>Areas and nearby towns covered</summary>
<p>
This page can help customers across {areas.join(", ")} and nearby local areas. Coverage may also include homes, workplaces, garages, retail parks, industrial estates, car parks, roadside locations and motorway routes.
{"\n\n"}
Customers often search using nearby towns and districts rather than one main city name. That is why these pages include surrounding areas, road names and local search terms to make it easier for Google and customers to understand where the service is available.
</p>
</details>

<details>
<summary>Roads and motorway coverage</summary>
<p>
Local emergency services are often needed on busy roads and motorway routes such as {roads.join(", ")}. Customers may need help after a breakdown, tyre problem, accident, vehicle fault or roadside issue.
{"\n\n"}
If a vehicle is unsafe to drive, it is important to stop in a safe place where possible, keep passengers away from traffic and call for help. These pages are written to support urgent local searches where customers need a fast and simple way to arrange assistance.
</p>
</details>

<details>
<summary>Common reasons customers call</summary>
<div className="keywordGrid">
{commonProblems.map((item) => <span key={item}>{item}</span>)}
</div>
<p>
These problems can happen without warning. A vehicle may fail to start, a tyre may go flat, a warning light may appear, or a driver may need urgent help moving a vehicle safely. The aim of this page is to give customers clear local information and a direct way to call.
</p>
</details>

<details>
<summary>Emergency advice</summary>
<p>
If you have broken down or suffered a tyre problem, avoid driving if the vehicle feels unsafe. Pull over where it is safe, switch on hazard lights and keep passengers away from moving traffic.
{"\n\n"}
On motorways or fast roads, leave the vehicle from the passenger side if safe and wait behind the barrier. Do not attempt a repair in a dangerous location. Call for professional help and explain your location clearly, including road name, direction of travel, junction number or nearby landmark.
</p>
</details>

<details>
<summary>Frequently asked questions</summary>
<h3>Is this service available 24/7?</h3>
<p>Emergency help may be available day and night depending on local provider availability.</p>

<h3>How quickly can someone arrive?</h3>
<p>Response times depend on location, traffic, weather and provider availability.</p>

<h3>Do you cover nearby towns?</h3>
<p>Yes, nearby areas and surrounding towns may be covered depending on the service.</p>

<h3>Can I call now?</h3>
<p>Yes. Use the call button to arrange help quickly.</p>

<h3>Can help come to my workplace?</h3>
<p>Many services can attend homes, workplaces, yards, car parks and roadside locations.</p>

<h3>Do you cover motorways?</h3>
<p>Motorway support may be available depending on location and safety requirements.</p>

<h3>Can vans be helped?</h3>
<p>Cars, vans, SUVs, 4x4s and light commercial vehicles may be supported.</p>

<h3>Is same-day help available?</h3>
<p>Same-day assistance may be available depending on local demand and provider availability.</p>
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
.trustGrid { grid-template-columns: repeat(2, 1fr); }
.services { grid-template-columns: 1fr; }
}
`}</style>
</main>
);
}