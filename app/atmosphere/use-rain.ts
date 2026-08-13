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

export function useRain() {
  const [active, setActive] = useState(false);
  const [intensity, setIntensity] = useState(0.4);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intensityRef = useRef(0.4);

  const toggle = useCallback(() => {
    if (active) {
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.6);
      }
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
      setActive(true);
    }
  }, [active]);

  const changeIntensity = useCallback((v: number) => {
    intensityRef.current = v;
    setIntensity(v);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(v * 0.4, ctxRef.current.currentTime, 0.3);
    }
  }, []);

  return { active, intensity, toggle, changeIntensity };
}
