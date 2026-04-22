"use client";

import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

type Props = {
  id?: string;
  className?: string;
  background?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
};

export function SparklesCore({
  id,
  className,
  background = "transparent",
  particleColor = "#EDEDED",
  particleDensity = 80,
  minSize = 0.6,
  maxSize = 1.8,
  speed = 1,
}: Props) {
  const [ready, setReady] = useState(false);
  const autoId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: background },
    fpsLimit: 60,
    particles: {
      number: { value: particleDensity, density: { enable: true } },
      color: { value: particleColor },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: { enable: true, speed: 1, sync: false },
      },
      size: { value: { min: minSize, max: maxSize } },
      move: {
        enable: true,
        speed: { min: 0.1, max: speed },
        direction: "none",
        outModes: { default: "out" },
        random: true,
        straight: false,
      },
    },
    detectRetina: true,
  };

  if (!ready) return <div className={className} />;
  return (
    <Particles
      id={id ?? autoId}
      options={options}
      className={className}
    />
  );
}
