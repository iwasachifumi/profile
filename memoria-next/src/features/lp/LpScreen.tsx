import Link from "next/link";

export default function LpScreen() {
  return (
    <div className="lp-root">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp/mikeneko.png" alt="" className="lp-float-sticker"
            style={{ top: "14%", left: "5%", transform: "rotate(-18deg)", width: "72px" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp/heart_2.png" alt="" className="lp-float-sticker"
            style={{ top: "20%", right: "7%", transform: "rotate(12deg)", width: "52px" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp/star.png" alt="" className="lp-float-sticker"
            style={{ bottom: "28%", left: "9%", transform: "rotate(6deg)", width: "44px" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp/kuroneko.png" alt="" className="lp-float-sticker"
            style={{ bottom: "20%", right: "6%", transform: "rotate(-10deg)", width: "60px" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp/garland_star_right.png" alt="" className="lp-float-sticker"
            style={{ top: "8%", left: "50%", transform: "translateX(-50%)", width: "180px", opacity: 0.4 }} />
        </div>

        <div className="lp-hero-inner">
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
          <div className="lp-cta-row">
            <Link className="button lp-btn-main" href="/mine">プロフ帳を作る</Link>
            <Link className="button secondary" href="/guide">ゲストで試す</Link>
          </div>
        </div>
      </section>

      {/* ── あるある ──────────────────────────────────────────────────── */}
      <section className="lp-section lp-aru-section">
        <h2 className="lp-h2">こんなこと、ありませんか？</h2>
        <ul className="lp-aru-list">
          {([
            ["📇", "名刺だけ残って、誰だったか思い出せない"],
            ["📱", "SNS交換したけど、タイムラインに流れてしまった"],
            ["🤝", "勉強会で話した人の名前を忘れてしまう"],
            ["💭", "「また話したい」と思ったのに、連絡先しか残らない"],
            ["🌐", "ネットで知り合った人も、ちゃんと覚えておきたい"],
          ] as [string, string][]).map(([icon, text]) => (
            <li key={text} className="lp-aru-item">
              <span className="lp-aru-icon">{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <div className="lp-answer-box">
          <p className="muted" style={{ margin: "0 0 6px" }}>Memoria は、</p>
          <strong className="lp-answer-text">「人との接点」を残すプロフィール帳です。</strong>
        </div>
      </section>

      {/* ── どっち？ ──────────────────────────────────────────────────── */}
      <section className="lp-section lp-scene-pick">
        <h2 className="lp-h2">あなたはどっち？</h2>
        <p className="muted lp-scene-pick-sub">あなたの使い方に合わせて見てみましょう</p>
        <div className="lp-scene-cards">
          <a className="lp-scene-card" href="#real">
            <span className="lp-scene-big-icon">🎪</span>
            <strong>イベント・リアル</strong>
            <span className="muted small">オフ会、即売会、勉強会、交流会</span>
            <span className="lp-scene-arrow">↓ 見てみる</span>
          </a>
          <a className="lp-scene-card" href="#online">
            <span className="lp-scene-big-icon">💻</span>
            <strong>ネット・コミュニティ</strong>
            <span className="muted small">Discord、配信、GitHub、SNS</span>
            <span className="lp-scene-arrow">↓ 見てみる</span>
          </a>
        </div>
      </section>

      {/* ── リアル場面 ────────────────────────────────────────────────── */}
      <section className="lp-section lp-scene-section" id="real">
        <div className="lp-scene-badge">🎪 イベント・リアル</div>
        <h2 className="lp-h2">QRで交換して、<br />帳面に残る</h2>
        <div className="lp-flow">
          {([
            ["①", "自分のプロフ帳を作る", "シールを貼って、自分らしくデコ"],
            ["②", "イベントでQRを見せる", "スマホひとつで、その場で交換"],
            ["③", "相手が交換帳に入る", "名前・顔・どこで会ったか、全部残る"],
            ["④", "あとから思い出せる", "「猫シール貼ってた人」「Rustが好きな人」"],
          ] as [string, string, string][]).map(([num, title, desc]) => (
            <div key={num} className="lp-flow-step">
              <div className="lp-flow-num">{num}</div>
              <div>
                <strong style={{ display: "block", marginBottom: "2px" }}>{title}</strong>
                <p className="muted small" style={{ margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ネット場面 ────────────────────────────────────────────────── */}
      <section className="lp-section lp-scene-section lp-online-section" id="online">
        <div className="lp-scene-badge lp-scene-badge-blue">💻 ネット・コミュニティ</div>
        <h2 className="lp-h2">リアルだけじゃない</h2>
        <p style={{ textAlign: "center", margin: "0 0 28px", color: "var(--muted)" }}>
          Memoria は、リアルイベントだけのサービスではありません。
        </p>
        <div className="lp-online-grid">
          {([
            ["💬", "Discordで会った人"],
            ["📺", "配信で知った人"],
            ["🐙", "GitHubで見つけた人"],
            ["🐦", "SNSで仲良くなった人"],
          ] as [string, string][]).map(([icon, text]) => (
            <div key={text} className="lp-online-item">
              <span className="lp-online-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", margin: "28px 0 0" }}>
          そんな「接点」も、<strong>交換帳に残していけます。</strong>
        </p>
      </section>

      {/* ── 交換帳イメージ ────────────────────────────────────────────── */}
      <section className="lp-section lp-book-section">
        <h2 className="lp-h2">会った人を、<br />あとから思い出せる</h2>
        <div className="lp-memory-cards">
          <div className="lp-memory-card">
            <span className="lp-memory-icon">🐱</span>
            <strong>猫シール貼ってた人</strong>
            <span className="muted small">同人誌即売会 / 2024.11</span>
          </div>
          <div className="lp-memory-card">
            <span className="lp-memory-icon">🦀</span>
            <strong>Rust好きのエンジニア</strong>
            <span className="muted small">勉強会 / 2024.10</span>
          </div>
          <div className="lp-memory-card">
            <span className="lp-memory-icon">🎸</span>
            <strong>音楽の趣味が合った人</strong>
            <span className="muted small">Discord / 2024.09</span>
          </div>
        </div>
      </section>

      {/* ── デコ ──────────────────────────────────────────────────────── */}
      <section className="lp-section lp-deco-section">
        <h2 className="lp-h2">自分だけのプロフ帳</h2>
        <p className="muted" style={{ textAlign: "center", margin: "0 0 32px" }}>
          ただの入力フォームじゃなくて、「作る楽しさ」があります。
        </p>
        <div className="lp-deco-grid">
          {([
            ["🌸", "シール", "自由な場所に貼れる"],
            ["🎨", "テーマ", "カラーや紙を選べる"],
            ["🖼", "フレーム", "デコ枠でかわいく"],
            ["📖", "帳面感", "懐かしいプロフ帳の文化"],
          ] as [string, string, string][]).map(([icon, title, desc]) => (
            <div key={title} className="lp-deco-item">
              <span className="lp-deco-icon">{icon}</span>
              <strong>{title}</strong>
              <span className="muted small">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 思想 ──────────────────────────────────────────────────────── */}
      <section className="lp-section lp-thought-section">
        <h2 className="lp-h2 lp-thought-h2">Memoria が<br />大切にしていること</h2>
        <ul className="lp-thought-list">
          {[
            "人をフォロワー数で見ない",
            "タイムライン消費を目的にしない",
            "「会った」を大事にする",
            "出会いを思い出せるようにする",
            "人との接点を、記録する",
          ].map((t) => (
            <li key={t} className="lp-thought-item">
              <span className="lp-thought-mark">✦</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="lp-section lp-final-section">
        <h2 className="lp-final-catch">
          人との出会いを、<br />忘れないように。
        </h2>
        <div className="lp-cta-row">
          <Link className="button lp-btn-main" href="/mine">プロフ帳を作る</Link>
          <Link className="button secondary" href="/guide">ゲストで試す</Link>
        </div>
        <p className="muted small" style={{ textAlign: "center", marginTop: "14px" }}>
          無料ではじめられます
        </p>
      </section>

    </div>
  );
}
