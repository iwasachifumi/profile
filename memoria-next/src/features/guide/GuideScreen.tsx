"use client";

import Link from "next/link";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";

export default function GuideScreen() {
  const { session } = useSession();
  const { t } = useLang();

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/guide" />;
  }

  const steps = [
    {
      badge: t("Step 1", "Step 1"),
      title: t("プロフィールを作る", "Create your profiles"),
      desc: t(
        "友人・仕事・コミュニティなど、相手によって見せる情報を変えた複数のパターンを作れます。",
        "Create multiple profile patterns for different contexts — friends, business, communities — showing only what's relevant."
      ),
    },
    {
      badge: t("Step 2", "Step 2"),
      title: t("URLやQRで共有する", "Share by URL or QR"),
      desc: t(
        "公開スラッグまたはハンドルを設定してURLを作り、対面のときにQRで共有します。",
        "Set a public slug or handle to create a URL, then share it in person via QR code."
      ),
    },
    {
      badge: t("Step 3", "Step 3"),
      title: t("名刺交換を記録する", "Record exchanges"),
      desc: t(
        "相手のプロフィールを見てから「交換する」ボタンを押すと、人脈帳に履歴が残ります。",
        "View someone's profile and press 'Exchange' to save it in your people book."
      ),
    },
    {
      badge: t("Step 4", "Step 4"),
      title: t("プロフィールを最新に保つ", "Keep profiles up to date"),
      desc: t(
        "仕事や趣味が変わったら、パターンの情報を更新しましょう。URLは変わらないので相手には常に最新が届きます。",
        "Update your pattern info when things change — the URL stays the same so others always see the latest."
      ),
    },
  ];

  return (
    <main className="app-shell">
      <section className="section-title">
        <div>
          <h1>{t("使い方", "How it works")}</h1>
          <p className="muted">{t("Memoriaを使いこなすための4ステップ", "4 steps to get the most out of Memoria")}</p>
        </div>
        <Link className="button secondary" href="/mine">{t("マイページへ", "Go to mine")}</Link>
      </section>

      <section className="guide-grid">
        {steps.map((step) => (
          <article key={step.badge} className="panel pad guide-card">
            <div className="guide-card-head">
              <span className="guide-badge">{step.badge}</span>
              <h2>{step.title}</h2>
            </div>
            <div className="guide-illust">
              <svg viewBox="0 0 320 120" role="img" aria-hidden="true">
                <rect x="20" y="20" width="280" height="80" rx="12" fill="var(--green-soft)" stroke="var(--line)" />
                <rect x="40" y="40" width="120" height="12" rx="6" fill="var(--green)" opacity="0.4" />
                <rect x="40" y="60" width="180" height="10" rx="5" fill="var(--line)" />
                <rect x="40" y="76" width="140" height="10" rx="5" fill="var(--line)" />
              </svg>
            </div>
            <p className="muted">{step.desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
