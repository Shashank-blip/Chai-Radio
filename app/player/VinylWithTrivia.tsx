"use client";

import { useState } from "react";
import type { Track } from "./types";
import { Vinyl } from "./Vinyl";
import { TriviaCard } from "./TriviaCard";
import { getRandomTrivia } from "./trivia";

type Props = {
  spinning: boolean;
  track: Track;
  size: "desktop" | "mobile";
};

export function VinylWithTrivia({ spinning, track, size }: Props) {
  const [fact, setFact] = useState<string | null>(null);

  function handleClick() {
    // Pick a new random fact (avoid repeating the current one)
    let next = getRandomTrivia();
    if (fact) {
      while (next === fact) next = getRandomTrivia();
    }
    setFact(next);
  }

  const sizeClass = size === "desktop" ? "h-28 w-28" : "h-20 w-20";

  return (
    <>
      <div
        className={`${sizeClass} shrink-0 cursor-pointer`}
        onClick={handleClick}
        title="Click for a random fact"
      >
        <Vinyl spinning={spinning} track={track} />
      </div>

      {fact && (
        <TriviaCard fact={fact} onDismiss={() => setFact(null)} />
      )}
    </>
  );
}
