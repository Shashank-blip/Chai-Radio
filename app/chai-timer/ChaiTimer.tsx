"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TimerState = "idle" | "selecting" | "brewing" | "done";

const PRESETS = [
  { label: "Phiki", seconds: 120, desc: "2 min" },
  { label: "Normal", seconds: 240, desc: "4 min" },
  { label: "Kadak", seconds: 360, desc: "6 min" },
] as const;

function playBell() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  [440, 880, 1320].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18 / (i + 1), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.5);
  });
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function ChaiTimer() {
  const [state, setState] = useState<TimerState>("idle");
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = useCallback((seconds: number) => {
    clearTick();
    setTotal(seconds);
    setRemaining(seconds);
    setState("brewing");

    // Request notification permission (best-effort)
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setState("done");
          playBell();
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Chai Chuska Radio", {
              body: "Your chai is ready! ☕",
              icon: "/favicon.ico",
            });
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, []);

  const cancel = useCallback(() => {
    clearTick();
    setState("idle");
    setRemaining(0);
  }, []);

  useEffect(() => () => clearTick(), []);

  const progress = total > 0 ? (total - remaining) / total : 0;
  const circumference = 2 * Math.PI * 10; // r=10

  if (state === "idle") {
    return (
      <button
        type="button"
        onClick={() => setState("selecting")}
        aria-label="Start chai timer"
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-white/40 transition-colors hover:text-white/70"
      >
        <TeacupIcon />
        Chai timer
      </button>
    );
  }

  if (state === "selecting") {
    return (
      <div className="flex items-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => startTimer(p.seconds)}
            className="rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/8 px-2.5 py-1 text-[10px] font-medium text-[#f0ddb0]/70 transition-colors hover:text-[#f0ddb0]"
          >
            {p.label}
            <span className="ml-1 text-[#e8a33d]/50">{p.desc}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setState("idle")}
          aria-label="Cancel"
          className="text-white/30 hover:text-white/60 text-xs"
        >
          ✕
        </button>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-[#e8a33d] tracking-wide">
          ☕ Chai ready!
        </span>
        <button
          type="button"
          onClick={() => setState("idle")}
          aria-label="Dismiss"
          className="text-white/30 hover:text-white/60 text-xs"
        >
          ✕
        </button>
      </div>
    );
  }

  // brewing
  return (
    <div className="flex items-center gap-2">
      {/* Circular progress */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <circle
          cx="12" cy="12" r="10"
          fill="none"
          stroke="rgba(232,163,61,0.15)"
          strokeWidth="2"
        />
        <circle
          cx="12" cy="12" r="10"
          fill="none"
          stroke="#e8a33d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform="rotate(-90 12 12)"
          style={{ transition: "stroke-dashoffset 0.8s linear" }}
        />
      </svg>
      <span className="font-mono text-[11px] tabular-nums text-[#f0ddb0]/70">
        {fmt(remaining)}
      </span>
      <button
        type="button"
        onClick={cancel}
        aria-label="Cancel timer"
        className="text-white/30 hover:text-white/60 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

function TeacupIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[13px] w-[13px]"
    >
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}
