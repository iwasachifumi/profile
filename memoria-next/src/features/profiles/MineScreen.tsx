"use client";

import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import type { Field, Link as ProfileLink, Profile } from "@/types";

type BusyKind = "load" | "create" | "save" | "delete" | null;

const themeOptions = [
  { id: "friends", label: "Friends" },
  { id: "business", label: "Business" },
  { id: "study", label: "Study" },
  { id: "pink", label: "Pink" },
];

const frameOptions = [
  { id: "none", label: "None" },
  { id: "top-ribbon", label: "Top Ribbon" },
  { id: "corner-ribbon", label: "Corner Ribbon" },
  { id: "pink-stars", label: "Pink Stars" },
];

const fieldGroupOptions = [
  { id: "basic", label: "Basic" },
  { id: "work", label: "Work" },
  { id: "favorite", label: "Favorite" },
  { id: "conversation", label: "Conversation" },
  { id: "free", label: "Free" },
];

const linkTypeOptions = [
  { id: "website", label: "Web" },
  { id: "x", label: "X" },
  { id: "instagram", label: "Instagram" },
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "other", label: "Other" },
];

function createDefaultField(): Field {
  return {
    id: crypto.randomUUID(),
    groupId: "basic",
    label: "New field",
    value: "",
    visible: true,
  };
}

function createDefaultLink(): ProfileLink {
  return {
    id: crypto.randomUUID(),
    type: "website",
    label: "Web",
    url: "",
    visible: true,
  };
}

function createProfileDraft(): Profile {
  return {
    id: crypto.randomUUID(),
    publicSlug: null,
    handle: null,
    isPublic: false,
    patternName: "New Profile",
    audience: "",
    description: "",
    themeId: "friends",
    frameId: "none",
    fields: [createDefaultField()],
    links: [createDefaultLink()],
    stickers: [],
  };
}

function cloneProfile(profile: Profile): Profile {
  return {
    ...profile,
    fields: [...profile.fields],
    links: [...profile.links],
    stickers: [...profile.stickers],
  };
}

