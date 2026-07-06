import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
// import "./globals.css";

export const metadata: Metadata = {
title: "Local Business Directory | Find Local Businesses Near You | AdForge",
description:
"Find trusted local businesses near you. Advertise your business for free, generate AI images and videos.",
icons: {
icon: "/icon.png",
shortcut: "/icon.png",
apple: "/icon.png",
},
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body
style={{
margin: 0,
background:
"radial-gradient(circle at top, #1e3a8a 0%, #08142f 40%, #020617 100%)",
color: "white",
}}
>
<ClientLayout>{children}</ClientLayout>
</body>
</html>
);
}