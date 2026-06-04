"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function BusinessPage({
params,
}: {
params: { slug: string };
}) {
const [business, setBusiness] = useState<any>(null);
const [posts, setPosts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadBusiness() {
const { data: businessData } = await supabase
.from("businesses")
.select("*")
.eq("slug", params.slug)
.maybeSingle();

setBusiness(businessData);

if (businessData?.id) {
const { data: postData } = await supabase
.from("posts")
.select("*")
.eq("user_id", businessData.id)
.order("created_at", { ascending: false })
.limit(6);

setPosts(postData || []);
}

setLoading(false);
}

loadBusiness();
}, [params.slug]);

if (loading) {
return (
<main style={page}>
<div style={statusBox}>Loading business...</div>
</main>
);
}

if (!business) {
return (
<main style={page}>
<div style={statusBox}>Business not found.</div>
</main>
);
}

const phone = business.phone || business.notification_phone || "";
const whatsapp = business.whatsapp || business.notification_phone || phone || "";
const cleanWhatsApp = String(whatsapp).replace(/\D/g, "");
const website = business.website || "";

const services = String(
business.services_offered ||
business.business_type ||
business.service_area ||
""
)
.split(",")
.map((item) => item.trim())
.filter(Boolean);

return (
<main style={page}>
<section style={hero}>
<div style={heroGlow} />

{business.profile_image_url ? (
<img
src={business.profile_image_url}
alt={business.name}
style={heroImage}
/>
) : (
<div style={fallbackImage}>
<span>{business.name}</span>
</div>
)}

<div style={heroOverlay}>
<div style={badge}>Verified local business</div>

<h1 style={title}>{business.name}</h1>

<p style={subtitle}>
{business.location || "Local service provider"}
</p>

{business.tagline && <p style={tagline}>{business.tagline}</p>}

<div style={buttonRow}>
{phone && (
<a href={`tel:${phone}`} style={mainButton}>
Call Now
</a>
)}

{cleanWhatsApp && (
<a
href={`https://wa.me/${cleanWhatsApp}`}
target="_blank"
style={darkButton}
>
WhatsApp
</a>
)}

{website && (
<a href={website} target="_blank" style={darkButton}>
Website
</a>
)}
</div>
</div>
</section>

<section style={grid}>
<div style={infoCard}>
<div style={miniLabel}>Service area</div>
<h2 style={cardTitle}>
{business.service_area || business.location || "Local area"}
</h2>
<p style={cardText}>
{business.details_to_collect ||
"Fast local service with direct contact and quick response."}
</p>
</div>

<div style={infoCard}>
<div style={miniLabel}>Opening hours</div>
<h2 style={cardTitle}>{business.opening_hours || "Contact for availability"}</h2>
<p style={cardText}>
Call or message this business directly to check availability.
</p>
</div>

<div style={infoCard}>
<div style={miniLabel}>Direct booking</div>
<h2 style={cardTitle}>Speak to the business</h2>
<p style={cardText}>
No middleman. Call, WhatsApp, or visit their website.
</p>
</div>
</section>

<section style={section}>
<div style={sectionHeader}>
<h2 style={sectionTitle}>Services</h2>
<p style={sectionText}>What this business offers locally.</p>
</div>

<div style={serviceGrid}>
{(services.length ? services : ["Fast response", "Local service", "Direct contact"]).map(
(service, index) => (
<div key={index} style={servicePill}>
{service}
</div>
)
)}
</div>
</section>

<section style={section}>
<div style={sectionHeader}>
<h2 style={sectionTitle}>Latest adverts</h2>
<p style={sectionText}>Recent posts and media from this business.</p>
</div>

{posts.length === 0 ? (
<div style={emptyBox}>No adverts posted yet.</div>
) : (
<div style={postGrid}>
{posts.map((post) => (
<div key={post.id} style={postCard}>
{post.image_url && (
<img src={post.image_url} alt="Business advert" style={postImage} />
)}

{post.video_url && (
<video src={post.video_url} controls style={postImage} />
)}

<p style={postText}>{post.content || "Business advert"}</p>
</div>
))}
</div>
)}
</section>

<section style={ctaCard}>
<h2 style={ctaTitle}>Ready to book?</h2>
<p style={ctaText}>
Contact {business.name} directly and get a fast response.
</p>

<div style={buttonRow}>
{phone && (
<a href={`tel:${phone}`} style={mainButton}>
Call Now
</a>
)}

{cleanWhatsApp && (
<a
href={`https://wa.me/${cleanWhatsApp}`}
target="_blank"
style={darkButton}
>
WhatsApp
</a>
)}
</div>
</section>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at 80% 0%, rgba(220,235,255,0.14), transparent 34%), radial-gradient(circle at 15% 30%, rgba(120,160,255,0.10), transparent 30%), #05070d",
color: "white",
padding: "18px 18px 110px",
fontFamily: "Inter, Arial, sans-serif",
};

const hero: React.CSSProperties = {
position: "relative",
maxWidth: 980,
margin: "0 auto",
minHeight: 560,
borderRadius: 34,
overflow: "hidden",
background: "rgba(10,14,24,0.92)",
border: "1px solid rgba(220,235,255,0.26)",
boxShadow:
"0 0 8px rgba(255,255,255,0.55), 0 0 38px rgba(220,235,255,0.20), 0 0 80px rgba(120,160,255,0.14)",
};

