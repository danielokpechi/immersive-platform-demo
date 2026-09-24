import { useEffect, useRef, useState } from 'react';
import {
  SENDERS, CHAT_SCRIPT, SHOP, QUIZ, POLL, CHAT_SUMMARY, READS,
  IRIS_CHIPS, IRIS_REPLIES, IRIS_FALLBACK, type ShopItem, type Sender,
} from './data';

/* ── tiny inline icons ─────────────────────────────────── */
const I = {
  share: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>,
  chat: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 10h8M8 14h5"/><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/></svg>,
  expand: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>,
  collapse: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>,
  send: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>,
  x: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  chevL: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  buy: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>,
  check: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  bag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>,
};

// A generic red-shield crest (Arsenal-evocative, not the real trademarked crest).
const Crest = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 80 88" style={{ display: 'block' }}>
    <path d="M40 2 76 14v34c0 22-16 32-36 38C20 80 4 70 4 48V14z" fill="#e2011a" stroke="#d9c79a" strokeWidth="3"/>
    <path d="M40 2 76 14v34c0 22-16 32-36 38C20 80 4 70 4 48V14z" fill="url(#g)" opacity=".25"/>
    <rect x="16" y="40" width="48" height="7" rx="3.5" fill="#d9c79a"/>
    <circle cx="20" cy="43.5" r="6" fill="#d9c79a"/>
    <rect x="58" y="34" width="5" height="9" rx="2" fill="#d9c79a" transform="rotate(20 60 38)"/>
    <text x="40" y="26" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="12" fill="#fff" letterSpacing="1">AFC</text>
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs>
  </svg>
);

const Stars = ({ n, reviews }: { n: number; reviews: number }) => (
  <div className="stars"><span className="st">{'★★★★★'.slice(0, Math.round(n))}{'☆☆☆☆☆'.slice(0, 5 - Math.round(n))}</span>{reviews}</div>
);

type Msg =
  | { id: number; type: 'in'; sender: Sender; text: string; time: string }
  | { id: number; type: 'you'; text: string; time: string }
  | { id: number; type: 'summary' }
  | { id: number; type: 'quiz' }
  | { id: number; type: 'poll' };

const TIMES = ['just now', '1m', '2m', '5m', '12m', '20m', '25m'];
let _uid = 1;
const uid = () => _uid++;

function seed(): Msg[] {
  return [
    { id: uid(), type: 'in', sender: SENDERS[0], text: CHAT_SCRIPT[0].text, time: '5m' },
    { id: uid(), type: 'in', sender: SENDERS[1], text: CHAT_SCRIPT[1].text, time: '3m' },
    { id: uid(), type: 'summary' },
    { id: uid(), type: 'in', sender: SENDERS[2], text: CHAT_SCRIPT[2].text, time: '2m' },
  ];
}

