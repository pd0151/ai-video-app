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
<main style={main}>
<section style={hero}>
<img src={heroImageSrc} alt={title} style={heroBgImage} />
<div style={heroOverlay} />

<div style={heroInner}>
<div style={brandRow}>
<div>
<p style={brandSmall}>LOCAL EMERGENCY SERVICE</p>
<strong style={brandName}>AdForge</strong>
</div>

<a href={`tel:${phone}`} style={topBtn}>
Call Now
</a>
</div>

<div style={heroContent}>
<div style={heroText}>
<p style={greenPill}>
{isTyrePage ? "24 Hour Mobile Tyre Fitting" : "24 Hour Emergency Recovery"}
</p>

<h1 style={h1}>{title}</h1>

<p style={intro}>{description}</p>

<div style={buttonRow}>
<a href={`tel:${phone}`} style={primaryBtn}>
Call Now
</a>

<a href="#services" style={secondaryBtn}>
View Services
</a>
</div>

<div style={trustRow}>
<span style={trustPill}>24/7 Available</span>
<span style={trustPill}>Fast Response</span>
<span style={trustPill}>Local Cover</span>
</div>
</div>

<div style={liveCard}>
<div style={liveTop}>
<span style={dot} />
<span>LIVE LOCAL RESPONSE</span>
</div>

<h2 style={liveTitle}>
{isTyrePage ? "Tyre help ready" : "Recovery ready"}
</h2>

<div style={leadBox}>
<p><strong>Service</strong> • {isTyrePage ? "Mobile tyre help" : "Vehicle recovery"}</p>
<p><strong>Area</strong> • Liverpool & nearby areas</p>
<p><strong>Status</strong> • Available now</p>
</div>

<a href={`tel:${phone}`} style={liveBtn}>
Call For Help
</a>
</div>
</div>
</div>
</section>

<section id="services" style={section}>
<div style={wrap}>
<p style={sectionLabel}>SERVICES</p>
<h2 style={h2}>Choose what you need</h2>

<div style={serviceGrid}>
{serviceCards.map((service, index) => (
<a
key={service}
href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
style={serviceCard}
>
<span style={serviceNum}>0{index + 1}</span>
<h2 style={serviceTitle}>{service}</h2>
<p style={cardText}>
Fast local support available across the area with simple contact options and rapid response.
</p>
<strong style={cardAction}>View service</strong>
</a>
))}
</div>
</div>
</section>

<section style={section}>
<div style={wrap}>
<div style={processBox}>
<p style={sectionLabel}>HOW IT WORKS</p>
<h2 style={h2}>Quick help without the hassle</h2>

<div style={steps}>
<div style={step}>
<span>01</span>
<strong>Call now</strong>
<p>Tap the call button and explain what help you need.</p>
</div>

<div style={step}>
<span>02</span>
<strong>Confirm location</strong>
<p>Share your area, vehicle details and urgency.</p>
</div>

<div style={step}>
<span>03</span>
<strong>Get support</strong>
<p>A local provider can help arrange the next step quickly.</p>
</div>
</div>
</div>
</div>
</section>

<section style={section}>
<div style={wrap}>
<div style={ctaBox}>
<div>
<p style={sectionLabel}>
{isTyrePage ? "NEED TYRE HELP?" : "NEED RECOVERY NOW?"}
</p>

<h2 style={h2}>Get help arranged quickly</h2>

<p style={bodyText}>
Call now and speak to a local provider. This page is built to help customers find fast assistance without searching through multiple websites.
</p>
</div>

<a href={`tel:${phone}`} style={primaryBtn}>
Call Now
</a>
</div>
</div>
</section>

<section style={section}>
<div style={wrap}>
<p style={sectionLabel}>COVERAGE</p>
<h2 style={h2}>Areas covered</h2>

<div style={areasBox}>
{areas.map((area) => (
<span key={area} style={areaChip}>
{area}
</span>
))}
</div>
</div>
</section>

<section style={section}>
<div style={wrap}>
<details style={detailsBox}>
<summary style={summaryStyle}>Read more about this service</summary>
<div style={detailsContent}>
<p style={bodyText}>{page.content}</p>
</div>
</details>

<details style={detailsBox}>
<summary style={summaryStyle}>Frequently asked questions</summary>
<div style={detailsContent}>
<h3>How quickly can someone arrive?</h3>
<p>Response times depend on location, traffic and provider availability.</p>

<h3>Is this service available 24/7?</h3>
<p>Emergency help may be available day and night depending on local cover.</p>

<h3>Do you cover nearby areas?</h3>
<p>Yes, nearby towns, roads and surrounding areas may be covered.</p>

<h3>Can I call now?</h3>
<p>Yes. Use the call button to arrange help quickly.</p>
</div>
</details>
</div>
</section>

<section style={section}>
<div style={wrap}>
<p style={sectionLabel}>NEARBY PAGES</p>
<h2 style={h2}>{nearbyTitle}</h2>

