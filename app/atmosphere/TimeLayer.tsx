"use client";

import { useTimeTheme } from "./use-time-theme";

/** Fixed full-bleed color overlay that shifts with time of day (IST). */
export function TimeOverlay() {
  const { overlayRgb, overlayOpacity } = useTimeTheme();
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{
        background: `rgba(${overlayRgb}, ${overlayOpacity})`,
        transition: "background 4000ms ease",
      }}
    />
  );
}

/** Inline label shown in the header center column. */
export function TimePeriodLabel() {
  const { label } = useTimeTheme();
  if (!label) return null;
  return (
    <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/30 mt-0.5">
      {label}
    </p>
  );
}
