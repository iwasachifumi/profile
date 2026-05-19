"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import { settingsApi } from "@/api/settings";

export default function TopBar() {
  const pathname = usePathname();
  const { session } = useSession();
  const { lang, setLanguage, t } = useLang();

  const isLoggedIn = session.status === "user";

  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [planBusy, setPlanBusy] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { setPlan(null); return; }
    let alive = true;
    settingsApi.get().then((r) => {
      if (alive && r.ok) setPlan(r.data.plan);
    });
    return () => { alive = false; };
  }, [isLoggedIn]);

  const switchPlan = async (next: "free" | "pro") => {
    if (planBusy || plan === next) return;
    setPlanBusy(true);
    const r = await settingsApi.setPlan(next);
    if (r.ok) setPlan(r.data.plan);
    setPlanBusy(false);
  };

  return (
    <header className="topbar">
      <Link className="brand" href={isLoggedIn ? "/mine" : "/"}>
        <span className="brand-mark">M</span>
        <span>
          <strong>Memoria</strong>
          <small>{t("プロフ帳", "Your book of people")}</small>
        </span>
      </Link>

      <span
        className="build-sha"
        title={t("ビルドリビジョン", "build revision")}
      >
        {process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev"}
      </span>

      {isLoggedIn && (
        <nav className="topnav" aria-label={t("ナビゲーション", "navigation")}>
          <Link href="/mine" className={pathname === "/mine" ? "active" : ""}>
            {t("Myプロフ", "My profile")}
          </Link>
          <Link href="/book" className={pathname === "/book" ? "active" : ""}>
            {t("プロフ交換帳", "Exchange")}
          </Link>
        </nav>
      )}

      <div className="topbar-tools">
        {isLoggedIn && plan !== null && (
          <div
            className="lang-switch"
            role="group"
            aria-label={t("プラン切替", "plan")}
          >
            <button
              type="button"
              className={`lang-btn${plan === "free" ? " active" : ""}`}
              onClick={() => switchPlan("free")}
              disabled={planBusy}
              title={t("無料モード", "Free mode")}
            >
              {t("無料", "Free")}
            </button>
            <button
              type="button"
              className={`lang-btn${plan === "pro" ? " active" : ""}`}
              onClick={() => switchPlan("pro")}
              disabled={planBusy}
              title={t("課金モード", "Paid mode")}
            >
              {t("課金", "Pro")}
            </button>
          </div>
        )}
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
