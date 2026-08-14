import { formatTime } from "./format";
import { SeekBar } from "./SeekBar";
import { ShareButton } from "./ShareButton";
import { TransportControls } from "./TransportControls";
import type { UsePlayerResult } from "./use-player";
import { VinylWithTrivia } from "./VinylWithTrivia";

type Props = { player: UsePlayerResult };

export function DesktopPlayer({ player }: Props) {
  const { currentTrack, status, elapsed, duration, controls } = player;

  return (
    <div
      className="hidden sm:flex w-full items-center gap-5 rounded-2xl p-5"
      style={{
        background: "linear-gradient(160deg, #211608 0%, #130d05 100%)",
        border: "1px solid rgba(232,163,61,0.14)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.4), 0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Vinyl */}
      <VinylWithTrivia
        spinning={status === "playing"}
        track={currentTrack}
        size="desktop"
      />

      {/* Info + controls */}
      <div className="min-w-0 flex-1">
        {/* Song info */}
        <p className="truncate text-[17px] font-semibold leading-tight text-[#f0ddb0]">
          {currentTrack.title}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#f0ddb0]/50">
          {currentTrack.artist}
        </p>
        <p className="truncate text-[11px] text-[#e8a33d]/60">
          {currentTrack.film} · {currentTrack.year}
        </p>

        {/* Tuner seek bar */}
        <SeekBar
          elapsed={elapsed}
          duration={duration}
          onSeek={controls.seek}
          className="mt-3"
        />

        {/* Time + controls row */}
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-[10px] tabular-nums text-[#e8a33d]/50">
            {formatTime(elapsed)} / {formatTime(duration)}
          </span>
          <div className="flex items-center gap-2">
            <TransportControls
              status={status}
              onPrev={controls.prev}
              onPlayPause={controls.playPause}
              onNext={controls.next}
              size="desktop"
            />
            <ShareButton track={currentTrack} />
          </div>
        </div>
      </div>
    </div>
  );
}
