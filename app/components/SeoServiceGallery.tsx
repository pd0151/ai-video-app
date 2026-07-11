import React from "react";
import { getSeoGallery } from "../../lib/seo-engine";

type Props = {
  slug: string;
  headline: string;
};

export default function SeoServiceGallery({ slug, headline }: Props) {
  const items = getSeoGallery({ slug, headline });

  if (!items.length) return null;

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>ADFORGE SERVICE GUIDE</p>
      <h2 style={headingStyle}>Services available</h2>

      <div style={gridStyle}>
        {items.map((item) => (
          <article key={item.src} style={cardStyle}>
            <img src={item.src} alt={item.alt} style={imageStyle} />
            <h3 style={titleStyle}>{item.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

const sectionStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "30px 22px",
};

const labelStyle: React.CSSProperties = {
  color: "#32ff73",
  letterSpacing: 2.4,
  fontWeight: 1000,
  fontSize: 13,
};

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(30px,4vw,44px)",
  lineHeight: 1,
  margin: "0 0 22px",
  fontWeight: 1000,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 14,
};

const cardStyle: React.CSSProperties = {
  overflow: "hidden",
  borderRadius: 22,
  background: "rgba(255,255,255,.08)",
  border: "1px solid rgba(255,255,255,.14)",
};

const imageStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  aspectRatio: "16 / 10",
  objectFit: "cover",
  background: "#090d14",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  padding: "16px 18px 18px",
  color: "white",
  fontSize: 18,
  fontWeight: 950,
};
