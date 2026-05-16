import Link from "next/link";

const CHANGELOG: { date: string; tag?: string; text: string }[] = [
  { date: "2026-05-16", tag: "NEW", text: "トップページ（このページ）を新設しました。" },
  { date: "2026-05-15", tag: "改善", text: "交換帳一覧にOGカード画像を表示。" },
  { date: "2026-05-14", tag: "改善", text: "プロフィール保存時にOG画像を自動生成。" },
  { date: "2026-05-13", tag: "UI", text: "ヘッダ文言・スマホレイアウト等を調整。" },
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

export default function IndexScreen() {
  return (
    <div className="idx-root lp-root">

      {/* ── Hero with Memoria-tan ── */}
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
              <Link className="button secondary lp-btn-lg" href="/lp">
                サービス紹介を見る
              </Link>
            </div>
          </div>
          <div className="idx-hero-chara">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/memoria.png" alt="めもりあたん" className="idx-chara-img" />
            <div className="idx-chara-bubble">
              <strong>めもりあたん</strong>
              <span>Memoria 公式キャラクター</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service overview ── */}
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
        <div className="idx-about-more">
          <Link className="button secondary" href="/lp">サービス紹介をくわしく見る →</Link>
        </div>
      </section>

      {/* ── Memoria-tan section ── */}
      <section className="lp-section idx-chara-section">
        <h2 className="lp-h2">Memoria のキャラクター</h2>
        <div className="idx-chara-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/memoria.png" alt="めもりあたん" className="idx-chara-card-img" />
          <div className="idx-chara-card-body">
            <h3>めもりあたん</h3>
            <p className="idx-chara-role">Memoria 公式マスコット</p>
            <p className="idx-chara-desc">
              {/* キャラ設定はユーザーがあとで差し替え */}
              ※キャラクター設定は準備中です。
            </p>
          </div>
        </div>
      </section>

      {/* ── Changelog ── */}
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

    </div>
  );
}
