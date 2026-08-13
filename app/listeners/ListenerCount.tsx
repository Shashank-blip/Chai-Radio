"use client";

import { useListenerCount } from "./use-listener-count";

export function ListenerCount() {
  const count = useListenerCount();

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8a33d] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8a33d]" />
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#e8a33d]/70">
        {count} listening
      </span>
    </div>
  );
}
