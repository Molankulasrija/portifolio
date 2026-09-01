"use client";

import { Canvas } from "@react-three/fiber";
import PortraitParticles from "./PortraitParticles";

export default function Hero() {
  return (
    <section id="portrait-container" className="relative h-screen w-full bg-[#050505]">
      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <PortraitParticles />
        </Canvas>
      </div>
    </section>
  );
}