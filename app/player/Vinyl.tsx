import type { Track } from "./types";

type VinylProps = {
  spinning: boolean;
  track: Track;
};

export function Vinyl({ spinning, track }: VinylProps) {
  const shortFilm =
    track.film.length > 12 ? track.film.slice(0, 11) + "…" : track.film;

  return (
    <div className="relative h-full w-full select-none">
      {/* Disc — grooves + label spin together */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 50%, #0a0a0a 0px, #0a0a0a 1px, #1d1d1d 1px, #1d1d1d 3px)",
          animation: "spin 4s linear infinite",
          animationPlayState: spinning ? "running" : "paused",
          boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {/* Vinyl sheen */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 38% 28%, rgba(255,255,255,0.10) 0%, transparent 52%)",
          }}
        />

        {/* Center label */}
        <div
          className="absolute inset-[30%] rounded-full overflow-hidden flex flex-col items-center justify-center"
          style={{ backgroundColor: track.labelColor }}
        >
          {/* Label sheen */}
          <div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 35% 28%, rgba(255,255,255,0.28) 0%, transparent 58%)",
            }}
          />
          {/* Label text */}
          <div className="relative z-10 text-center px-1 w-full leading-tight">
            <p
              className="font-bold tracking-wider text-white/90 truncate text-center"
              style={{ fontSize: "clamp(5px, 8%, 8px)" }}
            >
              {shortFilm}
            </p>
            <p
              className="text-white/55 text-center"
              style={{ fontSize: "clamp(4px, 6%, 6px)" }}
            >
              {track.year}
            </p>
          </div>
          {/* Spindle hole */}
          <div
            className="absolute rounded-full bg-black/80"
            style={{ width: "16%", height: "16%" }}
          />
        </div>

        {/* Outer edge highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        />
      </div>
    </div>
  );
}
