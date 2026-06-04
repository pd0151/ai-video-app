"use client";

import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BusinessesPage() {
const [businesses, setBusinesses] = useState<any[]>([]);
const [search, setSearch] = useState("");

useEffect(() => {
loadBusinesses();
}, []);

async function loadBusinesses() {
const { data } = await supabase.from("businesses").select("*").order("name");
setBusinesses(data || []);
}

const filteredBusinesses = businesses.filter((business) =>
`${business.name || ""} ${business.location || ""} ${business.category || ""}`
.toLowerCase()
.includes(search.toLowerCase())
);

return (
<div style={page}>
<section style={hero}>
<div style={heroGlow} />
<div style={mapGlow} />

<h1 style={title}>
Find Local
<br />
Businesses
</h1>

<p style={subtitle}>
Discover trusted local businesses near you.
</p>

<div style={searchBox}>
<span style={searchIcon}>⌕</span>
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search businesses or services..."
style={searchInput}
/>
</div>
</section>

<div style={sectionHeader}>
<h2 style={sectionTitle}>Browse Categories</h2>
<span style={viewAll}>View all ›</span>
</div>

<div style={categoryGrid}>
{[
["Mobile Tyres", "/cats/tyres.jpg"],
["Recovery", "/cats/recovery.jpg"],
["Barbers", "/cats/barber.jpg"],
["Gyms", "/cats/gym.jpg"],
].map(([name, img]) => (
<div
key={name}
style={{
...categoryCard,
backgroundImage: `url(${img})`,
}}
>
<div style={categoryShade} />
<div style={categoryText}>
<strong>{name}</strong>
<span>Local services</span>
</div>
<div style={categoryArrow}>›</div>
</div>
))}
</div>

<div style={sectionHeader}>
<h2 style={sectionTitle}>Featured Businesses</h2>
<span style={viewAll}>View all ›</span>
</div>

<div style={businessList}>
{filteredBusinesses.map((business) => {
const phone = business.phone || business.notification_phone || "";
const whatsapp = String(business.whatsapp || phone).replace(/\D/g, "");
const profileLink = business.slug
? `/business/${business.slug}`
: `/business/${business.id}`;

return (
<div key={business.id} style={businessCard}>
<div style={logoBox}>
{business.profile_image_url ? (
<img
src={business.profile_image_url}
alt={business.name}
style={logoImg}
/>
) : (
<span>{business.name?.charAt(0) || "B"}</span>
)}
</div>

<div style={businessInfo}>
<h3 style={businessName}>{business.name}</h3>

<p style={businessCategory}>
{business.category || "Local Business"}
</p>

<p style={businessLocation}>
{business.location || "Location not set"}
</p>

<p style={rating}>
★★★★★ <span style={ratingText}>4.9 reviews</span>
</p>
</div>

<div style={actions}>
<div style={topActions}>
<a href={`tel:${phone}`} style={smallBtn}>
Call
</a>

<a
href={`https://wa.me/${whatsapp}`}
target="_blank"
style={smallBtn}
>
WhatsApp
</a>
</div>

<Link href={profileLink} style={viewBtn}>
View Profile →
</Link>
</div>
</div>
);
})}
</div>
</div>
);
}

const page: CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at top right, rgba(49,255,125,0.16), transparent 34%), #020305",
color: "#fff",
padding: "42px 18px 140px",
};

const hero: CSSProperties = {
position: "relative",
overflow: "hidden",
paddingBottom: 20,
};

const heroGlow: CSSProperties = {
position: "absolute",
right: -70,
top: -40,
width: 230,
height: 230,
borderRadius: "50%",
background: "rgba(52,255,129,0.2)",
filter: "blur(45px)",
};

const mapGlow: CSSProperties = {
position: "absolute",
right: 10,
top: 26,
width: 150,
height: 90,
borderRadius: 40,
border: "1px solid rgba(52,255,129,0.12)",
boxShadow: "0 0 60px rgba(52,255,129,0.18)",
transform: "rotate(-18deg)",
};

const title: CSSProperties = {
position: "relative",
fontSize: 48,
lineHeight: 0.95,
fontWeight: 950,
margin: "22px 0 14px",
letterSpacing: "-1.5px",
};

