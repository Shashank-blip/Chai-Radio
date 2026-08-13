# Chai Chuska Radio — Design Spec

Date: 2026-08-13
Status: Approved (pending final read-through)

## Summary

A single-page nostalgia music site built with Next.js App Router. Visitors land
on an illustrated Indian street scene (a chai tapri) and can play a curated set
of nostalgic Hindi film songs through a glass-pill music player, styled with
light cassette-deck accents. Playback is powered by the YouTube IFrame Player
API, driving real embedded videos — no audio files, no backend, no database.

## Stack

- Next.js, App Router, TypeScript, `app/` at the project root (no `src/`)
- Tailwind CSS v4 using `@theme` tokens in `app/globals.css` (no tailwind.config)
- Dependencies: `next`, `react`, `react-dom`, `@vercel/analytics`, `@vercel/speed-insights`
- No CSS-in-JS, no component library, no state manager

## Branding

- Site/station name: **Chai Chuska Radio**
- Accent color: amber/mustard, sampled from the tea-stall signage and evening
  light in the background art (approx `#e8a33d` base / `#f2c464` glow — final
  values tuned against the actual images during implementation)
- Assets: `public/bg/scene-wide.png` (landscape), `public/bg/scene-tall.png`
  (portrait, separately composed)

## Page layout — `app/page.tsx` (server component)

`<main>` is `relative flex min-h-dvh flex-1 flex-col items-center justify-between
overflow-hidden`, containing:

1. **Fixed background div**, `-z-20`, class `hero-bg`, `bg-cover bg-center`.
   CSS sets the background to `scene-wide.png`, swapping to `scene-tall.png`
   inside `@media (orientation: portrait)`. Overlaid with
   `bg-gradient-to-b from-black/35 via-transparent to-black/80`.
2. **Fixed grain overlay**, `-z-10`: inline SVG `feTurbulence` data-URI,
   `mix-blend-mode: overlay`, `opacity: 0.3`.
3. **Fixed top row**:
   - Left: `<Clock />` — ticking clock, Asia/Kolkata.
   - Center: station wordmark "Chai Chuska Radio" (small caps, low-opacity
     white text). Replaces a listener-count element from the original brief —
     dropped since there's no backend to source a real number from, and a
     faked one wasn't wanted.
   - Right: social links — Instagram and GitHub icons (inline SVG, no icon
     library).
4. **The player**, bottom-anchored, `max-w-xl`.

All four fixed corners use `max(1rem, env(safe-area-inset-*))` padding; the
`viewport` export sets `viewportFit: "cover"`.

## The player

A floating glass pill on desktop, a stacked card on mobile. Two separate
blocks (`hidden sm:flex` / `sm:hidden`), not one reflowing layout, both
consuming shared state/callbacks from the parent client component.

**Glass recipe** (flat white/10 fill reads as a grey slab, not glass):
```
border border-white/10
bg-gradient-to-b from-white/[0.15] to-white/[0.055]
backdrop-blur-3xl backdrop-saturate-[1.7]
shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]
```

**Cassette-inspired accents** (additive, layered onto the glass recipe above —
not a replacement for it):
- Seek rail gets small tick marks (thin `white/10` verticals every ~5%, a
  slightly heavier tick at the elapsed position) evoking a tape counter.
- Elapsed/duration readout uses `font-variant-numeric: tabular-nums`, a touch
  of letter-spacing, and a dim amber tint — reads like a mechanical counter
  (`0:41 / 5:15`) rather than plain UI text.

### Desktop — one horizontal pill, `rounded-full p-3 pr-5`, left to right:

