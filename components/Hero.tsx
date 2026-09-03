"use client";

import { Canvas } from "@react-three/fiber";
import PortraitParticles from "./PortraitParticles";

export default function Hero() {
  return (
    <div className="relative w-full">
      <section id="portrait-container" className="relative h-screen w-full bg-[#050505]">
        <div className="absolute inset-0 z-0 cursor-none">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <PortraitParticles />
          </Canvas>
        </div>
      </section>
    </div>
  );
}