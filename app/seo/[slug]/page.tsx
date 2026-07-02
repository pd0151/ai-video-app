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

const heroImageSrc = isTyrePage
? "/images/mobile-tyre-fitting.jpg"
: "/images/recovery-truck.jpg";

const stickyText = isTyrePage
? "Call Mobile Tyre Fitting"
: "Call 24 Hour Recovery";

const nearbyTitle = isTyrePage
? "Nearby Mobile Tyre Areas"
: "Nearby Recovery Areas";

const serviceCards = isTyrePage
? [
"Mobile Tyre Fitting",
"Emergency Tyre Fitting",
"Puncture Repair",
"Tyre Replacement",
]
: [
"Breakdown Recovery",
"Accident Recovery",
"Vehicle Transport",
"Roadside Assistance",
];

const { data: relatedPages } = await supabase
.from("landing_pages")
.select("slug, headline")
.neq("slug", params.slug)
.eq("active", true)
.ilike("slug", isTyrePage ? "%tyre%" : "%recovery%")
.limit(30);

const areas = [
"Liverpool",
"Bootle",
"Huyton",
"Kirkby",
"Speke",
"Widnes",
"St Helens",
"Wirral",
"M57",
"M58",
"M62",
];

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

<a href={`tel:${phone}`} className="topCall">
Call Now
</a>
</div>

<div className="heroText">
<div className="greenPill">
{isTyrePage ? "24 HOUR MOBILE TYRE FITTING" : "24 HOUR EMERGENCY RECOVERY"}
</div>

<h1>{title}</h1>

<p className="intro">{description}</p>

<div className="heroButtons">
<a href={`tel:${phone}`} className="whiteBtn">
Call Now
</a>

<a href="#services" className="glassBtn">
View Services
</a>
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

<section className="liveSection">
<div className="liveCard">
<p className="liveLabel"><span /> LIVE LOCAL RESPONSE</p>

<h2>{isTyrePage ? "Tyre help ready" : "Recovery ready"}</h2>

<div className="liveGrid">
<div className="liveDetails">
<p><b>Service</b><br />{isTyrePage ? "Mobile tyre help" : "Vehicle recovery"}</p>
<p><b>Area</b><br />Liverpool & nearby areas</p>
<p><b>Status</b><br />Available now</p>
</div>

<a href={`tel:${phone}`} className="greenBtn">
Call For Help
</a>
</div>
</div>
</section>

<section id="services" className="section">
<p className="label">OUR SERVICES</p>
<h2>Choose what you need</h2>

<div className="services">
{serviceCards.map((service) => (
<a
key={service}
href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
className="serviceCard"
>
<h3>{service}</h3>
<p>
Fast local support available across the area with simple contact options and rapid response.
</p>
</a>
))}
</div>
</section>

<section className="section">
<div className="cta">
<div>
<p className="label">
{isTyrePage ? "NEED TYRE HELP?" : "NEED RECOVERY NOW?"}
</p>

<h2>Get help arranged quickly</h2>

<p>
Call now and speak to a local provider. This page is built to help customers find fast assistance without searching through multiple websites.
</p>
</div>

<a href={`tel:${phone}`} className="whiteBtn">
Call Now
</a>
</div>
</section>

<section className="section">
<p className="label">HOW IT WORKS</p>
<h2>Quick help without the hassle</h2>

<div className="steps">
<div><b>01</b><h3>Call now</h3><p>Tap the call button and explain what help you need.</p></div>
<div><b>02</b><h3>Confirm location</h3><p>Share your area, vehicle details and urgency.</p></div>
<div><b>03</b><h3>Get support</h3><p>A local provider can help arrange the next step quickly.</p></div>
</div>
</section>

<section className="section">
<p className="label">COVERAGE</p>
<h2>Areas covered</h2>

<div className="areas">
{areas.map((area) => (
<span key={area}>{area}</span>
))}
</div>
</section>

<section className="section">
<details>
<summary>Read more about this service</summary>
<p>{page.content}</p>
</details>

<details>
<summary>Frequently asked questions</summary>

<h3>How quickly can someone arrive?</h3>
<p>Response times depend on location, traffic and provider availability.</p>

<h3>Is this service available 24/7?</h3>
<p>Emergency help may be available day and night depending on local cover.</p>

<h3>Do you cover nearby areas?</h3>
<p>Yes, nearby towns, roads and surrounding areas may be covered.</p>

<h3>Can I call now?</h3>
<p>Yes. Use the call button to arrange help quickly.</p>
</details>
</section>

<section className="section">
<p className="label">NEARBY PAGES</p>
<h2>{nearbyTitle}</h2>

<div className="related">
{relatedPages?.map((p) => (
<a key={p.slug} href={`/seo/${p.slug}`}>
{p.headline}
</a>
))}
</div>
</section>

