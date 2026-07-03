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
.order("created_at", { ascending: false })
.range(0, 4999);

setPages(data || []);
}

function makeSlug(value: string) {
return String(value || "")
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

function titleCaseFromSlug(value: string) {
return String(value || "")
.replace(/-/g, " ")
.replace(/\b\w/g, (c) => c.toUpperCase())
.trim();
}

function seoCheck(page: any) {
const issues: string[] = [];

if (!page.slug) issues.push("Missing slug");
if (!page.headline) issues.push("Missing H1 headline");
if (!page.title_tag) issues.push("Missing title tag");
if (!page.meta_description) issues.push("Missing meta description");
if (!page.content) issues.push("Missing content");

if (page.headline && page.title_tag && !page.title_tag.includes(page.headline)) {
issues.push("Title does not match H1");
}

if (page.meta_description && page.meta_description.length < 120) {
issues.push("Meta too short");
}

if (page.meta_description && page.meta_description.length > 180) {
issues.push("Meta too long");
}

return issues;
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

# Call Now

If you need emergency recovery in ${location}, use this page to arrange assistance quickly.`;
}

function tyreContent(location: string) {
return `# 24 Hour Mobile Tyre Fitting in ${location}

Need 24 hour mobile tyre fitting in ${location}? AdForge helps drivers find fast local tyre fitting, emergency tyre replacement, roadside tyre fitting and puncture repair services across ${location} and surrounding areas.

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

# Call Now

If you need ${service.toLowerCase()} in ${location}, use this page to get help arranged quickly.`;
}

function buildFixedPage(page: any) {
const slugValue = page.slug || "";
const oldHeadline = page.headline || titleCaseFromSlug(slugValue) || "Local Service";

const isTyre = slugValue.includes("tyre");
const isRecovery = slugValue.includes("recovery");
const isTowing = slugValue.includes("towing");
const isBreakdown = slugValue.includes("breakdown");

let newHeadline = oldHeadline.trim();

if (isTyre && !newHeadline.toLowerCase().includes("24 hour")) {
newHeadline = newHeadline.replace(/^Mobile Tyre Fitting/i, "24 Hour Mobile Tyre Fitting");
}

if (isRecovery && !newHeadline.toLowerCase().includes("24 hour")) {
newHeadline = newHeadline.replace(/^Recovery Service/i, "24 Hour Recovery Service");
}

let location = "your local area";

if (isTyre) {
location = newHeadline.replace("24 Hour Mobile Tyre Fitting ", "").replace("Mobile Tyre Fitting ", "").trim();
} else if (isRecovery) {
location = newHeadline.replace("24 Hour Recovery Service ", "").replace("Recovery Service ", "").trim();
} else {
const parts = newHeadline.split(" ");
location = parts[parts.length - 1] || "your local area";
}

let newContent = page.content || "";

if (!newContent || newContent.length < 500) {
if (isTyre) newContent = tyreContent(location);
else if (isRecovery) newContent = recoveryContent(location);
else newContent = customContent(newHeadline, location);
}

let meta = "";

if (isTyre) {
meta = `Need 24 hour mobile tyre fitting in ${location}? Fast roadside tyre replacement, puncture repair and emergency mobile tyre fitting available across ${location} and surrounding areas.`;
} else if (isRecovery) {
meta = `Need 24 hour recovery in ${location}? Fast breakdown recovery, accident recovery and vehicle transport available across ${location} and surrounding areas.`;
} else if (isTowing) {
meta = `Need ${newHeadline.toLowerCase()}? Fast, reliable local towing support available across ${location} and surrounding areas. Call now for roadside help and vehicle transport.`;
} else if (isBreakdown) {
meta = `Need ${newHeadline.toLowerCase()}? Fast, reliable breakdown support available across ${location} and surrounding areas. Call now for roadside help and local assistance.`;
} else {
meta = `Need ${newHeadline.toLowerCase()}? Fast, reliable local service available across ${location} and surrounding areas. Call now for same-day help and local assistance.`;
}

return {
headline: newHeadline,
title_tag: `${newHeadline} | AdForge`,
meta_description: meta,
content: newContent,
active: true,
};
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

async function fixSeoPage(page: any) {
const fixedPayload = buildFixedPage(page);

const { error } = await supabase
.from("landing_pages")
.update(fixedPayload)
.eq("id", page.id);

if (error) {
alert(error.message);
return;
}

loadPages();
}

async function fixAllSeoPages() {
if (!confirm("Fix SEO titles, H1s, meta descriptions and content for all pages with issues?")) return;

const badPages = pages.filter((page) => seoCheck(page).length > 0);

for (const page of badPages) {
const fixedPayload = buildFixedPage(page);

await supabase
.from("landing_pages")
.update(fixedPayload)
.eq("id", page.id);
}

alert("SEO fixes complete");
loadPages();
}

async function generateBulkPages(type: "recovery" | "tyres") {
const locations = bulkLocations.split("\n").map((x) => x.trim()).filter(Boolean);

if (locations.length === 0) {
alert("Add locations first");
return;
}

const newPages = locations.map((location) => {
if (type === "recovery") {
const headline = `24 Hour Recovery Service ${location}`;

return {
slug: `24-hour-recovery-service-${makeSlug(location)}`,
headline,
title_tag: `${headline} | AdForge`,
meta_description: `Need 24 hour recovery in ${location}? Fast breakdown recovery, accident recovery and vehicle transport available across ${location} and surrounding areas.`,
content: recoveryContent(location),
active: true,
};
}

const headline = `24 Hour Mobile Tyre Fitting ${location}`;

return {
slug: `mobile-tyre-fitting-${makeSlug(location)}`,
headline,
title_tag: `${headline} | AdForge`,
meta_description: `Need 24 hour mobile tyre fitting in ${location}? Fast roadside tyre replacement, puncture repair and emergency mobile tyre fitting across ${location}.`,
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

if (!service) return alert("Add a service name first");
if (locations.length === 0) return alert("Add locations first");

const newPages = locations.map((location) => {
const pageHeadline = `${service} ${location}`;

return {
slug: `${makeSlug(service)}-${makeSlug(location)}`,
headline: pageHeadline,
title_tag: `${pageHeadline} | AdForge`,
meta_description: `Need ${service.toLowerCase()} in ${location}? Fast, reliable local service available across ${location} and surrounding areas. Call now for local help and same-day assistance.`,
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
if (!confirm("Update SEO content on all existing pages with improved content?")) return;

const { data: existingPages, error } = await supabase
.from("landing_pages")
.select("*")
.range(0, 4999);

if (error) return alert(error.message);

for (const page of existingPages || []) {
const fixedPayload = buildFixedPage(page);

await supabase
.from("landing_pages")
.update({ content: fixedPayload.content })
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

const badPages = pages.filter((page) => seoCheck(page).length > 0);

return (
<div style={{ minHeight: "100vh", background: "#05070d", color: "white", padding: 24 }}>
<h1 style={{ fontSize: 36, fontWeight: 900 }}>SEO Pages</h1>
<p style={{ opacity: 0.7 }}>Create Google landing pages from AdForge.</p>

<div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
<button onClick={() => { resetForm(); setShowForm(true); }} style={btn}>+ Create New Page</button>
<button onClick={fixAllSeoPages} style={btnGreen}>Fix All SEO Issues ({badPages.length})</button>
</div>

<div style={panel}>
<h2>SEO Checker</h2>
<p>Total pages: {pages.length}</p>
<p style={{ color: badPages.length ? "#ffb4b4" : "#32ff73", fontWeight: 900 }}>
{badPages.length === 0 ? "All pages look OK" : `${badPages.length} pages need attention`}
</p>
</div>

<div style={panel}>
<h2>Bulk Generate Recovery / Tyre Pages</h2>

<textarea
style={{ ...inputStyle, minHeight: 140 }}
placeholder={"Liverpool\nSouthport\nRuncorn\nWidnes\nSt Helens"}
value={bulkLocations}
onChange={(e) => setBulkLocations(e.target.value)}
/>

<button onClick={() => generateBulkPages("recovery")} style={btn}>Generate Recovery Pages</button>
<button onClick={() => generateBulkPages("tyres")} style={btn}>Generate Mobile Tyre Pages</button>
<button onClick={updateExistingSeoContent} style={btn}>Update Existing SEO Content</button>
</div>

<div style={panel}>
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

<button onClick={generateCustomServicePages} style={btn}>Generate Custom Service Pages</button>
</div>

{showForm && (
<div style={panel}>
<h2>{editingId ? "Edit Page" : "Create Page"}</h2>

<input style={inputStyle} placeholder="URL slug" value={slug} onChange={(e) => setSlug(makeSlug(e.target.value))} />
<input style={inputStyle} placeholder="Headline / H1" value={headline} onChange={(e) => setHeadline(e.target.value)} />
<input style={inputStyle} placeholder="SEO title tag" value={titleTag} onChange={(e) => setTitleTag(e.target.value)} />
<textarea style={inputStyle} placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
<textarea style={{ ...inputStyle, minHeight: 180 }} placeholder="Main page content" value={content} onChange={(e) => setContent(e.target.value)} />

<button onClick={savePage} style={btn}>{editingId ? "Update Page" : "Save Page"}</button>
<button onClick={resetForm} style={btn}>Cancel</button>
</div>
)}

<div style={{ marginTop: 30, display: "grid", gap: 14 }}>
{pages.map((page) => {
const issues = seoCheck(page);

return (
<div key={page.id} style={panel}>
<h2>{page.headline || page.slug}</h2>

{issues.length === 0 ? (
<p style={{ color: "#32ff73", fontWeight: 900 }}>SEO OK</p>
) : (
<div style={{ marginTop: 10, color: "#ffb4b4", fontWeight: 800 }}>
{issues.map((issue) => (
<div key={issue}>⚠ {issue}</div>
))}
</div>
)}

<p style={{ opacity: 0.7, marginTop: 8 }}>Title: {page.title_tag || "Missing"}</p>
<p style={{ opacity: 0.7 }}>Meta: {page.meta_description || "Missing"}</p>

<a href={`/seo/${page.slug}`} target="_blank" style={{ opacity: 0.9, color: "white", textDecoration: "underline", display: "inline-block", marginTop: 8 }}>
Open /seo/{page.slug}
</a>

<div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
<button onClick={() => editPage(page)} style={btnSmall}>Edit</button>
<button onClick={() => fixSeoPage(page)} style={btnSmallGreen}>Fix SEO</button>
<button onClick={() => deletePage(page.id)} style={btnSmall}>Delete</button>
</div>
</div>
);
})}
</div>
</div>
);
}

const inputStyle: React.CSSProperties = {
width: "100%",
padding: 14,
borderRadius: 14,
border: "1px solid rgba(255,255,255,0.15)",
background: "rgba(255,255,255,0.08)",
color: "white",
marginTop: 10,
};

const panel: React.CSSProperties = {
marginTop: 24,
padding: 18,
borderRadius: 22,
background: "rgba(255,255,255,0.08)",
};

const btn: React.CSSProperties = {
marginTop: 14,
marginRight: 10,
padding: "14px 20px",
borderRadius: 999,
border: 0,
fontWeight: 900,
};

const btnGreen: React.CSSProperties = {
marginTop: 14,
marginRight: 10,
padding: "14px 20px",
borderRadius: 999,
border: 0,
fontWeight: 900,
background: "#32ff73",
color: "#05070d",
};

const btnSmall: React.CSSProperties = {
padding: "10px 16px",
borderRadius: 999,
border: 0,
fontWeight: 900,
};

const btnSmallGreen: React.CSSProperties = {
padding: "10px 16px",
borderRadius: 999,
border: 0,
fontWeight: 900,
background: "#32ff73",
color: "#05070d",
};