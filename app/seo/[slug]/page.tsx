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

const isRecoveryPage =
slug.includes("recovery") ||
slug.includes("breakdown") ||
slug.includes("vehicle-transport") ||
slug.includes("roadside-assistance");

const heroImageSrc = isTyrePage
? "/images/mobile-tyre-fitting.jpg"
: "/images/recovery-truck.jpg";

const badgeText = isTyrePage
? "Mobile tyre help available"
: "24 hour recovery available";

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
<div style={heroGrid}>
<div>
<p style={badge}>
{isTyrePage ? "24 Hour Mobile Tyre Fitting" : "24 Hour Emergency Recovery"}
</p>

<h1 style={h1}>{title}</h1>

<p style={intro}>{description}</p>

<div style={buttonRow}>
<a href={`tel:${phone}`} style={primaryBtn}>Call Now</a>
<a href="#services" style={secondaryBtn}>View Services</a>
</div>

<div style={trustRow}>
<span style={trustPill}>Fast Response</span>
<span style={trustPill}>Available 24/7</span>
<span style={trustPill}>Local Service</span>
</div>
</div>

<div style={heroImagePanel}>
<img src={heroImageSrc} alt={title} style={heroImage} />

<div style={floatingHelp}>
<strong>Need help now?</strong>
<span>Call and get connected quickly.</span>
</div>
</div>
</div>
</section>

<section id="services" style={section}>
<div style={grid}>
{serviceCards.map((service) => (
<a
key={service}
href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
style={card}
>
<h2 style={cardTitle}>{service}</h2>
<p style={cardText}>
Fast local support available across the area with simple contact
options and rapid response.
</p>
</a>
))}
</div>
</section>

<section style={section}>
<div style={wrap}>
<div style={ctaBox}>
<p style={badge}>{isTyrePage ? "Need tyre help?" : "Need recovery now?"}</p>
<h2 style={h2}>Get help arranged quickly</h2>
<p style={bodyText}>
Call now and speak to a local provider. This page is built to help
customers find fast assistance without searching through multiple
websites.
</p>
<a href={`tel:${phone}`} style={primaryBtn}>
Call Now
</a>
</div>
</div>
</section>

<section style={section}>
<div style={wrap}>
<h2 style={h2}>Services available</h2>

<div style={featureGrid}>
{serviceCards.map((item) => (
<div key={item} style={featureCard}>
<strong>{item}</strong>
<p style={cardText}>
Available locally with support for urgent call-outs, same-day
enquiries and professional service.
</p>
</div>
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
<summary style={summaryStyle}>Areas covered</summary>
<div style={chipRow}>
{areas.map((area) => (
<span key={area} style={chip}>
{area}
</span>
))}
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
padding: "76px 20px 42px",
background:
"radial-gradient(circle at top right, rgba(50,255,115,0.14), transparent 32%), linear-gradient(180deg,#0b0f18,#05070d)",
borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const wrap: React.CSSProperties = {
maxWidth: 1100,
margin: "0 auto",
};

const badge: React.CSSProperties = {
display: "inline-block",
padding: "9px 15px",
borderRadius: 999,
background: "rgba(50,255,115,0.1)",
border: "1px solid rgba(50,255,115,0.25)",
color: "#eaffef",
fontWeight: 850,
};

const h1: React.CSSProperties = {
fontSize: 58,
lineHeight: 0.95,
fontWeight: 950,
margin: "18px 0",
letterSpacing: -2,
};

const intro: React.CSSProperties = {
fontSize: 21,
lineHeight: 1.55,
opacity: 0.84,
maxWidth: 780,
};

const buttonRow: React.CSSProperties = {
display: "flex",
gap: 12,
flexWrap: "wrap",
marginTop: 26,
};

const primaryBtn: React.CSSProperties = {
display: "inline-block",
padding: "16px 24px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 950,
textDecoration: "none",
};

const secondaryBtn: React.CSSProperties = {
display: "inline-block",
padding: "16px 24px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
color: "white",
border: "1px solid rgba(255,255,255,0.16)",
fontWeight: 900,
textDecoration: "none",
};

const poweredBadge: React.CSSProperties = {
display: "inline-flex",
alignItems: "center",
gap: 10,
padding: "8px 18px",
borderRadius: 999,
background: "rgba(50,255,115,.12)",
border: "1px solid rgba(50,255,115,.35)",
color: "#fff",
fontWeight: 700,
marginTop: 22,
marginBottom: 22,
};

const greenDot: React.CSSProperties = {
color: "#32ff73",
fontWeight: 900,
};

const trustRow: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
marginTop: 24,
};

const trustPill: React.CSSProperties = {
padding: "10px 14px",
borderRadius: 999,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.12)",
fontWeight: 800,
fontSize: 14,
};

const heroImage: React.CSSProperties = {
width: "100%",
height: 300,
objectFit: "cover",
objectPosition: "center",
borderRadius: 28,
border: "1px solid rgba(255,255,255,.12)",
display: "block",
};

const section: React.CSSProperties = {
padding: "34px 20px",
};

const grid: React.CSSProperties = {
maxWidth: 1100,
margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 16,
};

const card: React.CSSProperties = {
display: "block",
padding: 28,
borderRadius: 28,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.12)",
textDecoration: "none",
color: "white",
};