<a href={`tel:${phone}`} className="sticky">
{stickyText}
</a>

<style>{`
* {
box-sizing: border-box;
}

.page {
min-height: 100vh;
background: #05070d;
color: white;
padding-bottom: 120px;
font-family: Inter, Arial, sans-serif;
}

.hero {
position: relative;
min-height: 760px;
overflow: hidden;
}

.heroImg {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: cover;
object-position: 72% center;
opacity: 1;
}

.heroOverlay {
position: absolute;
inset: 0;
background:
linear-gradient(90deg, rgba(5,7,13,.78), rgba(5,7,13,.28), rgba(5,7,13,.22)),
linear-gradient(180deg, rgba(5,7,13,.12), rgba(5,7,13,.35), #05070d 96%);
}

.heroInner {
position: relative;
z-index: 2;
max-width: 1180px;
margin: 0 auto;
padding: 28px 22px 60px;
}

.topBar {
display: flex;
justify-content: space-between;
align-items: flex-start;
gap: 18px;
margin-bottom: 54px;
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
color: rgba(255,255,255,.78);
}

.topCall,
.whiteBtn {
display: inline-flex;
align-items: center;
justify-content: center;
padding: 14px 24px;
border-radius: 999px;
background: white;
color: #05070d;
font-weight: 1000;
text-decoration: none;
box-shadow: 0 0 28px rgba(255,255,255,.22);
white-space: nowrap;
}

.heroText {
max-width: 570px;
}

.greenPill {
display: inline-flex;
align-items: center;
padding: 12px 19px;
border-radius: 999px;
background: #32ff73;
color: #05070d;
font-size: 13px;
font-weight: 1000;
letter-spacing: 1.2px;
box-shadow: 0 0 34px rgba(50,255,115,.5);
}

h1 {
font-size: clamp(46px, 6vw, 78px);
line-height: .94;
letter-spacing: -3px;
margin: 26px 0 18px;
font-weight: 1000;
max-width: 620px;
}

.intro {
font-size: 19px;
line-height: 1.55;
max-width: 510px;
color: rgba(255,255,255,.9);
margin: 0;
}

.heroButtons {
display: flex;
gap: 14px;
flex-wrap: wrap;
margin-top: 26px;
}

.glassBtn {
display: inline-flex;
align-items: center;
justify-content: center;
padding: 14px 24px;
border-radius: 999px;
color: white;
background: rgba(255,255,255,.1);
border: 1px solid rgba(255,255,255,.22);
text-decoration: none;
font-weight: 950;
backdrop-filter: blur(16px);
}

.trustGrid {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 14px;
margin-top: 34px;
max-width: 1120px;
width: calc(100vw - 44px);
}

.trustGrid div {
padding: 18px 22px;
border-radius: 22px;
background: rgba(10,14,22,.72);
border: 1px solid rgba(255,255,255,.15);
box-shadow: 0 0 30px rgba(50,255,115,.08);
font-size: 18px;
font-weight: 1000;
backdrop-filter: blur(18px);
}

.trustGrid span {
display: block;
font-size: 15px;
color: rgba(255,255,255,.8);
margin-top: 4px;
font-weight: 800;
}

.liveSection,
.section {
max-width: 1180px;
margin: 0 auto;
padding: 28px 22px;
}

.liveCard {
margin-top: -72px;
position: relative;
z-index: 4;
padding: 28px;
border-radius: 30px;
background: rgba(8,12,18,.86);
border: 1px solid rgba(255,255,255,.18);
box-shadow: 0 30px 100px rgba(0,0,0,.45), 0 0 45px rgba(50,255,115,.12);
backdrop-filter: blur(22px);
}

.liveLabel {
margin: 0 0 16px;
display: flex;
align-items: center;
gap: 10px;
color: rgba(255,255,255,.78);
letter-spacing: 2px;
font-size: 13px;
font-weight: 1000;
}

.liveLabel span {
width: 10px;
height: 10px;
border-radius: 50%;
background: #32ff73;
box-shadow: 0 0 22px rgba(50,255,115,.8);
}

.liveCard h2,
.section h2 {
font-size: clamp(30px, 4vw, 44px);
line-height: 1;
letter-spacing: -1.5px;
margin: 0 0 22px;
font-weight: 1000;
}

.liveGrid {
display: grid;
grid-template-columns: 1.2fr .8fr;
gap: 22px;
align-items: center;
border-top: 1px solid rgba(255,255,255,.12);
padding-top: 22px;
}

.liveDetails {
display: grid;
gap: 18px;
}

.liveDetails p {
margin: 0;
font-size: 17px;
line-height: 1.35;
color: rgba(255,255,255,.86);
}

.liveDetails b {
color: white;
}

.greenBtn {
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 66px;
border-radius: 999px;
background: linear-gradient(135deg, #32ff73, #18d85b);
color: #05070d;
font-weight: 1000;
font-size: 18px;
text-decoration: none;
box-shadow: 0 0 35px rgba(50,255,115,.45);
}

.label {
margin: 0 0 10px;
color: #32ff73;
letter-spacing: 2.4px;
font-weight: 1000;
font-size: 13px;
}

.services {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 14px;
}

.serviceCard,
.steps div,
.cta,
details,
.related a {
background: linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.04));
border: 1px solid rgba(255,255,255,.14);
box-shadow: 0 20px 70px rgba(0,0,0,.25);
}

.serviceCard {
min-height: 205px;
padding: 24px;
border-radius: 24px;
color: white;
text-decoration: none;
}

.serviceCard h3 {
font-size: 24px;
line-height: 1.1;
margin: 0 0 18px;
letter-spacing: -.7px;
}

.serviceCard p,
.steps p,
.cta p,
details p {
margin: 0;
color: rgba(255,255,255,.78);
line-height: 1.55;
font-size: 16px;
}

.cta {
padding: 30px 34px;
border-radius: 28px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 24px;
background:
radial-gradient(circle at 82% 45%, rgba(50,255,115,.28), transparent 32%),
linear-gradient(135deg, rgba(255,255,255,.11), rgba(255,255,255,.04));
}

.steps {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 14px;
}

.steps div {
padding: 24px;
border-radius: 24px;
}

.steps b {
color: #32ff73;
font-size: 15px;
}

.steps h3 {
margin: 12px 0 10px;
font-size: 22px;
}

.areas {
display: flex;
flex-wrap: wrap;
gap: 10px;
padding: 22px;
border-radius: 26px;
background: rgba(255,255,255,.055);
border: 1px solid rgba(255,255,255,.13);
}

.areas span {
padding: 11px 15px;
border-radius: 999px;
background: rgba(255,255,255,.09);
border: 1px solid rgba(255,255,255,.14);
font-weight: 900;
}

details {
padding: 24px;
border-radius: 24px;
margin-bottom: 16px;
}

summary {
cursor: pointer;
font-size: 20px;
font-weight: 1000;
}

details p {
margin-top: 18px;
white-space: pre-line;
}

.related {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 12px;
}

.related a {
padding: 16px 18px;
border-radius: 18px;
color: white;
text-decoration: none;
font-weight: 900;
}

.sticky {
position: fixed;
left: 20px;
right: 20px;
bottom: 18px;
z-index: 80;
padding: 16px 20px;
border-radius: 999px;
background: #32ff73;
color: #05070d;
text-align: center;
text-decoration: none;
font-weight: 1000;
box-shadow: 0 0 40px rgba(50,255,115,.55);
}

@media (max-width: 760px) {
.hero {
min-height: 690px;
}

.heroImg {
object-position: 68% center;
}

.heroOverlay {
background:
linear-gradient(90deg, rgba(5,7,13,.76), rgba(5,7,13,.22), rgba(5,7,13,.18)),
linear-gradient(180deg, rgba(5,7,13,.12), rgba(5,7,13,.35), #05070d 96%);
}

.heroInner {
padding: 24px 20px 44px;
}

.topBar {
margin-bottom: 48px;
}

.brand {
font-size: 38px;
}

.topBar p {
font-size: 10px;
letter-spacing: 2.5px;
}

.topCall {
padding: 12px 17px;
font-size: 14px;
}

.greenPill {
font-size: 12px;
padding: 11px 16px;
letter-spacing: 1px;
}

h1 {
font-size: 43px;
line-height: .96;
letter-spacing: -2px;
max-width: 330px;
margin: 22px 0 16px;
}

.intro {
font-size: 16px;
max-width: 320px;
}

.heroButtons {
margin-top: 22px;
}

.whiteBtn,
.glassBtn {
padding: 13px 18px;
font-size: 15px;
}

.trustGrid {
grid-template-columns: repeat(2, 1fr);
width: 100%;
gap: 10px;
margin-top: 28px;
}

.trustGrid div {
padding: 14px 16px;
font-size: 16px;
border-radius: 18px;
}

.trustGrid span {
font-size: 13px;
}

.liveSection,
.section {
padding: 24px 20px;
}

.liveCard {
margin-top: -42px;
padding: 22px;
border-radius: 26px;
}

.liveCard h2,
.section h2 {
font-size: 30px;
}

.liveGrid {
grid-template-columns: 1fr;
gap: 18px;
}

.liveDetails p {
font-size: 16px;
}

.greenBtn {
min-height: 54px;
font-size: 16px;
}

.services,
.steps {
grid-template-columns: 1fr;
}

.serviceCard {
min-height: 160px;
border-radius: 22px;
}

.cta {
padding: 24px;
border-radius: 24px;
align-items: flex-start;
}

.sticky {
left: 20px;
right: 20px;
bottom: 18px;
}
}
`}</style>
</main>
);
}