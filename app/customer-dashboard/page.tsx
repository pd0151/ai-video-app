"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Lead = {
id: string;
phone: string;
job: string;
location: string;
status: string;
created_at: string;
};

type TyreBooking = {
id: string;
business_id: string;
tyre_id: string;
customer_name: string;
customer_phone: string;
postcode: string;
address: string;
status: string;
created_at: string;
};

const xeonBorder = "1px solid rgba(220,235,255,0.28)";
const xeonGlow =
"0 0 3px rgba(255,255,255,0.55), 0 0 22px rgba(220,235,255,0.28), 0 0 60px rgba(120,160,255,0.16)";
const xeonGlowStrong =
"0 0 6px rgba(255,255,255,0.85), 0 0 30px rgba(220,235,255,0.45), 0 0 75px rgba(120,160,255,0.22)";
const cardBg = "rgba(10,14,24,0.92)";

export default function CustomerDashboard() {
const [leads, setLeads] = useState<Lead[]>([]);
const [loading, setLoading] = useState(true);
const [tyreBookings, setTyreBookings] = useState<TyreBooking[]>([]);

const newBookings = tyreBookings.filter(
(b) => b.status === "new"
).length;

const acceptedBookings = tyreBookings.filter(
(b) => b.status === "accepted"
).length;

const completedBookings = tyreBookings.filter(
(b) => b.status === "completed"
).length;


useEffect(() => {
loadLeads();
}, []);

async function loadLeads() {
const {
data: { user },
} = await supabase.auth.getUser();

if (!user?.email) return;

const { data: business } = await supabase
.from("businesses")
.select("*")
.eq("email", user.email)
.single();

if (!business) return;
const { data: bookings } = await supabase
.from("tyre_bookings")
.select("*")
.eq("business_id", business.id)
.order("created_at", { ascending: false });

setTyreBookings(bookings || []);

console.log("BOOKINGS", bookings);console.log("BOOKINGS", bookings);

const { data } = await supabase
.from("leads")
.select("*")
.eq("business_id", business.id)
.order("created_at", { ascending: false });

console.log("BOOKINGS", bookings);

setLeads(data || []);
setLoading(false);
}

async function updateTyreBookingStatus(id: string, status: string) {


const { data, error } = await supabase
.from("tyre_bookings")
.update({ status })
.eq("id", String(id).trim())
.select();


loadLeads();
}

return (
<main style={page}>
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(3,1fr)",
gap: 12,
marginBottom: 24,
}}
>
<div style={statCard}>
<div>New</div>
<div>{newBookings}</div>
</div>

<div style={statCard}>
<div>Accepted</div>
<div>{acceptedBookings}</div>
</div>

<div style={statCard}>
<div>Completed</div>
<div>{completedBookings}</div>
</div>
</div>


<h1 style={title}>AI Leads Dashboard</h1>

{loading ? (
<div style={emptyBox}>Loading...</div>
) : leads.length === 0 ? (
<div style={emptyBox}>No leads yet.</div>
) : (
leads.map((lead) => (
<div key={lead.id} style={leadCard}>
<p><b>Customer:</b> {lead.phone}</p>
<p><b>Location:</b> {lead.location}</p>
<p><b>Job:</b> {lead.job}</p>
<p><b>Status:</b> {lead.status}</p>
</div>
))
)}
<h2 style={{ marginTop: 30 }}>Tyre Bookings</h2>

{tyreBookings.length === 0 ? (
<div style={emptyBox}>No tyre bookings yet.</div>
) : (
tyreBookings.map((booking) => (
<div key={booking.id} style={leadCard}>
<p><b>Name:</b> {booking.customer_name}</p>
<p><b>Phone:</b> {booking.customer_phone}</p>
<p><b>Postcode:</b> {booking.postcode}</p>
<p><b>Address:</b> {booking.address}</p>
<pre>
{JSON.stringify(booking, null, 2)}
</pre>
<p>
<b>Status:</b>{" "}
<span
style={{
color:
booking.status === "completed"
? "#75ff8a"
: booking.status === "accepted"
? "#7ab7ff"
: "#ffb86b",
fontWeight: 950,
textTransform: "uppercase",
}}
>
{booking.status}
</span>
</p>
<div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
{booking.status === "new" && (
<button
style={smallButton}
onClick={() => updateTyreBookingStatus(booking.id, "accepted")}
>
Accept
</button>
)}

<button
style={smallButton}
onClick={() => (window.location.href = `tel:${booking.customer_phone}`)}
>
Call Customer
</button>

{booking.status === "accepted" && (
<button
style={smallButton}
onClick={() => updateTyreBookingStatus(booking.id, "completed")}
>
Mark Completed
</button>
)}
</div>
</div>
))
)}
</main>
);
}

const page: React.CSSProperties = {
minHeight: "100vh",
background:
"radial-gradient(circle at 72% 0%, rgba(220,235,255,0.10), transparent 34%), radial-gradient(circle at 28% 35%, rgba(120,160,255,0.10), transparent 32%), #05070d",
color: "white",
padding: 20,
fontFamily: "Inter, Arial, sans-serif",
};

const title: React.CSSProperties = {
fontSize: 42,
fontWeight: 950,
margin: "0 0 24px",
textShadow: "0 0 22px rgba(220,235,255,0.35)",
};

const leadCard: React.CSSProperties = {
background: cardBg,
padding: 20,
borderRadius: 20,
marginTop: 20,
border: xeonBorder,
boxShadow: xeonGlow,
backdropFilter: "blur(16px)",
};

const emptyBox: React.CSSProperties = {
background: cardBg,
padding: 22,
borderRadius: 20,
border: xeonBorder,
boxShadow: xeonGlowStrong,
color: "rgba(255,255,255,0.82)",
fontWeight: 900,
};

const smallButton: React.CSSProperties = {
padding: "10px 14px",
borderRadius: 999,
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.08)",
color: "white",
fontWeight: 900,
cursor: "pointer",
};

const statCard: React.CSSProperties = {
padding: 18,
borderRadius: 22,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.12)",
textAlign: "center",
fontWeight: 900,
};
