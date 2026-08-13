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
  const now = ctx.currentTime;

  // Compressor glues crack + rumble and boosts perceived loudness
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -10;
  comp.knee.value = 3;
  comp.ratio.value = 6;
  comp.attack.value = 0.001;
  comp.release.value = 0.15;
  comp.connect(ctx.destination);

  // ── Initial boom (low-mid thud, no high freq = no gun-crack) ─────────────
  const boomDur = 0.9;
  const boomBuf = ctx.createBuffer(2, Math.ceil(boomDur * ctx.sampleRate), ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = boomBuf.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const boomSrc = ctx.createBufferSource();
  boomSrc.buffer = boomBuf;

  const boomHp = ctx.createBiquadFilter();
  boomHp.type = "highpass";
  boomHp.frequency.value = 55;          // keeps the low body

  const boomLp = ctx.createBiquadFilter();
  boomLp.type = "lowpass";
  boomLp.frequency.value = 320;         // cuts everything gun-shot-like above this

  const boomGain = ctx.createGain();
  boomGain.gain.setValueAtTime(0, now);
  boomGain.gain.linearRampToValueAtTime(3.5, now + 0.018); // soft attack (~18ms) → thud not snap
  boomGain.gain.exponentialRampToValueAtTime(0.001, now + boomDur);

  boomSrc.connect(boomHp);
  boomHp.connect(boomLp);
  boomLp.connect(boomGain);
  boomGain.connect(comp);
  boomSrc.start(now);

  // ── Rolling rumble underneath ──────────────────────────────────────────────
  const rumbleDur = 3.5 + Math.random() * 2;
  const rumbleBuf = ctx.createBuffer(2, Math.ceil(rumbleDur * ctx.sampleRate), ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = rumbleBuf.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const rumbleSrc = ctx.createBufferSource();
  rumbleSrc.buffer = rumbleBuf;

  const rumbleLp = ctx.createBiquadFilter();
  rumbleLp.type = "lowpass";
  rumbleLp.frequency.value = 220 + Math.random() * 100; // 220-320Hz — audible on headphones, feels like sky

  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0, now);
  rumbleGain.gain.linearRampToValueAtTime(2.2, now + 0.1);
  rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + rumbleDur);

  rumbleSrc.connect(rumbleLp);
  rumbleLp.connect(rumbleGain);
  rumbleGain.connect(comp);
  rumbleSrc.start(now);
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
    // Subtle double-flash — bright enough to notice, not blinding
    setThunderFlash(true);
    setTimeout(() => setThunderFlash(false), 60);
    setTimeout(() => setThunderFlash(true), 100);
    setTimeout(() => setThunderFlash(false), 180);

    // Sound fires with the flash — crack is instant, rumble builds underneath
    if (ctxRef.current) playThunderRumble(ctxRef.current);
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
