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
const [customService, setCustomService] = useState("");
const [customLocations, setCustomLocations] = useState("");

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

function recoveryContent(location: string) {
return `# 24 Hour Recovery in ${location}

Need emergency vehicle recovery in ${location}? AdForge helps connect drivers with fast local recovery services 24 hours a day. Whether you have broken down at home, at work, on the motorway, in a car park or at the roadside, this page helps you get assistance arranged quickly.

# Why Choose Our Recovery Service

When your vehicle breaks down, speed matters. Our recovery network helps drivers in ${location} find local recovery support without wasting time ringing around multiple companies.

Recovery support may be available for cars, vans, motorcycles and light commercial vehicles. Services can help with non-starting vehicles, accident damage, roadside breakdowns, flat batteries, vehicle transport and emergency call-outs.

# Services We Offer

• 24 Hour Breakdown Recovery

• Emergency Vehicle Recovery

• Accident Recovery

• Roadside Assistance

• Vehicle Transport

• Car Recovery

• Van Recovery

• Battery Assistance

• Jump Starts

• Flat Battery Recovery

• Non Start Vehicle Recovery

• Motorway Recovery

• Long Distance Vehicle Transport

• Insurance Recovery

• Commercial Vehicle Recovery

# Areas We Cover

Recovery is available throughout ${location} together with surrounding towns, nearby roads, industrial estates, business parks, retail parks, car parks and motorway networks.

# Common Breakdown Problems

Common issues include flat batteries, engine failure, gearbox problems, overheating, electrical faults, accident damage, clutch failure, tyre blowouts, locked wheels, non-runner vehicles and vehicles that are unsafe to drive.

# Frequently Asked Questions

Can you recover my car today?

Yes. Recovery may be available day and night depending on local availability.

Can vans be recovered?

Yes. Many recovery providers can help with cars, vans and light commercial vehicles.

Can you transport vehicles?

Yes. Vehicle transport may be available for breakdowns, garages, auctions, home deliveries and non-runner vehicles.

Can accident vehicles be recovered?

Yes. Accident recovery and vehicle transport may be available in ${location}.

# Call Now

If you need emergency recovery in ${location}, use this page to arrange assistance quickly.`;
}

function tyreContent(location: string) {
return `# Mobile Tyre Fitting in ${location}

Need mobile tyre fitting in ${location}? AdForge helps drivers find fast local tyre fitting, emergency tyre replacement, roadside tyre fitting and puncture repair services across ${location} and surrounding areas.

# Why Choose Mobile Tyre Fitting

Mobile tyre fitting saves time because the tyre fitter comes directly to your home, workplace or roadside location. You do not need to arrange recovery, wait at a garage or risk driving on a damaged tyre.

This is ideal if you have a flat tyre, puncture, blowout, damaged sidewall, worn tyre, slow puncture, valve problem or unsafe tyre and need help quickly.

# Services We Offer

• Mobile Tyre Fitting

• Emergency Mobile Tyre Fitting

• 24 Hour Mobile Tyre Fitting

• Mobile Puncture Repair

• Roadside Tyre Replacement

• Emergency Tyre Replacement

• Same Day Tyre Fitting

• Locking Wheel Nut Removal

• Run Flat Tyre Replacement

• Mobile Van Tyre Fitting

• Commercial Vehicle Tyres

• Wheel Balancing

• Valve Replacement

• Seasonal Tyre Changes

# Areas We Cover

Mobile tyre fitting covers ${location}, nearby towns, villages, industrial estates, retail parks, workplaces, homes, car parks and motorway networks.

# Common Tyre Problems

Common tyre problems include flat tyres, punctures, damaged sidewalls, cracked tyres, worn tread, uneven tyre wear, slow punctures, valve leaks, locking wheel nuts, damaged alloys, tyre pressure issues and blowouts.

# Frequently Asked Questions

Can tyres be fitted at home?

Yes. Mobile tyre fitting is designed for home, work and roadside call-outs.

Can you fit tyres at work?

Yes. Mobile tyre fitting can usually be arranged at workplaces, offices, yards and business parks.

Can you repair punctures?

Where safe to do so, puncture repair may be available depending on the damage.

Can you fit tyres roadside?

Emergency roadside tyre fitting may be available in ${location}.

# Call Now

For emergency mobile tyre fitting in ${location}, use this page to arrange help quickly.`;
}

