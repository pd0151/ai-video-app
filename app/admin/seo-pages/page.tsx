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
      const result = await fetchAllLandingPages();
      setPages(result);
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

  function makeTitleTag(value: string) {
    const cleanHeadline = String(value || "").trim();
    return cleanHeadline ? `${cleanHeadline} | AdForge` : "";
  }

  function seoCheck(page: LandingPage) {
    const issues: string[] = [];

    if (!page.slug?.trim()) issues.push("Missing slug");
    if (!page.headline?.trim()) issues.push("Missing H1 headline");
    if (!page.title_tag?.trim()) issues.push("Missing title tag");
    if (!page.meta_description?.trim()) issues.push("Missing meta description");
    if (!page.content?.trim()) issues.push("Missing content");

    return issues;
  }

  async function restoreAllExistingContentToV4() {
    if (
      !confirm(
        `RESTORE BODY CONTENT ONLY on all existing SEO pages using ${CONTENT_VERSION}?\n\nThis will NOT change:\n\n• URL slug\n• H1 headline\n• title tag\n• meta description\n• active status\n\nONLY the content field will be replaced.`
      )
    ) {
      return;
    }

    const confirmAgain = prompt(
      `Type RESTORE V4 to continue.\n\nThis will rebuild body content on all ${pages.length.toLocaleString()} existing SEO pages.`
    );

    if (confirmAgain !== "RESTORE V4") {
      alert("Restore cancelled.");
      return;
    }

    setWorking(true);
    setProgress("Loading all existing SEO pages...");

    try {
      const existingPages = await fetchAllLandingPages();

      const chunkSize = 20;

      for (
        let start = 0;
        start < existingPages.length;
        start += chunkSize
      ) {
        const chunk = existingPages.slice(start, start + chunkSize);

        const results = await Promise.all(
          chunk.map(async (page) => {
            const newContent = buildRichContent({
              slug: page.slug,
              headline: page.headline,
            });

            const { error } = await supabase
              .from("landing_pages")
              .update({
                content: newContent,
              })
              .eq("id", page.id);

            return {
              page,
              error,
            };
          })
        );

        const failed = results.find((result) => result.error);

        if (failed?.error) {
          throw new Error(
            `${failed.page.slug || failed.page.id}: ${failed.error.message}`
          );
        }

        const complete = Math.min(
          start + chunk.length,
          existingPages.length
        );

        setProgress(
          `Restoring ${CONTENT_VERSION} content: ${complete.toLocaleString()} / ${existingPages.length.toLocaleString()}`
        );

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await loadPages();

      alert(
        `Finished.\n\n${existingPages.length.toLocaleString()} pages had BODY CONTENT rebuilt using ${CONTENT_VERSION}.\n\nURLs, H1s, title tags and meta descriptions were NOT changed.`
      );
    } catch (error: any) {
      alert(error?.message || "V4 content restore failed");
    } finally {
      setWorking(false);
      setProgress("");
    }
  }

  async function fixSeoPage(page: LandingPage) {
    if (
      !confirm(
        `Fix ONLY missing SEO fields for "${
          page.headline || page.slug
        }"? Existing SEO and content will NOT be changed.`
      )
    ) {
      return;
    }

    const safeHeadline =
      page.headline?.trim() || titleCase(page.slug || "Local Service");

    const payload = {
      slug: page.slug?.trim() || makeSlug(safeHeadline),
      headline: page.headline?.trim() || safeHeadline,
      title_tag: page.title_tag?.trim() || makeTitleTag(safeHeadline),
      meta_description:
        page.meta_description?.trim() ||
        `Find ${safeHeadline.toLowerCase()} through AdForge. Local service information, nearby coverage and clear contact options.`,
      content: page.content || "",
      active: page.active ?? true,
    };

    setWorking(true);

    try {
      const { error } = await supabase
        .from("landing_pages")
        .update(payload)
        .eq("id", page.id);

      if (error) throw new Error(error.message);

      await loadPages();

      alert(
        "Done. Only missing fields were filled. Existing SEO/content was preserved."
      );
    } catch (error: any) {
      alert(error?.message || "Could not fix page");
    } finally {
      setWorking(false);
    }
  }

  async function fixAllSeoPages() {
    const badPages = pages.filter((page) => seoCheck(page).length > 0);

    if (!badPages.length) {
      alert("No missing SEO fields found.");
      return;
    }

    if (
      !confirm(
        `Fill ONLY missing fields on ${badPages.length} pages?\n\nExisting titles, H1s, descriptions, URLs and content will NOT be replaced.`
      )
    ) {
      return;
    }

    setWorking(true);
    setProgress("Safely checking pages...");

    try {
      const chunkSize = 20;

      for (let start = 0; start < badPages.length; start += chunkSize) {
        const chunk = badPages.slice(start, start + chunkSize);

        const results = await Promise.all(
          chunk.map(async (page) => {
            const safeHeadline =
              page.headline?.trim() ||
              titleCase(page.slug || "Local Service");

            const payload = {
              slug: page.slug?.trim() || makeSlug(safeHeadline),
              headline: page.headline?.trim() || safeHeadline,
              title_tag:
                page.title_tag?.trim() || makeTitleTag(safeHeadline),
              meta_description:
                page.meta_description?.trim() ||
                `Find ${safeHeadline.toLowerCase()} through AdForge. Local service information, nearby coverage and clear contact options.`,
              content: page.content || "",
              active: page.active ?? true,
            };

            const { error } = await supabase
              .from("landing_pages")
              .update(payload)
              .eq("id", page.id);

            return {
              page,
              error,
            };
          })
        );

        const failed = results.find((result) => result.error);

        if (failed?.error) {
          throw new Error(
            `${failed.page.slug || failed.page.id}: ${
              failed.error.message
            }`
          );
        }

        const complete = Math.min(
          start + chunk.length,
          badPages.length
        );

        setProgress(
          `Safely fixing missing fields: ${complete.toLocaleString()} / ${badPages.length.toLocaleString()}`
        );

        await new Promise((resolve) => setTimeout(resolve, 75));
      }

      await loadPages();

      alert(
        "Safe SEO check complete. Existing SEO/content was not rewritten."
      );
    } catch (error: any) {
      alert(error?.message || "SEO check failed");
    } finally {
      setWorking(false);
      setProgress("");
    }
  }

  async function savePage() {
    const cleanHeadline = headline.trim();
    const cleanSlug = slug.trim();

    if (!cleanHeadline) {
      alert("Add a headline first");
      return;
    }

    if (!cleanSlug) {
      alert("Add a URL slug first");
      return;
    }

    if (!titleTag.trim()) {
      alert("Add an SEO title tag");
      return;
    }

    const payload = {
      slug: cleanSlug,
      headline: cleanHeadline,
      title_tag: titleTag.trim(),
      meta_description: metaDescription.trim(),
      content,
      active: true,
    };

    setWorking(true);

    try {
      const { error } = editingId
        ? await supabase
            .from("landing_pages")
            .update(payload)
            .eq("id", editingId)
        : await supabase
            .from("landing_pages")
            .insert(payload);

      if (error) throw new Error(error.message);

      resetForm();
      await loadPages();

      alert(editingId ? "Page updated." : "Page created.");
    } catch (error: any) {
      alert(error?.message || "Could not save page");
    } finally {
      setWorking(false);
    }
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      const pageHeadline =
        type === "recovery"
          ? `24 Hour Recovery Service ${location}`
          : `24 Hour Mobile Tyre Fitting ${location}`;

      const draft: LandingPage = {
        id: "",
        slug:
          type === "recovery"
            ? `24-hour-recovery-service-${makeSlug(location)}`
            : `mobile-tyre-fitting-${makeSlug(location)}`,
        headline: pageHeadline,
      };

      return {
        slug: draft.slug,
        headline: pageHeadline,
        title_tag: makeTitleTag(pageHeadline),
        meta_description:
          type === "recovery"
            ? `Need vehicle recovery in ${location}? Fast local breakdown recovery, towing and roadside help across ${location} and nearby areas.`
            : `Need mobile tyre fitting in ${location}? Fast tyre replacement, puncture repair and emergency tyre help at home, work or roadside.`,
        content: buildRichContent(draft),
        active: true,
      };
    });

    if (
      !confirm(
        `Create ${newPages.length} NEW ${
          type === "recovery" ? "recovery" : "mobile tyre"
        } pages?\n\nExisting pages will NOT be changed.`
      )
    ) {
      return;
    }

    setWorking(true);

    try {
      const { error } = await supabase
        .from("landing_pages")
        .insert(newPages);

      if (error) throw new Error(error.message);

      setBulkLocations("");
      await loadPages();

      alert(
        `${newPages.length} new pages created. Existing pages were untouched.`
      );
    } catch (error: any) {
      alert(error?.message || "Could not create pages");
    } finally {
      setWorking(false);
    }
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
        title_tag: makeTitleTag(pageHeadline),
        meta_description:
          `Need ${service.toLowerCase()} in ${location}? Find trusted local providers covering ${location} and nearby areas through AdForge.`,
        content: buildRichContent(draft),
        active: true,
      };
    });

    if (
      !confirm(
        `Create ${newPages.length} NEW custom service pages?\n\nExisting pages will NOT be changed.`
      )
    ) {
      return;
    }

    setWorking(true);

    try {
      const { error } = await supabase
        .from("landing_pages")
        .insert(newPages);

      if (error) throw new Error(error.message);

      setCustomService("");
      setCustomLocations("");

      await loadPages();

      alert(`${newPages.length} new custom pages created.`);
    } catch (error: any) {
      alert(error?.message || "Could not create custom pages");
    } finally {
      setWorking(false);
    }
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page permanently?")) return;

    setWorking(true);

    try {
      const { error } = await supabase
        .from("landing_pages")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);

      await loadPages();
    } catch (error: any) {
      alert(error?.message || "Could not delete page");
    } finally {
      setWorking(false);
    }
  }

  const badPages = useMemo(
    () => pages.filter((page) => seoCheck(page).length > 0),
    [pages]
  );

  return (
    <div style={pageShell}>
      <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>
        SEO Pages
      </h1>

      <p style={{ opacity: 0.7 }}>
        Manage AdForge Google landing pages safely.
      </p>

      <div style={warningBox}>
        <strong>SEO PROTECTION ENABLED</strong>

        <p
          style={{
            margin: "8px 0 0",
            opacity: 0.82,
            lineHeight: 1.6,
          }}
        >
          Existing H1s, title tags, meta descriptions and URLs are protected.
        </p>
      </div>

      <div style={restoreBox}>
        <h2 style={{ marginTop: 0 }}>
          Restore Existing Page Content
        </h2>

        <p style={{ lineHeight: 1.6, opacity: 0.85 }}>
          Current SEO engine: <strong>{CONTENT_VERSION}</strong>
        </p>

        <p style={{ lineHeight: 1.6, opacity: 0.85 }}>
          This button changes the body content field only.
          Titles, H1s, metas and URLs stay untouched.
        </p>

        <button
          disabled={working}
          onClick={restoreAllExistingContentToV4}
          style={btnRestore}
        >
          {working
            ? "RESTORING CONTENT..."
            : `RESTORE EXISTING CONTENT TO ${CONTENT_VERSION}`}
        </button>
      </div>

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

        <button
          disabled={working}
          onClick={fixAllSeoPages}
          style={btnGreen}
        >
          Fill Missing SEO Fields ({badPages.length})
        </button>

        <button
          disabled={working}
          onClick={loadPages}
          style={btn}
        >
          Refresh Pages
        </button>
      </div>

      {progress && (
        <div style={progressBox}>
          <strong>{progress}</strong>

          <p
            style={{
              margin: "7px 0 0",
              opacity: 0.75,
            }}
          >
            Keep this page open until it finishes.
          </p>
        </div>
      )}

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>SEO Checker</h2>

        <p>
          Total pages:{" "}
          <strong>
            {loadingPages
              ? "Loading..."
              : pages.length.toLocaleString()}
          </strong>
        </p>

        <p
          style={{
            color: badPages.length ? "#ffb4b4" : "#32ff73",
            fontWeight: 900,
          }}
        >
          {badPages.length === 0
            ? "No missing SEO fields"
            : `${badPages.length} pages have missing fields`}
        </p>
      </div>

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>
          Bulk Generate NEW Recovery / Tyre Pages
        </h2>

        <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
          This creates new pages only. Existing pages are untouched.
        </p>

        <textarea
          style={{
            ...inputStyle,
            minHeight: 140,
          }}
          placeholder={
            "Liverpool\nSouthport\nRuncorn\nWidnes\nSt Helens"
          }
          value={bulkLocations}
          onChange={(event) =>
            setBulkLocations(event.target.value)
          }
        />

        <div style={buttonRow}>
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
      </div>

      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>
          Custom Service Page Generator
        </h2>

        <input
          style={inputStyle}
          placeholder="Service e.g. Emergency Mobile Tyre Fitting"
          value={customService}
          onChange={(event) =>
            setCustomService(event.target.value)
          }
        />

        <textarea
          style={{
            ...inputStyle,
            minHeight: 140,
          }}
          placeholder={"Liverpool\nBootle\nWirral\nSouthport"}
          value={customLocations}
          onChange={(event) =>
            setCustomLocations(event.target.value)
          }
        />

        <button
          disabled={working}
          onClick={generateCustomServicePages}
          style={{
            ...btn,
            marginTop: 12,
          }}
        >
          Generate NEW Custom Pages
        </button>
      </div>

      {showForm && (
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>
            {editingId ? "Edit Existing Page" : "Create New Page"}
          </h2>

          <label style={labelStyle}>URL Slug</label>

          <input
            style={inputStyle}
            placeholder="URL slug"
            value={slug}
            onChange={(event) =>
              setSlug(makeSlug(event.target.value))
            }
          />

          <label style={labelStyle}>Headline / H1</label>

          <input
            style={inputStyle}
            placeholder="Headline / H1"
            value={headline}
            onChange={(event) =>
              setHeadline(event.target.value)
            }
          />

          <label style={labelStyle}>Google SEO Title</label>

          <input
            style={inputStyle}
            placeholder="SEO title tag"
            value={titleTag}
            onChange={(event) =>
              setTitleTag(event.target.value)
            }
          />

          <label style={labelStyle}>Meta Description</label>

          <textarea
            style={{
              ...inputStyle,
              minHeight: 110,
            }}
            placeholder="Meta description"
            value={metaDescription}
            onChange={(event) =>
              setMetaDescription(event.target.value)
            }
          />

          <label style={labelStyle}>Main Page Content</label>

          <textarea
            style={{
              ...inputStyle,
              minHeight: 300,
            }}
            placeholder="Main page content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
          />

          <div style={buttonRow}>
            <button
              disabled={working}
              onClick={savePage}
              style={btnGreen}
            >
              {editingId ? "Save Existing Page" : "Create Page"}
            </button>

            <button
              disabled={working}
              onClick={resetForm}
              style={btn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gap: 14,
        }}
      >
        {pages.map((page) => {
          const issues = seoCheck(page);

          return (
            <div key={page.id} style={panel}>
              <h2 style={{ marginTop: 0 }}>
                {page.headline || page.slug}
              </h2>

              {issues.length === 0 ? (
                <p
                  style={{
                    color: "#32ff73",
                    fontWeight: 900,
                  }}
                >
                  SEO fields present
                </p>
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

              <p style={{ opacity: 0.72 }}>
                <strong>Title:</strong>{" "}
                {page.title_tag || "Missing"}
              </p>

              <p style={{ opacity: 0.72 }}>
                <strong>Meta:</strong>{" "}
                {page.meta_description || "Missing"}
              </p>

              <p style={{ opacity: 0.72 }}>
                <strong>Content:</strong>{" "}
                {(page.content || "").length.toLocaleString()} characters
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

                {issues.length > 0 && (
                  <button
                    disabled={working}
                    onClick={() => fixSeoPage(page)}
                    style={btnSmallGreen}
                  >
                    Fill Missing Fields
                  </button>
                )}

                <button
                  disabled={working}
                  onClick={() => deletePage(page.id)}
                  style={btnSmallDanger}
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
  boxSizing: "border-box",
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  marginTop: 8,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 18,
  fontWeight: 900,
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

const btnRestore: React.CSSProperties = {
  ...btn,
  background: "#ffb020",
  color: "#05070d",
  marginTop: 10,
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

const btnSmallDanger: React.CSSProperties = {
  ...btnSmall,
  background: "rgba(255,80,80,0.16)",
  color: "#ffb4b4",
  border: "1px solid rgba(255,80,80,0.3)",
};

const progressBox: React.CSSProperties = {
  marginTop: 18,
  padding: 18,
  borderRadius: 18,
  background: "rgba(139,92,246,0.16)",
  border: "1px solid rgba(139,92,246,0.35)",
};

const warningBox: React.CSSProperties = {
  marginTop: 20,
  padding: 18,
  borderRadius: 18,
  background: "rgba(50,255,115,0.10)",
  border: "1px solid rgba(50,255,115,0.35)",
};

const restoreBox: React.CSSProperties = {
  marginTop: 20,
  padding: 18,
  borderRadius: 18,
  background: "rgba(255,176,32,0.10)",
  border: "1px solid rgba(255,176,32,0.4)",
};

const openLink: React.CSSProperties = {
  opacity: 0.92,
  color: "white",
  textDecoration: "underline",
  display: "inline-block",
  marginTop: 8,
};