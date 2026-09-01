"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vertexShader, fragmentShader } from "./shaders/portraitShaders";
import { parseImageToParticles } from "@/lib/imageParser";

gsap.registerPlugin(ScrollTrigger);

export default function PortraitParticles({ 
  particleCount = 250000,
  imageSrc = "/srija-portrait.jpg" 
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const viewport = useThree((state) => state.viewport); 
  
  const hoverState = useRef(0);
  const isHovered = useRef(false);
  const timeRef = useRef(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [geometryData, setGeometryData] = useState<{
    positions: Float32Array;
    targets: Float32Array;
    colors: Float32Array;
  } | null>(null);

  useEffect(() => {
    parseImageToParticles(imageSrc, particleCount)
      .then((data) => {
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 20; 
        }
        setGeometryData({ positions, targets: data.targetPositions, colors: data.colors });
        setIsLoaded(true);
      })
      .catch((error) => console.error("🚨 Missing image in /public folder", error));
  }, [imageSrc, particleCount]);

  useEffect(() => {
    if (!isLoaded || !materialRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#portrait-container",
          start: "top top",
          end: "+=3500", 
          scrub: 1, 
          pin: true, 
        }
      });

      tl.to(materialRef.current!.uniforms.uProgress, {
        value: 1.0, 
        ease: "none",
        duration: 2.5, 
      })
      .to({}, { duration: 0.8 }) 
      .to(materialRef.current!.uniforms.uDissolve, {
        value: 1.0,
        ease: "power2.in", 
        duration: 1.2,
      });
    });

    return () => ctx.revert();
  }, [isLoaded]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    
    timeRef.current += delta;
    materialRef.current.uniforms.uTime.value = timeRef.current;

    const targetX = (state.pointer.x * viewport.width) / 2;
    const targetY = (state.pointer.y * viewport.height) / 2;

    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.x, targetX, 0.08
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.y, targetY, 0.08
    );

    const targetHover = isHovered.current ? 1 : 0;
    hoverState.current = THREE.MathUtils.lerp(hoverState.current, targetHover, 0.1);
    materialRef.current.uniforms.uHover.value = hoverState.current;
  });

  if (!isLoaded || !geometryData) return null;

  return (
    <group 
      onPointerEnter={() => (isHovered.current = true)}
      onPointerLeave={() => (isHovered.current = false)}
    >
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={geometryData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-targetPosition" count={particleCount} array={geometryData.targets} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={geometryData.colors} itemSize={3} />
        </bufferGeometry>
        
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uProgress: { value: 0.0 }, 
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector3(0, 0, 0) }, 
            uHover: { value: 0.0 },
            uDissolve: { value: 0.0 }
          }}
        />
      </points>
    </group>
  );
}