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
    id: "new-age-romance",
    name: "New Age Romance",
    tracks: [
      {
        id: "tujhe-dekha-to",
        title: "Tujhe Dekha To",
        artist: "Lata Mangeshkar, Kumar Sanu",
        film: "Dilwale Dulhania Le Jayenge",
        year: 1995,
        duration: 310,
        audioUrl:
          "https://archive.org/download/DilwaleDulhaniaLeJayenge-1995/Dilwale%20Dulhania%20Le%20Jayenge%20-%201995/06%20-%20TUJHE%20DEKHA%20TO.mp3",
        labelColor: "#1a2a3e",
      },
      {
        id: "kal-ho-na-ho",
        title: "Kal Ho Naa Ho",
        artist: "Sonu Nigam",
        film: "Kal Ho Naa Ho",
        year: 2003,
        duration: 295,
        audioUrl:
          "https://archive.org/download/KalHoNaaHo-2003/Kal%20ho%20naa%20ho%20-%202003/04%20-%20Kal_ho_na_ho.mp3",
        labelColor: "#2a1e40",
      },
      {
        id: "kuch-to-hua-hai",
        title: "Kuch To Hua Hai",
        artist: "Shaan, Shreya Ghoshal",
        film: "Kal Ho Naa Ho",
        year: 2003,
        duration: 270,
        audioUrl:
          "https://archive.org/download/KalHoNaaHo-2003/Kal%20ho%20naa%20ho%20-%202003/05%20-%20Kuch_to_hua_hai.mp3",
        labelColor: "#0e2a20",
      },
      {
        id: "jaadu-hai-nasha",
        title: "Jaadu Hai Nasha Hai",
        artist: "Shreya Ghoshal, Shaan",
        film: "Jism",
        year: 2003,
        duration: 285,
        audioUrl:
          "https://archive.org/download/ShreyaGhoshal2003CompleteHindiSongsCollection/021%20Jaadu%20Hai%20Nasha%20Hai%20%28Duet%29.mp3",
        labelColor: "#3e1a20",
      },
      {
        id: "pehli-nazar-mein",
        title: "Pehli Nazar Mein",
        artist: "Atif Aslam",
        film: "Race",
        year: 2008,
        duration: 300,
        audioUrl:
          "https://archive.org/download/songs.pkatifyourstruly08rangjolagyo/%5BSongs.PK%5D%20Atif%20Yours%20Truly%20-%2013%20-%20Pehli%20Nazar%20Mein.mp3",
        labelColor: "#1e3020",
      },
      {
        id: "phir-mohabbat",
        title: "Phir Mohabbat",
        artist: "Mohit Chauhan",
        film: "Murder 2",
        year: 2011,
        duration: 320,
        audioUrl:
          "https://archive.org/download/phirmohabbatmurder2320kbps/Phir%20Mohabbat%20-%20Murder%202%20320Kbps.mp3",
        labelColor: "#2e2040",
      },
      {
        id: "raabta",
        title: "Raabta",
        artist: "Shreya Ghoshal",
        film: "Agent Vinod",
        year: 2012,
        duration: 295,
        audioUrl:
          "https://archive.org/download/RaabtaKehteHainKhudaNebestwap.in/Raabta_%28Kehte_Hain_Khuda_Ne%29_%28bestwap.in%29.mp3",
        labelColor: "#401e10",
      },
      {
        id: "channa-mereya",
        title: "Channa Mereya",
        artist: "Arijit Singh",
        film: "Ae Dil Hai Mushkil",
        year: 2016,
        duration: 280,
        audioUrl:
          "https://archive.org/download/AeDilHaiMushkil-2016/Ae%20Dil%20Hai%20Mushkil%20-%202016/03%20-%20Channa%20Mereya.mp3",
        labelColor: "#0e1e30",
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
          "https://archive.org/download/RajeshKhannaHitSongsCollectionTop25BollywoodOldSuperhitsEvergreenHindiSongsJukebox_201709/KumarKishore/Ye%20Shaam%20Mastani%20-%20Rajesh%20Khanna%20%20Asha%20Parekh%20-%20Kati%20Patang.mp3",
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
