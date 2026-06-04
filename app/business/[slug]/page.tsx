import { createClient } from "@supabase/supabase-js";
import BusinessClient from "./BusinessClient";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL as string,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function generateMetadata({
params,
}: {
params: { slug: string };
}) {
const { data: business } = await supabase
.from("businesses")
.select("name,business_type,location,phone")
.eq("slug", params.slug)
.maybeSingle();

const name = business?.name || "Local Business";
const type = business?.business_type || "Local Business";
const location = business?.location || "Your Area";

return {
title: `${name} | ${type} in ${location} | AdForge`,
description: `${name} is a ${type} in ${location}. Contact them directly through AdForge.`,
};
}

export default function Page({
params,
}: {
params: { slug: string };
}) {
return <BusinessClient params={params} />;
}