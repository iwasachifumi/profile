import Link from "next/link";

const realWorldFlow = [
  {
    step: "1",
    title: "Prepare your profile pattern",
    desc: "Choose what to share for this context: event, business, or community.",
  },
  {
    step: "2",
    title: "Share via URL or QR",
    desc: "Open your public profile and exchange quickly in person.",
  },
  {
    step: "3",
    title: "Record the exchange",
    desc: "Save who you met with date, memo, and tags.",
  },
  {
    step: "4",
    title: "Follow up naturally",
    desc: "Use your memory log so important people do not get lost.",
  },
];

const onlineUseCases = [
  "Discord community members",
  "Conference speakers and attendees",
  "GitHub collaborators",
  "SNS mutuals and creators",
];

export default function LpScreen() {
  return (
    <div className="lp-root">
      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-split">
          <div className="lp-hero-text">
            <p className="lp-eyebrow">Memoria</p>
            <h1 className="lp-catch">
              Meet people.<br />
              Remember naturally.
            </h1>
            <p className="lp-sub">
              Share your profile at events and online.<br />
              Keep your own memory log with notes and tags.
            </p>
            <div className="lp-cta-row lp-cta-left">
              <Link className="button lp-btn-main" href="/mine">Open App</Link>
              <Link className="button secondary" href="/guide">See Guide</Link>
            </div>
          </div>
          <div className="lp-hero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/eyecatch2.png" alt="Memoriaでプロフィール交換と交換帳の記録" />
          </div>
        </div>
      </section>

      <section className="lp-section lp-aru-section">
        <h2 className="lp-h2">If any of these feel familiar</h2>
        <ul className="lp-aru-list">
          <li className="lp-aru-item"><span className="lp-aru-icon">-</span><span>You meet great people but forget details later.</span></li>
          <li className="lp-aru-item"><span className="lp-aru-icon">-</span><span>You are active on SNS but connection quality is shallow.</span></li>
          <li className="lp-aru-item"><span className="lp-aru-icon">-</span><span>You cannot recall where or why you met someone.</span></li>
        </ul>
        <div className="lp-answer-box">
          <p className="muted" style={{ margin: "0 0 6px" }}>Memoria helps with this:</p>
          <strong className="lp-answer-text">A profile notebook designed for real relationships.</strong>
        </div>
      </section>

      <section className="lp-section lp-scene-section" id="real">
        <div className="lp-scene-badge">Real-world events</div>
        <h2 className="lp-h2">Exchange faster. Keep context.</h2>
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

      <section className="lp-section lp-scene-section lp-online-section" id="online">
        <div className="lp-scene-badge lp-scene-badge-blue">Online communities</div>
        <h2 className="lp-h2">Useful even when you never meet in person</h2>
        <div className="lp-online-grid">
          {onlineUseCases.map((text) => (
            <div key={text} className="lp-online-item">{text}</div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-book-section">
        <h2 className="lp-h2">Your memory log becomes your relationship map</h2>
        <div className="lp-memory-cards">
          <div className="lp-memory-card"><strong>Date + context</strong><span className="muted small">Where and when you met</span></div>
          <div className="lp-memory-card"><strong>Private notes</strong><span className="muted small">What mattered in the conversation</span></div>
          <div className="lp-memory-card"><strong>Tags</strong><span className="muted small">Find people quickly later</span></div>
        </div>
      </section>

      <section className="lp-section lp-final-section">
        <h2 className="lp-final-catch">
          Keep meeting people.
          <br />
          Keep remembering them.
        </h2>
        <div className="lp-cta-row">
          <Link className="button lp-btn-main" href="/mine">Open App</Link>
          <Link className="button secondary" href="/guide">See Guide</Link>
        </div>
      </section>
    </div>
  );
}
