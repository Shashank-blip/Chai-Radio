import { Clock } from "./clock/Clock";
import { Player } from "./player/Player";
import { RainLayer } from "./atmosphere/RainLayer";
import { ChaiTimer } from "./chai-timer/ChaiTimer";
import { TimeOverlay, TimePeriodLabel } from "./atmosphere/TimeLayer";
import { ListenerCount } from "./listeners/ListenerCount";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* Deliberately z-0 / z-[1], never negative: negative z-index on a
          fixed full-bleed layer collides with a CSS quirk where the body's
          background gets promoted to paint the page's root canvas, which
          sits beneath negative-z-index content and hides it entirely. Every
          layer below is non-negative; foreground content is lifted above
          them with z-10 instead. */}
      <div className="hero-bg fixed inset-0 z-0 bg-cover bg-center">
        <div className="h-full w-full bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>
      <div
        className="grain-overlay fixed inset-0 z-[1]"
        style={{ mixBlendMode: "overlay", opacity: 0.3 }}
      />
      <TimeOverlay />

      <div className="relative z-10 grid w-full grid-cols-3 items-start px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="relative z-[5] justify-self-start">
          <Clock />
        </div>
        <div className="relative z-[5] justify-self-center flex flex-col items-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
            Chai Chuska Radio
          </p>
          <TimePeriodLabel />
          <ListenerCount />
        </div>
        <div className="relative z-[5] justify-self-end flex flex-col items-end gap-2 rounded-2xl bg-black/30 px-2.5 py-2">
          <RainLayer />
          <ChaiTimer />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Player />
      </div>
    </main>
  );
}
