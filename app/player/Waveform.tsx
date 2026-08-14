"use client";

import { useEffect, useRef } from "react";
import type { PlaybackStatus } from "./use-player";

const BAR_COUNT = 48;

type Props = { status: PlaybackStatus };

export function Waveform({ status }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = new Float32Array(BAR_COUNT);
    const targets = new Float32Array(BAR_COUNT);
    let raf: number;

    function updateTargets() {
      for (let i = 0; i < BAR_COUNT; i++) {
        if (status === "playing") {
          // Bell curve: centre frequencies appear louder
          const norm = i / (BAR_COUNT - 1); // 0..1
          const bell = Math.exp(-Math.pow((norm - 0.38) * 2.6, 2));
          targets[i] = 0.08 + Math.random() * 0.7 * bell + Math.random() * 0.12;
        } else {
          targets[i] = 0;
        }
      }
    }

    const targetInterval = setInterval(updateTargets, 110);
    updateTargets();

    function draw() {
      raf = requestAnimationFrame(draw);

      // Keep canvas buffer in sync with CSS size
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (canvas!.width !== w) canvas!.width = w;
      if (canvas!.height !== h) canvas!.height = h;

      ctx!.clearRect(0, 0, w, h);

      const barW = w / BAR_COUNT;
      for (let i = 0; i < BAR_COUNT; i++) {
        bars[i] += (targets[i] - bars[i]) * 0.11;
        const v = bars[i];
        if (v < 0.005) continue;
        const barH = v * h * 0.78;
        const alpha = 0.08 + v * 0.22;
        ctx!.fillStyle = `rgba(232,163,61,${alpha.toFixed(3)})`;
        ctx!.fillRect(i * barW + 0.5, h - barH, Math.max(barW - 1.5, 1), barH);
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(targetInterval);
    };
  }, [status]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}