- **Vinyl**: the actual YouTube iframe, clipped to a circle, 80px,
  `animation: spin 8s linear infinite`, `animationPlayState` driven by
  playback state (`running` when playing, `paused` otherwise). A 12px
  `bg-black/70 ring-2 ring-white/40` circle is absolutely centered on top as
  the spindle hole.
  - **Explicit tradeoff, confirmed with the project owner**: because the
    vinyl slot must show the real, visible YouTube player (see "How the
    music plays" below), the iframe itself spins — its native controls
    rotate along with the video. This is the literal reading of "the cover
    art spins": a genuine spinning record with a small film playing on its
    label, controls readable at 12 o'clock and rotating through the rest of
    the turn. Rejected alternatives: a static iframe with a separate
    decorative spinning ring (doesn't read as "the artwork itself spins");
    hiding the iframe until interaction (violates the no-hidden-player rule
    below, not built).
- Title (15px semibold) and artist (12.5px white/70), both `truncate`.
- Seek bar under them: 24px invisible hit area, 3px visible rail
  (`bg-white/15`), tick marks per above, amber fill with a soft glow, knob
  visible on hover only.
- Elapsed / duration in 10.5px tabular-nums (cassette-counter styling).
- Transport on the right: prev, play/pause, next.

### Mobile — a `rounded-[26px]` card:

- Row 1: 64px vinyl (same spinning-iframe treatment) + title/artist
- Row 2: full-width seek bar
- Row 3: elapsed/duration on the left, transport centered, 44px minimum
  touch targets
- Play button: 52px circle, `bg-gradient-to-b` in the accent color, `ring-1
  ring-white/25`, coloured drop shadow

## How the music plays

No audio files. The YouTube IFrame Player API is loaded and driven directly.

- Each track: `{ id, title, artist, film, year, duration, videoId }`. Adding
  a song is a one-line change to `app/player/tracks.ts`.
- Tracks are grouped into **3 playlists**, same engine, different arrays.
  Switching playlists restarts at track 1.
- **The player is rendered visibly** — the iframe lives in the artwork/vinyl
  slot (see above), never hidden via 1px/opacity-0/off-screen containers.
  This is a hard requirement: hiding it breaks YouTube's Developer Policies
  (no background players, no separating audio from video) and traps
  listeners on unskippable ads, because the Skip button lives inside a
  player they can't see.
- `onStateChange`: PLAYING/PAUSED drive the UI; ENDED advances to the next
  track (wraps to track 1 at the end of a playlist).
- `onError`: fires when a video is deleted or has embedding disabled after
  ship. Auto-advances to the next track and fires an analytics event with
  `{ code, videoId }`. Capped at one full pass through the playlist so a
  fully-broken playlist doesn't infinite-loop.
- Elapsed time is polled via a ~200ms interval calling `player.getCurrentTime()`,
  only while playing.
- Copyright discipline: every track must either be content the site owner has
  the right to use, or a rights holder's own YouTube upload with embedding
  enabled. See "Track sourcing" below for how the current list was vetted.

## Data model

```ts
type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  duration: number; // seconds; initial estimate, corrected by the player once loaded
  videoId: string;
};

type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};
```

## Track sourcing and current playlist

Songs were not picked from memory. Each candidate was searched, then verified
by calling YouTube's oEmbed endpoint
(`https://www.youtube.com/oembed?url=...&format=json`) and checking the
`author_name` field resolves to the actual rights-holder-branded channel
(e.g. "Saregama Music", "Shemaroo Filmi Gaane") rather than a fan reupload,
karaoke channel, or auto-generated "- Topic" channel. Candidates that didn't
clear this bar were rejected even when they looked plausible in search
results.

Confirmed list (5 tracks across 3 playlists):

| Playlist | Track | Artist | Film (Year) | Channel | videoId |
|---|---|---|---|---|---|
| Old is Gold | Lag Ja Gale | Lata Mangeshkar | Woh Kaun Thi (1964) | Saregama Music | `fj4MnkljFXc` |
| Old is Gold | Yeh Shaam Mastani | Kishore Kumar | Kati Patang (1971) | Saregama Music | `Ypyekxaj3gw` |
| Monsoon Mood | O Sajna Barkha Bahar Aayi | Lata Mangeshkar | Parakh (1960) | Shemaroo Filmi Gaane | `v0cN4AXHiW4` |
| Monsoon Mood | Rimjhim Gire Sawan | Lata Mangeshkar | Manzil (1979) | Shemaroo Filmi Gaane | `6C7R_CUJgHQ` |
| Late Night Chai | Mera Kuchh Samaan | Asha Bhosle | Ijaazat (1987) | Saregama Music | `6i9YxZKnQeY` |

This ships as 2/2/1 across the three playlists. Adding more tracks later is a
one-line change per track; the project owner may supply additional
already-vetted YouTube links at any time.

## Styling approach (Tailwind v4)

- `app/globals.css`: `@import "tailwindcss";` then `@theme { --color-accent: ...;
  --color-accent-glow: ...; }` for the amber/mustard tokens.
- `.hero-bg` utility class holds the two `background-image` rules (wide
  default, tall inside `@media (orientation: portrait)`), since a media-query
  background swap isn't expressible via Tailwind arbitrary values alone.
- Grain: inline `data:image/svg+xml` `feTurbulence`, fixed full-bleed div,
  `mix-blend-mode: overlay; opacity: .3`.
- `@keyframes spin` and `@keyframes blink` (clock colon) defined in
  `globals.css`; `animationPlayState` applied via inline `style` since it's
  driven by playback state, not by a static class.

## Components

- `app/page.tsx` — server component; static shell (background, grain, top
  row) + `<Player />`.
- `app/player/Player.tsx` — the only `"use client"` boundary. Owns the
  `usePlayer(playlists)` hook: YouTube IFrame API lifecycle, playback state,
  current playlist/track index, seek dragging.
- `app/player/tracks.ts` — plain data module (`Playlist[]`), per the data
  model above.
- `app/player/DesktopPlayer.tsx` / `app/player/MobilePlayer.tsx` — pure
  presentational, **declared at module scope** (never nested inside `Player`
  — see Gotchas), receiving playback state and callbacks as props.
- `app/clock/Clock.tsx` — client component, ticks every second,
  `Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric",
  minute: "2-digit", hour12: true })`, blinking colon via
  `@keyframes blink { 50% { opacity: 0 } }`.

## Error handling & edge cases

- YT API script fails to load / `window.onYouTubeIframeAPIReady` never fires
  → after a timeout, show an inline "player unavailable, refresh" note
  instead of a dead spinner.
- `onError` codes (2/5/100/101/150 — bad param, HTML5 error, not found, embed
  disallowed) → auto-advance + fire an analytics event with
  `{ code, videoId }`; capped after one full pass so a fully-broken playlist
  doesn't loop forever.
- Single-track playlist: prev/next loop to the same track.
- Seek dragging: `onPointerDown`/`onPointerMove`/`onPointerUp`, `touch-none`
  (so dragging doesn't scroll the page), clamped to `[0, duration]`,
  `player.seekTo()` called on release only.
- Play button is never gated behind a `canplay`-style readiness event — iOS
  Safari won't fire that before a user gesture, which would leave the button
  permanently dead.

## Gotchas (carried from the original brief)

- Sub-components (`DesktopPlayer`, `MobilePlayer`, etc.) are defined at
  module scope, never inside `Player`. Declaring them inside would give them
  a new function identity every render, forcing React to remount the
  subtree — which would restart the vinyl's CSS spin animation from 0deg on
  every ~200ms progress tick.
- No YouTube thumbnails are downloaded or re-hosted onto this domain. The
  visible player displays the artwork itself.
- `next/image` inside a flex column gets stretched by `align-items: stretch`
  — add `self-start` or an explicit width wherever it's used (background
  images here are CSS, not `next/image`, so this mainly applies to any
  future static image use, e.g. social icons if swapped from inline SVG).
- Seeking uses `onPointerDown`, not `onClick`, with `touch-none`.

## Testing / verification

No test framework is implied by this stack. Verification is:
- `npm run build` (typecheck + Next build) must pass clean.
- Manual check by the project owner in a real browser (the owner verifies
  visually; this is not something to automate here). Specific things to
  check: vinyl spin/pause sync with playback state, seek drag on a mobile
  viewport, playlist switch restarting at track 1, orientation-based
  background swap, ENDED auto-advance, and one deliberately-broken videoId
  to confirm the `onError` skip path.

## Dependencies & setup

`npm init` a Next.js 14 App Router + TypeScript + Tailwind v4 project at the
repo root (`app/`, no `src/`), add `@vercel/analytics` and
`@vercel/speed-insights` in `app/layout.tsx`. No `.env` file is needed — the
YouTube IFrame API is a public script and requires no API key for embedded
playback.
