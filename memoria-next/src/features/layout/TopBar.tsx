"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";

export default function TopBar() {
  const pathname = usePathname();
  const { session } = useSession();
  const { lang, setLanguage, t } = useLang();

  const isLoggedIn = session.status === "user";

  return (
    <header className="topbar">
      <Link className="brand" href={isLoggedIn ? "/mine" : "/"}>
        <span className="brand-mark">M</span>
        <span>
          <strong>Memoria</strong>
          <small>{t("プロフ帳", "Your book of people")}</small>
        </span>
      </Link>

      {isLoggedIn && (
        <nav className="topnav" aria-label={t("ナビゲーション", "navigation")}>
          <Link href="/mine" className={pathname === "/mine" ? "active" : ""}>
            {t("マイページ", "My page")}
          </Link>
          <Link href="/design" className={pathname === "/design" ? "active" : ""}>
            {t("デザイン", "Design")}
          </Link>
          <Link href="/stickers" className={pathname === "/stickers" ? "active" : ""}>
            {t("シール", "Stickers")}
          </Link>
          <Link href="/book" className={pathname === "/book" ? "active" : ""}>
            {t("人脈帳", "People")}
          </Link>
        </nav>
      )}

      <div className="topbar-tools">
        <Link
          className="icon-button topbar-settings"
          href="/settings"
          title={t("設定", "Settings")}
        >
          &#9881;
        </Link>
        <div className="lang-switch" role="group" aria-label={t("言語切替", "language")}>
          <button
            type="button"
            className={`lang-btn${lang === "ja" ? " active" : ""}`}
            onClick={() => { if (lang !== "ja") setLanguage("ja"); }}
          >
            JA
          </button>
          <button
            type="button"
            className={`lang-btn${lang === "en" ? " active" : ""}`}
            onClick={() => { if (lang !== "en") setLanguage("en"); }}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
