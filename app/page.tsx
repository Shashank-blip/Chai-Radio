"use client";

import { Clock } from "./clock/Clock";
import { Player } from "./player/Player";
import { RainCanvas } from "./atmosphere/RainCanvas";
import { RainToggle } from "./atmosphere/RainToggle";
import { useRain } from "./atmosphere/use-rain";
import { ChaiTimer } from "./chai-timer/ChaiTimer";
import { TimeOverlay, TimePeriodLabel } from "./atmosphere/TimeLayer";
import { ListenerCount } from "./listeners/ListenerCount";

/**
 * Why "use client" here:
 *
 * The rain ambient layers (rain-bg, canvas, thunder flash) must live at the
 * ROOT stacking context level — i.e. as siblings of the z-10 header grid —
 * so their z-indices (0, 3, 4) are compared against z-10, not painted inside
 * it. When they were rendered inside the right column (a stacking context at
 * z-7 within z-10), browser paint order caused them to cover the clock and
 * center columns even though those had a higher z-index value. Lifting
 * useRain() here and rendering the ambient divs at page level is the fix.
 */
export default function Page() {
  const { active, intensity, thunderFlash, toggle, changeIntensity } = useRain();

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* ── Static background layers (z 0-2) ──────────────────────────────── */}
      <div className="hero-bg fixed inset-0 z-0 bg-cover bg-center">
        <div className="h-full w-full bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>
      <div
        className="grain-overlay fixed inset-0 z-[1]"
        style={{ mixBlendMode: "overlay", opacity: 0.3 }}
      />
      <TimeOverlay />  {/* z-[2] */}

      {/* ── Rain ambient layers (z 0, 3, 4) ───────────────────────────────── */}
      {/* Rendered here at root level so their z-indices are below z-10 (header).
          If these were inside the header's stacking context they would paint
          over the clock and center columns regardless of their z-index value. */}
      <div
        className="rain-bg pointer-events-none fixed inset-0 z-[0] bg-cover bg-center"
        style={{ opacity: active ? 1 : 0, transition: "opacity 3s ease" }}
      >
        <div className="h-full w-full bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[4]"
        style={{
          background: "rgba(210, 230, 255, 1)",
          opacity: thunderFlash ? 0.28 : 0,
          transition: thunderFlash ? "none" : "opacity 0.5s ease-out",
        }}
      />
      <RainCanvas active={active} intensity={intensity} />  {/* fixed z-[3] */}

      {/* ── Top scrim (z-[6]) — sits above rain effects, below header ─────── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[6] h-28 bg-gradient-to-b from-black/60 to-transparent" />

      {/* ── Header (z-10 stacking context) ────────────────────────────────── */}
      <div className="relative z-10 grid w-full grid-cols-3 items-start px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="relative z-[7] justify-self-start">
          <Clock />
        </div>
        <div className="relative z-[7] justify-self-center flex flex-col items-center rounded-2xl bg-black/30 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
            Chai Chuska Radio
          </p>
          <TimePeriodLabel />
          <ListenerCount />
        </div>
        <div className="relative z-[7] justify-self-end flex flex-col items-end gap-2 rounded-2xl bg-black/30 px-2.5 py-2">
          <RainToggle
            active={active}
            intensity={intensity}
            toggle={toggle}
            changeIntensity={changeIntensity}
          />
          <ChaiTimer />
        </div>
      </div>

      {/* ── Player (z-10) ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Player />
      </div>
    </main>
  );
}