export default function MineScreen() {
  const { session, logout } = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [busy, setBusy] = useState<BusyKind>("load");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await profilesApi.list();
    setBusy(null);
    if (!result.ok) {
      setProfiles([]);
      setSelectedId(null);
      setDraft(null);
      setError(result.error);
      return;
    }

    setProfiles(result.data);
    setSelectedId((currentId) => {
      const nextSelectedId = currentId ?? result.data[0]?.id ?? null;
      const selected = result.data.find((item) => item.id === nextSelectedId) ?? null;
      setDraft(selected ? cloneProfile(selected) : null);
      return nextSelectedId;
    });
  }, []);

  useEffect(() => {
    if (session.status === "user") void loadProfiles();
  }, [loadProfiles, session.status]);

  async function handleCreate() {
    if (session.status !== "user") return;
    const next = createProfileDraft();

    setBusy("create");
    setError(null);
    setSuccess(null);
    const result = await profilesApi.create(next);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setProfiles((current) => [next, ...current]);
    setSelectedId(next.id);
    setDraft(cloneProfile(next));
    setSuccess("Profile created.");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    if (draft.patternName.trim() === "") {
      setError("Name is required.");
      return;
    }

    setBusy("save");
    setError(null);
    setSuccess(null);
    const result = await profilesApi.update(draft.id, {
      publicSlug: draft.publicSlug,
      handle: draft.handle,
      isPublic: draft.isPublic,
      patternName: draft.patternName,
      audience: draft.audience,
      description: draft.description,
      themeId: draft.themeId,
      frameId: draft.frameId,
      fields: draft.fields,
      links: draft.links,
      stickers: draft.stickers,
    });
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setProfiles((current) =>
      current.map((item) => (item.id === draft.id ? { ...draft } : item))
    );
    setSuccess("Saved.");
  }

  async function handleDelete() {
    const removingId = selectedId;
    if (!removingId) return;
    setBusy("delete");
    setError(null);
    setSuccess(null);
    const result = await profilesApi.remove(removingId);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setProfiles((current) => {
      const next = current.filter((item) => item.id !== removingId);
      const nextSelected = next[0] ?? null;
      setSelectedId(nextSelected?.id ?? null);
      setDraft(nextSelected ? cloneProfile(nextSelected) : null);
      return next;
    });
    setSuccess("Deleted.");
  }

  function handleSelect(profile: Profile) {
    setSelectedId(profile.id);
    setDraft(cloneProfile(profile));
  }

  function updateField(index: number, patch: Partial<Field>) {
    if (!draft) return;
    const nextFields = draft.fields.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    );
    setDraft({ ...draft, fields: nextFields });
  }

  function addField() {
    if (!draft) return;
    setDraft({ ...draft, fields: [...draft.fields, createDefaultField()] });
  }

  function removeField(index: number) {
    if (!draft) return;
    const next = draft.fields.filter((_, itemIndex) => itemIndex !== index);
    setDraft({ ...draft, fields: next });
  }

  function updateLink(index: number, patch: Partial<ProfileLink>) {
    if (!draft) return;
    const nextLinks = draft.links.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    );
    setDraft({ ...draft, links: nextLinks });
  }

  function addLink() {
    if (!draft) return;
    setDraft({ ...draft, links: [...draft.links, createDefaultLink()] });
  }

  function removeLink(index: number) {
    if (!draft) return;
    const next = draft.links.filter((_, itemIndex) => itemIndex !== index);
    setDraft({ ...draft, links: next });
  }

  if (session.status === "loading") {
    return (
      <main style={styles.page}>
        <p style={styles.muted}>Loading session...</p>
      </main>
    );
  }

  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/mine" />;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Mine</h1>
          <p style={styles.muted}>
            {session.user.isGuest ? "ゲスト利用中" : `Signed in as ${session.user.email}`}
          </p>
          {session.user.isGuest && (
            <p style={{ margin: 0, fontSize: "11px", color: "#b45309" }}>
              ⚠ 設定メニューよりログイン情報を登録するとデータを保持できます
            </p>
          )}
        </div>
        <div style={styles.headerActions}>
          <Link href="/book" style={styles.linkButton}>
            Book
          </Link>
          <Link href="/guide" style={styles.linkButton}>
            Guide
          </Link>
          <Link href="/settings" style={styles.linkButton}>
            Settings
          </Link>
          <button type="button" onClick={() => void logout()} style={styles.linkButton}>
            Sign out
          </button>
        </div>
      </header>

      <section style={styles.grid}>
        <aside style={styles.listPanel}>
          <div style={styles.row}>
            <h2 style={styles.subtitle}>Profiles</h2>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={busy === "create"}
              style={styles.primaryButton}
            >
              {busy === "create" ? "Creating..." : "New"}
            </button>
          </div>

          {busy === "load" ? <p style={styles.muted}>Loading profiles...</p> : null}
          {!busy && profiles.length === 0 ? <p style={styles.muted}>No profiles yet.</p> : null}

          <ul style={styles.list}>
            {profiles.map((profile) => (
              <li key={profile.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(profile)}
                  style={profile.id === selectedId ? styles.listItemActive : styles.listItem}
                >
                  <strong>{profile.patternName || "Untitled"}</strong>
                  <span style={styles.listMeta}>
                    {profile.handle ?? profile.publicSlug ?? "private"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section style={styles.editorPanel}>
          <div style={styles.row}>
            <h2 style={styles.subtitle}>Editor</h2>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={!selectedId || busy === "delete"}
              style={styles.dangerButton}
            >
              {busy === "delete" ? "Deleting..." : "Delete"}
            </button>
          </div>

          {!draft ? (
            <p style={styles.muted}>Select a profile.</p>
          ) : (
            <form onSubmit={handleSave} style={styles.form}>
              <section style={styles.section}>
                <h3 style={styles.sectionTitle}>Basic</h3>
                <label style={styles.label}>
                  Name
                  <input
                    style={styles.input}
                    value={draft.patternName}
                    onChange={(e) => setDraft({ ...draft, patternName: e.target.value })}
                  />
                </label>

                <label style={styles.label}>
                  Audience
                  <input
                    style={styles.input}
                    value={draft.audience}
                    onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
                  />
                </label>

                <label style={styles.label}>
                  Description
                  <textarea
                    style={styles.textarea}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </label>

                <label style={styles.label}>
                  Handle
                  <input
                    style={styles.input}
                    value={draft.handle ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        handle: e.target.value.trim() === "" ? null : e.target.value.trim(),
                      })
                    }
                  />
                </label>

                <label style={styles.label}>
                  Public slug
                  <input
                    style={styles.input}
                    value={draft.publicSlug ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        publicSlug: e.target.value.trim() === "" ? null : e.target.value.trim(),
                      })
                    }
                  />
                </label>

                <div style={styles.rowWrap}>
                  <label style={styles.labelSmall}>
                    Theme
                    <select
                      style={styles.input}
                      value={draft.themeId}
                      onChange={(e) => setDraft({ ...draft, themeId: e.target.value })}
                    >
                      {themeOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={styles.labelSmall}>
                    Frame
                    <select
                      style={styles.input}
                      value={draft.frameId}
                      onChange={(e) => setDraft({ ...draft, frameId: e.target.value })}
                    >
                      {frameOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={draft.isPublic}
                    onChange={(e) => setDraft({ ...draft, isPublic: e.target.checked })}
                  />
                  Public profile
                </label>
              </section>

              <section style={styles.section}>
                <div style={styles.row}>
                  <h3 style={styles.sectionTitle}>Fields</h3>
                  <button type="button" onClick={addField} style={styles.secondaryButton}>
                    Add field
                  </button>
                </div>
                {draft.fields.length === 0 ? <p style={styles.muted}>No fields.</p> : null}
                <div style={styles.stack}>
                  {draft.fields.map((field, index) => (
                    <article key={field.id} style={styles.inlineCard}>
                      <div style={styles.rowWrap}>
                        <label style={styles.labelSmall}>
                          Group
                          <select
                            style={styles.input}
                            value={field.groupId}
                            onChange={(e) => updateField(index, { groupId: e.target.value })}
                          >
                            {fieldGroupOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label style={styles.labelSmall}>
                          Label
                          <input
                            style={styles.input}
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                          />
                        </label>
                      </div>
                      <label style={styles.label}>
                        Value
                        <input
                          style={styles.input}
                          value={field.value}
                          onChange={(e) => updateField(index, { value: e.target.value })}
                        />
                      </label>
                      <div style={styles.row}>
                        <label style={styles.checkLabel}>
                          <input
                            type="checkbox"
                            checked={field.visible}
                            onChange={(e) => updateField(index, { visible: e.target.checked })}
                          />
                          Visible
                        </label>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          style={styles.dangerGhostButton}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section style={styles.section}>
                <div style={styles.row}>
                  <h3 style={styles.sectionTitle}>Links</h3>
                  <button type="button" onClick={addLink} style={styles.secondaryButton}>
                    Add link
                  </button>
                </div>
                {draft.links.length === 0 ? <p style={styles.muted}>No links.</p> : null}
                <div style={styles.stack}>
                  {draft.links.map((item, index) => (
                    <article key={item.id} style={styles.inlineCard}>
                      <div style={styles.rowWrap}>
                        <label style={styles.labelSmall}>
                          Type
                          <select
                            style={styles.input}
                            value={item.type}
                            onChange={(e) => updateLink(index, { type: e.target.value })}
                          >
                            {linkTypeOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label style={styles.labelSmall}>
                          Label
                          <input
                            style={styles.input}
                            value={item.label}
                            onChange={(e) => updateLink(index, { label: e.target.value })}
                          />
                        </label>
                      </div>
                      <label style={styles.label}>
                        URL
                        <input
                          style={styles.input}
                          value={item.url}
                          onChange={(e) => updateLink(index, { url: e.target.value })}
                        />
                      </label>
                      <div style={styles.row}>
                        <label style={styles.checkLabel}>
                          <input
                            type="checkbox"
                            checked={item.visible}
                            onChange={(e) => updateLink(index, { visible: e.target.checked })}
                          />
                          Visible
                        </label>
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          style={styles.dangerGhostButton}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div style={styles.rowWrap}>
                <button type="submit" disabled={busy === "save"} style={styles.primaryButton}>
                  {busy === "save" ? "Saving..." : "Save"}
                </button>
                <Link
                  href={draft.publicSlug ? `/profile/${draft.publicSlug}` : "#"}
                  style={styles.linkButton}
                  aria-disabled={!draft.publicSlug}
                >
                  Open by slug
                </Link>
                <Link
                  href={draft.handle ? `/profile/handle/${draft.handle}` : "#"}
                  style={styles.linkButton}
                  aria-disabled={!draft.handle}
                >
                  Open by handle
                </Link>
              </div>
            </form>
          )}

          {error ? <p style={styles.errorText}>{error}</p> : null}
          {success ? <p style={styles.successText}>{success}</p> : null}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(120deg, #f8fafc 0%, #e2e8f0 100%)",
    display: "grid",
    gap: "16px",
  },
  header: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  headerActions: {
    display: "flex",
    gap: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "300px minmax(0, 1fr)",
    gap: "12px",
  },
  listPanel: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "grid",
    gap: "10px",
    alignContent: "start",
    height: "fit-content",
  },
  editorPanel: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "grid",
    gap: "12px",
    alignContent: "start",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.2,
  },
  subtitle: {
    margin: 0,
    fontSize: "18px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
  },
  section: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px",
    display: "grid",
    gap: "10px",
  },
  muted: {
    margin: 0,
    color: "#475569",
    fontSize: "13px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  rowWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  stack: {
    display: "grid",
    gap: "8px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "6px",
  },
  listItem: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#ffffff",
    padding: "10px",
    textAlign: "left",
    display: "grid",
    gap: "4px",
    cursor: "pointer",
  },
  listItemActive: {
    width: "100%",
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#f8fafc",
    padding: "10px",
    textAlign: "left",
    display: "grid",
    gap: "4px",
    cursor: "pointer",
  },
  listMeta: {
    color: "#64748b",
    fontSize: "12px",
  },
  form: {
    display: "grid",
    gap: "10px",
  },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "13px",
  },
  labelSmall: {
    display: "grid",
    gap: "6px",
    fontSize: "13px",
    minWidth: "180px",
    flex: 1,
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    width: "100%",
  },
  textarea: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "10px",
    minHeight: "100px",
    fontSize: "14px",
    resize: "vertical",
    width: "100%",
  },
  inlineCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px",
    display: "grid",
    gap: "8px",
  },
  primaryButton: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "8px 10px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    border: "1px solid #334155",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "8px 10px",
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid #b91c1c",
    borderRadius: "8px",
    background: "#b91c1c",
    color: "#ffffff",
    padding: "8px 10px",
    cursor: "pointer",
  },
  dangerGhostButton: {
    border: "1px solid #ef4444",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#b91c1c",
    padding: "6px 8px",
    cursor: "pointer",
  },
  linkButton: {
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "8px 10px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "13px",
  },
  successText: {
    margin: 0,
    color: "#166534",
    fontSize: "13px",
  },
};
