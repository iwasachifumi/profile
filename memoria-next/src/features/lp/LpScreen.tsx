import Link from "next/link";

const PAIN_POINTS = [
  { label: "名刺だけ残る", text: "顔と話した内容が結びつかない" },
  { label: "SNSに流れる", text: "交換した相手を後から探しにくい" },
  { label: "名前を忘れる", text: "勉強会で話した人を思い出せない" },
  { label: "次につながらない", text: "また話したい気持ちだけ残る" },
  { label: "ネットの出会い", text: "オンラインの縁も覚えておきたい" },
] as const;

const STORY_STEPS = [
  {
    num: "01",
    title: "会う",
    body: "イベントや SNS でその人と出会う。\n名刺交換じゃなくて、プロフィール交換。",
  },
  {
    num: "02",
    title: "QRで交換",
    body: "スマホでその場のプロフィールを渡せます。アプリ不要。",
  },
  {
    num: "03",
    title: "交換帳に残る",
    body: "誰とどこで会ったか、メモやタグを添えて記録。",
  },
  {
    num: "04",
    title: "あとで思い出す",
    body: "コメントやタグを見返して、会話の続きに戻れます。",
  },
];

const MEMORY_REASONS = [
  {
    label: "メモ",
    title: "コメントで思い出す",
    text: "話したことや次に聞きたいことを、自分だけのメモに残せます。",
  },
  {
    label: "更新",
    title: "再交換で更新する",
    text: "また会ったら、その時点のプロフィールを重ねて保存できます。",
  },
  {
    label: "履歴",
    title: "会った回数が残る",
    text: "何度も会う相手ほど履歴が増え、関係の流れをたどれます。",
  },
] as const;

export default function LpScreen() {
  return (
    <div className="lp-root">

      {/* ── 1. Hero ── */}
      <section className="lp-hero lp-hero-v2">
        <div className="lp-hero-photo-wrap">
          <picture>
            <source media="(max-width: 640px)" srcSet="/images/eyecatch1_notext.png" />
            <img
              src="/images/eyecatch2.png"
              alt="Memoria — プロフィール交換と交換帳"
              className="lp-hero-photo"
            />
          </picture>
          <div className="lp-hero-tape" aria-hidden="true" />
        </div>
        <div className="lp-hero-footer">
          <div className="lp-hero-footer-copy">
            <span>QRで交換して、あとで思い出せる。</span>
            <strong>人との出会いを残す、あなたの交換帳。</strong>
          </div>
          <div className="lp-hero-actions">
            <Link className="button lp-btn-main lp-btn-lg" href="/mine">プロフ帳を作る</Link>
            <Link className="button secondary lp-btn-lg" href="/guide">使い方を見る</Link>
          </div>
        </div>
      </section>

      {/* ── 2. あるある ── */}
      <section className="lp-section lp-aru-section">
        <h2 className="lp-h2">こんなこと、ありませんか？</h2>
        <p className="lp-section-lead">
          連絡先だけでは、会話の温度やその人らしさまでは残りません。
        </p>
        <div className="lp-stickies">
          {PAIN_POINTS.map((item) => (
            <div key={item.label} className="lp-sticky">
              <span>{item.label}</span>
              <p>{item.text}</p>
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
        <p className="lp-section-lead">
          その場で交換して、あとから自分の言葉で記録できます。
        </p>
        <div className="lp-story-grid">
          {STORY_STEPS.map((s) => (
            <div key={s.num} className="lp-story-card">
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

      {/* ── 5. 交換帳 ── */}
      <section className="lp-section lp-memory-section">
        <div className="lp-scene-badge">あとで思い出せる理由</div>
        <h2 className="lp-h2">会ったあとも、記憶を育てられる</h2>
        <p className="lp-section-lead">
          交換した相手には、自分だけのコメントや再交換の履歴を重ねられます。
        </p>
        <div className="lp-reason-grid">
          {MEMORY_REASONS.map((item) => (
            <article key={item.label} className="lp-reason-card">
              <span className="lp-reason-label">{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 6. Final CTA ── */}
      <section className="lp-section lp-final-section">
        <h2 className="lp-final-catch">
          人との出会いを、<br />忘れないように。
        </h2>
        <p className="lp-final-lead">
          まずは一枚、自分のプロフィール帳を作ってみてください。
        </p>
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
