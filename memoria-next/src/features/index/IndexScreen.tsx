"use client";

import Link from "next/link";
import { useLang } from "@/store/language";

const CHANGELOG: { date: string; tagJa: string; tagEn: string; textJa: string; textEn: string }[] = [
  { date: "2026-05-16", tagJa: "公開", tagEn: "Launch", textJa: "開発ベータ公開", textEn: "Beta release" },
  { date: "2026-05-08", tagJa: "開始", tagEn: "Start", textJa: "開発開始", textEn: "Development started" },
];

export default function IndexScreen() {
  const { t } = useLang();

  const FEATURES = [
    {
      label: t("交換", "Exchange"),
      title: t("QRでその場で交換", "Exchange on the spot via QR"),
      text: t(
        "アプリ不要。スマホで読み取るだけでプロフィールを渡せます。",
        "No app needed — just scan the QR to share your profile."
      ),
    },
    {
      label: t("記録", "Record"),
      title: t("交換帳に残る", "Saved to your exchange book"),
      text: t(
        "誰とどこで会ったか、メモやタグを添えて自動で記録。",
        "Who you met and where — auto-recorded with notes and tags."
      ),
    },
    {
      label: t("再会", "Reconnect"),
      title: t("あとで思い出せる", "Remember them later"),
      text: t(
        "コメントや再交換の履歴を重ねて、関係を育てられます。",
        "Layer comments and re-exchanges to grow each relationship."
      ),
    },
  ];

  const CHARA_BASIC = [
    { label: t("ニックネーム", "Nickname"), value: t("めもりあたん", "Memoria-tan") },
    {
      label: t("本名", "Real name"),
      value: t("メモリア・ノートリア", "Memoria Notoria"),
    },
    {
      label: t("出身地", "From"),
      value: t("にっぽんのどこかの勉強会", "A study meetup somewhere in Japan"),
    },
    {
      label: t("属性", "Type"),
      value: t("出会いを集めるのが好きなひと", "Loves collecting encounters"),
    },
  ];

  const CHARA_SECTIONS = [
    {
      heading: t("基本系", "Basics"),
      items: [
        {
          label: t("性格を一言で", "Personality in one line"),
          value: t(
            "人の話を覚えていたいタイプ",
            "The type who wants to remember what people said"
          ),
        },
        {
          label: t("第一印象で言われること", "First impression"),
          value: t("話しやすそう", "Easy to talk to"),
        },
        {
          label: t("仲良くなるとどうなる？", "When you get close"),
          value: t(
            "あとから「あの時の話」をちゃんと覚えてる",
            "Remembers \"that conversation\" later, in detail"
          ),
        },
      ],
    },
    {
      heading: t("趣味・嗜好", "Hobbies & taste"),
      items: [
        {
          label: t("趣味", "Hobbies"),
          value: t(
            "ノートにメモすること / シール集め / 勉強会めぐり",
            "Taking notes / collecting stickers / meetup hopping"
          ),
        },
        {
          label: t("好きな音楽", "Music"),
          value: t("やさしいインスト / lo-fi / 作業用BGM", "Gentle instrumental / lo-fi / focus BGM"),
        },
        {
          label: t("最近のはまってること", "Lately into"),
          value: t(
            "会った人のメモをあとで読み返すこと",
            "Re-reading notes about people I met"
          ),
        },
        {
          label: t("やめられないこと", "Can't quit"),
          value: t(
            "話した内容をすぐメモしちゃう",
            "Jotting down what people just said"
          ),
        },
        {
          label: t("つい熱く語ってしまうこと", "What I get fired up about"),
          value: t("「人って面白いよね」って話", "\"People are interesting, right?\""),
        },
        {
          label: t("一日のスマホ時間", "Phone time per day"),
          value: t(
            "3〜4時間くらい（でもSNSよりメモが多い）",
            "3-4 hours (mostly notes, not SNS)"
          ),
        },
        {
          label: t("最近会った人", "People I met recently"),
          value: t(
            "・Rust好きの人\n・猫の話で盛り上がった人\n・初LTした人",
            "- A Rust fan\n- Someone who got excited about cats\n- A first-time LT speaker"
          ),
        },
      ],
    },
    {
      heading: t("コミュニケーション", "Communication"),
      items: [
        {
          label: t("話しかけてほしいこと", "Topics I'd love to chat about"),
          value: t(
            "最近参加したイベント / 作ってるもの",
            "Recent events / what you're building"
          ),
        },
        {
          label: t("人見知りする？", "Shy?"),
          value: t(
            "ちょっとするけど、話しかけられると嬉しい",
            "A little, but happy when spoken to"
          ),
        },
        {
          label: t("好きなタイプ", "What I like in people"),
          value: t(
            "なにか好きなものを持ってる人",
            "People who have something they love"
          ),
        },
      ],
    },
    {
      heading: t("価値観", "Values"),
      items: [
        {
          label: t("大切にしていること", "What I value"),
          value: t("一度会った人を忘れないこと", "Never forgetting someone I met"),
        },
        {
          label: t("座右の銘", "Motto"),
          value: t("会った人を、忘れないように。", "So you don't forget who you met."),
        },
      ],
    },
  ];

  const CHARA_NOTES = [
    t("この前の勉強会、すごく楽しかった", "Last meetup was so much fun"),
    t("また話したい人が増えた", "Found more people I want to talk to again"),
  ];

  const CHARA_MESSAGE = t(
    "またどこかで会えたらうれしいな",
    "Hope we meet again somewhere"
  );

  return (
    <div className="idx-root lp-root">

      {/* ── Hero ── */}
      <section className="idx-hero">
        <div className="idx-hero-inner">
          <div className="idx-hero-copy">
            <p className="idx-hero-eyebrow">
              {t("人との出会いを、忘れないように。", "So you don't forget the people you meet.")}
            </p>
            <h1 className="idx-hero-title">
              Memoria<span className="idx-hero-dot">.</span>
            </h1>
            <p className="idx-hero-lead">
              {t("QRで交換して、あとで思い出せる。", "Exchange via QR, remember them later.")}
              <br />
              {t("あなたの交換帳。", "Your book of people.")}
            </p>
            <div className="idx-hero-actions">
              <Link className="button lp-btn-main lp-btn-lg" href="/login?mode=register">
                {t("はじめる", "Get started")}
              </Link>
            </div>
          </div>
          <div className="idx-hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/eyecatch1_notext.png"
              alt={t("Memoria — QRでプロフィールを交換するシーン", "Memoria — exchanging profiles via QR")}
              className="idx-hero-photo"
            />
          </div>
        </div>
      </section>

      {/* ── 2-pane (PC) / stacked (mobile) ── */}
      <div className="idx-two-pane">
        {/* Left: Memoria-tan profile */}
        <aside className="idx-pane idx-pane-left">
          <section className="lp-section idx-chara-section">
            <p className="lp-section-lead">
              {t(
                "本サービスの公式キャラクターのメモリアです。このサービスでは自分のプロフを作成・交換できます。",
                "Meet Memoria, the official character of this service. Memoria lets you create and exchange your own profile."
              )}
            </p>

            <div className="idx-chara-profile">
              <div className="idx-chara-profile-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/memoria.png" alt={t("めもりあたん", "Memoria-tan")} className="idx-chara-profile-img" />
                <dl className="idx-chara-basic">
                  {CHARA_BASIC.map((it) => (
                    <div key={it.label} className="idx-chara-basic-row">
                      <dt>{it.label}</dt>
                      <dd>{it.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {CHARA_SECTIONS.map((sec) => (
                <div key={sec.heading} className="idx-chara-block">
                  <h3 className="idx-chara-block-title">{sec.heading}</h3>
                  <dl className="idx-chara-list">
                    {sec.items.map((it) => (
                      <div key={it.label} className="idx-chara-list-row">
                        <dt>{it.label}</dt>
                        <dd>{it.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div className="idx-chara-block">
                <h3 className="idx-chara-block-title">{t("最近のメモ", "Recent notes")}</h3>
                <ul className="idx-chara-notes">
                  {CHARA_NOTES.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <p className="idx-chara-message">「{CHARA_MESSAGE}」</p>
            </div>
          </section>
        </aside>

        {/* Right: Service overview + CTA banners + Changelog */}
        <div className="idx-pane idx-pane-right">
          <section className="lp-section idx-about-section">
            <h2 className="lp-h2">{t("Memoria とは", "What is Memoria")}</h2>
            <p className="lp-section-lead">
              {t(
                "イベントや SNS で出会った人を、QRやリンクで交換して、自分だけの「交換帳」に残せるサービスです。",
                "A service to exchange profiles (via QR or link) with people you meet at events or on SNS, and keep them in your own \"book of people.\""
              )}
            </p>
            <div className="lp-reason-grid">
              {FEATURES.map((f) => (
                <article key={f.label} className="lp-reason-card">
                  <span className="lp-reason-label">{f.label}</span>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="lp-section idx-changelog-section">
            <h2 className="lp-h2">{t("更新履歴", "Changelog")}</h2>
            <ul className="idx-changelog">
              {CHANGELOG.map((c, i) => (
                <li key={i} className="idx-changelog-item">
                  <time className="idx-changelog-date">{c.date}</time>
                  <span className="idx-changelog-tag">{t(c.tagJa, c.tagEn)}</span>
                  <span className="idx-changelog-text">{t(c.textJa, c.textEn)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="lp-section idx-cta-banner-section">
            <h2 className="lp-h2">{t("もっと知る", "Learn more")}</h2>
            <div className="idx-cta-banner-grid">
              <Link href="/lp" className="idx-cta-banner idx-cta-banner-lp">
                <span className="idx-cta-banner-tag">{t("サービス紹介", "About")}</span>
                <strong className="idx-cta-banner-title">
                  {t("Memoria でできること", "What Memoria can do")}
                </strong>
                <span className="idx-cta-banner-desc">
                  {t(
                    "交換から記録まで、使い方をビジュアルで紹介します。",
                    "From exchange to record — see how it works, visually."
                  )}
                </span>
                <span className="idx-cta-banner-arrow">{t("LPを見る →", "See the LP →")}</span>
              </Link>
              <a
                href="https://note.com/torataka/n/n5df397c395c1"
                target="_blank"
                rel="noopener noreferrer"
                className="idx-cta-banner idx-cta-banner-note"
              >
                <span className="idx-cta-banner-tag">{t("開発秘話", "Dev story")}</span>
                <strong className="idx-cta-banner-title">
                  {t("なぜ Memoria をつくったか", "Why I built Memoria")}
                </strong>
                <span className="idx-cta-banner-desc">
                  {t(
                    "開発の背景や想いを、note にまとめています。",
                    "The story and ideas behind the project, on note."
                  )}
                </span>
                <span className="idx-cta-banner-arrow">{t("noteで読む →", "Read on note →")}</span>
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <section className="lp-section lp-final-section">
        <h2 className="lp-final-catch">
          {t("まずは、自分の", "First, make your own")}
          <br />
          {t("プロフ帳を作ろう。", "profile book.")}
        </h2>
        <div className="lp-cta-row">
          <Link className="button lp-btn-main" href="/login?mode=register">
            {t("はじめる", "Get started")}
          </Link>
          <Link className="button secondary" href="/login">
            {t("ログイン", "Log in")}
          </Link>
        </div>
        <p className="muted small" style={{ textAlign: "center", marginTop: "14px" }}>
          {t("無料ではじめられます", "Free to start")}
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="idx-footer">
        <nav className="idx-footer-links" aria-label={t("フッターリンク", "Footer links")}>
          <a
            href="https://note.com/torataka/n/n5df397c395c1"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("開発秘話（note）", "Dev story (note)")}
          </a>
          <a
            href="https://x.com/Aci2t66187"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("お問い合わせ（X / @Aci2t66187）", "Contact (X / @Aci2t66187)")}
          </a>
        </nav>
        <p className="idx-footer-copy">
          © {new Date().getFullYear()}{" "}
          <a href="https://ac7.co.jp" target="_blank" rel="noopener noreferrer">
            {t("ACナレッヂ株式会社", "AC Knowledge Inc.")}
          </a>
        </p>
      </footer>

    </div>
  );
}
