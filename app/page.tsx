import Link from "next/link";

export default function PublicHomePage() {
return (
<main
style={{
minHeight: "100vh",
background: "#05070d",
color: "#ffffff",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 24,
textAlign: "center",
}}
>
<div>
<h1 style={{ fontSize: 54, marginBottom: 16 }}>
Ad<span style={{ color: "#32ff73" }}>Forge</span>
</h1>

<p style={{ opacity: 0.7, marginBottom: 28 }}>
Find local tyre fitting, recovery services and businesses.
</p>

<Link
href="/home"
style={{
display: "inline-block",
padding: "15px 24px",
borderRadius: 999,
background: "#32ff73",
color: "#05070d",
fontWeight: 900,
textDecoration: "none",
}}
>
Open AdForge App
</Link>
</div>
</main>
);
}