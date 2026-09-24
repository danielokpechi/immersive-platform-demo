// Demo content for the Immersive Platform panel (Arsenal theme mockup).
// Everything here is placeholder demo data — no real transactions, no real accounts.

export type Sender = { user: string; initials: string; color: string };

export const SENDERS: Sender[] = [
  { user: 'Karim L.', initials: 'KL', color: '#3B82F6' },
  { user: 'Mohamed A.', initials: 'MA', color: '#D3A63C' },
  { user: 'Fatima Z.', initials: 'FZ', color: '#14B8A6' },
  { user: 'John Doe', initials: 'JD', color: '#22A06B' },
  { user: 'Lina Smith', initials: 'LS', color: '#E0A83B' },
  { user: 'Kevin T.', initials: 'KT', color: '#2AA198' },
  { user: 'Sara M.', initials: 'SM', color: '#8B5CF6' },
  { user: 'Diego R.', initials: 'DR', color: '#EF6C4D' },
];

// Ambient chat that streams in on the autoplay loop. Cycles forever.
export const CHAT_SCRIPT: { s: number; text: string }[] = [
  { s: 0, text: 'Go Arsenal! 🔴⚪ Ready for the big clash!' },
  { s: 1, text: 'Our new signing is showing great form in training! 💪' },
  { s: 2, text: "Anyone watching the match at the Emirates? Let's meet up! 🙌" },
  { s: 3, text: "Counting down to the next game! Let's secure the win! 🎉" },
  { s: 4, text: 'What a finish last week — still buzzing about it! ⚽️' },
  { s: 5, text: 'The atmosphere is going to be unreal tonight 🔥' },
  { s: 6, text: 'North London is red. Always has been. ❤️' },
  { s: 7, text: 'Predictions for the score? I say 2–0 Gunners.' },
  { s: 0, text: 'Midfield has looked so composed lately 👏' },
  { s: 2, text: 'Wearing my kit already and kickoff is hours away 😅' },
  { s: 4, text: 'That through ball at the weekend? Poetry. 🎯' },
  { s: 5, text: "Let's get behind the team from the first whistle! 📣" },
];

export type ShopItem = { id: string; name: string; price: number; rating: number; reviews: number; hue: string; tag?: string };
export const SHOP: ShopItem[] = [
  { id: 'shirt', name: 'Arsenal adidas 26/27 Authentic Home Shirt', price: 120.99, rating: 4.5, reviews: 229, hue: '#E22', tag: 'Home Kit' },
  { id: 'cap', name: 'Arsenal Kids 47 Red Crest Cap', price: 20.0, rating: 4.5, reviews: 42, hue: '#C11' },
  { id: 'scarf', name: 'Arsenal Supporters Bar Scarf', price: 18.0, rating: 5, reviews: 512, hue: '#B00' },
  { id: 'hoodie', name: 'Arsenal Travel Hoodie — Charcoal', price: 64.0, rating: 4, reviews: 88, hue: '#333' },
];

export const QUIZ = {
  q: "What is Arsenal's nickname?",
  options: ['The Gunners', 'The Reds', 'The Blues', 'The Spurs'],
  correct: 0,
};

export const POLL = {
  q: 'Who will win the next match?',
  options: [
    { name: 'Arsenal', pct: 62, crest: '#EF0107' },
    { name: 'Chelsea FC', pct: 38, crest: '#034694' },
  ],
};

export const CHAT_SUMMARY = 'Fans are hyped about the new signings and the upcoming derby! 🤩';

export type Read = { id: string; kicker: string; title: string; meta: string; hue: string };
export const READS: Read[] = [
  { id: 'r1', kicker: 'Match Preview', title: 'Top clash of matchday 14: Arsenal host Chelsea at the Emirates', meta: '6 min read', hue: '#7a1220' },
  { id: 'r2', kicker: 'Tactics', title: 'The number that explains our midfield dominance this season', meta: '4 min read', hue: '#123a5a' },
  { id: 'r3', kicker: 'Academy', title: 'Three Hale End graduates pushing for a first-team debut', meta: '5 min read', hue: '#2a2a2a' },
];

export const IRIS_CHIPS = [
  'What can you help me with?',
  'Explain the Premier League',
  'How can Arsenal win the trophy?',
  'When is the next game?',
];

export const IRIS_REPLIES: Record<string, string> = {
  'What can you help me with?':
    "I can answer anything about Arsenal — fixtures, form, players, history — summarise the fan chat, run quizzes, and help you around the panel. Try asking about the next game! ⚽️",
  'Explain the Premier League':
    'The Premier League is England’s top football division: 20 clubs, 38 matches each, playing August to May. Win = 3 points, draw = 1. The top of the table lifts the title; the bottom three are relegated.',
  'How can Arsenal win the trophy?':
    'Consistency is everything — stack wins, keep clean sheets, and win the big derbies. Squad depth for the busy winter fixtures and staying sharp in the final third will be decisive. 🔴⚪',
  'When is the next game?':
    'The next fixture is Arsenal vs Chelsea at the Emirates — Saturday, 17:30. Kick off your predictions in the poll above! 🏟️',
};
export const IRIS_FALLBACK =
  "Great question! In the live product I'd pull that from the club's real-time data feed. For this demo, try one of the suggested questions above. 🙂";
