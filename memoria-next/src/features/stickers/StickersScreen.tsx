"use client";

import Link from "next/link";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";

export default function StickersScreen() {
  const { session } = useSession();
  const { t } = useLang();

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/stickers" />;
  }

  return (
    <main className="app-shell">
      <section className="section-title">
        <div>
          <h1>{t("シール", "Stickers")}</h1>
          <p className="muted">{t("プロフィールにシールを貼ろう", "Decorate your profile with stickers")}</p>
        </div>
        <Link className="button secondary" href="/mine">{t("マイページへ", "Back to mine")}</Link>
      </section>
      <div className="empty-state stack">
        <strong>{t("シール機能は近日公開予定です", "Sticker placement coming soon")}</strong>
        <p className="muted">
          {t(
            "プロフィールカードにシールをドラッグして貼る機能を開発中です。",
            "We are working on drag-and-drop sticker placement for your profile cards."
          )}
        </p>
        <Link className="button secondary" href="/design" style={{ justifySelf: "start" }}>
          {t("デザインを設定する", "Set up design")}
        </Link>
      </div>
    </main>
  );
}
