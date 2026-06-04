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
color: "white",
padding: 24,
}}
>
<h1>Find Local Businesses</h1>

<div
style={{
display: "grid",
gap: 16,
marginTop: 24,
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
background: "#111827",
borderRadius: 24,
padding: 18,
border: "1px solid rgba(255,255,255,0.1)",
}}
>
<h3>{business.name}</h3>
<p>{business.location}</p>
</div>
</Link>
))}
</div>
</div>
);
}