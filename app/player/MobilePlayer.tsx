import { formatTime } from "./format";
import { SeekBar } from "./SeekBar";
import { TransportControls } from "./TransportControls";
import type { UsePlayerResult } from "./use-player";
import { Vinyl } from "./Vinyl";

type Props = { player: UsePlayerResult };

export function MobilePlayer({ player }: Props) {
  const { currentTrack, status, elapsed, duration, controls } = player;

  return (
    <div
      className="flex sm:hidden w-full flex-col gap-4 rounded-2xl p-4"
      style={{
        background: "linear-gradient(160deg, #211608 0%, #130d05 100%)",
        border: "1px solid rgba(232,163,61,0.14)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.4), 0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Top row: vinyl + info */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0">
          <Vinyl spinning={status === "playing"} track={currentTrack} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-[#f0ddb0]">
            {currentTrack.title}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[#f0ddb0]/50">
            {currentTrack.artist}
          </p>
          <p className="truncate text-[10px] text-[#e8a33d]/60">
            {currentTrack.film} · {currentTrack.year}
          </p>
        </div>
      </div>

      {/* Tuner seek bar */}
      <SeekBar elapsed={elapsed} duration={duration} onSeek={controls.seek} />

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tabular-nums text-[#e8a33d]/50">
          {formatTime(elapsed)} / {formatTime(duration)}
        </span>
        <TransportControls
          status={status}
          onPrev={controls.prev}
          onPlayPause={controls.playPause}
          onNext={controls.next}
          size="mobile"
        />
        {/* Balance spacer */}
        <span className="w-[60px]" aria-hidden />
      </div>
    </div>
  );
}
