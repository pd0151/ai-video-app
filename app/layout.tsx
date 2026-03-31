import "./globals.css";

export const metadata = {
title: "AdForge",
description: "AI Ad Generator",
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}