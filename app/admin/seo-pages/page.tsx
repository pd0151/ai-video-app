"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SeoPagesAdmin() {
const [pages, setPages] = useState<any[]>([]);
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);

const [slug, setSlug] = useState("");
const [headline, setHeadline] = useState("");
const [titleTag, setTitleTag] = useState("");
const [metaDescription, setMetaDescription] = useState("");
const [content, setContent] = useState("");
const [bulkLocations, setBulkLocations] = useState("");

useEffect(() => {
loadPages();
}, []);

async function loadPages() {
const { data } = await supabase
.from("landing_pages")
.select("*")
.order("created_at", { ascending: false });

setPages(data || []);
}

function makeSlug(value: string) {
return value
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

function resetForm() {
setSlug("");
setHeadline("");
setTitleTag("");
setMetaDescription("");
setContent("");
setEditingId(null);
setShowForm(false);
}

function editPage(page: any) {
setEditingId(page.id);
setSlug(page.slug || "");
setHeadline(page.headline || "");
setTitleTag(page.title_tag || "");
setMetaDescription(page.meta_description || "");
setContent(page.content || "");
setShowForm(true);
window.scrollTo({ top: 0, behavior: "smooth" });
}

async function savePage() {
const payload = {
slug: makeSlug(slug),
headline,
title_tag: titleTag,
meta_description: metaDescription,
content,
active: true,
};

const { error } = editingId
? await supabase.from("landing_pages").update(payload).eq("id", editingId)
: await supabase.from("landing_pages").insert(payload);

if (error) {
alert(error.message);
return;
}

resetForm();
loadPages();
}

async function generateRecoveryPages() {
await generateBulkPages("recovery");
}

async function generateMobileTyrePages() {
await generateBulkPages("tyres");
}

async function generateBulkPages(type: "recovery" | "tyres") {
const locations = bulkLocations
.split("\n")
.map((x) => x.trim())
.filter(Boolean);

if (locations.length === 0) {
alert("Add locations first");
return;
}

const newPages = locations.map((location) => {
if (type === "recovery") {
return {
slug: `24-hour-recovery-service-${makeSlug(location)}`,
headline: `24 Hour Recovery Service ${location}`,
title_tag: `24 Hour Recovery Service ${location} | AdForge`,
meta_description: `Fast 24 hour breakdown recovery, accident recovery and vehicle transport in ${location}. Available 24/7 with rapid response.`,
content: `Need emergency recovery in ${location}? We provide 24 hour breakdown recovery, roadside assistance, accident recovery and vehicle transport throughout ${location} and surrounding areas.

Whether your vehicle has broken down, been involved in an accident, will not start, or needs transporting safely, our recovery network can help arrange fast assistance day or night.

Our service covers local roads, nearby motorways and surrounding towns, helping drivers get recovered quickly and professionally.`,
active: true,
};
}

return {
slug: `mobile-tyre-fitting-${makeSlug(location)}`,
headline: `Mobile Tyre Fitting ${location}`,
title_tag: `Mobile Tyre Fitting ${location} | AdForge`,
meta_description: `Need mobile tyre fitting in ${location}? Fast mobile tyre replacement, puncture repair and emergency tyre fitting at home, work or roadside.`,
content: `Need mobile tyre fitting in ${location}? Our mobile tyre fitting network helps drivers arrange fast tyre replacement, puncture repair and emergency tyre support across ${location} and surrounding areas.

Whether you are at home, at work, stuck on the roadside or dealing with a flat tyre, mobile tyre fitting can save time by bringing tyre help directly to you.

Services can include tyre replacement, puncture repair, valve replacement, wheel balancing and emergency roadside tyre assistance depending on availability in your area.`,
active: true,
};
});

const { error } = await supabase.from("landing_pages").insert(newPages);

if (error) {
alert(error.message);
return;
}

setBulkLocations("");
loadPages();
alert("SEO pages created");
}

async function deletePage(id: string) {
if (!confirm("Delete this page?")) return;

const { error } = await supabase.from("landing_pages").delete().eq("id", id);

if (error) {
alert(error.message);
return;
}

loadPages();
}

const inputStyle = {
width: "100%",
padding: 14,
borderRadius: 14,
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(255,255,255,0.08)",
color: "white",
marginTop: 10,
};

return (
<div style={{ minHeight: "100vh", background: "#05070d", color: "white", padding: 24 }}>
<h1 style={{ fontSize: 36, fontWeight: 900 }}>SEO Pages</h1>
<p style={{ opacity: 0.7 }}>Create Google landing pages from AdForge.</p>

<button
onClick={() => {
resetForm();
setShowForm(true);
}}
style={{ marginTop: 20, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}
>
+ Create New Page
</button>

<div style={{ marginTop: 24, padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<h2>Bulk Generate SEO Pages</h2>

<textarea
style={{ ...inputStyle, minHeight: 140 }}
placeholder={"Liverpool\nSouthport\nRuncorn\nWidnes\nSt Helens"}
value={bulkLocations}
onChange={(e) => setBulkLocations(e.target.value)}
/>

<button
onClick={generateRecoveryPages}
style={{ marginTop: 14, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}
>
Generate Recovery Pages
</button>

<button
onClick={generateMobileTyrePages}
style={{ marginTop: 14, marginLeft: 10, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}
>
Generate Mobile Tyre Pages
</button>
</div>

{showForm && (
<div style={{ marginTop: 24, padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<h2>{editingId ? "Edit Page" : "Create Page"}</h2>

<input style={inputStyle} placeholder="URL slug" value={slug} onChange={(e) => setSlug(makeSlug(e.target.value))} />
<input style={inputStyle} placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
<input style={inputStyle} placeholder="SEO title tag" value={titleTag} onChange={(e) => setTitleTag(e.target.value)} />
<textarea style={inputStyle} placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
<textarea style={{ ...inputStyle, minHeight: 180 }} placeholder="Main page content" value={content} onChange={(e) => setContent(e.target.value)} />

<button onClick={savePage} style={{ marginTop: 14, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
{editingId ? "Update Page" : "Save Page"}
</button>

<button onClick={resetForm} style={{ marginLeft: 10, marginTop: 14, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Cancel
</button>
</div>
)}

<div style={{ marginTop: 30, display: "grid", gap: 14 }}>
{pages.map((page) => (
<div key={page.id} style={{ padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<h2>{page.headline || page.slug}</h2>

<a href={`/seo/${page.slug}`} target="_blank" style={{ opacity: 0.9, color: "white", textDecoration: "underline", display: "inline-block", marginTop: 8 }}>
Open /seo/{page.slug}
</a>

<div style={{ display: "flex", gap: 10, marginTop: 14 }}>
<button onClick={() => editPage(page)} style={{ padding: "10px 16px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Edit
</button>

<button onClick={() => deletePage(page.id)} style={{ padding: "10px 16px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Delete
</button>
</div>
</div>
))}
</div>
</div>
);
}