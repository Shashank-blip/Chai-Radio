import type { PlaybackStatus } from "./use-player";

type TransportControlsProps = {
  status: PlaybackStatus;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  size: "desktop" | "mobile";
};

const BUTTON_BASE =
  "flex items-center justify-center rounded-full transition-all duration-75 " +
  "bg-gradient-to-b from-[#2a1c0c] to-[#170f06] " +
  "border border-[#e8a33d]/20 " +
  "shadow-[0_3px_0_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] " +
  "active:shadow-[0_1px_0_rgba(0,0,0,0.55),inset_0_2px_4px_rgba(0,0,0,0.35)] " +
  "active:translate-y-[2px]";

export function TransportControls({
  status,
  onPrev,
  onPlayPause,
  onNext,
  size,
}: TransportControlsProps) {
  const isPlaying = status === "playing";
  const playSize = size === "mobile" ? "h-14 w-14" : "h-10 w-10";
  const sideSize = size === "mobile" ? "h-10 w-10" : "h-8 w-8";
  const iconSize = size === "mobile" ? "h-5 w-5" : "h-4 w-4";
  const sideIconSize = size === "mobile" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous track"
        className={`${BUTTON_BASE} ${sideSize} text-[#f0ddb0]/70`}
      >
        <PrevIcon className={sideIconSize} />
      </button>

      <button
        type="button"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={`${BUTTON_BASE} ${playSize} text-[#e8a33d]`}
        style={{
          boxShadow:
            "0 3px 0 rgba(0,0,0,0.55), 0 0 12px rgba(232,163,61,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {isPlaying ? (
          <PauseIcon className={iconSize} />
        ) : (
          <PlayIcon className={iconSize} />
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next track"
        className={`${BUTTON_BASE} ${sideSize} text-[#f0ddb0]/70`}
      >
        <NextIcon className={sideIconSize} />
      </button>
    </div>
  );
}

function PlayIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function PrevIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 6h2v12H6zM20 6l-10 6 10 6z" />
    </svg>
  );
}

function NextIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 6h2v12h-2zM4 6l10 6-10 6z" />
    </svg>
  );
}