const subtitle: CSSProperties = {
position: "relative",
color: "rgba(255,255,255,0.68)",
fontSize: 17,
lineHeight: 1.4,
marginBottom: 22,
};

const searchBox: CSSProperties = {
position: "relative",
height: 62,
borderRadius: 28,
background: "rgba(13,19,32,0.92)",
border: "1px solid rgba(255,255,255,0.1)",
boxShadow: "0 0 35px rgba(255,255,255,0.045)",
display: "flex",
alignItems: "center",
gap: 12,
padding: "0 18px",
};

const searchIcon: CSSProperties = {
fontSize: 28,
color: "rgba(255,255,255,0.55)",
};

const searchInput: CSSProperties = {
flex: 1,
background: "transparent",
border: 0,
outline: 0,
color: "white",
fontSize: 16,
};

const sectionHeader: CSSProperties = {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
margin: "28px 0 14px",
};

const sectionTitle: CSSProperties = {
margin: 0,
fontSize: 24,
fontWeight: 950,
};

const viewAll: CSSProperties = {
color: "#42ff89",
fontWeight: 800,
};

const categoryGrid: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 12,
};

const categoryCard: CSSProperties = {
position: "relative",
height: 116,
borderRadius: 20,
overflow: "hidden",
backgroundSize: "cover",
backgroundPosition: "center",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
};

const categoryShade: CSSProperties = {
position: "absolute",
inset: 0,
background:
"linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.15))",
};

const categoryText: CSSProperties = {
position: "absolute",
left: 14,
bottom: 13,
display: "flex",
flexDirection: "column",
gap: 3,
fontSize: 13,
color: "rgba(255,255,255,0.7)",
};

const categoryArrow: CSSProperties = {
position: "absolute",
right: 12,
bottom: 12,
width: 34,
height: 34,
borderRadius: "50%",
background: "rgba(52,255,129,0.16)",
color: "#42ff89",
display: "grid",
placeItems: "center",
fontSize: 25,
};

const businessList: CSSProperties = {
display: "flex",
flexDirection: "column",
gap: 13,
};

const businessCard: CSSProperties = {
display: "flex",
gap: 13,
padding: 14,
borderRadius: 26,
background: "rgba(12,18,30,0.94)",
border: "1px solid rgba(255,255,255,0.1)",
boxShadow: "0 0 35px rgba(255,255,255,0.04)",
};

const logoBox: CSSProperties = {
width: 76,
height: 76,
borderRadius: 20,
background: "linear-gradient(135deg,#05070d,#151b2c)",
display: "grid",
placeItems: "center",
fontSize: 31,
fontWeight: 950,
overflow: "hidden",
};

const logoImg: CSSProperties = {
width: "100%",
height: "100%",
objectFit: "cover",
};

const businessInfo: CSSProperties = {
flex: 1,
minWidth: 0,
};

const businessName: CSSProperties = {
margin: 0,
fontSize: 19,
fontWeight: 950,
};

const businessCategory: CSSProperties = {
margin: "4px 0",
color: "rgba(255,255,255,0.62)",
fontSize: 13,
};

const businessLocation: CSSProperties = {
margin: "4px 0",
color: "rgba(255,255,255,0.72)",
fontSize: 13,
};

const rating: CSSProperties = {
margin: "7px 0 0",
color: "#42ff89",
fontSize: 13,
letterSpacing: 1,
};

const ratingText: CSSProperties = {
color: "rgba(255,255,255,0.68)",
letterSpacing: 0,
marginLeft: 5,
};

const actions: CSSProperties = {
width: 124,
display: "flex",
flexDirection: "column",
gap: 9,
};

const topActions: CSSProperties = {
display: "flex",
gap: 7,
};

const smallBtn: CSSProperties = {
flex: 1,
height: 38,
borderRadius: 14,
background: "rgba(255,255,255,0.08)",
color: "white",
textDecoration: "none",
display: "grid",
placeItems: "center",
fontSize: 11,
fontWeight: 850,
};

const viewBtn: CSSProperties = {
height: 45,
borderRadius: 16,
background: "linear-gradient(135deg,#5dff98,#24df6d)",
color: "#020305",
textDecoration: "none",
display: "grid",
placeItems: "center",
fontWeight: 950,
fontSize: 13,
};