"use client";

import { useEffect, useState } from "react";

export type TimePeriod = "morning" | "afternoon" | "evening" | "night" | "latenight";

export type TimeTheme = {
  period: TimePeriod;
  label: string;
  overlayRgb: string;
  overlayOpacity: number;
};

function getISTHour(): number {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  ).getHours();
}

function themeFromHour(h: number): TimeTheme {
  if (h >= 5 && h < 11)
    return {
      period: "morning",
      label: "Morning Raga",
      overlayRgb: "255,180,60",
      overlayOpacity: 0.07,
    };
  if (h >= 11 && h < 16)
    return {
      period: "afternoon",
      label: "Afternoon Chai",
      overlayRgb: "220,150,50",
      overlayOpacity: 0.04,
    };
  if (h >= 16 && h < 20)
    return {
      period: "evening",
      label: "Evening Adrak",
      overlayRgb: "200,70,10",
      overlayOpacity: 0.09,
    };
  if (h >= 20)
    return {
      period: "night",
      label: "Night Sirens",
      overlayRgb: "30,50,140",
      overlayOpacity: 0.08,
    };
  return {
    period: "latenight",
    label: "Late Night Chai",
    overlayRgb: "10,15,60",
    overlayOpacity: 0.14,
  };
}

export function useTimeTheme(): TimeTheme {
  const [theme, setTheme] = useState<TimeTheme | null>(null);

  useEffect(() => {
    const tick = () => setTheme(themeFromHour(getISTHour()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Return a neutral default until mounted (avoids SSR/client mismatch)
  return (
    theme ?? {
      period: "night",
      label: "",
      overlayRgb: "0,0,0",
      overlayOpacity: 0,
    }
  );
}
