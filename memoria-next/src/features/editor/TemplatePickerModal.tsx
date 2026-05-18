"use client";

import { useEffect, useState } from "react";
import { templateNodesApi, type TemplateNode } from "@/api/templateNodes";

type Props = {
  onClose: () => void;
  onAdd: (node: TemplateNode) => void;
};

export default function TemplatePickerModal({ onClose, onAdd }: Props) {
  const [nodes, setNodes]       = useState<TemplateNode[]>([]);
  const [loading, setLoading]   = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pathStack, setPathStack]   = useState<string[]>([]);   // ナビゲーション階層
  const [selected, setSelected]     = useState<TemplateNode | null>(null);

  useEffect(() => {
    templateNodesApi.getAll().then((res) => {
      if (res.ok) setNodes(res.data);
      else setFetchError(res.error);
      setLoading(false);
    });
  }, []);

  // pathStack にマッチするノードだけ
  const filtered = nodes.filter((n) =>
    pathStack.every((seg, i) => n.path[i] === seg)
  );

  const depth = pathStack.length;

  // 次の階層のカテゴリ（まだ末端でないもの）
  const subCategories = [
    ...new Set(filtered.filter((n) => n.path.length > depth).map((n) => n.path[depth])),
  ];

  // 現在の階層にある末端テンプレート（path が pathStack と完全一致）
  const leafTemplates = filtered.filter((n) => n.path.length === depth);

  function drillDown(seg: string) {
    setPathStack([...pathStack, seg]);
    setSelected(null);
  }

  function goBack() {
    if (selected) {
      setSelected(null);
    } else {
      setPathStack(pathStack.slice(0, -1));
    }
  }

  function handleAdd() {
    if (!selected) return;
    onAdd(selected);
    onClose();
  }

  const title = selected
    ? selected.name
    : pathStack.length > 0
    ? pathStack[pathStack.length - 1]
    : "質問グループを追加";

  return (
    <div
      className="sticker-picker-backdrop"
      onClick={onClose}
    >
      <div
        className="sticker-picker-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "480px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          {(pathStack.length > 0 || selected) && (
            <button
              type="button"
              className="icon-button"
              onClick={goBack}
              style={{ fontSize: "18px" }}
            >
              ←
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </p>
            {pathStack.length > 0 && !selected && (
              <p className="muted small" style={{ margin: "2px 0 0", fontSize: "11px" }}>
                {pathStack.join(" › ")}
              </p>
            )}
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ボディ */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {loading && (
            <p className="muted" style={{ textAlign: "center", padding: "24px 0" }}>
              読み込み中…
            </p>
          )}
          {fetchError && (
            <p style={{ color: "var(--pink)", textAlign: "center", padding: "24px 0" }}>
              {fetchError}
            </p>
          )}

          {/* ナビゲーション表示 */}
          {!loading && !fetchError && !selected && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {subCategories.length === 0 && leafTemplates.length === 0 && (
                <p className="muted" style={{ textAlign: "center", padding: "24px 0" }}>
                  テンプレートがありません
                </p>
              )}

              {/* サブカテゴリ */}
              {subCategories.map((cat) => {
                const count = filtered.filter((n) => n.path[depth] === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    className="button secondary"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "left",
                      padding: "10px 14px",
                    }}
                    onClick={() => drillDown(cat)}
                  >
                    <span>{cat}</span>
                    <span className="muted small">{count}件 ›</span>
                  </button>
                );
              })}

              {/* 末端テンプレート */}
              {leafTemplates.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="button secondary"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    padding: "10px 14px",
                  }}
                  onClick={() => setSelected(node)}
                >
                  <span>{node.name}</span>
                  <span className="muted small">{node.questions.length}問</span>
                </button>
              ))}
            </div>
          )}

          {/* テンプレート詳細（質問プレビュー） */}
          {!loading && !fetchError && selected && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p className="muted small" style={{ margin: "0 0 8px" }}>
                {selected.questions.length}件の質問が追加されます。あとで削除・編集できます。
              </p>
              {selected.questions.map((q, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--surface, #fafafa)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{q.label}</div>
                  {q.placeholder && (
                    <div
                      className="muted"
                      style={{ fontSize: "11px", marginTop: "2px" }}
                    >
                      {q.placeholder}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター（テンプレート選択時のみ） */}
        {selected && (
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              className="button"
              style={{ width: "100%", background: "var(--green, #4caf7d)", color: "#fff", border: "none" }}
              onClick={handleAdd}
            >
              この質問グループを追加
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
