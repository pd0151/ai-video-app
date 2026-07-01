import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: any) {
const { data } = await supabase
.from("landing_pages")
.select("*")
.eq("slug", params.slug)
.eq("active", true)
.single();

if (!data) {
return {
title: "Page Not Found",
};
}

return {
title: data.title_tag || data.headline,
description: data.meta_description || "",
};
}

export default async function LandingPage({ params }: any) {
const { data: page } = await supabase
.from("landing_pages")
.select("*")
.eq("slug", params.slug)
.eq("active", true)
.single();

if (!page) notFound();

return (
<main
style={{
minHeight: "100vh",
background: "#05070d",
color: "white",
padding: "40px 20px",
}}
>
<section style={{ maxWidth: 900, margin: "0 auto" }}>
<p
style={{
display: "inline-block",
padding: "8px 14px",
borderRadius: 999,
background: "rgba(255,255,255,0.08)",
border: "1px solid rgba(255,255,255,0.15)",
marginBottom: 20,
}}
>
24/7 Recovery Service
</p>

<h1
style={{
fontSize: 48,
lineHeight: 1,
fontWeight: 900,
marginBottom: 18,
}}
>
{page.headline}
</h1>

<p
style={{
fontSize: 20,
lineHeight: 1.6,
opacity: 0.85,
whiteSpace: "pre-line",
}}
>
{page.content}
</p>

<a
href="tel:+447576579923"
style={{
display: "inline-block",
marginTop: 28,
padding: "16px 22px",
borderRadius: 999,
background: "white",
color: "#05070d",
fontWeight: 900,
textDecoration: "none",
}}
>
Call Now
</a>
</section>
</main>
);
}