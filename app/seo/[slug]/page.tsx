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
<h2 className="greenPill">
{greenHeading}
</h2>
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
<summary>Popular searches for this service</summary>
<div className="keywordGrid">
{(isTyrePage
? [
`24 hour mobile tyre fitting`,
`mobile tyre fitting near me`,
`emergency mobile tyre fitting`,
`mobile tyre replacement`,
`roadside tyre fitting`,
`same day tyre fitting`,
`mobile puncture repair`,
`flat tyre repair`,
`emergency tyre replacement`,
`home tyre fitting`,
`workplace tyre fitting`,
`run flat tyre replacement`,
`locking wheel nut removal`,
`mobile tyre fitter open now`,
`cheap mobile tyre fitting`,
`local mobile tyre company`,
]
: [
`24 hour recovery`,
`vehicle recovery near me`,
`breakdown recovery`,
`car recovery`,
`van recovery`,
`roadside recovery`,
`accident recovery`,
`emergency vehicle recovery`,
`car towing service`,
`tow truck near me`,
`vehicle transport`,
`motorway recovery`,
`flat battery recovery`,
`jump start service`,
`non runner recovery`,
`breakdown service open now`,
]
).map((keyword) => (
<span key={keyword}>{keyword}</span>
))}
</div>

<p>
Customers search in lots of different ways when they need urgent help.
Some people search by the exact service, some search by town, and others
search for terms like “near me”, “open now”, “24 hour”, “emergency” or
“same day”. This page is written to cover those different search terms
naturally while still giving useful information to drivers.
</p>
</details>

<details>
<summary>Why choose local help?</summary>
<p>
Choosing a local {serviceName} service can make a big difference when you
need help quickly. Local providers understand the roads, nearby towns,
traffic routes, retail parks, business estates, car parks and motorway
links around the area.
{"\n\n"}
Whether you are at home, at work, roadside, outside a shop, stuck in a car
park or waiting near a motorway junction, a local service page helps you
find the right support faster.
{"\n\n"}
This page is designed for customers looking for fast local help, emergency
call-outs, same-day support, roadside assistance, local coverage and simple
contact options.
</p>
</details>

<details>
<summary>Areas and nearby towns covered</summary>
<p>
This page can help customers across {areas.join(", ")} and surrounding
areas. Coverage may also include local roads, housing estates, industrial
estates, business parks, retail parks, supermarkets, garages, workplaces,
homes, car parks and roadside locations.
{"\n\n"}
Many people do not search only for the main town. They also search for
nearby villages, districts, suburbs and motorway routes. Including these
areas helps Google understand the full local coverage of the page.
</p>
</details>

<details>
<summary>Roads and motorway coverage</summary>
<p>
Emergency local services are often needed on busy roads and motorway
routes such as {roads.join(", ")}. Customers may need help after a
breakdown, tyre problem, accident, warning light, flat battery, puncture,
blowout or roadside issue.
{"\n\n"}
If your vehicle is unsafe to drive, stop somewhere safe where possible,
switch on hazard lights and keep passengers away from traffic. On fast
roads or motorways, wait behind the barrier where safe and call for help.
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
These problems can happen without warning. A tyre can fail, a vehicle can
refuse to start, a battery can go flat, a warning light can appear, or a
driver may need urgent help moving a vehicle safely.
{"\n\n"}
This page helps customers find clear local information and a fast way to
call for help without searching through lots of different websites.
</p>
</details>

<details>
<summary>
{isTyrePage ? "Mobile tyre fitting information" : "Vehicle recovery information"}
</summary>

{isTyrePage ? (
<p>
Mobile tyre fitting is useful when you need tyres fitted at home, work
or roadside. It can help with flat tyres, punctures, damaged sidewalls,
blown tyres, low tread, valve issues, run flat tyres, locking wheel nut
problems and emergency tyre replacement.
{"\n\n"}
Customers often search for mobile tyre fitting near me, tyre fitter open
now, 24 hour tyre fitting, emergency tyre fitting, roadside tyre
replacement, mobile puncture repair, same day tyres and mobile tyre
service.
{"\n\n"}
A mobile tyre fitter may be able to attend your location, check the tyre,
replace it where needed and help get the vehicle moving again without
you needing to drive to a garage.
</p>
) : (
<p>
Vehicle recovery can help when a car, van or light commercial vehicle
cannot be driven safely. This may include breakdown recovery, accident
recovery, car towing, van recovery, vehicle transport, motorway recovery,
non-runner recovery, flat battery help and roadside assistance.
{"\n\n"}
Customers often search for recovery truck near me, 24 hour breakdown
recovery, car recovery, vehicle recovery, towing service, roadside
recovery, accident recovery and emergency recovery open now.
{"\n\n"}
If your vehicle is damaged, unsafe, stuck, broken down or unable to
start, recovery support may be needed to move it safely.
</p>
)}
</details>

<details>
<summary>Emergency advice</summary>
<p>
If you have broken down or suffered a tyre problem, avoid driving if the
vehicle feels unsafe. Pull over where it is safe, switch on hazard lights
and keep passengers away from moving traffic.
{"\n\n"}
On motorways or fast roads, leave the vehicle from the passenger side if
safe and wait behind the barrier. Do not attempt a repair in a dangerous
location.
{"\n\n"}
When calling, give your location clearly. Mention the road name, direction
of travel, junction number, nearby landmark, postcode or any nearby shops,
garages or buildings.
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

<h3>Can I get help at home?</h3>
<p>Yes, many services can attend home addresses depending on availability.</p>

<h3>Can I get help in a car park?</h3>
<p>Yes, help may be available at supermarkets, retail parks, public car parks and private car parks.</p>

<h3>What information should I give when calling?</h3>
<p>Give your location, vehicle details, the problem, and whether the vehicle is in a safe place.</p>

<h3>Do you cover evenings and weekends?</h3>
<p>Out-of-hours help may be available depending on the local provider.</p>
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