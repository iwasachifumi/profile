import Link from "next/link";

const realWorldFlow = [
  {
    step: "1",
    title: "プロフィールパターンを準備する",
    desc: "イベント・仕事・コミュニティなど、場面に合わせて公開内容を選べる。",
  },
  {
    step: "2",
    title: "URLかQRで交換する",
    desc: "公開プロフィールをその場でさっと見せるだけ。アプリ不要。",
  },
  {
    step: "3",
    title: "交換を記録する",
    desc: "日付・メモ・タグを添えて、会った人を交換帳に残す。",
  },
  {
    step: "4",
    title: "あとから思い出せる",
    desc: "大事な人が記憶の中に埋もれない。",
  },
];

const onlineUseCases = [
  "Discordのコミュニティメンバー",
  "カンファレンスの登壇者・参加者",
  "GitHubのコラボレーター",
  "SNSのフォロワー・クリエイター",
];

export default function LpScreen() {
  return (
    <div className="lp-root">

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-split">
          <div className="lp-hero-text">
            <p className="lp-eyebrow">✦ Memoria</p>
            <h1 className="lp-catch">
              SNS交換だけじゃ、<br />
              覚えていられないから。
            </h1>
            <p className="lp-sub">
              イベントやSNSで出会った人を、<br />
              QRやリンクで交換して、<br />
              自分だけの<strong>交換帳</strong>に残せます。
            </p>
            <div className="lp-cta-row lp-cta-left">
              <Link className="button lp-btn-main" href="/mine">プロフ帳を作る</Link>
              <Link className="button secondary" href="/guide">使い方を見る</Link>
            </div>
          </div>
          <div className="lp-hero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/eyecatch2.png" alt="Memoriaでプロフィール交換と交換帳の記録" />
          </div>
        </div>
      </section>

      {/* ── あるある ── */}
      <section className="lp-section lp-aru-section">
        <h2 className="lp-h2">こんなこと、ありませんか？</h2>
        <ul className="lp-aru-list">
          <li className="lp-aru-item">
            <span className="lp-aru-icon">📇</span>
            <span>すごく良い人と会ったのに、あとで詳細を忘れてしまう。</span>
          </li>
          <li className="lp-aru-item">
            <span className="lp-aru-icon">📱</span>
            <span>SNSは活発なのに、つながりが深くならない。</span>
          </li>
          <li className="lp-aru-item">
            <span className="lp-aru-icon">💭</span>
            <span>どこで、なぜ会ったのか、思い出せない。</span>
          </li>
        </ul>
        <div className="lp-answer-box">
          <p className="muted" style={{ margin: "0 0 6px" }}>Memoria は、</p>
          <strong className="lp-answer-text">人との接点を残す、プロフィール帳です。</strong>
        </div>
      </section>

      {/* ── リアルイベント ── */}
      <section className="lp-section lp-scene-section" id="real">
        <div className="lp-scene-badge">🎪 リアルイベント</div>
        <h2 className="lp-h2">素早く交換。文脈を残す。</h2>
        <div className="lp-scene-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/eyecatch3.png" alt="Tech meetupでQRコード交換するシーン" />
        </div>
        <div className="lp-flow">
          {realWorldFlow.map((item) => (
            <div key={item.step} className="lp-flow-step">
              <div className="lp-flow-num">{item.step}</div>
              <div>
                <strong style={{ display: "block", marginBottom: "2px" }}>{item.title}</strong>
                <p className="muted small" style={{ margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── オンライン ── */}
      <section className="lp-section lp-scene-section lp-online-section" id="online">
        <div className="lp-scene-badge lp-scene-badge-blue">💻 オンラインコミュニティ</div>
        <h2 className="lp-h2">会わなくても使える</h2>
        <div className="lp-online-grid">
          {onlineUseCases.map((text) => (
            <div key={text} className="lp-online-item">
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 交換帳 ── */}
      <section className="lp-section lp-book-section">
        <h2 className="lp-h2">交換帳が、<br />人間関係の地図になる</h2>
        <div className="lp-memory-cards">
          <div className="lp-memory-card">
            <span className="lp-memory-icon">📅</span>
            <strong>日付・文脈</strong>
            <span className="muted small">どこで、いつ会ったか</span>
          </div>
          <div className="lp-memory-card">
            <span className="lp-memory-icon">📝</span>
            <strong>プライベートメモ</strong>
            <span className="muted small">話した内容や印象を残す</span>
          </div>
          <div className="lp-memory-card">
            <span className="lp-memory-icon">🏷</span>
            <strong>タグ</strong>
            <span className="muted small">あとで素早く検索できる</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="lp-section lp-final-section">
        <h2 className="lp-final-catch">
          人との出会いを、<br />忘れないように。
        </h2>
        <div className="lp-cta-row">
          <Link className="button lp-btn-main" href="/mine">プロフ帳を作る</Link>
          <Link className="button secondary" href="/guide">使い方を見る</Link>
        </div>
        <p className="muted small" style={{ textAlign: "center", marginTop: "12px" }}>
          無料ではじめられます
        </p>
      </section>

    </div>
  );
}