function customContent(service: string, location: string) {
return `# ${service} in ${location}

Need ${service.toLowerCase()} in ${location}? AdForge helps customers find fast, reliable local providers across ${location} and surrounding areas.

# Why Choose ${service}

When you need ${service.toLowerCase()}, speed and trust matter. This page helps customers in ${location} get connected with local providers without wasting time searching multiple websites.

# Services We Offer

• ${service}

• Emergency ${service}

• Same Day ${service}

• Local Call-Outs

• Roadside Assistance

• Home Appointments

• Workplace Appointments

• Fast Response Service

• Local Providers

• 24/7 Availability Where Possible

# Areas We Cover

This page covers ${location}, nearby towns, local roads, surrounding areas, car parks, homes, workplaces, business parks and roadside locations.

# Common Problems

Customers may need ${service.toLowerCase()} because of urgent problems, roadside issues, breakdowns, damaged parts, unsafe vehicles, emergency call-outs or same-day service needs.

# Frequently Asked Questions

Can I get ${service.toLowerCase()} today?

Same-day help may be available depending on local provider availability.

Do you cover ${location}?

Yes. This page is designed for ${location} and nearby areas.

Can I call for urgent help?

Yes. Use this page to arrange help quickly.

# Call Now

If you need ${service.toLowerCase()} in ${location}, use this page to get help arranged quickly.`;
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

async function generateRecoveryPages() {
await generateBulkPages("recovery");
}

async function generateMobileTyrePages() {
await generateBulkPages("tyres");
}

async function generateBulkPages(type: "recovery" | "tyres") {
const locations = bulkLocations.split("\n").map((x) => x.trim()).filter(Boolean);

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
content: recoveryContent(location),
active: true,
};
}

return {
slug: `mobile-tyre-fitting-${makeSlug(location)}`,
headline: `Mobile Tyre Fitting ${location}`,
title_tag: `Mobile Tyre Fitting ${location} | AdForge`,
meta_description: `Need mobile tyre fitting in ${location}? Fast mobile tyre replacement, puncture repair and emergency tyre fitting at home, work or roadside.`,
content: tyreContent(location),
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

async function generateCustomServicePages() {
const service = customService.trim();
const locations = customLocations.split("\n").map((x) => x.trim()).filter(Boolean);

if (!service) {
alert("Add a service name first");
return;
}

if (locations.length === 0) {
alert("Add locations first");
return;
}

const newPages = locations.map((location) => {
const pageHeadline = `${service} ${location}`;

return {
slug: `${makeSlug(service)}-${makeSlug(location)}`,
headline: pageHeadline,
title_tag: `${pageHeadline} | AdForge`,
meta_description: `Need ${service.toLowerCase()} in ${location}? Fast, reliable local service available across ${location} and surrounding areas.`,
content: customContent(service, location),
active: true,
};
});

const { error } = await supabase.from("landing_pages").insert(newPages);

if (error) {
alert(error.message);
return;
}

setCustomService("");
setCustomLocations("");
loadPages();
alert("Custom service pages created");
}

async function updateExistingSeoContent() {
if (!confirm("Update SEO content on all existing recovery and tyre pages?")) return;

const { data: existingPages, error: fetchError } = await supabase
.from("landing_pages")
.select("id, slug, headline");

if (fetchError) {
alert(fetchError.message);
return;
}

for (const page of existingPages || []) {
const headline = page.headline || "";
const slugValue = page.slug || "";

const isRecovery = slugValue.includes("recovery");
const isTyre = slugValue.includes("tyre");

if (!isRecovery && !isTyre) continue;

const location = headline
.replace("24 Hour Recovery Service ", "")
.replace("Mobile Tyre Fitting ", "")
.trim();

const newContent = isTyre ? tyreContent(location) : recoveryContent(location);

await supabase
.from("landing_pages")
.update({ content: newContent })
.eq("id", page.id);
}

loadPages();
alert("Existing SEO page content updated");
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

<button onClick={() => { resetForm(); setShowForm(true); }} style={{ marginTop: 20, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
+ Create New Page
</button>

<div style={{ marginTop: 24, padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<h2>Bulk Generate Recovery / Tyre Pages</h2>

<textarea
style={{ ...inputStyle, minHeight: 140 }}
placeholder={"Liverpool\nSouthport\nRuncorn\nWidnes\nSt Helens"}
value={bulkLocations}
onChange={(e) => setBulkLocations(e.target.value)}
/>

<button onClick={generateRecoveryPages} style={{ marginTop: 14, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Generate Recovery Pages
</button>

<button onClick={generateMobileTyrePages} style={{ marginTop: 14, marginLeft: 10, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Generate Mobile Tyre Pages
</button>

<button onClick={updateExistingSeoContent} style={{ marginTop: 14, marginLeft: 10, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Update Existing SEO Content
</button>
</div>

<div style={{ marginTop: 24, padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<h2>Custom Service Page Generator</h2>

<input
style={inputStyle}
placeholder="Service e.g. Emergency Mobile Tyre Fitting"
value={customService}
onChange={(e) => setCustomService(e.target.value)}
/>

<textarea
style={{ ...inputStyle, minHeight: 140 }}
placeholder={"Liverpool\nBootle\nWirral\nSouthport"}
value={customLocations}
onChange={(e) => setCustomLocations(e.target.value)}
/>

<button onClick={generateCustomServicePages} style={{ marginTop: 14, padding: "14px 20px", borderRadius: 999, border: 0, fontWeight: 900 }}>
Generate Custom Service Pages
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