"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BusinessesPage() {
const [businesses, setBusinesses] = useState<any[]>([]);

useEffect(() => {
loadBusinesses();
}, []);

async function loadBusinesses() {
const { data } = await supabase
.from("businesses")
.select("*")
.order("name");

setBusinesses(data || []);
}

return (
<div
style={{
minHeight: "100vh",
background: "#05070d",
color: "#fff",
padding: "24px 18px 120px",
}}
>
<h1
style={{
fontSize: 46,
fontWeight: 900,
marginBottom: 6,
}}
>
Find Local Businesses
</h1>

<p
style={{
opacity: 0.7,
marginBottom: 24,
}}
>
Discover trusted local businesses near you
</p>

<input
placeholder="Search businesses..."
style={{
width: "100%",
padding: "18px 22px",
borderRadius: 20,
border: "1px solid rgba(255,255,255,0.08)",
background: "#0b1220",
color: "#fff",
fontSize: 16,
marginBottom: 28,
}}
/>

<h2
style={{
marginBottom: 16,
fontSize: 24,
}}
>
Featured Businesses
</h2>

<div
style={{
display: "grid",
gap: 18,
}}
>
{businesses.map((business) => (
<Link
key={business.id}
href={`/business/${business.slug}`}
style={{
textDecoration: "none",
color: "white",
}}
>
<div
style={{
background:
"linear-gradient(135deg,#0b1220,#111827)",
borderRadius: 28,
padding: 18,
border:
"1px solid rgba(255,255,255,0.08)",
boxShadow:
"0 0 30px rgba(255,255,255,0.06)",
}}
>
<div
style={{
display: "flex",
gap: 16,
alignItems: "center",
}}
>
<div
style={{
width: 72,
height: 72,
borderRadius: 20,
background:
"linear-gradient(135deg,#05070d,#1f2937)",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: 900,
fontSize: 24,
}}
>
{business.name?.charAt(0)}
</div>

<div style={{ flex: 1 }}>
<h3
style={{
margin: 0,
fontSize: 22,
}}
>
{business.name}
</h3>

<p
style={{
marginTop: 6,
opacity: 0.7,
}}
>
{business.location}
</p>
</div>
</div>

<div
style={{
display: "flex",
gap: 10,
marginTop: 18,
}}
>
<button
style={{
flex: 1,
padding: "12px",
borderRadius: 14,
border: "none",
background: "#111827",
color: "#fff",
fontWeight: 700,
}}
>
Call
</button>

<button
style={{
flex: 1,
padding: "12px",
borderRadius: 14,
border: "none",
background: "#111827",
color: "#fff",
fontWeight: 700,
}}
>
WhatsApp
</button>

<button
style={{
flex: 1,
padding: "12px",
borderRadius: 14,
border: "none",
background:
"linear-gradient(135deg,#41ff87,#29d86c)",
color: "#000",
fontWeight: 900,
}}
>
View
</button>
</div>
</div>
</Link>
))}
</div>
</div>
);
}