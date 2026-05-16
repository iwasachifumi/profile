import Link from "next/link";

const CHANGELOG: { date: string; tag?: string; text: string }[] = [
  { date: "2026-05-16", tag: "公開", text: "開発ベータ公開" },
  { date: "2026-05-08", tag: "開始", text: "開発開始" },
];

const FEATURES = [
  {
    label: "交換",
    title: "QRでその場で交換",
    text: "アプリ不要。スマホで読み取るだけでプロフィールを渡せます。",
  },
  {
    label: "記録",
    title: "交換帳に残る",
    text: "誰とどこで会ったか、メモやタグを添えて自動で記録。",
  },
  {
    label: "再会",
    title: "あとで思い出せる",
    text: "コメントや再交換の履歴を重ねて、関係を育てられます。",
  },
];

type ProfileSection = {
  heading: string;
  items: { label: string; value: string }[];
};

const CHARA_BASIC: { label: string; value: string }[] = [
  { label: "ニックネーム", value: "めもりあたん" },
  { label: "本名", value: "メモリア・ノートリア（ちょっとだけそれっぽく）" },
  { label: "出身地", value: "にっぽんのどこかの勉強会" },
  { label: "属性", value: "出会いを集めるのが好きなひと" },
];

const CHARA_SECTIONS: ProfileSection[] = [
  {
    heading: "基本系",
    items: [
      { label: "性格を一言で", value: "人の話を覚えていたいタイプ" },
      { label: "第一印象で言われること", value: "話しやすそう" },
      { label: "仲良くなるとどうなる？", value: "あとから「あの時の話」をちゃんと覚えてる" },
    ],
  },
  {
    heading: "趣味・嗜好",
    items: [
      { label: "趣味", value: "ノートにメモすること / シール集め / 勉強会めぐり" },
      { label: "好きな音楽", value: "やさしいインスト / lo-fi / 作業用BGM" },
      { label: "最近のはまってること", value: "会った人のメモをあとで読み返すこと" },
      { label: "やめられないこと", value: "話した内容をすぐメモしちゃう" },
      { label: "つい熱く語ってしまうこと", value: "「人って面白いよね」って話" },
      { label: "一日のスマホ時間", value: "3〜4時間くらい（でもSNSよりメモが多い）" },
      { label: "最近会った人", value: "・Rust好きの人\n・猫の話で盛り上がった人\n・初LTした人" },
    ],
  },
  {
    heading: "コミュニケーション",
    items: [
      { label: "話しかけてほしいこと", value: "最近参加したイベント / 作ってるもの" },
      { label: "人見知りする？", value: "ちょっとするけど、話しかけられると嬉しい" },
      { label: "好きなタイプ", value: "なにか好きなものを持ってる人" },
    ],
  },
  {
    heading: "価値観",
    items: [
      { label: "大切にしていること", value: "一度会った人を忘れないこと" },
      { label: "座右の銘", value: "会った人を、忘れないように。" },
    ],
  },
];

const CHARA_NOTES = [
  "この前の勉強会、すごく楽しかった",
  "また話したい人が増えた",
];

const CHARA_MESSAGE = "またどこかで会えたらうれしいな";

