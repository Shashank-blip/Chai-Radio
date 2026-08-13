# Chai Chuska Radio

A nostalgic web radio for old Hindi film songs. Vintage vinyl aesthetic, ambient rain, time-aware atmosphere, and a chai brewing timer — built to feel like a late night listening session.

Live at **[chaichuska](https://chai-radio-ten.vercel.app/)**

---

## What it is

Chai Chuska Radio is a curated music player, not a search engine. It plays a handpicked library of classic Hindi film songs across three playlists, rendered through a retro radio UI inspired by physical vinyl records and old-school tuners.

The app is designed around a single mood: dim the lights, make some chai, let the music run.

---

## Features

### Music Player
- 20 curated old Hindi film songs across three playlists — Old is Gold, Monsoon Mood, Late Night Chai
- HTML5 Audio with a fully imperative player (no React effects on track changes — direct audio element control)
- Animated CSS vinyl record with a unique colored center label per track
- Retro frequency-tuner seek bar with amber needle glow
- Physical button feel on transport controls (press-down shadow animation)
- Responsive layout — separate desktop and mobile player components

### Rain Ambience
- Web Audio pink noise (Paul Kellett algorithm) through a lowpass filter, fades in/out on toggle
- Canvas rain animation with per-drop speed and length variation, synced to an intensity slider
- Smooth background crossfade to a rain scene image when toggled
- Thunder: random lightning flash (double-blink) paired with a procedurally generated boom + rolling rumble via Web Audio

### Time-Aware Atmosphere
- Reads IST time and maps it to one of five periods: morning, afternoon, evening, night, late night
- Each period applies a colored overlay (warm gold to deep indigo) that transitions over 4 seconds
- Period label displayed in the header

### Chai Timer
- Three presets: Phiki (2 min), Normal (4 min), Kadak (6 min)
- SVG circular progress ring
- Completion bell synthesized from three sine wave harmonics (440 / 880 / 1320 Hz)
- Browser notification on completion

### Social
- Generates a 1200x630 PNG card for the currently playing track — vintage postcard design with a canvas-drawn vinyl, song title in serif, artist, film, and year
- Shares via Web Share API (native sheet on mobile) or falls back to direct download

### Listener Count
- Session-based heartbeat to `/api/listeners` every 60 seconds
- In-memory session store with a 2-minute TTL
- Pulsing amber dot with live count shown in the header

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Audio | HTML5 Audio + Web Audio API |
| Animation | Canvas API + CSS |
| Deployment | Vercel |
| Analytics | Vercel Analytics + Speed Insights |

---

## Project Structure

```
app/
  player/          Music player — state hook, vinyl, seek bar, transport, share card
  atmosphere/      Rain audio, canvas animation, time theme, thunder
  chai-timer/      Brewing timer with SVG ring and Web Audio bell
  clock/           Live IST clock
  listeners/       Heartbeat hook and listener count display
  api/listeners/   Route handler — session store, GET count, POST heartbeat

public/bg/         Four background images (wide + tall, clear + rain)
```

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Audio and Web Audio both require a browser that allows autoplay after a user gesture — the rain toggle and play button serve as those gestures.

---

## Architecture Notes

**Audio is fully imperative.** The HTML5 Audio element is created once in a `useEffect` and controlled directly from callbacks — no React state drives track changes or play/pause. This avoids the stale-closure and double-play bugs that come from wiring audio to effects.

**Rain and thunder share one AudioContext.** The context is created on the toggle gesture and closed when rain turns off. Thunder fires into the same context so it respects browser autoplay policy without needing a second user gesture.

**CSS stacking contexts are explicit.** The rain canvas (`z-[3]`) and background (`z-[0]`) are fixed full-bleed layers inside a `z-10` stacking context. Each header column has `relative z-[5]` so their content paints above the rain layers regardless of DOM order.

**Listener count is approximate in production.** The in-memory `Map` is per serverless instance. Swap `sessions` for Vercel KV if you need a cross-instance accurate count.

---

## Playlists

**Old is Gold** — the essentials. Lag Ja Gale, Tere Bina Zindagi, Ek Pyaar Ka Nagma Hai, and five more.

**Monsoon Mood** — rain-day picks. Rimjhim Gire Saawan, Bheegi Bheegi Raaton Mein, and others that belong on a grey afternoon.

**Late Night Chai** — quiet hour songs. Koi Hota Jisko Apna, Dil Dhundta Hai, and a few more for when the city goes quiet.

---

## License

MIT
