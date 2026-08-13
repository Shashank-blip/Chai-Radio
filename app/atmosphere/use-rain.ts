"use client";

import { useCallback, useRef, useState } from "react";

// Paul Kellett's pink noise algorithm — closer to rain than white noise.
function makePinkNoise(ctx: AudioContext): AudioBuffer {
  const len = 4 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.76160 * b5 - w * 0.0168980;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

function playThunderRumble(ctx: AudioContext) {
  const duration = 2.5 + Math.random() * 2;
  const buf = ctx.createBuffer(1, Math.ceil(duration * ctx.sampleRate), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  // Very low cutoff for that deep booming rumble
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 70 + Math.random() * 60;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.55 + Math.random() * 0.45, now + 0.07);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  src.connect(lp);
  lp.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

export function useRain() {
  const [active, setActive] = useState(false);
  const [intensity, setIntensity] = useState(0.4);
  const [thunderFlash, setThunderFlash] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intensityRef = useRef(0.4);
  const thunderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  function triggerThunder() {
    // Double-flash like real lightning
    setThunderFlash(true);
    setTimeout(() => setThunderFlash(false), 70);
    setTimeout(() => setThunderFlash(true), 120);
    setTimeout(() => setThunderFlash(false), 220);

    // Rumble arrives after a random delay (light travels faster than sound)
    const rumbleDelay = 200 + Math.random() * 1400;
    setTimeout(() => {
      if (ctxRef.current) playThunderRumble(ctxRef.current);
    }, rumbleDelay);
  }

  function scheduleThunder(intensityVal: number) {
    if (thunderTimerRef.current) clearTimeout(thunderTimerRef.current);
    if (!activeRef.current) return;

    // Lower intensity → rarer strikes. At 0.1: ~50-100s. At 1.0: ~8-18s.
    const t = intensityVal;
    const minDelay = 8000 + (1 - t) * 42000;
    const maxDelay = 18000 + (1 - t) * 82000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    thunderTimerRef.current = setTimeout(() => {
      if (activeRef.current && ctxRef.current) {
        triggerThunder();
        scheduleThunder(intensityRef.current);
      }
    }, delay);
  }

  const toggle = useCallback(() => {
    if (activeRef.current) {
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.6);
      }
      if (thunderTimerRef.current) clearTimeout(thunderTimerRef.current);
      activeRef.current = false;
      setTimeout(() => {
        ctxRef.current?.close();
        ctxRef.current = null;
        gainRef.current = null;
      }, 2500);
      setActive(false);
    } else {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const src = ctx.createBufferSource();
      src.buffer = makePinkNoise(ctx);
      src.loop = true;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1100;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setTargetAtTime(intensityRef.current * 0.4, ctx.currentTime, 1.5);
      gainRef.current = gain;

      src.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      activeRef.current = true;
      setActive(true);
      scheduleThunder(intensityRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeIntensity = useCallback((v: number) => {
    intensityRef.current = v;
    setIntensity(v);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(v * 0.4, ctxRef.current.currentTime, 0.3);
    }
  }, []);

  return { active, intensity, thunderFlash, toggle, changeIntensity };
}
