export const triviaFacts = [
  // Chai facts
  "Chai was introduced to India by the British in the 1800s to compete with Chinese tea — but Indians ignored it for decades until street vendors started adding spices and sugar.",
  "The word 'chai' simply means 'tea' in Hindi. Saying 'chai tea' is like saying 'tea tea'.",
  "Masala chai was originally prescribed as an Ayurvedic remedy — not a beverage. Ginger for digestion, cardamom for the mouth, cloves for pain, black pepper for circulation.",
  "India is the world's second-largest tea producer, but also its largest consumer — most of what it grows, it drinks.",
  "The 'cutting chai' you get at Mumbai tapris is half a cup by design — cheap, quick, and meant to be shared.",
  "Kashmiri noon chai is pink — made with baking soda, milk, and salt instead of sugar. It tastes nothing like what you expect.",
  "A single chai wallah near a busy railway station can serve over a thousand cups in a single morning.",
  "The clay kulhad (matka cup) is single-use and biodegradable — and it gives chai a faint earthy flavour nothing else replicates.",

  // Monsoon facts
  "The word 'monsoon' comes from the Arabic 'mawsim', meaning season. Arab traders used the seasonal winds to navigate the Indian Ocean centuries before GPS.",
  "India's entire agricultural calendar is built around the monsoon. A two-week delay can ripple into a national food shortage.",
  "The smell of rain on dry earth has a name: petrichor. It's caused by an oil plants release during drought, mixed with a compound produced by soil bacteria called geosmin.",
  "The Western Ghats receive some of the world's heaviest rainfall — Mawsynram in Meghalaya once recorded over 26,000mm in a single year.",
  "Frogs in India only call during monsoon. The sudden chorus after first rain is one of the most abrupt seasonal transitions in nature.",
  "Mumbai receives more rainfall in one monsoon season than London gets in an entire decade.",
  "The raga Megh Malhar is traditionally sung to invoke rain. Tansen, the legendary musician in Akbar's court, was said to actually summon storms with it.",

  // Bollywood golden era
  "S.D. Burman composed music on a harmonium so small it fit in his lap. He reportedly refused to use a piano because it 'felt foreign'.",
  "Lata Mangeshkar recorded over 30,000 songs across her career — more than any other singer in history, according to the Guinness Book.",
  "The song 'Pyar Hua Ikrar Hua' from Shree 420 (1955) was originally meant to be a background piece. Raj Kapoor heard it and insisted it become a full song.",
  "Guru Dutt's 'Pyaasa' (1957) was rejected by every distributor before release. Time magazine later listed it as one of the 100 best films ever made.",
  "O.P. Nayyar never used a single classical raga in his compositions — he built an entirely Western-influenced sound that defined a decade of Bollywood.",
  "The iconic 'Waqt Ne Kiya' from Kaagaz Ke Phool was recorded in a single take. Geeta Dutt reportedly wept through the whole session.",
  "Mehboob Khan designed the Mother India poster himself, drawing direct inspiration from Soviet propaganda art — intentionally.",

  // Lofi / music
  "The lofi aesthetic was pioneered not by YouTube but by cassette culture — the warmth and crackle you hear is literally tape degradation, replicated digitally.",
  "The word 'lofi' (low fidelity) was originally an insult. Engineers used it to describe recordings that didn't meet broadcast standards.",
  "Nujabes, one of the founding fathers of lofi hip-hop, never saw the genre's massive rise — he passed away in 2010, a decade before it peaked.",
  "Rain sounds help concentration because they sit in a frequency range (pink noise) that masks distracting sounds without being distracting themselves.",
  "The 'brown note' is a myth, but infrasound below 18Hz — like distant thunder — genuinely causes unease and a sense of awe in humans.",
  "The crackling vinyl sound in lofi music is usually a sample of a real vinyl record being played in silence. Producers collect 'quiet vinyl' specifically for this.",

  // Urdu / poetry
  "Mirza Ghalib wrote most of his Urdu poetry while in severe debt, often trading couplets for wine. He considered himself first a Persian poet — the Urdu was secondary.",
  "The ghazal form requires every couplet to be self-contained. A ghazal with ten couplets is ten independent poems that share only a mood.",
  "Faiz Ahmed Faiz wrote some of his most celebrated work while imprisoned in Pakistan in the 1950s. The restrictions gave the poems their coded, layered quality.",
  "The word 'shayari' has no direct English translation. It's closer to 'the act of feeling deeply enough to put it into words' than simply 'poetry'.",
  "Rahat Indori's last mushayra (poetry gathering) was performed over video call during the 2020 lockdown, weeks before he passed. Thousands watched live.",

  // Miscellaneous warmth
  "There are 17 documented words in Sanskrit for different qualities of silence. English has one.",
  "The concept of 'jugaad' — creative improvisation with what's available — is now studied in Western business schools as a formal innovation framework.",
  "Indian Railways serves approximately 1.3 million cups of chai every single day across its network.",
];

export function getRandomTrivia(): string {
  return triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
}