const heroGlow: React.CSSProperties = {
position: "absolute",
inset: 0,
background:
"linear-gradient(to top, rgba(5,7,13,0.96), rgba(5,7,13,0.35), rgba(5,7,13,0.05))",
zIndex: 1,
};

const heroImage: React.CSSProperties = {
width: "100%",
height: 560,
objectFit: "cover",
display: "block",
};

const fallbackImage: React.CSSProperties = {
height: 560,
display: "flex",
alignItems: "center",
justifyContent: "center",
background:
"linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
fontSize: 34,
fontWeight: 950,
};

const heroOverlay: React.CSSProperties = {
position: "absolute",
left: 24,
right: 24,
bottom: 24,
zIndex: 2,
};

const badge: React.CSSProperties = {
display: "inline-flex",
padding: "9px 13px",
borderRadius: 999,
background: "rgba(255,255,255,0.12)",
border: "1px solid rgba(255,255,255,0.22)",
fontSize: 13,
fontWeight: 900,
marginBottom: 14,
};

const title: React.CSSProperties = {
fontSize: "clamp(38px, 8vw, 72px)",
lineHeight: 0.95,
margin: "0 0 12px",
fontWeight: 950,
letterSpacing: "-0.06em",
textShadow: "0 0 28px rgba(220,235,255,0.35)",
};

const subtitle: React.CSSProperties = {
fontSize: 18,
margin: "0 0 8px",
fontWeight: 900,
opacity: 0.9,
};

const tagline: React.CSSProperties = {
maxWidth: 620,
fontSize: 16,
lineHeight: 1.5,
opacity: 0.82,
};

const buttonRow: React.CSSProperties = {
display: "flex",
gap: 12,
flexWrap: "wrap",
marginTop: 20,
};

const mainButton: React.CSSProperties = {
padding: "15px 22px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 950,
textDecoration: "none",
boxShadow: "0 0 22px rgba(255,255,255,0.28)",
};

const darkButton: React.CSSProperties = {
padding: "15px 22px",
borderRadius: 999,
background: "rgba(255,255,255,0.10)",
color: "white",
border: "1px solid rgba(255,255,255,0.22)",
fontWeight: 950,
textDecoration: "none",
backdropFilter: "blur(14px)",
};

const grid: React.CSSProperties = {
maxWidth: 980,
margin: "18px auto 0",
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: 14,
};

const infoCard: React.CSSProperties = {
padding: 20,
borderRadius: 26,
background: "rgba(10,14,24,0.88)",
border: "1px solid rgba(220,235,255,0.20)",
boxShadow: "0 0 26px rgba(220,235,255,0.10)",
};

const miniLabel: React.CSSProperties = {
fontSize: 12,
textTransform: "uppercase",
letterSpacing: "0.12em",
opacity: 0.58,
fontWeight: 950,
marginBottom: 10,
};

const cardTitle: React.CSSProperties = {
fontSize: 22,
margin: "0 0 8px",
fontWeight: 950,
};

const cardText: React.CSSProperties = {
margin: 0,
opacity: 0.74,
lineHeight: 1.5,
};

const section: React.CSSProperties = {
maxWidth: 980,
margin: "34px auto 0",
};

const sectionHeader: React.CSSProperties = {
marginBottom: 14,
};

const sectionTitle: React.CSSProperties = {
fontSize: 32,
margin: "0 0 6px",
fontWeight: 950,
letterSpacing: "-0.04em",
};

const sectionText: React.CSSProperties = {
margin: 0,
opacity: 0.65,
};

const serviceGrid: React.CSSProperties = {
display: "flex",
flexWrap: "wrap",
gap: 10,
};

const servicePill: React.CSSProperties = {
padding: "12px 15px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.18)",
fontWeight: 900,
};

const emptyBox: React.CSSProperties = {
padding: 20,
borderRadius: 24,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.14)",
fontWeight: 900,
};

const postGrid: React.CSSProperties = {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
gap: 14,
};

const postCard: React.CSSProperties = {
borderRadius: 24,
overflow: "hidden",
background: "rgba(10,14,24,0.90)",
border: "1px solid rgba(220,235,255,0.18)",
};

const postImage: React.CSSProperties = {
width: "100%",
height: 260,
objectFit: "cover",
display: "block",
};

const postText: React.CSSProperties = {
padding: 14,
margin: 0,
fontWeight: 800,
opacity: 0.82,
};

const ctaCard: React.CSSProperties = {
maxWidth: 980,
margin: "34px auto 0",
padding: 24,
borderRadius: 30,
background:
"linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))",
border: "1px solid rgba(255,255,255,0.20)",
boxShadow: "0 0 34px rgba(220,235,255,0.14)",
};

const ctaTitle: React.CSSProperties = {
fontSize: 34,
margin: "0 0 8px",
fontWeight: 950,
};

const ctaText: React.CSSProperties = {
margin: 0,
opacity: 0.72,
};

const statusBox: React.CSSProperties = {
maxWidth: 520,
margin: "80px auto",
padding: 24,
borderRadius: 24,
background: "rgba(10,14,24,0.92)",
border: "1px solid rgba(220,235,255,0.22)",
fontWeight: 900,
textAlign: "center",
};