"use client";

import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { exchangesApi } from "@/api/exchanges";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import type { Exchange } from "@/types";

type BusyKind = "load" | "create" | "save" | "delete" | null;

function createExchangeDraft(): Exchange {
  return {
    id: crypto.randomUUID(),
    targetProfileId: null,
    method: "QR/URL",
    eventName: "New Event",
    exchangedAt: new Date().toISOString(),
    snapshot: {},
    privateNote: "",
    tags: [],
  };
}

function cloneExchange(exchange: Exchange): Exchange {
  return {
    ...exchange,
    tags: [...exchange.tags],
    snapshot: { ...exchange.snapshot },
  };
}

export default function BookScreen() {
  const { session, logout } = useSession();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Exchange | null>(null);
  const [busy, setBusy] = useState<BusyKind>("load");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadExchanges = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await exchangesApi.list();
    setBusy(null);
    if (!result.ok) {
      setExchanges([]);
      setSelectedId(null);
      setDraft(null);
      setError(result.error);
      return;
    }

    setExchanges(result.data);
    setSelectedId((currentId) => {
      const nextSelectedId = currentId ?? result.data[0]?.id ?? null;
      const selected = result.data.find((item) => item.id === nextSelectedId) ?? null;
      setDraft(selected ? cloneExchange(selected) : null);
      return nextSelectedId;
    });
  }, []);

  useEffect(() => {
    if (session.status !== "user") return;
    void loadExchanges();
  }, [loadExchanges, session.status]);

  async function handleCreate() {
    const next = createExchangeDraft();
    setBusy("create");
    setError(null);
    setSuccess(null);
    const result = await exchangesApi.create(next);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setExchanges((current) => [next, ...current]);
    setSelectedId(next.id);
    setDraft(cloneExchange(next));
    setSuccess("Exchange created.");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setBusy("save");
    setError(null);
    setSuccess(null);
    const result = await exchangesApi.update(draft.id, {
      eventName: draft.eventName,
      privateNote: draft.privateNote,
      tags: draft.tags,
    });
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setExchanges((current) =>
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
    const result = await exchangesApi.remove(removingId);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setExchanges((current) => {
      const next = current.filter((item) => item.id !== removingId);
      const nextSelected = next[0] ?? null;
      setSelectedId(nextSelected?.id ?? null);
      setDraft(nextSelected ? cloneExchange(nextSelected) : null);
      return next;
    });
    setSuccess("Deleted.");
  }

  function handleSelect(item: Exchange) {
    setSelectedId(item.id);
    setDraft(cloneExchange(item));
  }

  if (session.status === "loading") {
    return (
      <main style={styles.page}>
        <p style={styles.muted}>Loading session...</p>
      </main>
    );
  }

  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/book" />;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Book</h1>
          <p style={styles.muted}>Exchange history</p>
        </div>
        <div style={styles.headerActions}>
          <Link href="/mine" style={styles.linkButton}>
            Mine
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
            <h2 style={styles.subtitle}>Exchanges</h2>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={busy === "create"}
              style={styles.primaryButton}
            >
              {busy === "create" ? "Adding..." : "New"}
            </button>
          </div>

          {busy === "load" ? <p style={styles.muted}>Loading exchanges...</p> : null}
          {!busy && exchanges.length === 0 ? <p style={styles.muted}>No exchanges yet.</p> : null}

          <ul style={styles.list}>
            {exchanges.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  style={item.id === selectedId ? styles.listItemActive : styles.listItem}
                >
                  <strong>{item.eventName ?? "Untitled event"}</strong>
                  <span style={styles.listMeta}>{new Date(item.exchangedAt).toLocaleString()}</span>
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
            <p style={styles.muted}>Select an exchange.</p>
          ) : (
            <form onSubmit={handleSave} style={styles.form}>
              <label style={styles.label}>
                Event name
                <input
                  style={styles.input}
                  value={draft.eventName ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      eventName: e.target.value.trim() === "" ? null : e.target.value,
                    })
                  }
                />
              </label>

              <label style={styles.label}>
                Method
                <input
                  style={styles.input}
                  value={draft.method}
                  onChange={(e) => setDraft({ ...draft, method: e.target.value })}
                />
              </label>

              <label style={styles.label}>
                Note
                <textarea
                  style={styles.textarea}
                  value={draft.privateNote}
                  onChange={(e) => setDraft({ ...draft, privateNote: e.target.value })}
                />
              </label>

              <label style={styles.label}>
                Tags (comma separated)
                <input
                  style={styles.input}
                  value={draft.tags.join(", ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>

              <p style={styles.muted}>Exchanged at: {new Date(draft.exchangedAt).toLocaleString()}</p>

              <button type="submit" disabled={busy === "save"} style={styles.primaryButton}>
                {busy === "save" ? "Saving..." : "Save"}
              </button>
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
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  title: {
    margin: 0,
    fontSize: "24px",
  },
  subtitle: {
    margin: 0,
    fontSize: "18px",
  },
  muted: {
    margin: 0,
    color: "#475569",
    fontSize: "13px",
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
    minHeight: "110px",
    fontSize: "14px",
    resize: "vertical",
    width: "100%",
  },
  primaryButton: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "8px 10px",
    cursor: "pointer",
    width: "fit-content",
  },
  dangerButton: {
    border: "1px solid #b91c1c",
    borderRadius: "8px",
    background: "#b91c1c",
    color: "#ffffff",
    padding: "8px 10px",
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
