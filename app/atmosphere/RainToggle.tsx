type Props = {
  active: boolean;
  intensity: number;
  toggle: () => void;
  changeIntensity: (v: number) => void;
};

export function RainToggle({ active, intensity, toggle, changeIntensity }: Props) {
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-label={active ? "Stop rain ambience" : "Start rain ambience"}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition-colors ${
          active
            ? "border-[#e8a33d]/50 bg-[#e8a33d]/15 text-[#f0ddb0]"
            : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
        }`}
      >
        <RainIcon active={active} />
        {active ? "Rain on" : "Rain"}
      </button>
      {active && (
        <input
          type="range"
          min={0.05}
          max={1}
          step={0.05}
          value={intensity}
          onChange={(e) => changeIntensity(Number(e.target.value))}
          aria-label="Rain intensity"
          className="w-20 accent-[#e8a33d] cursor-pointer"
          style={{ height: 3 }}
        />
      )}
    </div>
  );
}

function RainIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-[13px] w-[13px]"
    >
      <path d="M20 16.2A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      <line x1="8" y1="19" x2="8" y2="21" style={{ opacity: active ? 1 : 0.4 }} />
      <line x1="12" y1="17" x2="12" y2="21" style={{ opacity: active ? 1 : 0.4 }} />
      <line x1="16" y1="19" x2="16" y2="21" style={{ opacity: active ? 1 : 0.4 }} />
    </svg>
  );
}
