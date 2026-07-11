"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { buildRichContent, CONTENT_VERSION } from "../../../lib/seo-engine";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LandingPage = {
  id: string;
  slug?: string | null;
  headline?: string | null;
  title_tag?: string | null;
  meta_description?: string | null;
  content?: string | null;
  active?: boolean | null;
  created_at?: string | null;
};

export default function SeoPagesAdmin() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [titleTag, setTitleTag] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");

  const [bulkLocations, setBulkLocations] = useState("");
  const [customService, setCustomService] = useState("");
  const [customLocations, setCustomLocations] = useState("");

  useEffect(() => {
    loadPages();
  }, []);

  async function fetchAllLandingPages(): Promise<LandingPage[]> {
    const allPages: LandingPage[] = [];
    const step = 1000;
    let from = 0;

    while (true) {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, from + step - 1);

      if (error) throw new Error(error.message);

      const batch = (data || []) as LandingPage[];
      if (batch.length === 0) break;

      allPages.push(...batch);

      if (batch.length < step) break;
      from += step;
    }

    return allPages;
  }

  async function loadPages() {
    setLoadingPages(true);

    try {
      setPages(await fetchAllLandingPages());
    } catch (error: any) {
      alert(error?.message || "Could not load SEO pages");
    } finally {
      setLoadingPages(false);
    }
  }

  function makeSlug(value: string) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function titleCase(value: string) {
    return String(value || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace(/\s+/g, " ")
      .trim();
  }

  function seoCheck(page: LandingPage) {
    const issues: string[] = [];

    if (!page.slug) issues.push("Missing slug");
    if (!page.headline) issues.push("Missing H1 headline");
    if (!page.title_tag) issues.push("Missing title tag");
    if (!page.meta_description) issues.push("Missing meta description");
    if (!page.content) issues.push("Missing content");

    if (
      page.headline &&
      page.title_tag &&
      !page.title_tag.includes(page.headline)
    ) {
      issues.push("Title does not match H1");
    }

    if (page.meta_description && page.meta_description.length < 80) {
      issues.push("Meta too short");
    }

    if (page.meta_description && page.meta_description.length > 220) {
      issues.push("Meta too long");
    }

    return issues;
  }

  async function updateRowsInChunks(
    rows: LandingPage[],
    makePayload: (page: LandingPage) => Record<string, any>,
    label: string
  ) {
    const chunkSize = 20;

    for (let start = 0; start < rows.length; start += chunkSize) {
      const chunk = rows.slice(start, start + chunkSize);

      const results = await Promise.all(
        chunk.map(async (page) => {
          const { error } = await supabase
            .from("landing_pages")
            .update(makePayload(page))
            .eq("id", page.id);

          return { page, error };
        })
      );

      const failed = results.find((result) => result.error);

      if (failed?.error) {
        throw new Error(
          `${failed.page.slug || failed.page.id}: ${failed.error.message}`
        );
      }

      const complete = Math.min(start + chunk.length, rows.length);

      setProgress(
        `${label}: ${complete.toLocaleString()} / ${rows.length.toLocaleString()}`
      );

      await new Promise((resolve) => setTimeout(resolve, 75));
    }
  }

  async function upgradeAllExistingContent() {
    if (
      !confirm(
        "Upgrade the CONTENT on every existing page? Headlines, Google titles, descriptions and URLs will stay unchanged."
      )
    ) {
      return;
    }

    setWorking(true);
    setProgress("Loading all SEO pages...");

    try {
      const existingPages = await fetchAllLandingPages();

      await updateRowsInChunks(
        existingPages,
        (page) => ({
          content: buildRichContent(page),
        }),
        "Upgrading rich content"
      );

      await loadPages();

      alert(
        `Finished. ${existingPages.length.toLocaleString()} pages were upgraded. H1s, title tags, descriptions and URLs were not changed.`
      );
    } catch (error: any) {
      alert(error?.message || "Content upgrade failed");
    } finally {
      setWorking(false);
      setProgress("");
    }
  }

  async function fixSeoPage(page: LandingPage) {
    const safeHeadline =
      page.headline || titleCase(page.slug || "Local Service");

    const payload = {
      slug: page.slug || makeSlug(safeHeadline),
      headline: safeHeadline,
      title_tag: page.title_tag || `${safeHeadline} | AdForge`,
      meta_description:
        page.meta_description ||
        `Find ${safeHeadline.toLowerCase()} through AdForge. Local service information, nearby coverage and clear contact options.`,
      content: page.content || buildRichContent(page),
      active: page.active ?? true,
    };

    const { error } = await supabase
      .from("landing_pages")
      .update(payload)
      .eq("id", page.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadPages();
    alert("SEO page fixed.");
  }

  async function fixAllSeoPages() {
    const badPages = pages.filter((page) => seoCheck(page).length > 0);

    if (!badPages.length) {
      alert("All pages already pass the SEO checker.");
      return;
    }

    if (
      !confirm(
        `Fix missing SEO fields on ${badPages.length} pages? Existing values will be preserved.`
      )
    ) {
      return;
    }

    setWorking(true);

    try {
      await updateRowsInChunks(
        badPages,
        (page) => {
          const safeHeadline =
            page.headline || titleCase(page.slug || "Local Service");

          return {
            slug: page.slug || makeSlug(safeHeadline),
            headline: safeHeadline,
            title_tag: page.title_tag || `${safeHeadline} | AdForge`,
            meta_description:
              page.meta_description ||
              `Find ${safeHeadline.toLowerCase()} through AdForge. Local service information, nearby coverage and clear contact options.`,
            content: page.content || buildRichContent(page),
            active: page.active ?? true,
          };
        },
        "Fixing SEO fields"
      );

      await loadPages();
      alert("SEO fixes complete.");
    } catch (error: any) {
      alert(error?.message || "SEO fixes failed");
    } finally {
      setWorking(false);
      setProgress("");
    }
  }

  async function savePage() {
    const payload = {
      slug: makeSlug(slug),
      headline,
      title_tag: titleTag,
      meta_description: metaDescription,
      content,
      active: true,
    };

    const { error } = editingId
      ? await supabase.from("landing_pages").update(payload).eq("id", editingId)
      : await supabase.from("landing_pages").insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    resetForm();
    await loadPages();
  }

  function resetForm() {
    setSlug("");
    setHeadline("");
    setTitleTag("");
    setMetaDescription("");
    setContent("");
    setEditingId(null);
    setShowForm(false);
  }

  function editPage(page: LandingPage) {
    setEditingId(page.id);
    setSlug(page.slug || "");
    setHeadline(page.headline || "");
    setTitleTag(page.title_tag || "");
    setMetaDescription(page.meta_description || "");
    setContent(page.content || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function generateBulkPages(type: "recovery" | "tyres") {
    const locations = bulkLocations
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!locations.length) {
      alert("Add locations first");
      return;
    }

    const newPages = locations.map((location) => {
      const headline =
        type === "recovery"
          ? `24 Hour Recovery Service ${location}`
          : `24 Hour Mobile Tyre Fitting ${location}`;

      const draft: LandingPage = {
        id: "",
        slug:
          type === "recovery"
            ? `24-hour-recovery-service-${makeSlug(location)}`
            : `mobile-tyre-fitting-${makeSlug(location)}`,
        headline,
      };

      return {
        slug: draft.slug,
        headline,
        title_tag: `${headline} | AdForge`,
        meta_description:
          type === "recovery"
            ? `Need vehicle recovery in ${location}? Fast local breakdown recovery, towing and roadside help across ${location} and nearby areas.`
            : `Need mobile tyre fitting in ${location}? Fast tyre replacement, puncture repair and emergency tyre help at home, work or roadside.`,
        content: buildRichContent(draft),
        active: true,
      };
    });

    const { error } = await supabase.from("landing_pages").insert(newPages);

    if (error) {
      alert(error.message);
      return;
    }

    setBulkLocations("");
    await loadPages();
    alert(`${newPages.length} rich SEO pages created.`);
  }

  async function generateCustomServicePages() {
    const service = customService.trim();

    const locations = customLocations
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!service) {
      alert("Add a service name first");
      return;
    }

    if (!locations.length) {
      alert("Add locations first");
      return;
    }

    const newPages = locations.map((location) => {
      const pageHeadline = `${service} ${location}`;

      const draft: LandingPage = {
        id: "",
        slug: `${makeSlug(service)}-${makeSlug(location)}`,
        headline: pageHeadline,
      };

      return {
        slug: draft.slug,
        headline: pageHeadline,
        title_tag: `${pageHeadline} | AdForge`,
        meta_description: `Need ${service.toLowerCase()} in ${location}? Find trusted local providers covering ${location} and nearby areas through AdForge.`,
        content: buildRichContent(draft),
        active: true,
      };
    });

    const { error } = await supabase.from("landing_pages").insert(newPages);

    if (error) {
      alert(error.message);
      return;
    }

    setCustomService("");
    setCustomLocations("");
    await loadPages();
    alert(`${newPages.length} rich custom pages created.`);
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page?")) return;

    const { error } = await supabase
      .from("landing_pages")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadPages();
  }

  const badPages = useMemo(
    () => pages.filter((page) => seoCheck(page).length > 0),
    [pages]
  );

  return (
    <div style={pageShell}>
      <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>SEO Pages</h1>
      <p style={{ opacity: 0.7 }}>
        Create and upgrade Google landing pages from AdForge.
      </p>

      <div style={buttonRow}>
        <button
          disabled={working}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          style={btn}
        >
          + Create New Page
        </button>

        <button disabled={working} onClick={fixAllSeoPages} style={btnGreen}>
          Fix All SEO Issues ({badPages.length})
        </button>

        <button
          disabled={working}
          onClick={upgradeAllExistingContent}
          style={btnPurple}
        >
          {working ? "Working..." : "Upgrade All Existing Content"}
        </button>
      </div>

      {progress && (
        <div style={progressBox}>
          <strong>{progress}</strong>
          <p style={{ margin: "7px 0 0", opacity: 0.72 }}>
            Keep this page open until the update finishes.
          </p>
        </div>
      )}

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>SEO Checker</h2>

        <p>
          Total pages:{" "}
          <strong>
            {loadingPages ? "Loading..." : pages.length.toLocaleString()}
          </strong>
        </p>

        <p
          style={{
            color: badPages.length ? "#ffb4b4" : "#32ff73",
            fontWeight: 900,
          }}
        >
          {badPages.length === 0
            ? "All pages look OK"
            : `${badPages.length} pages need attention`}
        </p>
      </div>

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>Bulk Generate Recovery / Tyre Pages</h2>

        <textarea
          style={{ ...inputStyle, minHeight: 140 }}
          placeholder={"Liverpool\nSouthport\nRuncorn\nWidnes\nSt Helens"}
          value={bulkLocations}
          onChange={(event) => setBulkLocations(event.target.value)}
        />

        <button
          disabled={working}
          onClick={() => generateBulkPages("recovery")}
          style={btn}
        >
          Generate Recovery Pages
        </button>

        <button
          disabled={working}
          onClick={() => generateBulkPages("tyres")}
          style={btn}
        >
          Generate Mobile Tyre Pages
        </button>
      </div>

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>Custom Service Page Generator</h2>

        <input
          style={inputStyle}
          placeholder="Service e.g. Emergency Mobile Tyre Fitting"
          value={customService}
          onChange={(event) => setCustomService(event.target.value)}
        />

        <textarea
          style={{ ...inputStyle, minHeight: 140 }}
          placeholder={"Liverpool\nBootle\nWirral\nSouthport"}
          value={customLocations}
          onChange={(event) => setCustomLocations(event.target.value)}
        />

        <button
          disabled={working}
          onClick={generateCustomServicePages}
          style={btn}
        >
          Generate Custom Service Pages
        </button>
      </div>

      {showForm && (
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit Page" : "Create Page"}
          </h2>

          <input
            style={inputStyle}
            placeholder="URL slug"
            value={slug}
            onChange={(event) => setSlug(makeSlug(event.target.value))}
          />

          <input
            style={inputStyle}
            placeholder="Headline / H1"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="SEO title tag"
            value={titleTag}
            onChange={(event) => setTitleTag(event.target.value)}
          />

          <textarea
            style={inputStyle}
            placeholder="Meta description"
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
          />

          <textarea
            style={{ ...inputStyle, minHeight: 240 }}
            placeholder="Main page content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <button disabled={working} onClick={savePage} style={btn}>
            {editingId ? "Update Page" : "Save Page"}
          </button>

          <button disabled={working} onClick={resetForm} style={btn}>
            Cancel
          </button>
        </div>
      )}

      <div style={{ marginTop: 30, display: "grid", gap: 14 }}>
        {pages.map((page) => {
          const issues = seoCheck(page);

          return (
            <div key={page.id} style={panel}>
              <h2 style={{ marginTop: 0 }}>{page.headline || page.slug}</h2>

              {issues.length === 0 ? (
                <p style={{ color: "#32ff73", fontWeight: 900 }}>SEO OK</p>
              ) : (
                <div
                  style={{
                    marginTop: 10,
                    color: "#ffb4b4",
                    fontWeight: 800,
                  }}
                >
                  {issues.map((issue) => (
                    <div key={issue}>⚠ {issue}</div>
                  ))}
                </div>
              )}

              <p style={{ opacity: 0.72, marginTop: 8 }}>
                Title: {page.title_tag || "Missing"}
              </p>

              <p style={{ opacity: 0.72 }}>
                Meta: {page.meta_description || "Missing"}
              </p>

              <p style={{ opacity: 0.72 }}>
                Content: {(page.content || "").length.toLocaleString()} characters
                {(page.content || "").includes(CONTENT_VERSION)
                  ? " • V3 rich content"
                  : ""}
              </p>

              <a
                href={`/seo/${page.slug}`}
                target="_blank"
                rel="noreferrer"
                style={openLink}
              >
                Open /seo/{page.slug}
              </a>

              <div style={buttonRow}>
                <button
                  disabled={working}
                  onClick={() => editPage(page)}
                  style={btnSmall}
                >
                  Edit
                </button>

                <button
                  disabled={working}
                  onClick={() => fixSeoPage(page)}
                  style={btnSmallGreen}
                >
                  Fix SEO
                </button>

                <button
                  disabled={working}
                  onClick={() => deletePage(page.id)}
                  style={btnSmall}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const pageShell: React.CSSProperties = {
  minHeight: "100vh",
  background: "#05070d",
  color: "white",
  padding: 24,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  marginTop: 10,
};

const panel: React.CSSProperties = {
  marginTop: 24,
  padding: 18,
  borderRadius: 22,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const buttonRow: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const btn: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: 999,
  border: 0,
  fontWeight: 900,
  cursor: "pointer",
};

const btnGreen: React.CSSProperties = {
  ...btn,
  background: "#32ff73",
  color: "#05070d",
};

const btnPurple: React.CSSProperties = {
  ...btn,
  background: "linear-gradient(135deg,#8b5cf6,#6d5dfc)",
  color: "white",
};

const btnSmall: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 999,
  border: 0,
  fontWeight: 900,
  cursor: "pointer",
};

const btnSmallGreen: React.CSSProperties = {
  ...btnSmall,
  background: "#32ff73",
  color: "#05070d",
};

const progressBox: React.CSSProperties = {
  marginTop: 18,
  padding: 18,
  borderRadius: 18,
  background: "rgba(139,92,246,0.16)",
  border: "1px solid rgba(139,92,246,0.35)",
};

const openLink: React.CSSProperties = {
  opacity: 0.92,
  color: "white",
  textDecoration: "underline",
  display: "inline-block",
  marginTop: 8,
};
