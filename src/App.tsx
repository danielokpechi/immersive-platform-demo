import { useEffect, useRef, useState, type ReactElement } from 'react';
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
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>,
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

/* ── original, brand-neutral merch visuals (studio-style) ── */
const Emblem = ({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M15 2 27 6.5V16q0 10-12 13Q3 26 3 16V6.5Z" fill="#d9c79a" stroke="#fff" strokeWidth="1.2" />
    <path d="M6 14h18v3H6z" fill="#7a1220" opacity=".9" />
    <circle cx="15" cy="10" r="2.4" fill="#7a1220" opacity=".9" />
  </g>
);
const Jersey = () => (
  <svg viewBox="0 0 240 240" width="84%" height="84%" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="jg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ef2130" /><stop offset="1" stopColor="#a8000d" /></linearGradient>
      <linearGradient id="jsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".22" /><stop offset=".28" stopColor="#000" stopOpacity="0" /><stop offset=".72" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".24" /></linearGradient>
      <clipPath id="jclip"><path d="M74 48 98 56Q120 76 142 56L166 48 214 92Q218 99 210 106L180 120 186 200Q186 208 178 208L62 208Q54 208 54 200L60 120 30 106Q22 99 26 92Z" /></clipPath>
    </defs>
    <path d="M74 48 98 56Q120 76 142 56L166 48 214 92Q218 99 210 106L180 120 186 200Q186 208 178 208L62 208Q54 208 54 200L60 120 30 106Q22 99 26 92Z" fill="url(#jg)" stroke="#7c0009" strokeWidth="1.5" />
    <g clipPath="url(#jclip)">
      <rect x="112" y="40" width="4" height="180" fill="#fff" opacity=".14" />
      <rect x="126" y="40" width="4" height="180" fill="#fff" opacity=".14" />
      <rect x="98" y="40" width="4" height="180" fill="#fff" opacity=".14" />
      <path d="M0 96 240 96 240 118 0 118Z" fill="#fff" opacity=".9" transform="translate(0 -2)" clipPath="url(#jclip)" />
    </g>
    <path d="M26 92 30 106 46 100 42 86Z" fill="#fff" />
    <path d="M214 92 210 106 194 100 198 86Z" fill="#fff" />
    <path d="M98 56Q120 76 142 56L135 68Q120 84 105 68Z" fill="#fff" />
    <Emblem x={106} y={88} s={0.9} />
    <path d="M74 48 98 56Q120 76 142 56L166 48 214 92Q218 99 210 106L180 120 186 200Q186 208 178 208L62 208Q54 208 54 200L60 120 30 106Q22 99 26 92Z" fill="url(#jsh)" />
  </svg>
);
const Cap = () => (
  <svg viewBox="0 0 240 200" width="88%" height="88%" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ef2130" /><stop offset="1" stopColor="#a8000d" /></linearGradient>
    </defs>
    <path d="M34 150Q120 118 206 150Q208 174 120 180Q32 174 34 150Z" fill="url(#cg)" stroke="#7c0009" strokeWidth="1.5" />
    <path d="M48 154Q42 58 120 54Q198 58 192 154Q120 136 48 154Z" fill="url(#cg)" stroke="#7c0009" strokeWidth="1.5" />
    <path d="M120 55 120 146M86 58Q104 100 92 148M154 58Q136 100 148 148" stroke="#000" strokeOpacity=".14" strokeWidth="2" fill="none" />
    <circle cx="120" cy="56" r="5" fill="#a8000d" />
    <ellipse cx="94" cy="86" rx="42" ry="26" fill="#fff" opacity=".12" />
    <Emblem x={105} y={82} s={1} />
  </svg>
);
const Scarf = () => (
  <svg viewBox="0 0 240 240" width="72%" height="92%" style={{ overflow: 'visible' }}>
    <defs><linearGradient id="scg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ef2130" /><stop offset="1" stopColor="#a8000d" /></linearGradient></defs>
    {[{ x: 66, h: 156 }, { x: 118, h: 176 }].map((c, i) => (
      <g key={i}>
        <rect x={c.x} y="26" width="48" height={c.h} rx="5" fill="url(#scg)" stroke="#7c0009" strokeWidth="1.2" />
        <rect x={c.x} y="44" width="48" height="12" fill="#fff" opacity=".92" />
        <rect x={c.x} y="64" width="48" height="5" fill="#fff" opacity=".55" />
        <rect x={c.x} y={26 + c.h - 34} width="48" height="12" fill="#fff" opacity=".92" />
        {[0, 1, 2, 3, 4].map((f) => <rect key={f} x={c.x + 3 + f * 9} y={26 + c.h} width="5" height="16" fill="#a8000d" />)}
      </g>
    ))}
    <Emblem x={126} y={92} s={1.1} />
  </svg>
);
const Hoodie = () => (
  <svg viewBox="0 0 240 240" width="86%" height="86%" style={{ overflow: 'visible' }}>
    <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3f47" /><stop offset="1" stopColor="#22262c" /></linearGradient></defs>
    <path d="M70 52 96 46Q120 40 144 46L170 52 214 96Q218 103 210 110L182 122 188 202Q188 210 180 210L60 210Q52 210 52 202L58 122 30 110Q22 103 26 96Z" fill="url(#hg)" stroke="#171a1e" strokeWidth="1.5" />
    <path d="M96 46Q120 84 144 46Q150 70 120 78Q90 70 96 46Z" fill="#171a1e" opacity=".85" />
    <rect x="86" y="150" width="68" height="40" rx="7" fill="#000" opacity=".22" />
    <path d="M112 78 108 116M128 78 132 116" stroke="#cfd3d8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="108" cy="118" r="3.5" fill="#cfd3d8" /><circle cx="132" cy="118" r="3.5" fill="#cfd3d8" />
  </svg>
);
const PRODUCT: Record<string, () => ReactElement> = { shirt: Jersey, cap: Cap, scarf: Scarf, hoodie: Hoodie };

// Abstract editorial art for Reads — floodlit stadium night, original.
const ReadArt = ({ hue = 200, seed = 0 }: { hue?: number; seed?: number }) => (
  <svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={`ra${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`hsl(${hue} 45% 22%)`} /><stop offset="1" stopColor={`hsl(${hue} 55% 8%)`} /></linearGradient>
      <radialGradient id={`rl${seed}`} cx="50%" cy="0%" r="80%"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="320" height="200" fill={`url(#ra${seed})`} />
    <polygon points="40,0 84,0 60,120 30,120" fill="#fff" opacity=".08" />
    <polygon points="236,0 280,0 290,120 260,120" fill="#fff" opacity=".08" />
    <ellipse cx="160" cy="210" rx="180" ry="70" fill={`hsl(${hue} 60% 30%)`} opacity=".55" />
    <path d="M0 150 320 150M160 150 160 92M110 150Q160 132 210 150" stroke="#fff" strokeOpacity=".28" strokeWidth="2" fill="none" />
    <circle cx="160" cy="120" r="16" stroke="#fff" strokeOpacity=".28" strokeWidth="2" fill="none" />
    {[42, 78, 120, 205, 250, 288].map((x, i) => <circle key={i} cx={x} cy={60 + (i % 3) * 12} r={2 + (i % 2)} fill="#fff" opacity=".5" />)}
    <rect width="320" height="200" fill="#000" opacity=".12" />
  </svg>
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
                {SHOP.map((it) => {
                  const Art = PRODUCT[it.id] ?? Jersey;
                  return (
                    <div className="shop-card" key={it.id}>
                      <div className="shop-img">{it.tag && <span className="shop-tag">{it.tag}</span>}<Art /></div>
                      <div className="shop-info">
                        <div className="shop-name">{it.name}</div>
                        <Stars n={it.rating} reviews={it.reviews} />
                        <div className="price"><small>£</small>{it.price.toFixed(2)}</div>
                        <button className="buy" onClick={() => { setCartItem(it); setCheckout('cart'); }}>{I.buy}Buy now</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* house ad */}
            <div className="ad">
              <svg className="ad-orb" viewBox="0 0 120 120" aria-hidden><circle cx="60" cy="60" r="40" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" /><path d="M60 20l12 18-12 14-12-14zM32 52l20 4 4 20-18-8zM88 52l-20 4-4 20 18-8z" fill="#fff" fillOpacity=".22" /></svg>
              <div className="ad-streak" />
              <div className="ad-txt"><span className="ad-kick">Matchday, live</span><b>NEVER MISS<br /><span className="y">A MOMENT</span></b></div>
            </div>
            {/* reads */}
            <div className="section-pad" style={{ paddingTop: 22 }}>
              <div className="section-head"><div className="section-title">Reads</div><div className="arrows"><button className="arrow-btn">{I.chevL}</button><button className="arrow-btn">{I.chevR}</button></div></div>
              {READS[0] && (
                <div className="read-hero">
                  <div className="read-hero-img"><ReadArt hue={352} seed={0} /></div>
                  <div className="read-hero-body">
                    <div className="read-kicker">{READS[0].kicker}</div>
                    <div className="read-hero-title">{READS[0].title}</div>
                    <div className="read-time">{READS[0].meta}</div>
                  </div>
                </div>
              )}
              <div className="read-grid">
                {READS.slice(1).map((r, i) => (
                  <div className="read-mini" key={r.id}>
                    <div className="read-mini-img"><ReadArt hue={i === 0 ? 210 : 40} seed={i + 1} /></div>
                    <div className="read-kicker">{r.kicker}</div>
                    <div className="read-mini-title">{r.title}</div>
                    <div className="read-time">{r.meta}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* membership banner */}
            <div className="member">
              <div className="member-crest"><Crest size={30} /></div>
              <div className="member-txt"><span className="member-kick">Members' Club · 2026/27</span><b>Season membership now open</b></div>
              <button className="member-cta">Join</button>
            </div>
            {/* footer nav */}
            <div className="nav">
              {[['home', I.home], ['shop', I.bag], ['chat', I.chat], ['you', I.user]].map(([k, ic], i) => (
                <button key={k as string} className={`nav-btn${i === 0 ? ' on' : ''}`} aria-label={k as string}>{ic}</button>
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
