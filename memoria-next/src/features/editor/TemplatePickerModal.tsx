"use client";

import { useEffect, useMemo, useState } from "react";
import { templateNodesApi, type TemplateNode } from "@/api/templateNodes";

// ── ツリー構造 ────────────────────────────────────────────────────────────────

type CategoryNode = {
  label: string;
  pathKey: string;          // 開閉状態のキー (例: "スポーツ|野球|NPB")
  subCategories: CategoryNode[];
  templates: TemplateNode[];
};

type BuildNode = { cat: CategoryNode; children: Map<string, BuildNode> };

function buildTree(nodes: TemplateNode[]): CategoryNode[] {
  const root = new Map<string, BuildNode>();

  function getOrCreate(map: Map<string, BuildNode>, label: string, pathKey: string): BuildNode {
    if (!map.has(label)) {
      map.set(label, {
        cat: { label, pathKey, subCategories: [], templates: [] },
        children: new Map(),
      });
    }
    return map.get(label)!;
  }

  for (const node of nodes) {
    let map = root;
    const parts: string[] = [];
    for (let i = 0; i < node.path.length; i++) {
      const seg = node.path[i];
      parts.push(seg);
      const bn = getOrCreate(map, seg, parts.join("|"));
      if (i === node.path.length - 1) bn.cat.templates.push(node);
      map = bn.children;
    }
  }

  function flatten(map: Map<string, BuildNode>): CategoryNode[] {
    return Array.from(map.values()).map(({ cat, children }) => {
      cat.subCategories = flatten(children);
      return cat;
    });
  }

  return flatten(root);
}

function countAll(cat: CategoryNode): number {
  return cat.templates.length + cat.subCategories.reduce((s, c) => s + countAll(c), 0);
}

// ── Props ────────────────────────────────────────────────────────────────────

type Props = {
  onClose: () => void;
  onAdd: (node: TemplateNode) => void;
};

// ── Component ────────────────────────────────────────────────────────────────

export default function TemplatePickerModal({ onClose, onAdd }: Props) {
  const [nodes, setNodes]           = useState<TemplateNode[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openKeys, setOpenKeys]     = useState<Set<string>>(new Set());
  const [previewId, setPreviewId]   = useState<string | null>(null); // 質問プレビュー展開中のテンプレートID

  useEffect(() => {
    templateNodesApi.getAll().then((res) => {
      if (res.ok) setNodes(res.data);
      else setFetchError(res.error);
      setLoading(false);
    });
  }, []);

  const tree = useMemo(() => buildTree(nodes), [nodes]);

  function toggleKey(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleAdd(node: TemplateNode) {
    onAdd(node);
    onClose();
  }

  // ── ツリー描画 ───────────────────────────────────────────────────────────────

  function renderCategories(cats: CategoryNode[], depth: number) {
    return cats.map((cat) => {
      const isOpen = openKeys.has(cat.pathKey);
      const count  = countAll(cat);
      return (
        <div key={cat.pathKey}>
          {/* カテゴリ行 */}
          <button
            type="button"
            onClick={() => toggleKey(cat.pathKey)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
              textAlign: "left",
              padding: `8px 12px 8px ${12 + depth * 16}px`,
              background: depth === 0 ? "var(--surface, #f5f5f5)" : "transparent",
              border: "none",
              borderBottom: "1px solid var(--border)",
              cursor: "pointer",
              fontSize: depth === 0 ? "14px" : "13px",
              fontWeight: depth === 0 ? 700 : 500,
              color: "var(--fg)",
            }}
          >
            <span style={{ fontSize: "10px", opacity: 0.6, width: "10px", flexShrink: 0 }}>
              {isOpen ? "▼" : "▶"}
            </span>
            <span style={{ flex: 1 }}>{cat.label}</span>
            <span style={{ fontSize: "11px", color: "var(--muted, #888)", flexShrink: 0 }}>
              {count}件
            </span>
          </button>

          {/* 展開中: サブカテゴリ → テンプレート */}
          {isOpen && (
            <div>
              {renderCategories(cat.subCategories, depth + 1)}
              {cat.templates.map((tmpl) => renderTemplate(tmpl, depth + 1))}
            </div>
          )}
        </div>
      );
    });
  }

  function renderTemplate(tmpl: TemplateNode, depth: number) {
    const isPreviewing = previewId === tmpl.id;
    return (
      <div key={tmpl.id} style={{ borderBottom: "1px solid var(--border)" }}>
        {/* テンプレート行 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: `7px 12px 7px ${12 + depth * 16}px`,
            gap: "6px",
            background: isPreviewing ? "var(--green-soft, #f0faf4)" : "transparent",
          }}
        >
          {/* 名前 + プレビュー展開トグル */}
          <button
            type="button"
            onClick={() => setPreviewId(isPreviewing ? null : tmpl.id)}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              padding: 0,
              minHeight: "auto",
              color: "var(--fg)",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "10px", opacity: 0.5, flexShrink: 0 }}>
              {isPreviewing ? "▼" : "▶"}
            </span>
            <span>{tmpl.name}</span>
            <span style={{ fontSize: "11px", color: "var(--muted, #888)" }}>
              {tmpl.questions.length}問
            </span>
          </button>

          {/* 追加ボタン */}
          <button
            type="button"
            onClick={() => handleAdd(tmpl)}
            style={{
              background: "var(--green, #4caf7d)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "3px 10px",
              fontSize: "12px",
              cursor: "pointer",
              flexShrink: 0,
              fontWeight: 600,
              minHeight: "auto",
            }}
          >
            追加
          </button>
        </div>

        {/* 質問プレビュー（インライン展開） */}
        {isPreviewing && (
          <div
            style={{
              paddingLeft: `${12 + (depth + 1) * 16}px`,
              paddingRight: "12px",
              paddingBottom: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              background: "var(--green-soft, #f0faf4)",
            }}
          >
            {tmpl.questions.map((q, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: 600 }}>{q.label}</div>
                {q.placeholder && (
                  <div style={{ fontSize: "11px", color: "var(--muted, #888)", marginTop: "1px" }}>
                    {q.placeholder}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="sticker-picker-backdrop" onClick={onClose}>
      <div
        className="sticker-picker-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "480px",
          maxHeight: "82vh",
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
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>
            質問グループを追加
          </p>
          <button type="button" className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ツリー本体 */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>
              読み込み中…
            </p>
          )}
          {fetchError && (
            <p style={{ color: "var(--pink)", textAlign: "center", padding: "32px 0" }}>
              {fetchError}
            </p>
          )}
          {!loading && !fetchError && renderCategories(tree, 0)}
        </div>
      </div>
    </div>
  );
}
