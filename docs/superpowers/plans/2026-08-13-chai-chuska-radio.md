# Chai Chuska Radio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single-page Chai Chuska Radio nostalgia music site: an illustrated chai-tapri background, a clock/wordmark/socials top row, and a YouTube-IFrame-API-driven glass-pill music player with cassette-inspired accents.

**Architecture:** Next.js App Router, `app/` at repo root, no `src/`. `app/page.tsx` is a server component rendering the static shell (background, grain, top row) plus one client component, `<Player />`, which owns all YouTube IFrame API state via a `usePlayer` hook. A single always-mounted vinyl/iframe element is repositioned (never duplicated, never hidden) to track whichever of the two responsive player layouts — a desktop pill or a mobile card — is currently visible, using `getBoundingClientRect` + `ResizeObserver` rather than conditional mounting, so the real embedded video is never in a `display:none` ancestor.

**Tech Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS v4 via `@theme` (no `tailwind.config`), `@vercel/analytics`, `@vercel/speed-insights`, the public YouTube IFrame Player API (no key, no SDK package).

## Global Constraints

- `app/` lives at the project root — no `src/` directory.
- Tailwind v4 is configured via `@theme` tokens in `app/globals.css` — no `tailwind.config.js`/`.ts` file is created.
- Dependencies are exactly: `next`, `react`, `react-dom`, `@vercel/analytics`, `@vercel/speed-insights` (runtime) plus `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss` (dev). No state manager, no component library, no CSS-in-JS, no test framework, no `@types/youtube`.
- **Testing deviation (explicit, from the design spec):** this stack has no test framework. Verification is `npm run build` (typecheck + build) after every task, plus — where noted — a manual browser check. Pure helper functions include a worked example in a comment instead of an automated test; the "Run test / verify it fails / verify it passes" step shape from the writing-plans template is replaced with "Run build / verify it passes" throughout this plan.
- **No git commits during implementation.** The project owner explicitly asked to skip commits until the full build is working end-to-end. Every task therefore ends with a build/verification step, never a `git commit` step. Committing is left to the owner's discretion once everything is done.
- No audio files. All playback goes through the YouTube IFrame Player API.
- The video player is always visibly rendered (never in a `display:none`/1px/opacity-0/off-screen container) — see Architecture above for how this is achieved across the two responsive layouts.
- Sub-components are declared at module scope, never nested inside another component's function body.
- Cover art / video is never downloaded or re-hosted onto this domain.
- Seeking uses `onPointerDown`/`onPointerMove`/`onPointerUp` with `touch-none`, not `onClick`.
- The play button is never gated behind a `canplay`-style readiness event.
- Only the 5 YouTube-verified tracks from the design spec are used (see Task 4) — no additional songs are invented.
- Social link URLs are left as empty-string constants the project owner will fill in themselves (`app/social-links.tsx`) — the component simply renders no icon for an empty URL, which is a deliberate, working default, not a stub.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`

**Interfaces:**
- Produces: a building Next.js app at the repo root with Tailwind v4 wired in and `app/globals.css` importable from `app/layout.tsx`. Later tasks add real content to `app/page.tsx` and extend `app/globals.css`; this task only needs a page that renders successfully.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "chai-chuska-radio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@vercel/analytics": "^1.3.1",
    "@vercel/speed-insights": "^1.0.12"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 5: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

- [ ] **Step 6: Create `.gitignore`**

```
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
```

- [ ] **Step 7: Create `app/globals.css` (minimal — extended in Task 2)**

```css
@import "tailwindcss";

@theme {
  --color-accent: #e8a33d;
  --color-accent-glow: #f2c464;
}

html,
body {
  height: 100%;
  background-color: #0b0906;
}
```

- [ ] **Step 8: Create `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chai Chuska Radio",
  description: "A nostalgia radio station for old Hindi film songs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0906] text-white antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Create a placeholder `app/page.tsx`**

```tsx
export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <p className="text-white/70">Chai Chuska Radio — coming up.</p>
    </main>
  );
}
```

- [ ] **Step 10: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 11: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully` and a static/prerendered `/` route in the output summary, no type errors.

---

### Task 2: Background, grain overlay, and page shell

**Files:**
- Create: `public/bg/scene-wide.png`
- Create: `public/bg/scene-tall.png`
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `.hero-bg` and `.grain-overlay` CSS classes; the `<main>` shell structure later tasks add the top row and player into.

- [ ] **Step 1: Copy the background assets into `public/bg/`**

Run:
```bash
mkdir -p public/bg
cp assests/scene-wide.png public/bg/scene-wide.png
cp assests/scene-tall.png public/bg/scene-tall.png
```
Expected: `public/bg/scene-wide.png` and `public/bg/scene-tall.png` exist (note the source folder is `assests/`, not `assets/` — that's the actual directory name in this repo).

- [ ] **Step 2: Extend `app/globals.css` with the background and grain classes**

Add to `app/globals.css` (after the existing `@theme` block):

```css
.hero-bg {
  background-image: url("/bg/scene-wide.png");
}

