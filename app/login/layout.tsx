import type { Metadata } from "next";

export const metadata: Metadata = {
title: "Local Business Directory | Find Local Businesses Near You | AdForge",
description:
"Find trusted local businesses near you. Advertise your business for free, generate AI images and videos, attract more customers and grow your business with AdForge.",
};

export default function LoginLayout({
children,
}: {
children: React.ReactNode;
}) {
return children;
}