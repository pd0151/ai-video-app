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

export default function LocationPage({ params }: { params: { slug: string } }) {
const [businesses, setBusinesses] = useState<any[]>([]);

useEffect(() => {
async function loadBusinesses() {
const city = cleanTitle(params.slug);

const { data } = await supabase
.from("businesses")
.select("*")
.ilike("location", `%${city}%`)
.order("name");

setBusinesses(data || []);
}

loadBusinesses();
}, [params.slug]);

return (
<main style={page}>
<h1 style={title}>{cleanTitle(params.slug)}</h1>
<p style={sub}>Local businesses in this area.</p>

<div style={grid}>
{businesses.map((business) => (
<Link key={business.id} href={`/business/${business.slug}`} style={link}>
<section style={card}>
<h2>{business.name}</h2>
<p>{business.location}</p>
</section>
</Link>
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