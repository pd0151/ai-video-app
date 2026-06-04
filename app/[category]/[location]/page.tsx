"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function cleanTitle(slug: string) {
return slug.replaceAll("-", " ");
}




export default function CategoryLocationPage({
params,
}: {
params: { category: string; location: string };
}) {
const [businesses, setBusinesses] = useState<any[]>([]);

useEffect(() => {
async function loadBusinesses() {
const category = cleanTitle(params.category);
const location = cleanTitle(params.location);

const { data } = await supabase
.from("businesses")
.select("*")
.ilike("business_type", `%${category}%`)
.ilike("location", `%${location}%`)
.order("name");

setBusinesses(data || []);
}

loadBusinesses();
}, [params.category, params.location]);

return (
<main style={page}>
<h1 style={title}>
{cleanTitle(params.category)} in {cleanTitle(params.location)}
</h1>

<p style={sub}>Find trusted local businesses in this area.</p>

<div style={grid}>
{businesses.map((business) => (


<section key={business.id} style={card}>


<h2>{business.name}</h2>
<p>{business.location}</p>
{(business.phone || business.notification_phone || business.twilio_number) && (
<p>{business.phone || business.notification_phone || business.twilio_number}</p>
)}

{business.website && (
<p>{business.website}</p>
)}

<div style={{ display: "flex", gap: 10, marginTop: 14 }}>
{(business.phone || business.notification_phone) && (
<a
href={`tel:${business.phone || business.notification_phone}`}
style={smallBtn}
>
Call
</a>
)}

{(business.whatsapp || business.phone || business.notification_phone) && (
<a
href={`https://wa.me/${String(
business.whatsapp || business.phone || business.notification_phone
).replace(/\D/g, "")}`}
style={smallBtn}
>
WhatsApp
</a>
)}

{business.website && (
<a
href={
business.website.startsWith("http")
? business.website
: `https://${business.website}`
}
target="_blank"
style={smallBtn}
>
Website
</a>
)}



<Link
href={`/business/${business.slug}`}
style={smallBtn}
>
View Profile
</Link>
</div>
</section>

))}
</div>
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background: "#05070d",
color: "white",
padding: 24,
};

const title: React.CSSProperties = {
fontSize: 42,
textTransform: "capitalize",
};

const sub: React.CSSProperties = {
opacity: 0.75,
};

const grid: React.CSSProperties = {
display: "grid",
gap: 16,
marginTop: 24,
};

const link: React.CSSProperties = {
color: "white",
textDecoration: "none",
};

const card: React.CSSProperties = {
padding: 20,
borderRadius: 24,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.14)",
};



const smallBtn: React.CSSProperties = {
padding: "10px 14px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 900,
textDecoration: "none",
fontSize: 14,
};