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
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Exchange | null>(null);
  const [busy, setBusy] = useState<"load" | "save" | "delete" | null>("load");
  const [error, setError] = useState<string | null>(null);

  const selected = exchanges.find((e) => e.id === selectedId) ?? null;

  const loadExchanges = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await exchangesApi.list();
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setExchanges(result.data);
    setSelectedId((cur) => {
      const nextId = cur ?? result.data[0]?.id ?? null;
      const found = result.data.find((e) => e.id === nextId) ?? null;
      setDraft(found ? cloneExchange(found) : null);
      return nextId;
    });
  }, []);

  useEffect(() => {
    if (session.status === "user") void loadExchanges();
  }, [loadExchanges, session.status]);

  function handleSelect(item: Exchange) {
    setSelectedId(item.id);
    setDraft(cloneExchange(item));
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setBusy("save");
    setError(null);
    const result = await exchangesApi.update(draft.id, {
      eventName: draft.eventName,
      privateNote: draft.privateNote,
      tags: draft.tags,
    });
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setExchanges((current) => current.map((e) => (e.id === draft.id ? { ...draft } : e)));
  }

  async function handleDelete() {
    if (!selectedId) return;
    const removingId = selectedId;
    setBusy("delete");
    const result = await exchangesApi.remove(removingId);
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setExchanges((current) => {
      const next = current.filter((e) => e.id !== removingId);
      const nextItem = next[0] ?? null;
      setSelectedId(nextItem?.id ?? null);
      setDraft(nextItem ? cloneExchange(nextItem) : null);
      return next;
    });
  }

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/book" />;
  }

  return (
    <main className="app-shell">
      {/* セクションタイトル */}
      <section className="section-title">
        <div>
          <h1>{t("人脈帳", "People")}</h1>
          <p className="muted">{t("名刺交換の履歴を管理します", "Your profile exchange history")}</p>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      <div className="book-layout">
        {/* 交換履歴リスト */}
        <aside className="panel pad stack">
          <div className="section-title">
            <h2 style={{ margin: 0 }}>{t("交換履歴", "History")}</h2>
            <span className="muted small">{t(`${exchanges.length}件`, `${exchanges.length} records`)}</span>
          </div>

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
                const snapshotName = (item.snapshot.displayName as string) || (item.snapshot.patternName as string) || t("名前なし", "No name");
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`exchange-card${selectedId === item.id ? " active" : ""}`}
                    onClick={() => handleSelect(item)}
                  >
                    <strong>{snapshotName}</strong>
                    <span className="muted small">
                      {formatDate(item.exchangedAt)} / {item.eventName || t("イベント未設定", "No event")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* 詳細パネル */}
        <section className="panel pad">
          {!selected || !draft ? (
            <div className="empty-state">
              <h2 style={{ margin: "0 0 8px" }}>{t("履歴を選択してください", "Select a record")}</h2>
              <p className="muted">{t("左のリストから交換記録を選んでください。", "Select an exchange from the left list.")}</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="stack">
              {/* スナップショット */}
              <div className="section-title">
                <h2 style={{ margin: 0 }}>{t("交換したプロフィール", "Exchanged profile")}</h2>
                {selected.targetProfileId && (
                  <a
                    className="button secondary"
                    href={`/profile/${selected.targetProfileId}`}
                  >
                    {t("現在のプロフィール", "Current profile")}
                  </a>
                )}
              </div>

              <div className="snapshot">
                <div className="avatar">
                  <span>
                    {initialOf((selected.snapshot.displayName as string) || (selected.snapshot.patternName as string) || "?")}
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>
                    {(selected.snapshot.displayName as string) || (selected.snapshot.patternName as string) || t("名前なし", "No name")}
                  </h3>
                  <p className="muted" style={{ margin: "0 0 6px" }}>
                    {(selected.snapshot.patternName as string) || ""}
                  </p>
                  <div className="tag-row">
                    <span className="tag">{selected.method}</span>
                    {selected.eventName && <span className="tag">{selected.eventName}</span>}
                    <span className="tag">{formatDate(selected.exchangedAt)}</span>
                  </div>
                </div>
              </div>

              {/* メモ・タグ */}
              <label>
                {t("メモ（非公開）", "Private note")}
                <textarea
                  value={draft.privateNote}
                  onChange={(e) => setDraft({ ...draft, privateNote: e.target.value })}
                  placeholder={t("気づいたことを書いておきましょう", "Add a private note...")}
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
                <button type="submit" disabled={busy === "save"}>
                  {busy === "save" ? t("保存中...", "Saving...") : t("保存", "Save")}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => void handleDelete()}
                  disabled={busy === "delete"}
                  style={{ color: "var(--pink)" }}
                >
                  {busy === "delete" ? t("削除中...", "Deleting...") : t("削除", "Delete")}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
