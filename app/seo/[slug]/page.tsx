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
? ["Mobile Tyre Fitting", "Emergency Tyre Fitting", "Puncture Repair", "Tyre Replacement"]
: ["Breakdown Recovery", "Accident Recovery", "Vehicle Transport", "Roadside Assistance"];

const { data: relatedPages } = await supabase
.from("landing_pages")
.select("slug, headline")
.neq("slug", params.slug)
.eq("active", true)
.ilike("slug", isTyrePage ? "%tyre%" : "%recovery%")
.limit(30);

const areas = ["Liverpool", "Bootle", "Huyton", "Kirkby", "Speke", "Widnes", "St Helens", "Wirral", "M57", "M58", "M62"];

return (
<main className="page">
<section className="hero">
<img src={heroImageSrc} alt={title} className="heroImg" />
<div className="heroOverlay" />

<div className="heroInner">
<div className="top">
<div>
<p className="brandSmall">LOCAL EMERGENCY SERVICE</p>
<strong className="brand">AdForge</strong>
</div>
<a href={`tel:${phone}`} className="topBtn">Call Now</a>
</div>

<div className="heroGrid">
<div>
<p className="greenPill">
{isTyrePage ? "24 Hour Mobile Tyre Fitting" : "24 Hour Emergency Recovery"}
</p>

<h1>{title}</h1>
<p className="intro">{description}</p>

<div className="actions">
<a href={`tel:${phone}`} className="whiteBtn">Call Now</a>
<a href="#services" className="darkBtn">View Services</a>
</div>
</div>

<div className="liveCard">
<p className="liveTop"><span /> LIVE LOCAL RESPONSE</p>
<h2>{isTyrePage ? "Tyre help ready" : "Recovery ready"}</h2>

<div className="leadBox">
<p><b>Service</b> • {isTyrePage ? "Mobile tyre help" : "Vehicle recovery"}</p>
<p><b>Area</b> • Liverpool & nearby areas</p>
<p><b>Status</b> • Available now</p>
</div>

<a href={`tel:${phone}`} className="greenBtn">Call For Help</a>
</div>
</div>
</div>
</section>

<section id="services" className="section">
<p className="label">SERVICES</p>
<h2>Choose what you need</h2>

<div className="cards">
{serviceCards.map((service, index) => (
<a key={service} href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="card">
<span className="num">0{index + 1}</span>
<h3>{service}</h3>
<p>Fast local support available across the area with simple contact options and rapid response.</p>
<b>View service</b>
</a>
))}
</div>
</section>

<section className="section">
<div className="box">
<p className="label">HOW IT WORKS</p>
<h2>Quick help without the hassle</h2>

<div className="steps">
<div><span>01</span><b>Call now</b><p>Tap the call button and explain what help you need.</p></div>
<div><span>02</span><b>Confirm location</b><p>Share your area, vehicle details and urgency.</p></div>
<div><span>03</span><b>Get support</b><p>A local provider can help arrange the next step quickly.</p></div>
</div>
</div>
</section>

<section className="section">
<div className="cta">
<p className="label">{isTyrePage ? "NEED TYRE HELP?" : "NEED RECOVERY NOW?"}</p>
<h2>Get help arranged quickly</h2>
<p>{description}</p>
<a href={`tel:${phone}`} className="whiteBtn">Call Now</a>
</div>
</section>

<section className="section">
<p className="label">COVERAGE</p>
<h2>Areas covered</h2>
<div className="areas">
{areas.map((area) => <span key={area}>{area}</span>)}
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
<a key={p.slug} href={`/seo/${p.slug}`}>{p.headline}</a>
))}
</div>
</section>

<a href={`tel:${phone}`} className="sticky">{stickyText}</a>

