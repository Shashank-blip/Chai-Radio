"use client";

import { DesktopPlayer } from "./DesktopPlayer";
import { MobilePlayer } from "./MobilePlayer";
import { PlaylistSwitcher } from "./PlaylistSwitcher";
import { playlists } from "./tracks";
import { usePlayer } from "./use-player";

export function Player() {
  const player = usePlayer(playlists);

  if (player.unavailable) {
    return (
      <div
        className="w-full rounded-2xl px-5 py-4 text-center text-sm text-[#f0ddb0]/60"
        style={{
          background: "linear-gradient(160deg, #211608 0%, #130d05 100%)",
          border: "1px solid rgba(232,163,61,0.14)",
        }}
      >
        Player unavailable — please try again later.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <PlaylistSwitcher
        playlists={player.playlists}
        activeIndex={player.playlistIndex}
        onSelect={player.controls.selectPlaylist}
      />
      <DesktopPlayer player={player} />
      <MobilePlayer player={player} />
    </div>
  );
}
