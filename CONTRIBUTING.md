# Contributing to Chai Chuska Radio

Thanks for wanting to contribute. This is a small, focused project — contributions that fit the existing spirit are welcome. Read this before opening a pull request.

---

## What fits this project

Chai Chuska Radio is intentionally minimal. The goal is a single-mood listening experience, not a feature-rich music platform. Good contributions tend to be small, polished, and invisible — the kind of thing that makes the experience feel more right without drawing attention to itself.

Things that fit:
- Bug fixes
- Song additions that genuinely match the playlist mood
- Performance improvements (load time, audio startup, animation frame budget)
- Accessibility improvements (keyboard navigation, screen reader support, reduced motion)
- Mobile experience fixes
- Atmosphere refinements (rain, thunder, time themes)

Things that don't fit:
- User accounts, playlists, or library management
- Song search or external API integrations
- Heavy dependencies
- Feature flags or configuration systems
- Anything that requires a backend beyond the existing serverless route

When in doubt, open an issue first and describe what you want to add and why it fits.

---

## Getting started

```bash
git clone https://github.com/YOUR_USERNAME/chai-chuska.git
cd chai-chuska
npm install
npm run dev
```

The app runs at `http://localhost:3000`. No environment variables required.

Audio requires a browser gesture before it starts — clicking the play button or the rain toggle counts. Test rain, thunder, the chai timer bell, and the share card in a real browser, not just via TypeScript compilation.

---

## Adding songs

Songs live in `app/player/tracks.ts`. Each track needs:

```ts
{
  id: "unique-kebab-case-id",
  title: "Song Title",
  artist: "Artist Name",
  film: "Film Name",
  year: 1965,
  audioUrl: "https://archive.org/download/...",   // direct MP3 link
  labelColor: "#a85c2a",                           // unique hex, warm tones preferred
  playlist: "old-is-gold",                         // or "monsoon-mood" / "late-night-chai"
}
```

Guidelines for song additions:
- Source audio from archive.org — it hosts a large catalog of pre-1980s Hindi film songs under public domain or permissive licenses. Verify the license on the item page before adding.
- Use a direct `.mp3` link (the `/download/` path, not the item page URL). Test that it actually streams.
- Pick a `labelColor` that hasn't been used. Check existing tracks — every vinyl should look different.
- Match the playlist mood. Monsoon Mood is rain and grey skies. Late Night Chai is quiet and introspective. Old is Gold is the broad classics.
- One PR per song or small batch. Don't restructure the playlist system as part of a song addition.

---

## Code style

No formatter is enforced, but the existing code follows some implicit conventions:

- Tailwind classes for layout and color, inline `style` only for dynamic values that can't be expressed as static classes
- No default exports except page and layout files — named exports everywhere else
- Hooks own state and expose a clean return object — components stay as thin as possible
- Web Audio nodes are created inline and connected in one block — no abstraction layers over the API
- `useRef` for values that shouldn't trigger re-renders (audio element, animation frame IDs, AudioContext)
- No comments unless the logic is genuinely non-obvious

TypeScript is strict. Run `npm run build` before submitting — it catches type errors that the dev server won't.

---

## Pull request checklist

- [ ] `npm run build` passes with no errors or warnings
- [ ] Tested in Chrome and either Firefox or Safari
- [ ] Rain, thunder, and the chai timer still work after your change
- [ ] No new dependencies added without a good reason
- [ ] PR description explains what changed and why — not just what

---

## Reporting bugs

Open a GitHub issue. Include:
- Browser and OS
- What you expected to happen
- What actually happened
- Steps to reproduce

For audio bugs specifically, mention whether you're on headphones or speakers, and whether the rain was active when the issue occurred — rain and music share resources that can interact in subtle ways.

---

## Atmosphere and sound design

The rain, thunder, and chai timer bell are all synthesized with the Web Audio API — no audio files. If you want to improve them, everything is in `app/atmosphere/use-rain.ts` and `app/chai-timer/ChaiTimer.tsx`.

A few hard constraints:
- No external audio files for sound effects. The synthesized approach keeps the bundle lean and avoids licensing questions.
- Thunder must remain subtle. The flash should be noticeable, not startling. The rumble should feel like distant sky, not a movie effect.
- The rain intensity slider controls everything simultaneously — drop count, speed, opacity, and audio gain. Any atmosphere change should respect this contract.

---

## License

By contributing, you agree that your contributions will be licensed under the same MIT license as the project.
