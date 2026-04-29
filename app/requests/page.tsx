"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type RequestItem = {
id: string;
created_at: string;
service: string | null;
location: string | null;
phone: string | null;
details: string | null;
status: string | null;
};

export default function RequestsPage() {
const router = useRouter();
const [requests, setRequests] = useState<RequestItem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadRequests() {
const { data, error } = await supabase
.from("service_requests")
.select("id,created_at,service,location,phone,details,status")
.order("created_at", { ascending: false })
.limit(50);

if (error) {
alert(error.message);
setLoading(false);
return;
}

setRequests((data || []) as RequestItem[]);
setLoading(false);
}

loadRequests();
}, []);

return (
<main style={page}>
<button onClick={() => router.push("/feed")} style={backBtn}>
← Back
</button>

<h1 style={title}>🚨 Service Requests</h1>

{loading ? (
<div style={box}>Loading requests...</div>
) : requests.length === 0 ? (
<div style={box}>No requests yet</div>
) : (
<div style={list}>
{requests.map((req) => (
<div key={req.id} style={card}>
<h2 style={service}>{req.service || "Service needed"}</h2>
<p style={line}>📍 {req.location || "No location"}</p>
{req.details && <p style={details}>{req.details}</p>}

{req.phone && (
<a href={`tel:${req.phone}`} style={callLink}>
📞 Call customer
</a>
)}

<p style={date}>
{new Date(req.created_at).toLocaleString()}
</p>
</div>
))}
</div>
)}
</main>
);
}

const page = {
minHeight: "100vh",
background: "radial-gradient(circle at top, #1e3a8a, #020617)",
color: "white",
padding: 20,
fontFamily: "Arial, sans-serif",
};

const backBtn = {
border: "none",
borderRadius: 999,
padding: "12px 18px",
background: "rgba(255,255,255,0.12)",
color: "white",
fontWeight: 900,
};

const title = {
fontSize: 34,
marginTop: 28,
};

const box = {
padding: 24,
borderRadius: 20,
background: "rgba(255,255,255,0.08)",
fontWeight: 900,
};

const list = {
display: "grid",
gap: 14,
};

const card = {
padding: 18,
borderRadius: 22,
background: "rgba(255,255,255,0.10)",
border: "1px solid rgba(255,255,255,0.14)",
};

const service = {
margin: 0,
fontSize: 24,
};

const line = {
fontWeight: 800,
};

const details = {
opacity: 0.85,
};

const callLink = {
display: "inline-block",
marginTop: 10,
padding: "12px 16px",
borderRadius: 999,
background: "#22c55e",
color: "white",
fontWeight: 900,
textDecoration: "none",
};

const date = {
marginTop: 14,
fontSize: 12,
opacity: 0.6,
};