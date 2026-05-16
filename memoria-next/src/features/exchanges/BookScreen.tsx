"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { exchangesApi } from "@/api/exchanges";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Exchange } from "@/types";

function cloneExchange(exchange: Exchange): Exchange {
  return { ...exchange, tags: [...exchange.tags], snapshot: { ...exchange.snapshot } };
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function initialOf(name: string) {
  return (name || "?")[0].toUpperCase();
}

type DirectionFilter = "all" | "outbound" | "inbound";

export default function BookScreen() {
  const { session } = useSession();
  const { t } = useLang();
  const [exchanges,    setExchanges]    = useState<Exchange[]>([]);
  const [editTarget,   setEditTarget]   = useState<Exchange | null>(null);
  const [draft,        setDraft]        = useState<Exchange | null>(null);
  const [busy,         setBusy]         = useState<"load" | "save" | "delete" | null>("load");
  const [error,        setError]        = useState<string | null>(null);
  const [ogFailed,     setOgFailed]     = useState<Set<string>>(new Set());
  const [filter,       setFilter]       = useState<DirectionFilter>("all");

  const loadExchanges = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await exchangesApi.list();
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setExchanges(result.data);
  }, []);

  useEffect(() => {
    if (session.status === "user") void loadExchanges();
  }, [loadExchanges, session.status]);

  // 鉛筆アイコン → 編集モーダルを開く
  function handleOpenEdit(item: Exchange) {
    setEditTarget(item);
    setDraft(cloneExchange(item));
  }

  function handleCloseEdit() {
    setEditTarget(null);
    setDraft(null);
    setError(null);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setBusy("save");
    setError(null);
    const result = await exchangesApi.update(draft.id, {
      eventName:   draft.eventName,
      privateNote: draft.privateNote,
      tags:        draft.tags,
    });
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setExchanges((cur) => cur.map((e) => (e.id === draft.id ? { ...draft } : e)));
    handleCloseEdit();
  }

  async function handleDelete() {
    if (!editTarget) return;
    const removingId = editTarget.id;
    setBusy("delete");
    const result = await exchangesApi.remove(removingId);
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setExchanges((cur) => cur.filter((e) => e.id !== removingId));
    handleCloseEdit();
  }

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/book" />;
  }

  const filtered = exchanges.filter((e) => filter === "all" ? true : (e.direction ?? "outbound") === filter);
  const counts = {
    all: exchanges.length,
    outbound: exchanges.filter((e) => (e.direction ?? "outbound") === "outbound").length,
    inbound: exchanges.filter((e) => e.direction === "inbound").length,
  };

  return (
    <main className="app-shell">
      <section className="section-title">
        <div>
          <h1>{t("プロフ交換帳", "Exchange")}</h1>
          <p className="muted">{t("プロフィール交換の履歴", "Your profile exchange history")}</p>
        </div>
      </section>

      {/* ── 方向フィルタ ── */}
      {exchanges.length > 0 && (
        <div className="exchange-filter-row" role="tablist" aria-label={t("方向で絞り込み", "Filter by direction")}>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            className={`exchange-filter-btn${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("すべて", "All")} <span className="exchange-filter-count">{counts.all}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "outbound"}
            className={`exchange-filter-btn${filter === "outbound" ? " active" : ""}`}
            onClick={() => setFilter("outbound")}
          >
            {t("自分から", "I added")} <span className="exchange-filter-count">{counts.outbound}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "inbound"}
            className={`exchange-filter-btn${filter === "inbound" ? " active" : ""}`}
            onClick={() => setFilter("inbound")}
          >
            {t("相手から", "Received")} <span className="exchange-filter-count">{counts.inbound}</span>
          </button>
        </div>
      )}

      {error && !editTarget && <p className="error-text">{error}</p>}

      {/* ── 一覧 ── */}
      {busy === "load" ? (
        <p className="muted small">{t("読み込み中...", "Loading...")}</p>
      ) : exchanges.length === 0 ? (
        <div className="empty-state stack">
          <strong>{t("まだ交換記録がありません", "No exchanges yet")}</strong>
          <p className="muted small">
            {t(
              "公開プロフィールを共有して、相手のプロフィールを交換しましょう。",
              "Share your public profile to start exchanging."
            )}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state stack">
          <p className="muted small">{t("該当する記録がありません", "No matching records.")}</p>
        </div>
      ) : (
        <div className="exchange-card-list">
          {filtered.map((item) => {
            const name = (item.snapshot.name as string)
              || (item.snapshot.displayName as string)
              || (item.snapshot.description as string)
              || (item.snapshot.patternName as string)
              || t("名前なし", "No name");
            const direction = item.direction ?? "outbound";
            const ogUnavailable = !item.targetProfileId || ogFailed.has(item.targetProfileId);

            return (
              <article key={item.id} className="exchange-card">
                <div className="exchange-card-left">
                  <header className="exchange-card-head">
                    <time className="exchange-card-date">{formatDate(item.exchangedAt)}</time>
                    <span
                      className={`exchange-direction-badge dir-${direction}`}
                      title={direction === "outbound" ? t("自分が登録", "I added") : t("相手から届いた", "Received")}
                    >
                      {direction === "outbound" ? t("自分から", "I added") : t("相手から", "Received")}
                    </span>
                  </header>

                  <h3 className="exchange-card-name">{name}</h3>

                  {(item.eventName || item.tags.length > 0) && (
                    <div className="exchange-card-tags">
                      {item.eventName && <span className="tag">{item.eventName}</span>}
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="exchange-card-note">
                    <button
                      type="button"
                      className="exchange-card-note-edit"
                      aria-label={t("メモを編集", "Edit note")}
                      onClick={() => handleOpenEdit(item)}
                    >
                      ✏️
                    </button>
                    {item.privateNote ? (
                      <p className="exchange-card-note-body">{item.privateNote}</p>
                    ) : (
                      <p className="exchange-card-note-empty">
                        {t("メモはまだありません", "No note yet")}
                      </p>
                    )}
                  </div>

                  {item.targetProfileId && (
                    <a
                      className="exchange-card-link"
                      href={`/preview/${item.targetProfileId}`}
                    >
                      {t("現在のプロフィールを見る →", "View current profile →")}
                    </a>
                  )}
                </div>

                <div className="exchange-card-right">
                  {ogUnavailable ? (
                    <div className="exchange-card-qr-fallback">
                      <div className="exchange-card-qr-initial">{initialOf(name)}</div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/og/${item.targetProfileId}.png`}
                      alt={name}
                      className="exchange-card-qr"
                      onError={() => setOgFailed((prev) => new Set(prev).add(item.targetProfileId!))}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── 編集モーダル ── */}
      {editTarget && draft && (
        <div
          className="auth-prompt-backdrop"
          onClick={() => { if (busy !== "save" && busy !== "delete") handleCloseEdit(); }}
          role="dialog"
          aria-modal="true"
          aria-label={t("交換記録を編集", "Edit exchange")}
        >
          <div className="auth-prompt-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="auth-prompt-close"
              onClick={handleCloseEdit}
              disabled={busy === "save" || busy === "delete"}
              aria-label={t("閉じる", "Close")}
            >
              ×
            </button>

            <div className="auth-prompt-icon">✏️</div>
            <h2 className="auth-prompt-title">
              {(editTarget.snapshot.displayName as string)
                || (editTarget.snapshot.patternName as string)
                || t("名前なし", "No name")}
            </h2>

            {error && <p className="error-text" style={{ marginBottom: "8px" }}>{error}</p>}

            <form onSubmit={handleSave} className="stack" style={{ width: "100%", textAlign: "left" }}>
              <label>
                {t("メモ（非公開）", "Private note")}
                <textarea
                  value={draft.privateNote}
                  onChange={(e) => setDraft({ ...draft, privateNote: e.target.value })}
                  placeholder={t("気づいたことを書いておきましょう", "Add a private note...")}
                  rows={3}
                />
              </label>

              <label>
                {t("タグ（空白またはカンマ区切り）", "Tags (space or comma separated)")}
                <input
                  value={draft.tags.join(" ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      tags: e.target.value
                        .split(/[\s,、，]+/u)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder={t("例: 勉強会 React 2026", "e.g. meetup React 2026")}
                />
              </label>

              <div className="row">
                <button type="submit" disabled={busy === "save" || busy === "delete"} style={{ flex: 1 }}>
                  {busy === "save" ? t("保存中...", "Saving...") : t("保存", "Save")}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => void handleDelete()}
                  disabled={busy === "save" || busy === "delete"}
                  style={{ color: "var(--pink)" }}
                >
                  {busy === "delete" ? t("削除中...", "Deleting...") : t("削除", "Delete")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