@media (orientation: portrait) {
  .hero-bg {
    background-image: url("/bg/scene-tall.png");
  }
}

.grain-overlay {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
```

- [ ] **Step 3: Rewrite `app/page.tsx` with the full shell (no top row/player content yet)**

```tsx
export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <div className="hero-bg fixed inset-0 -z-20 bg-cover bg-center">
        <div className="h-full w-full bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>
      <div
        className="grain-overlay fixed inset-0 -z-10"
        style={{ mixBlendMode: "overlay", opacity: 0.3 }}
      />
    </main>
  );
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: the chai-tapri street scene fills the viewport with a subtle dark gradient (heavier at the bottom) and a faint film-grain texture over it. Resizing the window to a portrait aspect ratio (or using a narrow/tall mobile emulation) swaps to `scene-tall.png`.

---

### Task 3: Top row — clock, wordmark, social links

**Files:**
- Create: `app/clock/Clock.tsx`
- Create: `app/social-links.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `Clock` (default-less named export, no props) and `SocialLinks` (named export, no props), both renderable directly inside `app/page.tsx`.

- [ ] **Step 1: Create `app/clock/Clock.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    // Renders the same on the server and on first client paint (avoids a
    // hydration mismatch from server/client clock or timezone differences),
    // then fills in real time once mounted.
    return <span className="text-sm text-white/70">&nbsp;</span>;
  }

  const parts = formatter.formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value ?? "";

  return (
    <span className="text-sm font-medium tabular-nums text-white/80">
      {hour}
      <span style={{ animation: "blink 1s step-start infinite" }}>:</span>
      {minute} {dayPeriod}
    </span>
  );
}
```

- [ ] **Step 2: Create `app/social-links.tsx`**

```tsx
// Fill these in with real profile URLs — an empty string simply omits that
// icon, so the row degrades gracefully until they're set.
const INSTAGRAM_URL = "";
const GITHUB_URL = "";