<style>{`
.page {
min-height: 100vh;
background: #05070d;
color: white;
padding-bottom: 120px;
font-family: Inter, Arial, sans-serif;
}

.hero {
position: relative;
min-height: 92vh;
overflow: hidden;
}

.heroImg {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
opacity: .9;
}

.heroOverlay {
position: absolute;
inset: 0;
background:
radial-gradient(circle at 65% 18%, rgba(50,255,115,.28), transparent 28%),
linear-gradient(90deg, rgba(5,7,13,.95), rgba(5,7,13,.55), rgba(5,7,13,.85)),
linear-gradient(180deg, rgba(5,7,13,.05), #05070d 95%);
}

.heroInner {
position: relative;
z-index: 2;
max-width: 1120px;
margin: 0 auto;
padding: 28px 20px 70px;
}

.top {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 70px;
gap: 16px;
}

.brandSmall {
margin: 0;
color: rgba(255,255,255,.55);
letter-spacing: 4px;
font-size: 11px;
font-weight: 900;
}

.brand {
display: block;
margin-top: 5px;
font-size: 38px;
font-weight: 1000;
letter-spacing: -2px;
}

.brand::first-letter {
color: white;
}

.topBtn,
.whiteBtn {
display: inline-block;
padding: 14px 22px;
border-radius: 999px;
background: white;
color: #05070d;
font-weight: 1000;
text-decoration: none;
box-shadow: 0 0 35px rgba(255,255,255,.22);
}

.heroGrid {
display: grid;
grid-template-columns: 1.1fr .9fr;
gap: 28px;
align-items: end;
}

.greenPill {
display: inline-block;
padding: 13px 20px;
border-radius: 999px;
background: #32ff73;
color: #05070d;
font-weight: 1000;
letter-spacing: 1.5px;
font-size: 13px;
box-shadow: 0 0 35px rgba(50,255,115,.55);
}

h1 {
font-size: clamp(44px, 7vw, 86px);
line-height: .9;
letter-spacing: -4px;
margin: 22px 0;
max-width: 760px;
font-weight: 1000;
}

.intro {
max-width: 660px;
font-size: 21px;
line-height: 1.55;
color: rgba(255,255,255,.86);
}

.actions {
display: flex;
flex-wrap: wrap;
gap: 12px;
margin-top: 26px;
}

.darkBtn {
display: inline-block;
padding: 14px 22px;
border-radius: 999px;
background: rgba(255,255,255,.1);
color: white;
border: 1px solid rgba(255,255,255,.18);
text-decoration: none;
font-weight: 950;
backdrop-filter: blur(18px);
}

.liveCard {
padding: 24px;
border-radius: 34px;
background: rgba(5,7,13,.76);
border: 1px solid rgba(255,255,255,.18);
box-shadow: 0 0 45px rgba(50,255,115,.18), 0 35px 90px rgba(0,0,0,.55);
backdrop-filter: blur(22px);
}

.liveTop {
display: flex;
align-items: center;
gap: 10px;
font-size: 13px;
font-weight: 1000;
letter-spacing: 1.2px;
}

.liveTop span {
width: 10px;
height: 10px;
border-radius: 999px;
background: #32ff73;
box-shadow: 0 0 25px rgba(50,255,115,.9);
}

.liveCard h2 {
font-size: 34px;
line-height: 1;
margin: 20px 0;
letter-spacing: -1px;
}

.leadBox {
padding: 18px;
border-radius: 24px;
background: rgba(255,255,255,.07);
border: 1px solid rgba(255,255,255,.12);
line-height: 1.6;
}

.greenBtn {
display: block;
margin-top: 16px;
padding: 15px 18px;
border-radius: 999px;
background: #32ff73;
color: #05070d;
text-align: center;
text-decoration: none;
font-weight: 1000;
box-shadow: 0 0 32px rgba(50,255,115,.45);
}

.section {
max-width: 1120px;
margin: 0 auto;
padding: 44px 20px;
}

.label {
margin: 0 0 12px;
color: #32ff73;
text-transform: uppercase;
letter-spacing: 2.5px;
font-weight: 1000;
font-size: 13px;
}

.section h2 {
font-size: clamp(32px, 5vw, 54px);
line-height: 1;
margin: 0 0 24px;
letter-spacing: -2px;
}

.cards,
.steps,
.related {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
gap: 16px;
}

.card,
.steps div,
.box,
.cta,
details {
border-radius: 30px;
background:
radial-gradient(circle at top right, rgba(50,255,115,.16), transparent 34%),
linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,.045));
border: 1px solid rgba(255,255,255,.14);
box-shadow: 0 25px 80px rgba(0,0,0,.3);
}

.card {
min-height: 220px;
padding: 24px;
color: white;
text-decoration: none;
display: flex;
flex-direction: column;
justify-content: space-between;
}

.num,
.card b {
color: #32ff73;
}

.card h3 {
font-size: 27px;
margin: 18px 0 8px;
letter-spacing: -1px;
}

.card p,
.steps p,
.cta p,
details p {
color: rgba(255,255,255,.78);
line-height: 1.6;
}

.box,
.cta,
details {
padding: 26px;
}

.steps div {
padding: 22px;
}

.steps span {
color: #32ff73;
font-weight: 1000;
display: block;
margin-bottom: 12px;
}

.steps b {
display: block;
font-size: 20px;
margin-bottom: 8px;
}

.areas {
display: flex;
flex-wrap: wrap;
gap: 10px;
padding: 22px;
border-radius: 30px;
background: rgba(255,255,255,.055);
border: 1px solid rgba(255,255,255,.13);
}

.areas span {
padding: 12px 16px;
border-radius: 999px;
background: rgba(255,255,255,.09);
border: 1px solid rgba(255,255,255,.14);
font-weight: 900;
}

summary {
cursor: pointer;
font-size: 20px;
font-weight: 1000;
}

.related a {
padding: 17px 18px;
border-radius: 22px;
background: rgba(255,255,255,.06);
border: 1px solid rgba(50,255,115,.25);
color: white;
text-decoration: none;
font-weight: 900;
}

.sticky {
position: fixed;
left: 16px;
right: 16px;
bottom: 18px;
padding: 16px 20px;
border-radius: 999px;
background: #32ff73;
color: #05070d;
font-weight: 1000;
text-align: center;
text-decoration: none;
box-shadow: 0 0 40px rgba(50,255,115,.55);
z-index: 50;
}

@media (max-width: 760px) {
.hero {
min-height: auto;
}

.heroInner {
padding: 24px 24px 80px;
}

.top {
margin-bottom: 46px;
}

.brandSmall {
letter-spacing: 3px;
font-size: 10px;
}

.brand {
font-size: 34px;
}

.topBtn {
padding: 12px 18px;
}

.heroGrid {
grid-template-columns: 1fr;
gap: 24px;
}

.greenPill {
font-size: 12px;
padding: 12px 16px;
letter-spacing: 1px;
}

h1 {
font-size: 52px;
letter-spacing: -3px;
line-height: .92;
}

.intro {
font-size: 18px;
max-width: 92%;
}

.actions {
gap: 10px;
}

.whiteBtn,
.darkBtn {
padding: 14px 19px;
}

.liveCard {
border-radius: 28px;
padding: 20px;
}

.liveCard h2 {
font-size: 30px;
}

.section {
padding: 34px 24px;
}

.section h2 {
font-size: 39px;
letter-spacing: -1.5px;
}

.cards,
.steps,
.related {
grid-template-columns: 1fr;
}

.card {
min-height: 190px;
border-radius: 28px;
}

.card h3 {
font-size: 28px;
}

.sticky {
left: 24px;
right: 24px;
bottom: 18px;
padding: 15px 18px;
}
}
`}</style>
</main>
);
}