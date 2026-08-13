"use client";

import { useState } from "react";
import type { Track } from "./types";

type Props = { track: Track };

// ─── Canvas drawing ──────────────────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

function drawVinyl(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  labelR: number,
  labelColor: string,
  filmName: string,
  year: number,
) {
  // Grooves
  for (let r = outerR; r > labelR; r -= 2.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 5 < 2.5 ? "#0a0a0a" : "#1d1d1d";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Sheen over grooves
  const sheen = ctx.createRadialGradient(
    cx - outerR * 0.32,
    cy - outerR * 0.32,
    0,
    cx,
    cy,
    outerR,
  );
  sheen.addColorStop(0, "rgba(255,255,255,0.09)");
  sheen.addColorStop(0.45, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fill();

  // Center label fill
  ctx.beginPath();
  ctx.arc(cx, cy, labelR, 0, Math.PI * 2);
  ctx.fillStyle = labelColor;
  ctx.fill();

  // Label sheen
  const ls = ctx.createRadialGradient(
    cx - labelR * 0.3,
    cy - labelR * 0.35,
    0,
    cx,
    cy,
    labelR,
  );
  ls.addColorStop(0, "rgba(255,255,255,0.30)");
  ls.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = ls;
  ctx.beginPath();
  ctx.arc(cx, cy, labelR, 0, Math.PI * 2);
  ctx.fill();

  // Label text
  const shortFilm = filmName.length > 11 ? filmName.slice(0, 10) + "…" : filmName;
  ctx.textAlign = "center";
  ctx.font = "bold 13px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText(shortFilm, cx, cy - 7);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText(String(year), cx, cy + 10);

  // Spindle hole
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.88)";
  ctx.fill();

  // Outer edge ring
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function generateCard(track: Track): Promise<Blob> {
  return new Promise((resolve) => {
    const W = 1200;
    const H = 630;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1c1208");
    bg.addColorStop(1, "#090603");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grain
    for (let i = 0; i < 90000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.022})`;
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
    }

    // Outer frame
    ctx.strokeStyle = "rgba(232,163,61,0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, W - 36, H - 36);

    // Inner frame
    ctx.strokeStyle = "rgba(232,163,61,0.12)";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Corner dots
    for (const [x, y] of [
      [42, 42],
      [W - 42, 42],
      [42, H - 42],
      [W - 42, H - 42],
    ] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232,163,61,0.45)";
      ctx.fill();
    }

    // Subtle vertical divider between vinyl and text
    ctx.beginPath();
    ctx.moveTo(490, 60);
    ctx.lineTo(490, H - 60);
    ctx.strokeStyle = "rgba(232,163,61,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vinyl
    drawVinyl(ctx, 245, H / 2, 198, 64, track.labelColor, track.film, track.year);

    // ── Right side text ──────────────────────────────────────────
    const tx = 530;
    const availW = W - tx - 55;
    ctx.textAlign = "left";

    // "NOW PLAYING" label
    ctx.font = "600 11px sans-serif";
    ctx.fillStyle = "rgba(232,163,61,0.75)";
    ctx.fillText("N O W   P L A Y I N G", tx, 112);

    // Song title (serif for vintage feel, wraps if long)
    const titleSize = track.title.length > 18 ? 48 : 58;
    ctx.font = `bold ${titleSize}px Georgia, 'Times New Roman', serif`;
    ctx.fillStyle = "#f0ddb0";
    const titleEndY = wrapText(ctx, track.title, tx, 178, availW, titleSize + 10);

    // Artist
    const artistY = Math.max(titleEndY + 36, 268);
    ctx.font = "400 22px sans-serif";
    ctx.fillStyle = "rgba(240,221,176,0.60)";
    ctx.fillText(track.artist, tx, artistY);

    // Film · Year
    ctx.font = "400 17px sans-serif";
    ctx.fillStyle = "rgba(232,163,61,0.65)";
    ctx.fillText(`${track.film}  ·  ${track.year}`, tx, artistY + 36);

    // Decorative line
    const divY = artistY + 80;
    ctx.beginPath();
    ctx.moveTo(tx, divY);
    ctx.lineTo(tx + 160, divY);
    ctx.strokeStyle = "rgba(232,163,61,0.30)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Branding
    ctx.font = "500 19px sans-serif";
    ctx.fillStyle = "rgba(232,163,61,0.88)";
    ctx.fillText("♫  Chai Chuska Radio", tx, divY + 40);

    ctx.font = "400 13px sans-serif";
    ctx.fillStyle = "rgba(240,221,176,0.30)";
    ctx.fillText("chaichuska.vercel.app", tx, divY + 65);

    // Bottom watermark
    ctx.textAlign = "center";
    ctx.font = "400 11px sans-serif";
    ctx.fillStyle = "rgba(232,163,61,0.18)";
    ctx.fillText("Chai Chuska Radio", W / 2, H - 24);

    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ShareButton({ track }: Props) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  async function handleShare() {
    if (state === "busy") return;
    setState("busy");

    try {
      const blob = await generateCard(track);
      const file = new File([blob], `chai-chuska-${track.id}.png`, { type: "image/png" });

      if (
        typeof navigator.share === "function" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `${track.title} — Chai Chuska Radio`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }

      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share now playing card"
      title="Share"
      className={`flex items-center justify-center rounded-full transition-all duration-75
        bg-gradient-to-b from-[#2a1c0c] to-[#170f06]
        border border-[#e8a33d]/20
        shadow-[0_3px_0_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)]
        active:shadow-[0_1px_0_rgba(0,0,0,0.55),inset_0_2px_4px_rgba(0,0,0,0.35)]
        active:translate-y-[2px] h-8 w-8
        ${state === "done" ? "text-[#e8a33d]" : "text-[#f0ddb0]/50"}`}
    >
      {state === "done" ? <CheckIcon /> : state === "busy" ? <SpinnerIcon /> : <ShareIcon />}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
