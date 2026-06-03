"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);


export default function BookingWidgetPage() {
const [stock, setStock] = useState<any[]>([]);
const [brand, setBrand] = useState("");
const [width, setWidth] = useState("");
const [profile, setProfile] = useState("");
const [rim, setRim] = useState("");
const [price, setPrice] = useState("");
const [quantity, setQuantity] = useState("");

async function loadStock() {
const { data } = await supabase
.from("tyre_stock")
.select("*")
.order("created_at", { ascending: false });

setStock(data || []);
}

useEffect(() => {
loadStock();
}, []);




async function addTyre() {
const { data: userData } = await supabase.auth.getUser();
const email = userData.user?.email;

const { data: business } = await supabase
.from("businesses")
.select("id")
.eq("email", email)
.single();

if (!business) return alert("Business not found");

await supabase.from("tyre_stock").insert({
business_id: business.id,
brand,
width,
profile,
rim,
price: Number(price),
quantity: Number(quantity),
});

setBrand("");
setWidth("");
setProfile("");
setRim("");
setPrice("");
setQuantity("");
loadStock();
}

useEffect(() => {
loadStock();
}, []);

return (
<main style={{ padding: 24, color: "white", background: "#05070b", minHeight: "100vh" }}>
<h1>Booking Widget</h1>
<p>Add and manage tyre stock.</p>

<input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
<input placeholder="Width e.g. 205" value={width} onChange={(e) => setWidth(e.target.value)} />
<input placeholder="Profile e.g. 55" value={profile} onChange={(e) => setProfile(e.target.value)} />
<input placeholder="Rim e.g. 16" value={rim} onChange={(e) => setRim(e.target.value)} />
<input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
<input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

<button onClick={addTyre}>Add Tyre</button>

<button
onClick={async () => {
const { error } = await supabase
.from("tyre_stock")
.insert([
{
brand: "Michelin",
width: "205",
profile: "55",
rim: "16",
price: 89,
quantity: 4,
},
]);

console.log(error);
loadStock();
}}
>
Test Add Tyre
</button>



{stock.map((item) => (
<div key={item.id}>
{item.brand} {item.width}/{item.profile}/{item.rim} - £{item.price} - Qty {item.quantity}
</div>
))}
</main>
);
}