"use client";

import { useEffect, useState } from "react";

function getOrCreateSessionId(): string {
  const key = "chai-chuska-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useListenerCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();

    async function heartbeat() {
      try {
        const res = await fetch("/api/listeners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        setCount(data.count);
      } catch {}
    }

    heartbeat();
    const interval = setInterval(heartbeat, 60_000);
    return () => clearInterval(interval);
  }, []);

  return count;
}
