"use client";

import { useEffect, useRef } from "react";

type Drop = {
  x: number;
  y: number;
  speedMult: number;  // per-drop variation, applied to base speed each frame
  lengthMult: number; // per-drop variation, applied to base length each frame
};

// How far a drop drifts right per vertical pixel — ~10° from vertical
const LEAN = Math.tan((10 * Math.PI) / 180);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function targetCount(intensity: number) {
  return Math.round(lerp(35, 380, intensity));
}

function makeDrop(w: number, h: number, randomY: boolean, intensity: number): Drop {
  const baseLength = lerp(8, 32, intensity);
  return {
    x: Math.random() * (w + h * LEAN) - h * LEAN,
    y: randomY ? Math.random() * h : -(baseLength * 1.5),
    speedMult: 0.5 + Math.random() * 1.0,
    lengthMult: 0.5 + Math.random() * 1.1,
  };
}

type Props = { active: boolean; intensity: number };

export function RainCanvas({ active, intensity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Stable ref so the animation loop always reads latest values without restart
  const stateRef = useRef({ active, intensity });
  useEffect(() => {
    stateRef.current = { active, intensity };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const drops: Drop[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed with drops spread across the screen on first mount
    const { intensity: i0 } = stateRef.current;
    const w0 = canvas.width;
    const h0 = canvas.height;
    for (let n = 0; n < targetCount(i0); n++) {
      drops.push(makeDrop(w0, h0, true, i0));
    }

    let raf = 0;

    function frame() {
      const { active, intensity } = stateRef.current;
      const W = canvas!.width;
      const H = canvas!.height;

      ctx.clearRect(0, 0, W, H);

      // Grow / shrink pool toward the target count
      const target = active ? targetCount(intensity) : 0;
      while (drops.length < target) drops.push(makeDrop(W, H, true, intensity));
      if (drops.length > target) drops.splice(target);

      const baseSpeed = lerp(4, 22, intensity);
      const baseLength = lerp(8, 32, intensity);
      const baseOpacity = lerp(0.09, 0.52, intensity);

      for (let n = drops.length - 1; n >= 0; n--) {
        const d = drops[n];
        const speed = baseSpeed * d.speedMult;
        const len = baseLength * d.lengthMult;

        d.y += speed;
        d.x += speed * LEAN;

        // Respawn at top once it exits the bottom
        if (d.y - len > H) {
          if (!active) {
            drops.splice(n, 1);
            continue;
          }
          const fresh = makeDrop(W, H, false, intensity);
          d.x = fresh.x;
          d.y = fresh.y;
          // Refresh multipliers so long-lived drops stay varied
          d.speedMult = fresh.speedMult;
          d.lengthMult = fresh.lengthMult;
        }

        // Tail fades in for the first bit of travel
        const fadeIn = Math.min(1, d.y / (H * 0.08));
        const opacity = baseOpacity * fadeIn * d.speedMult * 0.7;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - len * LEAN, d.y - len);
        ctx.strokeStyle = `rgba(180,215,255,${opacity.toFixed(3)})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[3]"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 1.8s ease",
      }}
    />
  );
}
