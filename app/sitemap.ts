import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const SITE_URL = "https://adforge.uk";

function slugify(value: string) {
return value
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

export default async function sitemap() {
const { data: businesses } = await supabase
.from("businesses")
.select("slug,business_type,location,created_at")
.order("created_at", { ascending: false })
.range(0, 4999);

const { data: landingPages } = await supabase
.from("landing_pages")
.select("slug,created_at")
.eq("active", true)
.order("created_at", { ascending: false })
.range(0, 4999);

const businessPages =
businesses
?.filter((b) => b.slug)
.map((b) => ({
url: `${SITE_URL}/business/${b.slug}`,
lastModified: b.created_at ? new Date(b.created_at) : new Date(),
})) || [];

const categoryLocationPages =
businesses
?.filter((b) => b.business_type && b.location)
.map((b) => ({
url: `${SITE_URL}/${slugify(b.business_type)}/${slugify(b.location)}`,
lastModified: b.created_at ? new Date(b.created_at) : new Date(),
})) || [];

const seoLandingPages =
landingPages
?.filter((p) => p.slug)
.map((p) => ({
url: `${SITE_URL}/seo/${p.slug}`,
lastModified: p.created_at ? new Date(p.created_at) : new Date(),
})) || [];

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