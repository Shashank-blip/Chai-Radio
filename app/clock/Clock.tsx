"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    // Renders the same on the server and on first client paint (avoids a
    // hydration mismatch from server/client clock or timezone differences),
    // then fills in real time once mounted.
    return <span className="text-sm text-white/70">&nbsp;</span>;
  }

  const parts = formatter.formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value ?? "";

  return (
    <span className="text-sm font-medium tabular-nums text-white/80">
      {hour}
      <span style={{ animation: "blink 1s step-start infinite" }}>:</span>
      {minute} {dayPeriod}
    </span>
  );
}
