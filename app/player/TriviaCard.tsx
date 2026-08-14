"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  fact: string;
  onDismiss: () => void;
};

const AUTO_DISMISS_MS = 8000;

export function TriviaCard({ fact, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(handleDismiss, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismiss() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(onDismiss, 400);
  }

  return (
    <>
      {/* Full-screen dismiss overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="status"
        aria-live="polite"
        onClick={handleDismiss}
        className="fixed bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 z-50 w-[min(92vw,480px)] -translate-x-1/2 cursor-pointer select-none rounded-2xl px-5 py-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          background: "rgba(18, 10, 3, 0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(232,163,61,0.22)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Label */}
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]/60">
          Did you know
        </p>

        {/* Fact */}
        <p className="text-[13px] leading-relaxed text-[#f0ddb0]/90">{fact}</p>

        {/* Progress bar */}
        <div className="mt-3 h-px w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#e8a33d]/40"
            style={{
              transformOrigin: "left",
              animation: `trivia-shrink ${AUTO_DISMISS_MS}ms linear forwards`,
            }}
          />
        </div>

        <style>{`
          @keyframes trivia-shrink {
            from { transform: scaleX(1); }
            to   { transform: scaleX(0); }
          }
        `}</style>
      </div>
    </>
  );
}