export default function IndexScreen() {
  return (
    <div className="idx-root lp-root">

      {/* ── Hero ── */}
      <section className="idx-hero">
        <div className="idx-hero-inner">
          <div className="idx-hero-copy">
            <p className="idx-hero-eyebrow">人との出会いを、忘れないように。</p>
            <h1 className="idx-hero-title">
              Memoria<span className="idx-hero-dot">.</span>
            </h1>
            <p className="idx-hero-lead">
              QRで交換して、あとで思い出せる。<br />
              あなたの交換帳。
            </p>
            <div className="idx-hero-actions">
              <Link className="button lp-btn-main lp-btn-lg" href="/login?mode=register">
                はじめる
              </Link>
            </div>
          </div>
          <div className="idx-hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/eyecatch1_notext.png"
              alt="Memoria — QRでプロフィールを交換するシーン"
              className="idx-hero-photo"
            />
          </div>
        </div>
      </section>

      {/* ── 大きい導線バナー (LP / note) ── */}
      <section className="idx-cta-banner-section">
        <div className="idx-cta-banner-grid">
          <Link href="/lp" className="idx-cta-banner idx-cta-banner-lp">
            <span className="idx-cta-banner-tag">サービス紹介</span>
            <strong className="idx-cta-banner-title">Memoria でできること</strong>
            <span className="idx-cta-banner-desc">
              交換から記録まで、使い方をビジュアルで紹介します。
            </span>
            <span className="idx-cta-banner-arrow">LPを見る →</span>
          </Link>
          <a
            href="https://note.com/torataka/n/n5df397c395c1"
            target="_blank"
            rel="noopener noreferrer"
            className="idx-cta-banner idx-cta-banner-note"
          >
            <span className="idx-cta-banner-tag">開発秘話</span>
            <strong className="idx-cta-banner-title">なぜ Memoria をつくったか</strong>
            <span className="idx-cta-banner-desc">
              開発の背景や想いを、note にまとめています。
            </span>
            <span className="idx-cta-banner-arrow">noteで読む →</span>
          </a>
        </div>
      </section>

      {/* ── 2-pane (PC) / stacked (mobile) ── */}
      <div className="idx-two-pane">
        {/* Left: Memoria-tan profile */}
        <aside className="idx-pane idx-pane-left">
          <section className="lp-section idx-chara-section">
            <h2 className="lp-h2">めもりあたん プロフィール</h2>
            <p className="lp-section-lead">
              Memoria の公式キャラクター。「人を覚えていたい」を体現した存在です。
            </p>

            <div className="idx-chara-profile">
              <div className="idx-chara-profile-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/memoria.png" alt="めもりあたん" className="idx-chara-profile-img" />
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
                <h3 className="idx-chara-block-title">最近のメモ</h3>
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

        {/* Right: Service overview + Changelog */}
        <div className="idx-pane idx-pane-right">
          <section className="lp-section idx-about-section">
            <h2 className="lp-h2">Memoria とは</h2>
            <p className="lp-section-lead">
              イベントや SNS で出会った人を、QRやリンクで交換して、
              自分だけの「交換帳」に残せるサービスです。
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
            <h2 className="lp-h2">更新履歴</h2>
            <ul className="idx-changelog">
              {CHANGELOG.map((c, i) => (
                <li key={i} className="idx-changelog-item">
                  <time className="idx-changelog-date">{c.date}</time>
                  {c.tag && <span className="idx-changelog-tag">{c.tag}</span>}
                  <span className="idx-changelog-text">{c.text}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <section className="lp-section lp-final-section">
        <h2 className="lp-final-catch">
          まずは、自分の<br />プロフ帳を作ろう。
        </h2>
        <div className="lp-cta-row">
          <Link className="button lp-btn-main" href="/login?mode=register">はじめる</Link>
          <Link className="button secondary" href="/login">ログイン</Link>
        </div>
        <p className="muted small" style={{ textAlign: "center", marginTop: "14px" }}>
          無料ではじめられます
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="idx-footer">
        <nav className="idx-footer-links" aria-label="フッターリンク">
          <a
            href="https://note.com/torataka/n/n5df397c395c1"
            target="_blank"
            rel="noopener noreferrer"
          >
            開発秘話（note）
          </a>
          <a
            href="https://x.com/Aci2t66187"
            target="_blank"
            rel="noopener noreferrer"
          >
            お問い合わせ（X / @Aci2t66187）
          </a>
        </nav>
        <p className="idx-footer-copy">
          © {new Date().getFullYear()}{" "}
          <a href="https://ac7.co.jp" target="_blank" rel="noopener noreferrer">
            ACナレッヂ株式会社
          </a>
        </p>
      </footer>

    </div>
  );
}
