"use client";

import { useRef, useState, type PointerEvent } from "react";
import { clamp } from "./format";
import type { PlaybackStatus } from "./use-player";
import { Waveform } from "./Waveform";

type SeekBarProps = {
  elapsed: number;
  duration: number;
  onSeek: (seconds: number) => void;
  status: PlaybackStatus;
  className?: string;
};

const TOTAL_TICKS = 48;
const MAJOR_EVERY = 6; // every 6th tick is tall
const MED_EVERY = 3;   // every 3rd is medium

export function SeekBar({ elapsed, duration, onSeek, status, className }: SeekBarProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [dragValue, setDragValue] = useState<number | null>(null);

  const safeDuration = duration > 0 ? duration : 1;
  const displayValue = dragValue ?? elapsed;
  const progress = clamp(displayValue / safeDuration, 0, 1);

  function valueFromPointer(clientX: number): number {
    const rail = railRef.current;
    if (!rail) return elapsed;
    const rect = rail.getBoundingClientRect();
    return clamp((clientX - rect.left) / rect.width, 0, 1) * safeDuration;
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragValue(valueFromPointer(e.clientX));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (dragValue === null) return;
    setDragValue(valueFromPointer(e.clientX));
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    if (dragValue === null) return;
    onSeek(dragValue);
    setDragValue(null);
  }

  return (
    <div className={className}>
      {/* Frequency number markers */}
      <div className="flex justify-between mb-0.5 px-0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="font-mono tabular-nums"
            style={{ fontSize: 8, color: "rgba(232,163,61,0.35)" }}
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Tuner rail */}
      <div
        ref={railRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative touch-none cursor-pointer rounded-sm overflow-hidden"
        style={{
          height: 40,
          background: "#050301",
          border: "1px solid rgba(232,163,61,0.12)",
        }}
      >
        {/* Waveform EQ bars — sits below tick marks */}
        <Waveform status={status} />

        {/* Tick marks */}
        <div className="absolute inset-0 flex items-end justify-around pb-1 px-0.5 pointer-events-none">
          {Array.from({ length: TOTAL_TICKS }).map((_, i) => {
            const isMajor = i % MAJOR_EVERY === 0;
            const isMed = i % MED_EVERY === 0;
            const h = isMajor ? 22 : isMed ? 13 : 6;
            const opacity = isMajor ? 0.45 : isMed ? 0.25 : 0.12;
            return (
              <div
                key={i}
                style={{
                  width: 1,
                  height: h,
                  background: `rgba(232,163,61,${opacity})`,
                }}
              />
            );
          })}
        </div>

        {/* Faint progress fill */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: `${progress * 100}%`,
            background: "rgba(232,163,61,0.05)",
          }}
        />

        {/* Needle */}
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{
            left: `${progress * 100}%`,
            width: 2,
            transform: "translateX(-50%)",
            background: "#e8a33d",
            boxShadow: "0 0 8px 2px rgba(232,163,61,0.55)",
          }}
        />
      </div>
    </div>
  );
}