<div style={relatedGrid}>
{relatedPages?.map((p) => (
<a key={p.slug} href={`/seo/${p.slug}`} style={relatedLink}>
{p.headline}
</a>
))}
</div>
</div>
</section>

<a href={`tel:${phone}`} style={stickyBtn}>
{stickyText}
</a>
</main>
);
}

const main: React.CSSProperties = {
minHeight: "100vh",
background: "#05070d",
color: "white",
paddingBottom: 110,
};

const hero: React.CSSProperties = {
position: "relative",
minHeight: "92vh",
overflow: "hidden",
};

const heroBgImage: React.CSSProperties = {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
objectPosition: "center",
opacity: 0.9,
};

const heroOverlay: React.CSSProperties = {
position: "absolute",
inset: 0,
background:
"radial-gradient(circle at 70% 20%, rgba(50,255,115,.24), transparent 28%), linear-gradient(90deg, rgba(5,7,13,.96), rgba(5,7,13,.62), rgba(5,7,13,.86)), linear-gradient(180deg, rgba(5,7,13,.08), #05070d 94%)",
};

const heroInner: React.CSSProperties = {
position: "relative",
zIndex: 2,
maxWidth: 1180,
margin: "0 auto",
padding: "28px 18px 70px",
};

const brandRow: React.CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 16,
marginBottom: 70,
};

const brandSmall: React.CSSProperties = {
margin: 0,
color: "rgba(255,255,255,.55)",
letterSpacing: 6,
fontSize: 12,
fontWeight: 900,
};

const brandName: React.CSSProperties = {
display: "block",
marginTop: 6,
fontSize: 38,
fontWeight: 1000,
letterSpacing: -1.8,
color: "white",
textShadow: "0 0 28px rgba(50,255,115,.35)",
};

const topBtn: React.CSSProperties = {
padding: "12px 18px",
borderRadius: 999,
background: "white",
color: "#05070d",
textDecoration: "none",
fontWeight: 1000,
};

const heroContent: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, .85fr)",
gap: 30,
alignItems: "end",
};

const heroText: React.CSSProperties = {
maxWidth: 760,
};

const greenPill: React.CSSProperties = {
display: "inline-block",
padding: "13px 20px",
borderRadius: 999,
background: "#32ff73",
color: "#05070d",
fontWeight: 1000,
letterSpacing: 1.7,
fontSize: 13,
boxShadow: "0 0 35px rgba(50,255,115,.55)",
};

const h1: React.CSSProperties = {
fontSize: "clamp(46px, 8vw, 92px)",
lineHeight: 0.88,
fontWeight: 1000,
letterSpacing: -4,
margin: "22px 0",
textShadow: "0 0 28px rgba(0,0,0,.55)",
};

const intro: React.CSSProperties = {
maxWidth: 690,
fontSize: "clamp(18px, 2.4vw, 23px)",
lineHeight: 1.55,
color: "rgba(255,255,255,.86)",
};

const buttonRow: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 12,
marginTop: 28,
};

const primaryBtn: React.CSSProperties = {
display: "inline-block",
padding: "16px 27px",
borderRadius: 999,
background: "white",
color: "#05070d",
textDecoration: "none",
fontWeight: 1000,
boxShadow: "0 0 38px rgba(255,255,255,.22)",
};

const secondaryBtn: React.CSSProperties = {
display: "inline-block",
padding: "16px 27px",
borderRadius: 999,
background: "rgba(255,255,255,.09)",
color: "white",
textDecoration: "none",
fontWeight: 950,
border: "1px solid rgba(255,255,255,.18)",
backdropFilter: "blur(18px)",
};

const trustRow: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
marginTop: 24,
};

const trustPill: React.CSSProperties = {
padding: "11px 15px",
borderRadius: 999,
background: "rgba(5,7,13,.55)",
border: "1px solid rgba(255,255,255,.18)",
fontWeight: 900,
backdropFilter: "blur(14px)",
};

const liveCard: React.CSSProperties = {
padding: 24,
borderRadius: 34,
background: "rgba(5,7,13,.72)",
border: "1px solid rgba(255,255,255,.18)",
boxShadow:
"0 0 45px rgba(50,255,115,.18), 0 35px 90px rgba(0,0,0,.55)",
backdropFilter: "blur(22px)",
};

const liveTop: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: 10,
color: "rgba(255,255,255,.8)",
fontWeight: 1000,
letterSpacing: 1.2,
fontSize: 13,
};

const dot: React.CSSProperties = {
width: 10,
height: 10,
borderRadius: 999,
background: "#32ff73",
boxShadow: "0 0 25px rgba(50,255,115,.9)",
};

const liveTitle: React.CSSProperties = {
fontSize: 34,
lineHeight: 1,
margin: "20px 0",
fontWeight: 1000,
letterSpacing: -1,
};

