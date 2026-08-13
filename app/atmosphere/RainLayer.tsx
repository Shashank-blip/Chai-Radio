"use client";

import { RainCanvas } from "./RainCanvas";
import { RainToggle } from "./RainToggle";
import { useRain } from "./use-rain";

/**
 * Owns the rain state and renders both the canvas overlay and the control
 * button/slider. Page.tsx renders <RainLayer /> in the header; the canvas
 * escapes to a fixed full-bleed layer via its own `fixed inset-0` styles.
 */
export function RainLayer() {
  const { active, intensity, toggle, changeIntensity } = useRain();

  return (
    <>
      {/* Rain background scene — cross-fades over the normal hero-bg */}
      <div
        className="rain-bg pointer-events-none fixed inset-0 z-[0] bg-cover bg-center"
        style={{
          opacity: active ? 1 : 0,
          transition: "opacity 3s ease",
        }}
      >
        <div className="h-full w-full bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      <RainCanvas active={active} intensity={intensity} />
      <RainToggle
        active={active}
        intensity={intensity}
        toggle={toggle}
        changeIntensity={changeIntensity}
      />
    </>
  );
}
