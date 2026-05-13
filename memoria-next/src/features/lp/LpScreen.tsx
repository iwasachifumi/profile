import Link from "next/link";

const PAIN_POINTS = [
  { color: "yellow", text: "名刺だけ残って、誰だったか思い出せない", rot: -1.2 },
  { color: "pink",   text: "SNS 交換したけど、タイムラインに流れてしまった", rot: 1.0 },
  { color: "blue",   text: "勉強会で話した人の名前を忘れてしまう", rot: -0.6 },
  { color: "yellow", text: "「また話したい」のに、連絡先しか残らない", rot: 1.4 },
  { color: "green",  text: "ネットで知り合った人も、ちゃんと覚えておきたい", rot: -0.9 },
] as const;

const STORY_STEPS = [
  {
    num: "01",
    title: "会う",
    body: "イベントや SNS でその人と出会う。\n名刺交換じゃなくて、プロフィール交換。",
    rot: -0.7,
  },
  {
    num: "02",
    title: "QR かリンクで\nこんにちは",
    body: "スマホひとつで、その場ですぐ交換できます。アプリ不要。",
    rot: 0.7,
  },
  {
    num: "03",
    title: "交換帳に残る",
    body: "誰とどこで会ったか、メモやタグを添えて記録。",
    rot: -0.5,
  },
  {
    num: "04",
    title: "あとで思い出す",
    body: "「猫シールの人」「Rust が好きな人」——そんなふうに思い出せます。",
    rot: 0.9,
  },
];

const MEMORY_SAMPLES = [
  { icon: "🐱", name: "猫シール貼ってた人", where: "同人誌即売会", date: "2024.11", rot: -0.8 },
  { icon: "🦀", name: "Rust 好きのエンジニア", where: "勉強会", date: "2024.10", rot: 0.6 },
  { icon: "🎸", name: "音楽の趣味が合った人", where: "Discord", date: "2024.09", rot: -1.0 },
];

const ONLINE_USES = [
  { icon: "💬", text: "Discord のコミュニティメンバー" },
  { icon: "📺", text: "配信で知った人" },
  { icon: "🐙", text: "GitHub のコラボレーター" },
  { icon: "🐦", text: "SNS でつながった人" },
];

export default function LpScreen() {
  return (
    <div className="lp-root">

      {/* ── 1. Hero ── */}
      <section className="lp-hero lp-hero-v2">
        <div className="lp-hero-photo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/eyecatch2.png"
            alt="Memoria — プロフィール交換と交換帳"
            className="lp-hero-photo"
          />
          <div className="lp-hero-tape" aria-hidden="true" />
          <div className="lp-hero-cta-overlay">
            <Link className="button lp-btn-main" href="/mine">プロフ帳を作る</Link>
            <Link className="button secondary lp-btn-glass" href="/guide">使い方を見る</Link>
          </div>
        </div>
      </section>

      {/* ── 2. あるある（付箋スタイル）── */}
      <section className="lp-section lp-aru-section lp-notebook-bg">
        <h2 className="lp-h2">こんなこと、ありませんか？</h2>
        <div className="lp-stickies">
          {PAIN_POINTS.map((p, i) => (
            <div
              key={i}
              className={`lp-sticky lp-sticky-${p.color}`}
              style={{ transform: `rotate(${p.rot}deg)` }}
            >
              {p.text}
            </div>
          ))}
        </div>
        <div className="lp-answer-pinned">
          <strong>Memoria は、「人との接点」を残すプロフィール帳です。</strong>
        </div>
      </section>

      {/* ── 3. 使い方（ノートカード）── */}
      <section className="lp-section lp-story-section">
        <h2 className="lp-h2">こんな流れで使います</h2>
        <div className="lp-story-grid">
          {STORY_STEPS.map((s) => (
            <div
              key={s.num}
              className="lp-story-card"
              style={{ transform: `rotate(${s.rot}deg)` }}
            >
              <span className="lp-story-num">{s.num}</span>
              <strong className="lp-story-title">{s.title}</strong>
              <p className="lp-story-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. フォトブレイク（eyecatch3）── */}
      <div className="lp-photo-break">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/eyecatch3.png"
          alt="Tech Meetup でプロフィール交換するシーン"
          className="lp-break-photo"
        />
        <p className="lp-break-caption">Tech Meetup での一場面</p>
      </div>

      {/* ── 5. オンラインでも── */}
      <section className="lp-section lp-online2-section lp-notebook-bg">
        <div className="lp-scene-badge lp-scene-badge-blue">💻 オンラインでも</div>
        <h2 className="lp-h2">リアルだけじゃない</h2>
        <div className="lp-online-rows">
          {ONLINE_USES.map(({ icon, text }) => (
            <div key={text} className="lp-online-row">
              <span className="lp-online-row-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. 交換帳（スクラップブック）── */}
      <section className="lp-section lp-book-section lp-notebook-bg">
        <h2 className="lp-h2">交換帳に、人との記憶が積まれていく</h2>
        <div className="lp-scrapbook">
          {MEMORY_SAMPLES.map((m) => (
            <div
              key={m.name}
              className="lp-scrap-card"
              style={{ transform: `rotate(${m.rot}deg)` }}
            >
              <span className="lp-scrap-tape" aria-hidden="true" />
              <span className="lp-scrap-date">{m.date}</span>
              <span className="lp-scrap-icon">{m.icon}</span>
              <strong className="lp-scrap-name">{m.name}</strong>
              <span className="muted small">{m.where}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Final CTA ── */}
      <section className="lp-section lp-final-section">
        <div className="lp-final-garland" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp/garland_ribbon.png" alt="" style={{ width: "220px", opacity: 0.6 }} />
        </div>
        <h2 className="lp-final-catch">
          人との出会いを、<br />忘れないように。
        </h2>
        <div className="lp-cta-row">
          <Link className="button lp-btn-main" href="/mine">プロフ帳を作る</Link>
          <Link className="button secondary" href="/guide">使い方を見る</Link>
        </div>
        <p className="muted small" style={{ textAlign: "center", marginTop: "14px" }}>
          無料ではじめられます
        </p>
      </section>

    </div>
  );
}