const leadBox: React.CSSProperties = {
padding: 18,
borderRadius: 24,
background: "rgba(255,255,255,.07)",
border: "1px solid rgba(255,255,255,.12)",
lineHeight: 1.6,
};

const liveBtn: React.CSSProperties = {
display: "block",
marginTop: 16,
padding: "15px 18px",
borderRadius: 999,
background: "#32ff73",
color: "#05070d",
textAlign: "center",
textDecoration: "none",
fontWeight: 1000,
boxShadow: "0 0 32px rgba(50,255,115,.45)",
};

const wrap: React.CSSProperties = {
maxWidth: 1120,
margin: "0 auto",
};

const section: React.CSSProperties = {
padding: "44px 18px",
};

const sectionLabel: React.CSSProperties = {
margin: "0 0 12px",
color: "#32ff73",
textTransform: "uppercase",
letterSpacing: 2.5,
fontWeight: 1000,
fontSize: 13,
};

const h2: React.CSSProperties = {
fontSize: "clamp(34px, 5vw, 56px)",
lineHeight: 0.95,
letterSpacing: -2,
margin: "0 0 24px",
fontWeight: 1000,
};

const serviceGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
gap: 16,
};

const serviceCard: React.CSSProperties = {
minHeight: 245,
padding: 25,
borderRadius: 32,
background:
"radial-gradient(circle at top right, rgba(50,255,115,.18), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,.045))",
border: "1px solid rgba(255,255,255,.14)",
color: "white",
textDecoration: "none",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
boxShadow: "0 25px 80px rgba(0,0,0,.3)",
};

const serviceNum: React.CSSProperties = {
color: "#32ff73",
fontWeight: 1000,
};

const serviceTitle: React.CSSProperties = {
fontSize: 28,
lineHeight: 1,
letterSpacing: -1,
margin: "18px 0 8px",
fontWeight: 1000,
};

const cardText: React.CSSProperties = {
color: "rgba(255,255,255,.74)",
lineHeight: 1.6,
};

const cardAction: React.CSSProperties = {
marginTop: 16,
color: "#32ff73",
};

const processBox: React.CSSProperties = {
padding: 30,
borderRadius: 38,
background:
"radial-gradient(circle at 12% 10%, rgba(50,255,115,.14), transparent 32%), rgba(255,255,255,.055)",
border: "1px solid rgba(255,255,255,.14)",
};

const steps: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
gap: 14,
};

const step: React.CSSProperties = {
padding: 22,
borderRadius: 26,
background: "rgba(255,255,255,.07)",
border: "1px solid rgba(255,255,255,.11)",
};

const ctaBox: React.CSSProperties = {
padding: 34,
borderRadius: 38,
background:
"radial-gradient(circle at 82% 28%, rgba(50,255,115,.32), transparent 32%), linear-gradient(135deg, rgba(255,255,255,.13), rgba(255,255,255,.045))",
border: "1px solid rgba(255,255,255,.16)",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 24,
flexWrap: "wrap",
};

const bodyText: React.CSSProperties = {
fontSize: 18,
lineHeight: 1.75,
color: "rgba(255,255,255,.82)",
whiteSpace: "pre-line",
maxWidth: 860,
};

const areasBox: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
padding: 24,
borderRadius: 34,
background:
"radial-gradient(circle at center, rgba(50,255,115,.16), transparent 35%), rgba(255,255,255,.055)",
border: "1px solid rgba(255,255,255,.13)",
};

const areaChip: React.CSSProperties = {
padding: "12px 16px",
borderRadius: 999,
background: "rgba(255,255,255,.09)",
border: "1px solid rgba(255,255,255,.14)",
fontWeight: 900,
};

const detailsBox: React.CSSProperties = {
marginTop: 16,
padding: 23,
borderRadius: 28,
background: "rgba(255,255,255,.06)",
border: "1px solid rgba(255,255,255,.12)",
};

const summaryStyle: React.CSSProperties = {
cursor: "pointer",
fontSize: 20,
fontWeight: 1000,
};

const detailsContent: React.CSSProperties = {
marginTop: 18,
color: "rgba(255,255,255,.8)",
lineHeight: 1.7,
};

const relatedGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: 14,
marginTop: 24,
};

const relatedLink: React.CSSProperties = {
padding: "17px 18px",
borderRadius: 22,
background: "rgba(255,255,255,.06)",
border: "1px solid rgba(50,255,115,.25)",
color: "white",
textDecoration: "none",
fontWeight: 900,
};

const stickyBtn: React.CSSProperties = {
position: "fixed",
left: 16,
right: 16,
bottom: 18,
padding: "16px 20px",
borderRadius: 999,
background: "#32ff73",
color: "#05070d",
fontWeight: 1000,
textAlign: "center",
textDecoration: "none",
boxShadow: "0 0 40px rgba(50,255,115,.55)",
zIndex: 50,
};