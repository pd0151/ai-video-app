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

const [slug, setSlug] = useState("");
const [headline, setHeadline] = useState("");
const [titleTag, setTitleTag] = useState("");
const [metaDescription, setMetaDescription] = useState("");
const [content, setContent] = useState("");

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

async function savePage() {
const { error } = await supabase.from("landing_pages").insert({
slug,
headline,
title_tag: titleTag,
meta_description: metaDescription,
content,
active: true,
});

if (error) {
alert(error.message);
return;
}

setSlug("");
setHeadline("");
setTitleTag("");
setMetaDescription("");
setContent("");
setShowForm(false);
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
onClick={() => setShowForm(!showForm)}
style={{
marginTop: 20,
padding: "14px 20px",
borderRadius: 999,
border: 0,
fontWeight: 900,
}}
>
+ Create New Page
</button>

{showForm && (
<div style={{ marginTop: 24, padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<input style={inputStyle} placeholder="URL slug e.g. recovery-liverpool" value={slug} onChange={(e) => setSlug(e.target.value)} />
<input style={inputStyle} placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
<input style={inputStyle} placeholder="SEO title tag" value={titleTag} onChange={(e) => setTitleTag(e.target.value)} />
<textarea style={inputStyle} placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
<textarea style={{ ...inputStyle, minHeight: 180 }} placeholder="Main page content" value={content} onChange={(e) => setContent(e.target.value)} />

<button
onClick={savePage}
style={{
marginTop: 14,
padding: "14px 20px",
borderRadius: 999,
border: 0,
fontWeight: 900,
}}
>
Save Page
</button>
</div>
)}

<div style={{ marginTop: 30, display: "grid", gap: 14 }}>
{pages.map((page) => (
<div key={page.id} style={{ padding: 18, borderRadius: 22, background: "rgba(255,255,255,0.08)" }}>
<h2>{page.headline}</h2>
<p style={{ opacity: 0.7 }}>/{page.slug}</p>
</div>
))}
</div>
</div>
);
}