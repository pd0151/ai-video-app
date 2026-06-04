"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function PublicBookingPage() {
const params = useParams();
const businessId = params.businessId as string;

const [width, setWidth] = useState("");
const [profile, setProfile] = useState("");
const [rim, setRim] = useState("");
const [results, setResults] = useState<any[]>([]);
const [selectedTyre, setSelectedTyre] = useState<any>(null);
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [postcode, setPostcode] = useState("");
const [address, setAddress] = useState("");
const [business, setBusiness] = useState<any>(null);


useEffect(() => {
loadBusiness();
}, []);

async function loadBusiness() {
const { data } = await supabase
.from("businesses")
.select("*")
.eq("id", businessId)
.single();

setBusiness(data);
}



async function submitBooking() {
if (!selectedTyre) return;

const { error } = await supabase
.from("tyre_bookings")
.insert([
{
business_id: businessId,
tyre_id: selectedTyre.id,
customer_name: name,
customer_phone: phone,
postcode: postcode,
address: address,
status: "new",
},
]);

if (error) {
alert("Booking failed");
return;
}

alert("Booking saved");
}

async function searchTyres() {




const { data, error } = await supabase
.from("tyre_stock")
.select("*")
.eq("business_id", businessId);


console.log("businessId:", businessId);
console.log("data:", data);
console.log("error:", error);

const filtered = (data || []).filter((tyre) => {
return (
String(tyre.width).trim() === width.trim() &&
String(tyre.profile).trim() === profile.trim() &&
String(tyre.rim).trim() === rim.trim()
);
});

setResults(filtered);
}






return (
<main
style={{
minHeight: "100vh",
background: "radial-gradient(circle at top, rgba(43,255,115,0.10), transparent 35%), #05070b",
color: "white",
padding: "24px 18px 60px",
fontFamily: "Arial, sans-serif",
}}
>

<div
style={{
maxWidth: 900,
margin: "0 auto 30px",
padding: 30,
borderRadius: 30,
background: "linear-gradient(135deg,#071426,#0d2440)",
border: "1px solid rgba(255,255,255,0.12)",
boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
textAlign: "center",
}}
>
<h1
style={{
fontSize: 42,
marginBottom: 10,
fontWeight: 900,
}}
>
{business?.name || "Find Your Tyres"}
</h1>

<p
style={{
opacity: 0.8,
fontSize: 18,
margin: 0,
}}
>
{business?.service_area || "Search tyres and book fitting instantly"}
</p>
</div>


<div
style={{
maxWidth: 900,
margin: "0 auto 28px",
padding: 24,
borderRadius: 28,
background: "rgba(255,255,255,0.06)",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 0 35px rgba(43,255,115,0.10)",
}}
>
<h2 style={{ marginTop: 0, fontSize: 26 }}>Search by tyre size</h2>

<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
<input placeholder="Width e.g. 205" value={width} onChange={(e) => setWidth(e.target.value)} style={inputStyle} />
<input placeholder="Profile e.g. 55" value={profile} onChange={(e) => setProfile(e.target.value)} style={inputStyle} />
<input placeholder="Rim e.g. 16" value={rim} onChange={(e) => setRim(e.target.value)} style={inputStyle} />

<button onClick={searchTyres} style={searchButton}>
Search Tyres
</button>
</div>
</div>

<div
style={{
maxWidth: 900,
margin: "0 auto 26px",
display: "grid",
gap: 16,
}}
>
{results.map((tyre) => (
<div
key={tyre.id}
style={{
padding: 22,
borderRadius: 26,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 0 35px rgba(43,255,115,0.10)",
}}
>
<h2 style={{ margin: 0, fontSize: 26 }}>
{tyre.brand}
</h2>

<img
src={tyre.image_url || "/placeholder-tyre.jpg"}
style={{
width: "100%",
height: 180,
objectFit: "cover",
borderRadius: 20,
marginBottom: 16,
}}
/>


<p style={{ opacity: 0.8, fontSize: 18 }}>
{tyre.width}/{tyre.profile}/R{tyre.rim}
</p>

<p style={{ fontSize: 30, fontWeight: 900 }}>
£{tyre.price}
</p>

<p
style={{
display: "inline-block",
color: "#75ff8a",
fontWeight: 900,
background: "rgba(117,255,138,0.12)",
border: "1px solid rgba(117,255,138,0.25)",
padding: "8px 14px",
borderRadius: 999,
}}
>
In stock: {tyre.quantity}
</p>

<button
onClick={() => setSelectedTyre(tyre)}
style={bookButton}
>
Book Fitting
</button>
</div>
))}
</div>

{selectedTyre && (
<div
style={{
maxWidth: 900,
margin: "32px auto 0",
padding: 26,
borderRadius: 28,
background: "rgba(255,255,255,0.07)",
border: "1px solid rgba(255,255,255,0.14)",
boxShadow: "0 0 35px rgba(43,255,115,0.10)",
}}
>
<h2
style={{
marginTop: 0,
marginBottom: 8,
fontSize: 34,
fontWeight: 950,
}}
>
{selectedTyre.brand}
</h2>

<p
style={{
opacity: 0.75,
marginBottom: 30,
fontSize: 18,
}}
>
{selectedTyre.width}/{selectedTyre.profile}/R{selectedTyre.rim}
</p>

<div style={{ display: "grid", gap: 12 }}>
<input
placeholder="Your name"
value={name}
onChange={(e) => setName(e.target.value)}
/>

<input
placeholder="Phone number"
value={phone}
onChange={(e) => setPhone(e.target.value)}
/>

<input
placeholder="Postcode"
value={postcode}
onChange={(e) => setPostcode(e.target.value)}
/>

<input
placeholder="Full address"
value={address}
onChange={(e) => setAddress(e.target.value)}
/>

<button
onClick={submitBooking}
style={searchButton}
>
Confirm Booking
</button>
</div>
</div>
)}


<div
style={{
maxWidth: 900,
margin: "40px auto 0",
textAlign: "center",
color: "rgba(255,255,255,0.55)",
fontWeight: 800,
fontSize: 13,
}}
>
Booking system powered by{" "}
<span style={{ color: "#42FF8A", fontWeight: 950 }}>
AdForge
</span>
</div>
</main>
);
}


const inputStyle: React.CSSProperties = {
flex: "1 1 160px",
padding: "16px 18px",
borderRadius: 999,
border: "1px solid rgba(255,255,255,0.18)",
background: "rgba(255,255,255,0.92)",
color: "#071018",
fontWeight: 800,
};

const searchButton: React.CSSProperties = {
padding: "16px 24px",
borderRadius: 999,
border: 0,
background: "linear-gradient(135deg,#75ff8a,#43e66b)",
color: "#051007",
fontWeight: 950,
cursor: "pointer",
};

const bookButton: React.CSSProperties = {
width: "100%",
marginTop: 12,
padding: "16px 20px",
borderRadius: 999,
border: 0,
background: "linear-gradient(135deg,#ffffff,#dce7ff)",
color: "#071018",
fontWeight: 950,
cursor: "pointer",
};