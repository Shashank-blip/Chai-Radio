import type { Playlist } from "./types";

// Audio sourced from Internet Archive (archive.org) — public-domain / openly
// licensed recordings. Verify each URL resolves before deploying; archive.org
// identifiers occasionally change. Replace any broken URL with an alternative
// source that has the same filename pattern at /download/<identifier>/<file>.
export const playlists: Playlist[] = [
  {
    id: "old-is-gold",
    name: "Old is Gold",
    tracks: [
      {
        id: "lag-ja-gale",
        title: "Lag Ja Gale",
        artist: "Lata Mangeshkar",
        film: "Woh Kaun Thi",
        year: 1964,
        duration: 262,
        audioUrl:
          "https://archive.org/download/woh-kaun-thi-lag-ja-gale/Woh%20Kaun%20Thi%20-%20Lag%20Ja%20Gale.mp3",
        labelColor: "#7a1a1a",
      },
      {
        id: "ajeeb-dastan",
        title: "Ajeeb Dastan Hai Yeh",
        artist: "Lata Mangeshkar",
        film: "Dil Apna Preet Parai",
        year: 1960,
        duration: 270,
        audioUrl:
          "https://archive.org/download/1960_20260225_202602/Ajib-Dastan-Hai-Yeh_.mp3",
        labelColor: "#1e3a5f",
      },
      {
        id: "abhi-na-jao",
        title: "Abhi Na Jao Chhod Kar",
        artist: "Asha Bhosle, Mohammad Rafi",
        film: "Hum Dono",
        year: 1961,
        duration: 310,
        audioUrl:
          "https://archive.org/download/1961_20260227/Abhi-Na-Jaao-Chhod-Kar_.mp3",
        labelColor: "#4a2810",
      },
      {
        id: "piya-tose",
        title: "Piya Tose Naina Lage Re",
        artist: "Lata Mangeshkar",
        film: "Guide",
        year: 1965,
        duration: 285,
        audioUrl:
          "https://archive.org/download/piya-tose-naina-lage/Piya%20Tose%20Naina%20Lage_.mp3",
        labelColor: "#5a3010",
      },
      {
        id: "gata-rahe",
        title: "Gata Rahe Mera Dil",
        artist: "Kishore Kumar, Lata Mangeshkar",
        film: "Guide",
        year: 1965,
        duration: 300,
        audioUrl:
          "https://archive.org/download/piya-tose-naina-lage/Gata%20Rahe%20Mera%20Dil_.mp3",
        labelColor: "#2e4a2e",
      },
      {
        id: "woh-shaam",
        title: "Woh Sham Kuchh Ajeeb Thi",
        artist: "Kishore Kumar",
        film: "Khamoshi",
        year: 1969,
        duration: 290,
        audioUrl:
          "https://archive.org/download/1969_20260311/Woh%20Sham%20Kuchh%20Aji_.mp3",
        labelColor: "#1e2e3e",
      },
      {
        id: "tum-bin",
        title: "Tum Bin Jao Kahan",
        artist: "Mohammad Rafi",
        film: "Pyaar Ka Mausam",
        year: 1969,
        duration: 275,
        audioUrl:
          "https://archive.org/download/1969_20260311/Tum%20bin%20jaau%20kaha_.mp3",
        labelColor: "#6a2a20",
      },
      {
        id: "chura-liya",
        title: "Chura Liya Hai Tumne",
        artist: "Asha Bhosle, Mohammad Rafi",
        film: "Yaadon Ki Baaraat",
        year: 1973,
        duration: 260,
        audioUrl:
          "https://archive.org/download/1973_20260316/Chura%20Liya%20Hai%20Tum_.mp3",
        labelColor: "#5a1e4a",
      },
    ],
  },
  {
    id: "monsoon-mood",
    name: "Monsoon Mood",
    tracks: [
      {
        id: "o-sajna",
        title: "O Sajna Barkha Bahar Aayi",
        artist: "Lata Mangeshkar",
        film: "Parakh",
        year: 1960,
        duration: 273,
        audioUrl:
          "https://archive.org/download/1960_20260225_202602/O_Sajana_Barkha_.mp3",
        labelColor: "#0e3050",
      },
      {
        id: "rimjhim-ke-geet",
        title: "Rimjhim Ke Geet",
        artist: "Lata Mangeshkar",
        film: "Anpadh",
        year: 1962,
        audioUrl:
          "https://archive.org/download/1969_20260311/RIM%20JHIM%20KE%20GEET_.mp3",
        duration: 240,
        labelColor: "#1a3e1a",
      },
      {
        id: "meri-bhigi",
        title: "Meri Bhigi Bhigi Si",
        artist: "Kishore Kumar",
        film: "Anamika",
        year: 1973,
        duration: 255,
        audioUrl:
          "https://archive.org/download/1973_20260316/Meri%20Bhigi%20Bhigi%20Si_.mp3",
        labelColor: "#243060",
      },
      {
        id: "tere-bina",
        title: "Tere Bina Zindagi Se",
        artist: "Lata Mangeshkar, Kishore Kumar",
        film: "Aandhi",
        year: 1975,
        duration: 295,
        audioUrl:
          "https://archive.org/download/1975_20260318/Tere%20Bina%20Zindagi%20Se_.mp3",
        labelColor: "#302050",
      },
      {
        id: "is-mod-se",
        title: "Is Mod Se Jate Hain",
        artist: "Lata Mangeshkar, Kishore Kumar",
        film: "Aandhi",
        year: 1975,
        duration: 280,
        audioUrl:
          "https://archive.org/download/1975_20260318/Is%20Mod%20Se%20Jate%20Hai_.mp3",
        labelColor: "#2a4020",
      },
      {
        id: "mere-naina",
        title: "Mere Naina Sawan Bhadon",
        artist: "Kishore Kumar",
        film: "Mehbooba",
        year: 1976,
        duration: 322,
        audioUrl:
          "https://archive.org/download/mere-naina-sawan-bhadon-male/Mere%20Naina%20Sawan%20Bhadon%20Male%20Mehbooba%20128%20Kbps.mp3",
        labelColor: "#1a3040",
      },
    ],
  },
  {
    id: "late-night-chai",
    name: "Late Night Chai",
    tracks: [
      {
        id: "yeh-shaam-mastani",
        title: "Yeh Shaam Mastani",
        artist: "Kishore Kumar",
        film: "Kati Patang",
        year: 1971,
        duration: 281,
        audioUrl:
          "https://archive.org/download/revival-vol-9-yeh-shaam-mastani-01-10/Revival%20Vol%209-Yeh_Shaam%20Mastani-01%20(10).mp3",
        labelColor: "#3a2a10",
      },
      {
        id: "kuchh-to-log",
        title: "Kuchh To Log Kahenge",
        artist: "Kishore Kumar",
        film: "Amar Prem",
        year: 1972,
        duration: 285,
        audioUrl:
          "https://archive.org/download/tu-chanda-main-cha/Kuchh%20To%20Log%20Kahenge_.mp3",
        labelColor: "#3a1e60",
      },
      {
        id: "chingari",
        title: "Chingari Koi Bhadke",
        artist: "Kishore Kumar",
        film: "Amar Prem",
        year: 1972,
        duration: 295,
        audioUrl:
          "https://archive.org/download/tu-chanda-main-cha/Chingari%20Koi%20Bhadke_.mp3",
        labelColor: "#601a1a",
      },
      {
        id: "ek-pyaar",
        title: "Ek Pyaar Ka Nagma Hai",
        artist: "Lata Mangeshkar, Mukesh",
        film: "Shor",
        year: 1972,
        duration: 270,
        audioUrl:
          "https://archive.org/download/1972_20260315/Ek%20Pyar%20Ka%20Nagma_.mp3",
        labelColor: "#604a10",
      },
      {
        id: "musafir",
        title: "Musafir Hoon Yaaron",
        artist: "Kishore Kumar",
        film: "Parichay",
        year: 1972,
        duration: 260,
        audioUrl:
          "https://archive.org/download/1972_20260315/Musafir%20Hoon%20Yaron_.mp3",
        labelColor: "#0e4a30",
      },
      {
        id: "mere-naina-f",
        title: "Mere Naina Sawan Bhadon",
        artist: "Asha Bhosle",
        film: "Mehbooba",
        year: 1976,
        duration: 310,
        audioUrl:
          "https://archive.org/download/1976_20260319/Mere%20Naina%20Sawan%20-Female_.mp3",
        labelColor: "#4a1040",
      },
    ],
  },
];
