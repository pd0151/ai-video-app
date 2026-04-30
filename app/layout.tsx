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
<body className="bg-black text-white">
<div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b1a] to-black">
{children}
</div>
</body>
</html>
);
}