export function SocialLinks() {
  const links = [
    { url: INSTAGRAM_URL, label: "Instagram", icon: <InstagramIcon /> },
    { url: GITHUB_URL, label: "GitHub", icon: <GithubIcon /> },
  ].filter((link) => link.url.length > 0);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-3 text-white/70">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
          className="transition-colors hover:text-white"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-[18px] w-[18px]"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.01 10.01 0 0 0 22 12.19C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
```

- [ ] **Step 3: Wire the top row into `app/page.tsx`**

Replace the contents of `app/page.tsx` with:

```tsx
import { Clock } from "./clock/Clock";
import { SocialLinks } from "./social-links";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <div className="hero-bg fixed inset-0 -z-20 bg-cover bg-center">
        <div className="h-full w-full bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>
      <div
        className="grain-overlay fixed inset-0 -z-10"
        style={{ mixBlendMode: "overlay", opacity: 0.3 }}
      />

      <div className="grid w-full grid-cols-3 items-start px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="justify-self-start">
          <Clock />
        </div>
        <p className="justify-self-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
          Chai Chuska Radio
        </p>
        <div className="justify-self-end">
          <SocialLinks />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: top-left shows a ticking clock in `h:mm AM/PM` IST with a blinking colon; top-center shows "CHAI CHUSKA RADIO" in small caps; top-right is empty (both social URLs are still blank, so nothing renders there — expected until real URLs are added).

---

### Task 4: Player data layer

**Files:**
- Create: `app/player/constants.ts`
- Create: `app/player/types.ts`
- Create: `app/player/tracks.ts`
- Create: `app/player/format.ts`

**Interfaces:**
- Produces:
  - `YT_PLAYER_CONTAINER_ID: string` (`constants.ts`)
  - `type Track`, `type Playlist` (`types.ts`)
  - `playlists: Playlist[]` (`tracks.ts`)
  - `formatTime(totalSeconds: number): string`, `clamp(value: number, min: number, max: number): number`, `nextTrackIndex(currentIndex: number, trackCount: number): number`, `prevTrackIndex(currentIndex: number, trackCount: number): number` (`format.ts`)
- Consumed by every player task from here on.

- [ ] **Step 1: Create `app/player/constants.ts`**

```ts
// Shared between use-player.ts (which constructs the YT.Player against this
// id) and Vinyl.tsx (which renders the target element). Must stay in sync.
export const YT_PLAYER_CONTAINER_ID = "chai-chuska-yt-player";
```

- [ ] **Step 2: Create `app/player/types.ts`**

```ts
export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  /** Seconds. Initial estimate shown before the player reports the real duration. */
  duration: number;
  videoId: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};
```

- [ ] **Step 3: Create `app/player/tracks.ts`**

```ts
import type { Playlist } from "./types";

// Every track below was verified via YouTube's oEmbed endpoint
// (https://www.youtube.com/oembed?url=...&format=json) to resolve to the
// rights holder's own branded channel (Saregama Music / Shemaroo Filmi
// Gaane), not a fan reupload or auto-generated channel. See
// docs/superpowers/specs/2026-08-13-chai-chuska-radio-design.md for the
// full sourcing method. Adding another already-vetted track is a one-line
// addition to the relevant playlist's `tracks` array.
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
        duration: 243,
        videoId: "fj4MnkljFXc",
      },
      {
        id: "yeh-shaam-mastani",
        title: "Yeh Shaam Mastani",
        artist: "Kishore Kumar",
        film: "Kati Patang",
        year: 1971,
        duration: 281,
        videoId: "Ypyekxaj3gw",
      },
    ],
  },
  {
    id: "monsoon-mood",
    name: "Monsoon Mood",
    tracks: [
      {
        id: "o-sajna-barkha-bahar-aayi",
        title: "O Sajna Barkha Bahar Aayi",
        artist: "Lata Mangeshkar",
        film: "Parakh",
        year: 1960,
        duration: 273,
        videoId: "v0cN4AXHiW4",
      },
      {
        id: "rimjhim-gire-sawan",
        title: "Rimjhim Gire Sawan",
        artist: "Lata Mangeshkar",
        film: "Manzil",
        year: 1979,
        duration: 330,
        videoId: "6C7R_CUJgHQ",
      },
    ],
  },
  {
    id: "late-night-chai",
    name: "Late Night Chai",
    tracks: [
      {
        id: "mera-kuchh-samaan",
        title: "Mera Kuchh Samaan",
        artist: "Asha Bhosle",
        film: "Ijaazat",
        year: 1987,
        duration: 320,
        videoId: "6i9YxZKnQeY",
      },
    ],
  },
];
```

- [ ] **Step 4: Create `app/player/format.ts`**

```ts
/**
 * Formats a duration in seconds as `m:ss`.
 * formatTime(65) -> "1:05"
 * formatTime(0)  -> "0:00"
 * formatTime(-1) -> "0:00"
 */
export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * clamp(5, 0, 10) -> 5
 * clamp(-5, 0, 10) -> 0
 * clamp(15, 0, 10) -> 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * nextTrackIndex(0, 3) -> 1
 * nextTrackIndex(2, 3) -> 0  (wraps)
 */
export function nextTrackIndex(currentIndex: number, trackCount: number): number {
  if (trackCount <= 0) return 0;
  return (currentIndex + 1) % trackCount;
}

/**
 * prevTrackIndex(1, 3) -> 0
 * prevTrackIndex(0, 3) -> 2  (wraps)
 */
export function prevTrackIndex(currentIndex: number, trackCount: number): number {
  if (trackCount <= 0) return 0;
  return (currentIndex - 1 + trackCount) % trackCount;
}
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors. (These modules aren't imported anywhere yet, so this mainly confirms they're syntactically and structurally valid TypeScript — later tasks exercise them at runtime.)

---

### Task 5: YouTube IFrame API loader and media query hook

**Files:**
- Create: `app/player/youtube-api.ts`
- Create: `app/player/use-media-query.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `loadYouTubeIframeAPI(): Promise<YTNamespace>`, plus the exported types `YTPlayer`, `YTNamespace`, `YTPlayerEvent` (`youtube-api.ts`)
  - `useMediaQuery(query: string): boolean` (`use-media-query.ts`)

- [ ] **Step 1: Create `app/player/youtube-api.ts`**

```ts
// Minimal ambient typing for the subset of the YouTube IFrame Player API
// this app uses. There's no @types/youtube dependency in this project, so
// these types are hand-rolled and intentionally narrow.

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  loadVideoById(videoId: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

export interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

export interface YTNamespace {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
        onError?: (event: YTPlayerEvent) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let loadPromise: Promise<YTNamespace> | null = null;

export function loadYouTubeIframeAPI(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadYouTubeIframeAPI called on the server"));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as YTNamespace);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return loadPromise;
}
```

- [ ] **Step 2: Create `app/player/use-media-query.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors.

---

### Task 6: `usePlayer` hook — the playback engine

**Files:**
- Create: `app/player/use-player.ts`

**Interfaces:**
- Consumes: `Playlist`, `Track` (`./types`), `YT_PLAYER_CONTAINER_ID` (`./constants`), `loadYouTubeIframeAPI`, `YTPlayer`, `YTNamespace` (`./youtube-api`), `clamp`, `nextTrackIndex`, `prevTrackIndex` (`./format`).
- Produces: `usePlayer(playlists: Playlist[]): UsePlayerResult`, and the exported types `PlaybackStatus`, `PlayerControls`, `UsePlayerResult`, consumed by `DesktopPlayer`, `MobilePlayer`, and `Player`.

- [ ] **Step 1: Create `app/player/use-player.ts`**

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { YT_PLAYER_CONTAINER_ID } from "./constants";
import { clamp, nextTrackIndex, prevTrackIndex } from "./format";
import type { Playlist, Track } from "./types";
import { loadYouTubeIframeAPI, type YTNamespace, type YTPlayer } from "./youtube-api";

export type PlaybackStatus = "idle" | "playing" | "paused";

export type PlayerControls = {
  playPause: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  selectPlaylist: (playlistIndex: number) => void;
};

export type UsePlayerResult = {
  playlists: Playlist[];
  playlistIndex: number;
  trackIndex: number;
  currentPlaylist: Playlist;
  currentTrack: Track;
  status: PlaybackStatus;
  elapsed: number;
  duration: number;
  unavailable: boolean;
  controls: PlayerControls;
};

const READY_TIMEOUT_MS = 10000;
const ELAPSED_POLL_MS = 200;

function trackPlaybackError(code: number, videoId: string) {
  if (typeof window === "undefined") return;
  const analytics = (window as unknown as { va?: (...args: unknown[]) => void }).va;
  analytics?.("event", "youtube_playback_error", { code, videoId });
}

export function usePlayer(playlists: Playlist[]): UsePlayerResult {
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unavailable, setUnavailable] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const erroredVideoIdsRef = useRef<Set<string>>(new Set());

  // Lets long-lived callbacks (registered once, at mount) read the latest
  // playlist/track without being recreated every render.
  const stateRef = useRef({ playlistIndex, trackIndex, playlists });
  useEffect(() => {
    stateRef.current = { playlistIndex, trackIndex, playlists };
  }, [playlistIndex, trackIndex, playlists]);

  const advance = useCallback(() => {
    const current = stateRef.current;
    const trackCount = current.playlists[current.playlistIndex].tracks.length;
    setTrackIndex(nextTrackIndex(current.trackIndex, trackCount));
  }, []);

  // Create the YT.Player exactly once. Track/playlist changes after this are
  // driven imperatively (see the loadVideoById effect below) so the player
  // — and the visible iframe it owns — is never destroyed and recreated on
  // every track change.
  useEffect(() => {
    let cancelled = false;
    let readyTimeout: ReturnType<typeof setTimeout> | null = setTimeout(
      () => setUnavailable(true),
      READY_TIMEOUT_MS,
    );

    loadYouTubeIframeAPI()
      .then((YT: YTNamespace) => {
        if (cancelled) return;
        const initial = stateRef.current;
        const initialTrack = initial.playlists[initial.playlistIndex].tracks[initial.trackIndex];

        playerRef.current = new YT.Player(YT_PLAYER_CONTAINER_ID, {
          videoId: initialTrack.videoId,
          width: "100%",
          height: "100%",
          playerVars: { playsinline: 1, rel: 0 },
          events: {
            onReady: () => {
              readyRef.current = true;
              if (readyTimeout) {
                clearTimeout(readyTimeout);
                readyTimeout = null;
              }
              setDuration(playerRef.current?.getDuration() || initialTrack.duration);
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                setStatus("playing");
                setDuration(playerRef.current?.getDuration() || 0);
              } else if (event.data === YT.PlayerState.PAUSED) {
                setStatus("paused");
              } else if (event.data === YT.PlayerState.ENDED) {
                advance();
              }
            },
            onError: (event) => {
              const current = stateRef.current;
              const track = current.playlists[current.playlistIndex].tracks[current.trackIndex];
              erroredVideoIdsRef.current.add(track.videoId);
              trackPlaybackError(event.data, track.videoId);

              const trackCount = current.playlists[current.playlistIndex].tracks.length;
              if (erroredVideoIdsRef.current.size < trackCount) {
                advance();
              } else {
                // Every track in this playlist has now errored in this
                // session — stop auto-skipping instead of looping forever.
                setUnavailable(true);
              }
            },
          },
        });
      })
      .catch(() => setUnavailable(true));

    return () => {
      cancelled = true;
      if (readyTimeout) clearTimeout(readyTimeout);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advance]);

  // Load the newly selected track whenever playlistIndex/trackIndex change
  // (after the player exists). loadVideoById autoplays by default, matching
  // "switching playlist restarts at track 1" and ENDED/onError auto-advance.
  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    const track = playlists[playlistIndex].tracks[trackIndex];
    playerRef.current.loadVideoById(track.videoId);
    setElapsed(0);
    setDuration(track.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistIndex, trackIndex]);

  // Poll elapsed time only while playing.
  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => {
      const current = playerRef.current?.getCurrentTime();
      if (typeof current === "number") setElapsed(current);
    }, ELAPSED_POLL_MS);
    return () => clearInterval(interval);
  }, [status]);

  const playPause = useCallback(() => {
    if (!playerRef.current) return;
    if (status === "playing") {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [status]);

  const next = useCallback(() => {
    const trackCount = playlists[playlistIndex].tracks.length;
    setTrackIndex((index) => nextTrackIndex(index, trackCount));
  }, [playlists, playlistIndex]);

  const prev = useCallback(() => {
    const trackCount = playlists[playlistIndex].tracks.length;
    setTrackIndex((index) => prevTrackIndex(index, trackCount));
  }, [playlists, playlistIndex]);

  const seek = useCallback(
    (seconds: number) => {
      if (!playerRef.current) return;
      const target = clamp(seconds, 0, duration || Number.MAX_SAFE_INTEGER);
      playerRef.current.seekTo(target, true);
      setElapsed(target);
    },
    [duration],
  );

  const selectPlaylist = useCallback((newPlaylistIndex: number) => {
    erroredVideoIdsRef.current = new Set();
    setPlaylistIndex(newPlaylistIndex);
    setTrackIndex(0);
  }, []);

  return {
    playlists,
    playlistIndex,
    trackIndex,
    currentPlaylist: playlists[playlistIndex],
    currentTrack: playlists[playlistIndex].tracks[trackIndex],
    status,
    elapsed,
    duration,
    unavailable,
    controls: { playPause, next, prev, seek, selectPlaylist },
  };
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors. `usePlayer` isn't called anywhere yet, so this checks the module compiles standalone.

---

### Task 7: Vinyl component (the shared, always-mounted video element)

**Files:**
- Create: `app/player/Vinyl.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `YT_PLAYER_CONTAINER_ID` (`./constants`).
- Produces: `Vinyl({ spinning: boolean })`, a component that fills its parent (`h-full w-full`) — sizing and positioning are the parent's responsibility (handled in Task 10).

- [ ] **Step 1: Create `app/player/Vinyl.tsx`**

```tsx
import { YT_PLAYER_CONTAINER_ID } from "./constants";

type VinylProps = {
  spinning: boolean;
};

export function Vinyl({ spinning }: VinylProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-full"
      style={{
        animation: "spin 8s linear infinite",
        animationPlayState: spinning ? "running" : "paused",
      }}
    >
      {/* The YouTube IFrame API replaces this div's contents with an
          <iframe> once the player is constructed (see use-player.ts). The
          rotation above is applied to this wrapper, not the div itself, so
          it keeps spinning the iframe after the API takes it over. */}
      <div id={YT_PLAYER_CONTAINER_ID} className="h-full w-full" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
    </div>
  );
}
```

- [ ] **Step 2: Add iframe-fill CSS to `app/globals.css`**

Add after the `.grain-overlay` rule:

```css
/* The YouTube API's generated iframe doesn't inherit Tailwind classes, so
   this targets it directly by the container id it replaces. */
#chai-chuska-yt-player iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors. `Vinyl` isn't rendered anywhere yet.

---

### Task 8: Shared player controls — seek bar, transport, playlist switcher

**Files:**
- Create: `app/player/SeekBar.tsx`
- Create: `app/player/TransportControls.tsx`
- Create: `app/player/PlaylistSwitcher.tsx`

**Interfaces:**
- Consumes: `clamp` (`./format`).
- Produces:
  - `SeekBar({ elapsed: number, duration: number, onSeek: (seconds: number) => void, className?: string })`
  - `TransportControls({ status: PlaybackStatus, onPrev: () => void, onPlayPause: () => void, onNext: () => void, size: "desktop" | "mobile" })`
  - `PlaylistSwitcher({ playlists: { id: string; name: string }[], activeIndex: number, onSelect: (index: number) => void })`

- [ ] **Step 1: Create `app/player/SeekBar.tsx`**

```tsx
"use client";

import { useRef, useState, type PointerEvent } from "react";
import { clamp } from "./format";

type SeekBarProps = {
  elapsed: number;
  duration: number;
  onSeek: (seconds: number) => void;
  className?: string;
};

const TICK_COUNT = 20;

export function SeekBar({ elapsed, duration, onSeek, className }: SeekBarProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const safeDuration = duration > 0 ? duration : 1;
  const displayValue = dragValue ?? elapsed;
  const progress = clamp(displayValue / safeDuration, 0, 1);

  function valueFromPointer(clientX: number): number {
    const rail = railRef.current;
    if (!rail) return elapsed;
    const rect = rail.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * safeDuration;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragValue(valueFromPointer(event.clientX));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragValue === null) return;
    setDragValue(valueFromPointer(event.clientX));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragValue === null) return;
    onSeek(dragValue);
    setDragValue(null);
  }

  return (
    <div
      ref={railRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`group relative flex h-6 touch-none items-center ${className ?? ""}`}
    >
      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]"
          style={{ width: `${progress * 100}%` }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-px">
          {Array.from({ length: TICK_COUNT }).map((_, index) => (
            <span key={index} className="h-2 w-px bg-white/10" />
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create `app/player/TransportControls.tsx`**

```tsx
import type { PlaybackStatus } from "./use-player";

type TransportControlsProps = {
  status: PlaybackStatus;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  size: "desktop" | "mobile";
};

export function TransportControls({ status, onPrev, onPlayPause, onNext, size }: TransportControlsProps) {
  const isPlaying = status === "playing";
  const playButtonClass =
    size === "mobile"
      ? "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-glow ring-1 ring-white/25 shadow-[0_8px_20px_-4px_var(--color-accent-glow)]"
      : "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-glow ring-1 ring-white/25";
  const sideButtonClass =
    size === "mobile"
      ? "flex h-11 w-11 items-center justify-center text-white/80"
      : "flex h-8 w-8 items-center justify-center text-white/80";

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onPrev} aria-label="Previous track" className={sideButtonClass}>
        <PrevIcon />
      </button>
      <button
        type="button"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={playButtonClass}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button type="button" onClick={onNext} aria-label="Next track" className={sideButtonClass}>
        <NextIcon />
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-black">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-black">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M6 6h2v12H6zM20 6l-10 6 10 6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16 6h2v12h-2zM4 6l10 6-10 6z" />
    </svg>
  );
}
```

- [ ] **Step 3: Create `app/player/PlaylistSwitcher.tsx`**

```tsx
type PlaylistSwitcherProps = {
  playlists: { id: string; name: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function PlaylistSwitcher({ playlists, activeIndex, onSelect }: PlaylistSwitcherProps) {
  return (
    <div className="mb-3 flex gap-2">
      {playlists.map((playlist, index) => (
        <button
          key={playlist.id}
          type="button"
          onClick={() => onSelect(index)}
          className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-colors ${
            index === activeIndex
              ? "border-accent/60 bg-accent/20 text-white"
              : "border-white/10 bg-white/5 text-white/60 hover:text-white/90"
          }`}
        >
          {playlist.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors.

---

### Task 9: Desktop and mobile player layouts

**Files:**
- Create: `app/player/DesktopPlayer.tsx`
- Create: `app/player/MobilePlayer.tsx`

**Interfaces:**
- Consumes: `UsePlayerResult` (`./use-player`), `formatTime` (`./format`), `SeekBar` (`./SeekBar`), `TransportControls` (`./TransportControls`).
- Produces: `DesktopPlayer({ player: UsePlayerResult, vinylSlotRef: RefObject<HTMLDivElement> })`, `MobilePlayer({ player: UsePlayerResult, vinylSlotRef: RefObject<HTMLDivElement> })`. `vinylSlotRef` is an empty placeholder div these components size and position — Task 10 measures it and positions the real `<Vinyl>` on top of it.

- [ ] **Step 1: Create `app/player/DesktopPlayer.tsx`**

```tsx
import type { RefObject } from "react";
import { formatTime } from "./format";
import { SeekBar } from "./SeekBar";
import { TransportControls } from "./TransportControls";
import type { UsePlayerResult } from "./use-player";

type DesktopPlayerProps = {
  player: UsePlayerResult;
  vinylSlotRef: RefObject<HTMLDivElement>;
};

export function DesktopPlayer({ player, vinylSlotRef }: DesktopPlayerProps) {
  const { currentTrack, status, elapsed, duration, controls } = player;

  return (
    <div className="hidden w-full items-center gap-4 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.15] to-white/[0.055] p-3 pr-5 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-3xl backdrop-saturate-[1.7] sm:flex">
      <div ref={vinylSlotRef} className="h-20 w-20 shrink-0 self-start" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-white">{currentTrack.title}</p>
        <p className="truncate text-[12.5px] text-white/70">{currentTrack.artist}</p>
        <SeekBar elapsed={elapsed} duration={duration} onSeek={controls.seek} className="mt-1" />
        <div className="mt-0.5 flex justify-between text-[10.5px] tracking-wide text-accent/80 tabular-nums">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <TransportControls
        status={status}
        onPrev={controls.prev}
        onPlayPause={controls.playPause}
        onNext={controls.next}
        size="desktop"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create `app/player/MobilePlayer.tsx`**

```tsx
import type { RefObject } from "react";
import { formatTime } from "./format";
import { SeekBar } from "./SeekBar";
import { TransportControls } from "./TransportControls";
import type { UsePlayerResult } from "./use-player";

type MobilePlayerProps = {
  player: UsePlayerResult;
  vinylSlotRef: RefObject<HTMLDivElement>;
};

export function MobilePlayer({ player, vinylSlotRef }: MobilePlayerProps) {
  const { currentTrack, status, elapsed, duration, controls } = player;

  return (
    <div className="flex w-full flex-col gap-3 rounded-[26px] border border-white/10 bg-gradient-to-b from-white/[0.15] to-white/[0.055] p-4 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-3xl backdrop-saturate-[1.7] sm:hidden">
      <div className="flex items-center gap-3">
        <div ref={vinylSlotRef} className="h-16 w-16 shrink-0 self-start" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-white">{currentTrack.title}</p>
          <p className="truncate text-[12.5px] text-white/70">{currentTrack.artist}</p>
        </div>
      </div>

      <SeekBar elapsed={elapsed} duration={duration} onSeek={controls.seek} />

      <div className="flex items-center justify-between">
        <span className="text-[10.5px] tracking-wide text-accent/80 tabular-nums">
          {formatTime(elapsed)} / {formatTime(duration)}
        </span>
        <TransportControls
          status={status}
          onPrev={controls.prev}
          onPlayPause={controls.playPause}
          onNext={controls.next}
          size="mobile"
        />
        <span className="w-[52px]" aria-hidden />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors.

---

### Task 10: `Player` orchestrator — wiring it all together

**Files:**
- Create: `app/player/Player.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `playlists` (`./tracks`), `usePlayer` (`./use-player`), `useMediaQuery` (`./use-media-query`), `Vinyl` (`./Vinyl`), `DesktopPlayer` (`./DesktopPlayer`), `MobilePlayer` (`./MobilePlayer`), `PlaylistSwitcher` (`./PlaylistSwitcher`).
- Produces: `Player()` — the only `"use client"` boundary in the tree, imported directly into `app/page.tsx`.

- [ ] **Step 1: Create `app/player/Player.tsx`**

```tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import { DesktopPlayer } from "./DesktopPlayer";
import { MobilePlayer } from "./MobilePlayer";
import { PlaylistSwitcher } from "./PlaylistSwitcher";
import { playlists } from "./tracks";
import { useMediaQuery } from "./use-media-query";
import { usePlayer } from "./use-player";
import { Vinyl } from "./Vinyl";

export function Player() {
  const player = usePlayer(playlists);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const desktopSlotRef = useRef<HTMLDivElement>(null);
  const mobileSlotRef = useRef<HTMLDivElement>(null);
  const vinylWrapperRef = useRef<HTMLDivElement>(null);

  // The vinyl/iframe is rendered exactly once, unconditionally, in a fixed
  // wrapper below. Rather than mounting it inside whichever of
  // DesktopPlayer/MobilePlayer is visible (which would mean creating two
  // players, or hiding one behind `display:none` — both against the "never
  // hidden" requirement), this measures whichever placeholder slot is
  // currently visible and moves the single real wrapper to sit exactly on
  // top of it. The video itself is never duplicated and never hidden.
  useLayoutEffect(() => {
    const activeSlot = isDesktop ? desktopSlotRef.current : mobileSlotRef.current;
    const wrapper = vinylWrapperRef.current;
    if (!activeSlot || !wrapper) return;

    function sync() {
      const rect = activeSlot!.getBoundingClientRect();
      wrapper!.style.top = `${rect.top}px`;
      wrapper!.style.left = `${rect.left}px`;
      wrapper!.style.width = `${rect.width}px`;
      wrapper!.style.height = `${rect.height}px`;
    }

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(activeSlot);
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [isDesktop]);

  if (player.unavailable) {
    return (
      <div className="w-full rounded-full border border-white/10 bg-black/60 px-5 py-3 text-center text-sm text-white/70">
        Player unavailable — refresh to try again.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={vinylWrapperRef}
        className="pointer-events-none fixed z-10"
        style={{ top: 0, left: 0, width: 0, height: 0 }}
      >
        <div className="pointer-events-auto h-full w-full">
          <Vinyl spinning={player.status === "playing"} />
        </div>
      </div>

      <PlaylistSwitcher
        playlists={player.playlists}
        activeIndex={player.playlistIndex}
        onSelect={player.controls.selectPlaylist}
      />
      <DesktopPlayer player={player} vinylSlotRef={desktopSlotRef} />
      <MobilePlayer player={player} vinylSlotRef={mobileSlotRef} />
    </div>
  );
}
```

- [ ] **Step 2: Wire `<Player />` into `app/page.tsx`**

Replace the contents of `app/page.tsx` with:

```tsx
import { Clock } from "./clock/Clock";
import { Player } from "./player/Player";
import { SocialLinks } from "./social-links";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <div className="hero-bg fixed inset-0 -z-20 bg-cover bg-center">
        <div className="h-full w-full bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>
      <div
        className="grain-overlay fixed inset-0 -z-10"
        style={{ mixBlendMode: "overlay", opacity: 0.3 }}
      />

      <div className="grid w-full grid-cols-3 items-start px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="justify-self-start">
          <Clock />
        </div>
        <p className="justify-self-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
          Chai Chuska Radio
        </p>
        <div className="justify-self-end">
          <SocialLinks />
        </div>
      </div>

      <div className="w-full max-w-xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Player />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type errors.

---

### Task 11: Final manual verification

**Files:** none (verification only).

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`, open `http://localhost:3000` in a real browser (this step is for the project owner to perform, per their standing preference — not to be automated or screenshotted here).

- [ ] **Step 2: Walk through this checklist**

- The vinyl shows real, playing YouTube video content (not a static thumbnail), clipped to a circle, with a small dark spindle-hole circle centered on top.
- Pressing play starts the vinyl spinning; pressing pause stops it without resetting rotation to 0deg (confirms sub-components stayed at module scope and didn't remount — see Global Constraints).
- Dragging the seek bar (mouse and touch) moves playback and doesn't scroll the page.
- Letting a track play to the end auto-advances to the next track in the playlist, wrapping to track 1 after the last track.
- Clicking a different playlist pill switches playlists and restarts at track 1.
- Resizing the browser across the 640px breakpoint moves the single vinyl smoothly between the desktop pill and the mobile card layouts without restarting the video or ever showing a blank/hidden player.
- Temporarily changing one `videoId` in `app/player/tracks.ts` to an invalid string (e.g. `"invalid000"`), reloading, and confirming playback auto-skips to the next track instead of getting stuck — then reverting the change.
- Rotating a mobile viewport (or narrowing/heightening the browser window) between landscape and portrait swaps the background image.
- The clock in the top-left ticks once a second with a blinking colon, in `h:mm AM/PM` IST.

- [ ] **Step 3: Final build check**

Run: `npm run build`
Expected: `✓ Compiled successfully`, no type or lint errors, confirming the whole app is in a shippable state.

## Self-Review Notes

- **Spec coverage:** every section of the design spec maps to a task — background/grain (Task 2), top row incl. the listener-count-replacement wordmark (Task 3), data model and verified track list (Task 4), YouTube engine incl. `onError` capping (Task 5–6), the vinyl/iframe tradeoff agreed with the project owner (Task 7, 10), cassette-inspired seek bar and time readout (Task 8–9), the two distinct responsive layouts (Task 9), safe-area corners and `viewportFit: "cover"` (Task 1, 3). One gap found during planning and fixed here: the design spec described playlist-switching behavior but never placed a UI control for it — `PlaylistSwitcher` (Task 8) closes that gap.
- **Placeholder scan:** the only intentionally-empty values are the two social URLs (Task 3), which is documented as a deliberate, working default (the row renders nothing until they're filled in), not an unfinished step.
- **Type consistency:** `UsePlayerResult`, `PlaybackStatus`, and `PlayerControls` (Task 6) are the exact names/shapes imported in Tasks 8–10; `Track`/`Playlist` (Task 4) match their usage in `tracks.ts`, `use-player.ts`, `DesktopPlayer.tsx`, and `MobilePlayer.tsx`; `YT_PLAYER_CONTAINER_ID` (Task 4) is the same constant imported in both `use-player.ts` and `Vinyl.tsx`.
