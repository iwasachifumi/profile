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

export default function BookScreen() {
  const { session } = useSession();
  const { t } = useLang();
  const [exchanges,    setExchanges]    = useState<Exchange[]>([]);
  const [expandedId,   setExpandedId]   = useState<string | null>(null);
  const [editTarget,   setEditTarget]   = useState<Exchange | null>(null);
  const [draft,        setDraft]        = useState<Exchange | null>(null);
  const [busy,         setBusy]         = useState<"load" | "save" | "delete" | null>("load");
  const [error,        setError]        = useState<string | null>(null);
  const [ogFailed,     setOgFailed]     = useState<Set<string>>(new Set());

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

  // 詳細の開閉
  function handleToggleDetail(item: Exchange) {
    setExpandedId((cur) => (cur === item.id ? null : item.id));
  }

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
    setExpandedId((cur) => (cur === removingId ? null : cur));
    handleCloseEdit();
  }

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/book" />;
  }

  return (
    <main className="app-shell">
      <section className="section-title">
        <div>
          <h1>{t("人脈帳", "People")}</h1>
          <p className="muted">{t("名刺交換の履歴を管理します", "Your profile exchange history")}</p>
        </div>
      </section>

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
      ) : (
        <div className="exchange-list">
          {exchanges.map((item) => {
            const name = (item.snapshot.displayName as string)
              || (item.snapshot.patternName as string)
              || t("名前なし", "No name");
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="exchange-list-item">
                {/* OGカード画像（あれば） */}
                {item.targetProfileId && (
                  ogFailed.has(item.targetProfileId) ? (
                    /* OG画像なし → 仮カード */
                    <div className="exchange-og-card exchange-og-fallback" onClick={() => handleToggleDetail(item)}>
                      <div className="exchange-og-fallback-initial">{initialOf(name)}</div>
                      <div className="exchange-og-fallback-info">
                        <strong>{name}</strong>
                        {!!(item.snapshot.audience as string) && (
                          <span>{item.snapshot.audience as string}</span>
                        )}
                        {!!(item.snapshot.description as string) && (
                          <span>{item.snapshot.description as string}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/og/${item.targetProfileId}.png`}
                      alt={name}
                      className="exchange-og-card"
                      onClick={() => handleToggleDetail(item)}
                      onError={() => setOgFailed((prev) => new Set(prev).add(item.targetProfileId!))}
                    />
                  )
                )}

                {/* カード行 */}
                <div className="exchange-row">
                  {!item.targetProfileId && (
                    <div className="avatar avatar-sm">
                      <span>{initialOf(name)}</span>
                    </div>
                  )}
                  <div className="exchange-row-info">
                    <strong>{name}</strong>
                    <span className="muted small">
                      {formatDate(item.exchangedAt)}
                      {item.eventName ? ` / ${item.eventName}` : ""}
                    </span>
                  </div>
                  <div className="exchange-row-actions">
                    <button
                      type="button"
                      className="button secondary"
                      style={{ padding: "4px 10px", fontSize: "13px" }}
                      onClick={() => handleToggleDetail(item)}
                    >
                      {isExpanded ? t("閉じる", "Close") : t("詳細", "Detail")}
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={t("編集", "Edit")}
                      onClick={() => handleOpenEdit(item)}
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                {/* 詳細（展開時のみ） */}
                {isExpanded && (
                  <div className="exchange-detail">
                    <div className="tag-row">
                      <span className="tag">{item.method === "qr" ? "QR" : t("手動", "Manual")}</span>
                      {item.eventName && <span className="tag">{item.eventName}</span>}
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    {!!(item.snapshot.audience as string) && (
                      <p className="muted small" style={{ margin: "6px 0 0" }}>
                        {item.snapshot.audience as string}
                      </p>
                    )}
                    {!!(item.snapshot.description as string) && (
                      <p style={{ margin: "4px 0 0" }}>
                        {item.snapshot.description as string}
                      </p>
                    )}
                    {item.privateNote && (
                      <p className="muted small" style={{ margin: "8px 0 0", whiteSpace: "pre-wrap" }}>
                        📝 {item.privateNote}
                      </p>
                    )}
                    {item.targetProfileId && (
                      <a
                        className="button secondary"
                        href={`/preview/${item.targetProfileId}`}
                        style={{ display: "inline-block", marginTop: "10px", fontSize: "13px" }}
                      >
                        {t("現在のプロフィールを見る", "View current profile")}
                      </a>
                    )}
                  </div>
                )}
              </div>
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
                {t("タグ（カンマ区切り）", "Tags (comma separated)")}
                <input
                  value={draft.tags.join(", ")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder={t("例: 勉強会, React, 2026", "e.g. meetup, React, 2026")}
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