const cardTitle: React.CSSProperties = {
fontSize: 22,
margin: 0,
fontWeight: 950,
};

const cardText: React.CSSProperties = {
opacity: 0.72,
lineHeight: 1.6,
};

const h2: React.CSSProperties = {
fontSize: 36,
fontWeight: 950,
letterSpacing: -1,
};

const bodyText: React.CSSProperties = {
fontSize: 18,
lineHeight: 1.75,
opacity: 0.84,
whiteSpace: "pre-line",
};

const ctaBox: React.CSSProperties = {
padding: 30,
borderRadius: 32,
background:
"linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
border: "1px solid rgba(255,255,255,0.14)",
};

const featureGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: 16,
};

const featureCard: React.CSSProperties = {
padding: 22,
borderRadius: 24,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.1)",
};

const detailsBox: React.CSSProperties = {
marginTop: 16,
padding: 20,
borderRadius: 24,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.12)",
};

const summaryStyle: React.CSSProperties = {
cursor: "pointer",
fontSize: 20,
fontWeight: 900,
};

const detailsContent: React.CSSProperties = {
marginTop: 18,
};

const chipRow: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
marginTop: 18,
};

const chip: React.CSSProperties = {
padding: "11px 15px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
fontWeight: 800,
};

const relatedGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
gap: 14,
marginTop: 24,
};

const relatedLink: React.CSSProperties = {
padding: "16px 18px",
borderRadius: 18,
background: "rgba(255,255,255,.05)",
border: "1px solid rgba(50,255,115,.2)",
color: "#32ff73",
textDecoration: "none",
fontWeight: 700,
};

const stickyBtn: React.CSSProperties = {
position: "fixed",
left: 16,
right: 16,
bottom: 18,
padding: "16px 20px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 950,
textAlign: "center",
textDecoration: "none",
boxShadow: "0 0 35px rgba(255,255,255,0.24)",
};

const heroGrid: React.CSSProperties = {
maxWidth: 1100,
margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 28,
alignItems: "center",
};

const heroImagePanel: React.CSSProperties = {
position: "relative",
padding: 10,
borderRadius: 34,
background: "linear-gradient(135deg, rgba(50,255,115,.2), rgba(255,255,255,.05))",
border: "1px solid rgba(255,255,255,.14)",
};

const floatingHelp: React.CSSProperties = {
position: "absolute",
left: 24,
bottom: 24,
padding: "14px 16px",
borderRadius: 20,
background: "rgba(5,7,13,.82)",
border: "1px solid rgba(255,255,255,.16)",
backdropFilter: "blur(16px)",
display: "grid",
gap: 4,
};