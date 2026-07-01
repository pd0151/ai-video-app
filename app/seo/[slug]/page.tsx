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
title: data?.title_tag || data?.headline || "24 Hour Recovery",
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
const { data: relatedPages } = await supabase
.from("landing_pages")
.select("slug, headline")
.neq("slug", params.slug)
.eq("active", true)
.limit(30);

if (!page) notFound();

const title = page.headline;
const description =
page.meta_description ||
"Fast 24 hour breakdown recovery, accident recovery and vehicle transport available day and night.";

const areas = [
"Liverpool",
"Bootle",
"Huyton",
"Kirkby",
"Speke",
"Widnes",
"St Helens",
"M57",
"M58",
"M62",
];

const services = [
"Breakdown Recovery",
"Accident Recovery",
"Vehicle Transport",
"Roadside Assistance",
];

return (
<main style={main}>
<section style={hero}>
<div style={wrap}>
<p style={badge}>24 Hour Emergency Recovery</p>

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

<div
style={{
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
}}
>
<span style={{ color: "#32ff73", fontWeight: 900 }}>
●
</span>

<span>Powered by</span>

<span
style={{
color: "#32ff73",
fontWeight: 900,
fontSize: 16,
}}
>
AdForge
</span>
</div>



<div style={trustRow}>
<span style={trustPill}>5.0 Rated</span>
<span style={trustPill}>Available 24/7</span>
<span style={trustPill}>Fast Response</span>
<span style={trustPill}>Fully Insured</span>
</div>

<img
src="/images/recovery-truck.jpg"
alt={title}
style={heroImage}
/>
</div>
</section>

<section id="services" style={section}>
<div style={grid}>
{services.map((service) => (
<div key={service} style={card}>
<h2 style={cardTitle}>{service}</h2>
<p style={cardText}>
Fast, reliable support available day and night across the local area.
</p>
</div>
))}
</div>
</section>

<section style={section}>
<div style={wrap}>
<h2 style={h2}>Why choose us?</h2>

<p style={bodyText}>{page.content}</p>

<div style={strip}>
<strong>Available 24/7</strong>
<strong>Fast Response</strong>
<strong>Local Recovery</strong>
</div>
</div>
</section>

<section style={section}>
<div style={wrap}>
<h2 style={h2}>Areas covered</h2>

<div style={chipRow}>
{areas.map((area) => (
<span key={area} style={chip}>
{area}
</span>
))}
</div>
</div>
</section>

<section style={{ ...section, paddingBottom: 130 }}>
<div style={ctaBox}>
<p style={badge}>Need recovery now?</p>

<h2 style={h2}>Call for immediate assistance</h2>

<p style={bodyText}>
Speak directly to the recovery team and get help arranged quickly.
</p>

<a href={`tel:${phone}`} style={primaryBtn}>
Call Now
</a>
</div>
</section>

<section style={section}>
<div style={wrap}>
<h2 style={h2}>Nearby Recovery Areas</h2>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
gap: 14,
marginTop: 24,
}}
>
{relatedPages?.map((p) => (
<a
key={p.slug}
href={`/seo/${p.slug}`}
style={{
padding: "16px 18px",
borderRadius: 18,
background: "rgba(255,255,255,.05)",
border: "1px solid rgba(50,255,115,.2)",
color: "#32ff73",
textDecoration: "none",
fontWeight: 700,
}}
>
{p.headline}
</a>
))}
</div>
</div>
</section>


<a href={`tel:${phone}`} style={stickyBtn}>
Call 24 Hour Recovery
</a>
</main>
);
}

const main: React.CSSProperties = {
minHeight: "100vh",
background: "#05070d",
color: "white",
paddingBottom: 90,
};

const hero: React.CSSProperties = {
padding: "76px 20px 42px",
background:
"radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 34%), linear-gradient(180deg,#0b0f18,#05070d)",
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
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.16)",
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
height: 380,
objectFit: "cover",
objectPosition: "center",
borderRadius: 30,
marginTop: 38,
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
display: "block",
};

const section: React.CSSProperties = {
padding: "34px 20px",
};

const grid: React.CSSProperties = {
maxWidth: 1100,
margin: "0 auto",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: 16,
};

const card: React.CSSProperties = {
padding: 28,
borderRadius: 28,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.12)",
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

const strip: React.CSSProperties = {
marginTop: 24,
display: "flex",
gap: 12,
flexWrap: "wrap",
};

const chipRow: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
};

const chip: React.CSSProperties = {
padding: "11px 15px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
fontWeight: 800,
};

const ctaBox: React.CSSProperties = {
maxWidth: 1100,
margin: "0 auto",
padding: 30,
borderRadius: 32,
background:
"linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
border: "1px solid rgba(255,255,255,0.14)",
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