export default function App() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [pollVote, setPollVote] = useState<number | null>(null);
  const [irisOpen, setIrisOpen] = useState(false);
  const [irisThread, setIrisThread] = useState<{ who: 'you' | 'bot'; text: string }[]>([]);
  const [irisTyping, setIrisTyping] = useState(false);
  const [cartItem, setCartItem] = useState<ShopItem | null>(null);
  const [checkout, setCheckout] = useState<'cart' | 'success' | null>(null);

  const scriptIdx = useRef(2);
  const timeIdx = useRef(0);
  const shopIdx = useRef(0);
  const chatBottom = useRef<HTMLDivElement>(null);

  // Autoplay director: a self-driving demo tour that streams chat, opens IRIS,
  // answers a quiz, votes a poll, and runs a shop checkout — on a loop.
  // Any interaction pauses it ("you're in control"); it resumes after idle.
  useEffect(() => {
    const paused = { current: false };
    let stepTimer: number | undefined;
    let idleTimer: number | undefined;

    const nextTime = () => TIMES[timeIdx.current++ % TIMES.length];
    const streamMsg = () => {
      const sc = CHAT_SCRIPT[scriptIdx.current++ % CHAT_SCRIPT.length];
      setMsgs((p) => [...p, { id: uid(), type: 'in', sender: SENDERS[sc.s % SENDERS.length], text: sc.text, time: nextTime() } as Msg].slice(-40));
    };
    const addCard = (type: 'summary' | 'quiz' | 'poll') =>
      setMsgs((p) => [...p, { id: uid(), type } as Msg].slice(-40));

    // Flat timeline — each step guarded by `paused`, so a pause suspends the
    // whole tour cleanly and it picks back up where it left off.
    const timeline: Array<{ run: () => void; gap: number }> = [
      { run: streamMsg, gap: 2600 },
      { run: streamMsg, gap: 2600 },
      // quiz: appears, then answers itself
      { run: () => { setQuizPick(null); addCard('quiz'); }, gap: 2200 },
      { run: () => setQuizPick(QUIZ.correct), gap: 3400 },
      { run: streamMsg, gap: 2600 },
      // IRIS: opens, asks a question, shows the reply, closes
      { run: () => { setIrisThread([]); setIrisOpen(true); }, gap: 1400 },
      { run: () => { setIrisThread([{ who: 'you', text: 'When is the next game?' }]); setIrisTyping(true); }, gap: 1400 },
      { run: () => { setIrisTyping(false); setIrisThread((p) => [...p, { who: 'bot', text: IRIS_REPLIES['When is the next game?'] }]); }, gap: 4400 },
      { run: () => setIrisOpen(false), gap: 1300 },
      { run: streamMsg, gap: 2600 },
      // poll: appears, then casts a vote
      { run: () => { setPollVote(null); addCard('poll'); }, gap: 2200 },
      { run: () => setPollVote(0), gap: 3400 },
      { run: streamMsg, gap: 2600 },
      // shop: opens an item, checks out, confirms, closes
      { run: () => { setCartItem(SHOP[shopIdx.current % SHOP.length]); setCheckout('cart'); }, gap: 2800 },
      { run: () => setCheckout('success'), gap: 2900 },
      { run: () => { setCheckout(null); setCartItem(null); shopIdx.current++; }, gap: 1800 },
    ];

    let idx = 0;
    const play = () => {
      if (paused.current) { stepTimer = window.setTimeout(play, 800); return; }
      const step = timeline[idx % timeline.length];
      idx++;
      step.run();
      stepTimer = window.setTimeout(play, step.gap);
    };

    const onInteract = () => {
      if (!paused.current) { paused.current = true; setInteracting(true); }
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        paused.current = false; setInteracting(false);
        // hand back a clean stage before the tour resumes
        setIrisOpen(false); setCheckout(null); setCartItem(null);
      }, 9000);
    };

    const evs: Array<[string, boolean]> = [['pointerdown', false], ['keydown', false], ['touchstart', false], ['wheel', true], ['scroll', true]];
    evs.forEach(([t, c]) => window.addEventListener(t, onInteract, { passive: true, capture: c }));
    stepTimer = window.setTimeout(play, 1600);
    return () => {
      if (stepTimer) clearTimeout(stepTimer);
      if (idleTimer) clearTimeout(idleTimer);
      evs.forEach(([t, c]) => window.removeEventListener(t, onInteract, { capture: c }));
    };
  }, []);

  // keep expanded chat pinned to the newest message
  useEffect(() => { if (expanded) chatBottom.current?.scrollIntoView({ block: 'end' }); }, [msgs, expanded]);

  const sendChat = () => {
    const t = draft.trim(); if (!t) return;
    setMsgs((p) => [...p, { id: uid(), type: 'you', text: t, time: 'just now' } as Msg].slice(-40));
    setDraft('');
  };

  const askIris = (q: string) => {
    setIrisThread((p) => [...p, { who: 'you', text: q }]);
    setIrisTyping(true);
    window.setTimeout(() => {
      setIrisTyping(false);
      setIrisThread((p) => [...p, { who: 'bot', text: IRIS_REPLIES[q] ?? IRIS_FALLBACK }]);
    }, 1100);
  };

  const cartTotal = cartItem ? cartItem.price : 0;

  /* ── renderers ─────────────────────────────────────────── */
  const renderMsg = (m: Msg) => {
    if (m.type === 'summary')
      return (
        <div key={m.id} className="incard">
          <div className="lbl">✦ Chat Summary</div>
          <div className="q" style={{ fontSize: 14, fontWeight: 500, margin: '10px 0 0' }}>{CHAT_SUMMARY}</div>
        </div>
      );
    if (m.type === 'quiz')
      return (
        <div key={m.id} className="incard">
          <div className="lbl">✦ Quiz</div>
          <div className="q">{QUIZ.q}</div>
          {QUIZ.options.map((o, i) => {
            const cls = quizPick == null ? '' : i === QUIZ.correct ? 'correct' : i === quizPick ? 'wrong' : '';
            return <button key={i} className={`quiz-opt ${cls}`} disabled={quizPick != null} onClick={() => setQuizPick(i)}>{o}</button>;
          })}
        </div>
      );
    if (m.type === 'poll')
      return (
        <div key={m.id} className="incard">
          <div className="lbl">✦ Poll</div>
          <div className="q">{POLL.q}</div>
          {POLL.options.map((o, i) => {
            const total = POLL.options.reduce((a, b) => a + b.pct, 0);
            const shown = pollVote == null ? 0 : Math.round((o.pct / total) * 100);
            return (
              <button key={i} className="poll-opt" disabled={pollVote != null} onClick={() => setPollVote(i)}>
                <span className="poll-fill" style={{ width: (pollVote == null ? 0 : shown) + '%' }} />
                <span className="poll-row">
                  <span className="poll-crest" style={{ background: o.crest }} />
                  <span className="poll-name">{o.name}{pollVote === i ? ' · your pick' : ''}</span>
                  {pollVote != null && <span className="poll-pct">{shown}%</span>}
                </span>
              </button>
            );
          })}
        </div>
      );
    if (m.type === 'you')
      return (
        <div key={m.id} className="msg you">
          <span className="avatar" style={{ background: '#444' }}>Y</span>
          <div className="msg-col"><div className="msg-name">You · {m.time}</div><div className="bubble">{m.text}</div></div>
        </div>
      );
    return (
      <div key={m.id} className="msg">
        <span className="avatar" style={{ background: m.sender.color }}>{m.sender.initials}</span>
        <div className="msg-col"><div className="msg-name">{m.sender.user} · {m.time}</div><div className="bubble">{m.text}</div></div>
      </div>
    );
  };

  const Typer = ({ iris }: { iris?: boolean }) => (
    <div className="typer">
      <div className="field">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} placeholder="Join the conversation..." />
      </div>
      <button className={`send${iris ? ' iris' : ''}`} onClick={sendChat} aria-label="Send">{I.send}</button>
    </div>
  );

  return (
    <div className="app">
      <div className="panel">
        {/* status bar */}
        <div className="statusbar">
          <span>9:41</span>
          <div className="sb-right">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="#fafafa"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4" width="3" height="8" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="#fafafa"><path d="M8.5 2C5.5 2 2.9 3.1 1 4.9l1.4 1.5C4 4.9 6.1 4 8.5 4s4.5.9 6.1 2.4L16 4.9C14.1 3.1 11.5 2 8.5 2zm0 4c-1.6 0-3 .6-4.1 1.6L8.5 12l4.1-4.4C11.5 6.6 10.1 6 8.5 6z"/></svg>
            <span className="sb-batt" />
          </div>
        </div>

        <div className={`auto-chip${interacting ? ' paused' : ''}`}><span className="dot" />{interacting ? "YOU'RE IN CONTROL" : 'AUTO'}</div>

        <div className="scroll">
          {/* hero */}
          <div className="hero">
            <div className="hero-bg" />
            <div className="hero-top">
              <button className="btn-iris" onClick={() => setIrisOpen(true)}><span className="spark">✦</span>Ask IRIS</button>
              <button className="btn-share">{I.share}</button>
            </div>
            <div className="crest-wrap">
              <div className="crest"><Crest size={72} /></div>
              <div className="hero-title">Arsenal</div>
            </div>
          </div>

          {/* fan chat (compact) */}
          <div className="chat-card">
            <div className="chat-head">
              <span className="chat-ic">{I.chat}</span>
              <div className="meta"><div className="t">Fan Chat</div><div className="s">7 fans active</div></div>
              <button className="icon-btn-round" onClick={() => setExpanded(true)} aria-label="Expand chat">{I.expand}</button>
            </div>
            <div className="chat-body">{msgs.slice(-4).map(renderMsg)}</div>
            <Typer />
          </div>

          {/* shop */}
          <div className="section" style={{ marginTop: 18 }}>
            <div className="section-pad">
              <div className="section-head"><div className="section-title">Shop</div><div className="arrows"><button className="arrow-btn">{I.chevL}</button><button className="arrow-btn">{I.chevR}</button></div></div>
              <div className="shop-row">
                {SHOP.map((it) => (
                  <div className="shop-card" key={it.id}>
                    <div className="shop-img"><span className="glow" style={{ background: `radial-gradient(70% 70% at 50% 40%, ${it.hue}, #17130f)` }} /><span className="shop-jersey" style={{ background: `linear-gradient(160deg, ${it.hue}, #0009), repeating-linear-gradient(90deg, #fff2 0 6px, transparent 6px 14px)` }} /></div>
                    <div className="shop-info">
                      <div className="shop-name">{it.name}</div>
                      <Stars n={it.rating} reviews={it.reviews} />
                      <div className="price"><small>£</small>{it.price.toFixed(2)}</div>
                      <button className="buy" onClick={() => { setCartItem(it); setCheckout('cart'); }}>{I.buy}Buy now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ad */}
            <div className="ad"><span className="ad-sneaker" /><div className="ad-txt"><b>BOOST</b><b className="y">YOUR RUN</b><span>adidas</span></div></div>
            {/* reads */}
            <div className="section-pad" style={{ paddingTop: 22 }}>
              <div className="section-head"><div className="section-title">Reads</div><div className="arrows"><button className="arrow-btn">{I.chevL}</button><button className="arrow-btn">{I.chevR}</button></div></div>
              {READS.map((r) => (
                <div className="read-card" key={r.id}>
                  <div className="read-thumb" style={{ background: `linear-gradient(135deg, ${r.hue}, #0008)` }} />
                  <div className="read-meta"><div className="read-kicker">{r.kicker}</div><div className="read-title">{r.title}</div><div className="read-time">{r.meta}</div></div>
                </div>
              ))}
            </div>
            <div className="footer">Powered by <b>BoltOS</b> · Immersive Platform</div>
          </div>
        </div>

        {/* ── expanded chat overlay ── */}
        {expanded && (
          <div className="chat-expanded">
            <div className="chat-head">
              <span className="chat-ic">{I.chat}</span>
              <div className="meta"><div className="t">Fan Chat</div><div className="s">7 fans active</div></div>
              <button className="icon-btn-round" onClick={() => setExpanded(false)} aria-label="Collapse chat">{I.collapse}</button>
            </div>
            <div className="chat-body expanded">{msgs.map(renderMsg)}<div ref={chatBottom} /></div>
            <Typer />
          </div>
        )}

        {/* ── IRIS sheet ── */}
        {irisOpen && (
          <>
            <div className="overlay-scrim" onClick={() => setIrisOpen(false)} />
            <div className="iris-sheet">
              <div className="iris-head"><div className="t">Ask IRIS</div><button className="icon-btn-round" style={{ width: 36, height: 36, borderRadius: '50%' }} onClick={() => setIrisOpen(false)}>{I.x}</button></div>
              <div className="iris-scroll">
                {irisThread.length === 0 && (
                  <div className="iris-intro">
                    <div className="iris-badge">✦</div>
                    <div className="iris-hi">Hi! I'm IRIS</div>
                    <div className="iris-sub">Your intelligent assistant. Ask me anything, or try one of these:</div>
                    {IRIS_CHIPS.map((c) => <button key={c} className="iris-chip" onClick={() => askIris(c)}>{c}</button>)}
                  </div>
                )}
                {irisThread.map((m, i) => <div key={i} className={`iris-msg ${m.who}`}>{m.text}</div>)}
                {irisTyping && <div className="iris-typing"><i /><i /><i /></div>}
              </div>
              <div className="typer">
                <div className="field"><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) { askIris(draft.trim()); setDraft(''); } }} placeholder="Ask IRIS anything..." /></div>
                <button className="send iris" onClick={() => { if (draft.trim()) { askIris(draft.trim()); setDraft(''); } }}>{I.send}</button>
              </div>
            </div>
          </>
        )}

        {/* ── cart / checkout ── */}
        {checkout && (
          <>
            <div className="overlay-scrim" onClick={() => { setCheckout(null); setCartItem(null); }} />
            {checkout === 'cart' && cartItem && (
              <div className="cart">
                <h3>Your bag <button className="icon-btn-round" style={{ width: 34, height: 34, borderRadius: '50%' }} onClick={() => { setCheckout(null); setCartItem(null); }}>{I.x}</button></h3>
                <div className="cart-line">
                  <span className="cart-thumb" style={{ background: `linear-gradient(160deg, ${cartItem.hue}, #0009)` }} />
                  <span className="nm">{cartItem.name}</span>
                  <span className="price" style={{ fontSize: 15 }}><small>£</small>{cartItem.price.toFixed(2)}</span>
                </div>
                <div className="cart-total"><span>Total</span><span className="big"><small style={{ fontSize: 13 }}>£</small>{cartTotal.toFixed(2)}</span></div>
                <button className="pay" onClick={() => setCheckout('success')}>{I.bag}Checkout · £{cartTotal.toFixed(2)}</button>
                <button className="pay ghost" onClick={() => { setCheckout(null); setCartItem(null); }}>Keep browsing</button>
                <div className="pay-note">Demo checkout — no card required, no real payment taken.</div>
              </div>
            )}
            {checkout === 'success' && (
              <div className="cart">
                <div className="success">
                  <div className="tick">{I.check}</div>
                  <h3>Order confirmed</h3>
                  <p>Nice one! Your {cartItem?.name.split(' ').slice(0, 3).join(' ')} is on its way.<br />No payment was taken — this is a live demo.</p>
                </div>
                <button className="pay" onClick={() => { setCheckout(null); setCartItem(null); }} style={{ marginTop: 8 }}>Back to the panel</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
