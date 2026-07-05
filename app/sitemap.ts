import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const SITE_URL = "https://adforge.uk";

function slugify(value: string) {
return String(value || "")
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

async function fetchAll(table: string, select: string, activeOnly = false) {
let allRows: any[] = [];
let from = 0;
const step = 1000;

while (true) {
let query = supabase
.from(table)
.select(select)
.order("created_at", { ascending: false })
.range(from, from + step - 1);

if (activeOnly) {
query = query.eq("active", true);
}

const { data, error } = await query;

if (error) {
console.error(error.message);
break;
}

if (!data || data.length === 0) break;

allRows.push(...data);

if (data.length < step) break;

from += step;
}

return allRows;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const businesses = await fetchAll(
"businesses",
"slug,business_type,location,created_at"
);

const landingPages = await fetchAll(
"landing_pages",
"slug,created_at,active",
true
);

const businessPages = businesses
.filter((b) => b.slug)
.map((b) => ({
url: `${SITE_URL}/business/${b.slug}`,
lastModified: b.created_at ? new Date(b.created_at) : new Date(),
}));

const categoryLocationPages = businesses
.filter((b) => b.business_type && b.location)
.map((b) => ({
url: `${SITE_URL}/${slugify(b.business_type)}/${slugify(b.location)}`,
lastModified: b.created_at ? new Date(b.created_at) : new Date(),
}));

const seoLandingPages = landingPages
.filter((p) => p.slug)
.map((p) => ({
url: `${SITE_URL}/seo/${p.slug}`,
lastModified: p.created_at ? new Date(p.created_at) : new Date(),
}));

return [
{
url: SITE_URL,
lastModified: new Date(),
},
{
url: `${SITE_URL}/businesses`,
lastModified: new Date(),
},
...businessPages,
...categoryLocationPages,
...seoLandingPages,
];
}