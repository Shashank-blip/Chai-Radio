type PlaylistSwitcherProps = {
  playlists: { id: string; name: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function PlaylistSwitcher({
  playlists,
  activeIndex,
  onSelect,
}: PlaylistSwitcherProps) {
  return (
    <div className="mb-3 flex gap-2">
      {playlists.map((playlist, index) => (
        <button
          key={playlist.id}
          type="button"
          onClick={() => onSelect(index)}
          className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-colors ${
            index === activeIndex
              ? "border-[#e8a33d]/50 bg-[#e8a33d]/15 text-[#f0ddb0]"
              : "border-[#e8a33d]/10 bg-[#e8a33d]/5 text-[#f0ddb0]/40 hover:text-[#f0ddb0]/70"
          }`}
        >
          {playlist.name}
        </button>
      ))}
    </div>
  );
}
