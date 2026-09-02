"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vertexShader, fragmentShader } from "./shaders/portraitShaders";
import { parseImageToParticles } from "@/lib/imageParser";
import SkillNodes from "./SkillNodes";

gsap.registerPlugin(ScrollTrigger);

export default function PortraitParticles({ 
  particleCount = 250000,
  imageSrc = "/sriju-stand2.png" 
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
    sphereTargets: Float32Array;
    colors: Float32Array;
  } | null>(null);

  useEffect(() => {
    parseImageToParticles(imageSrc, particleCount)
      .then((data) => {
        const positions = new Float32Array(particleCount * 3);
        const sphereTargets = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          // Initial random positions for the entry scatter
          positions[i * 3] = (Math.random() - 0.5) * 20; 
          positions[i * 3 + 1] = (Math.random() - 0.5) * 20; 
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20; 
          
          // Scramble the index so the colored image particles are uniformly distributed across the entire 3D sphere!
          // We use a large prime number to create a pseudo-random, even distribution.
          const scrambledIndex = (i * 15485863) % particleCount;
          
          // Fibonacci Sphere Math
          const phi = Math.acos(1 - 2 * (scrambledIndex / particleCount));
          const theta = Math.PI * (1 + Math.sqrt(5)) * scrambledIndex;
          
          // SHRINK THE SPHERE: 4.5 creates a tight, dense, cinematic globe that fits on all screens
          const radius = 4.5; 

          sphereTargets[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
          sphereTargets[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
          sphereTargets[i * 3 + 2] = radius * Math.cos(phi);
        }
        
        setGeometryData({ 
          positions, 
          targets: data.targetPositions, 
          sphereTargets,
          colors: data.colors 
        });
        setIsLoaded(true);
      })
      .catch((error) => console.error("Missing image", error));
  }, [imageSrc, particleCount]);

  useEffect(() => {
    if (!isLoaded || !materialRef.current) return;

    // We create a virtual proxy object for GSAP to animate safely
    const domProxy = { skillsOpacity: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#portrait-container",
          start: "top top",
          end: "+=7500", // Increased scroll distance to accommodate the final disperse animation
          scrub: 1, 
          pin: true, 
        }
      });

      // 1. Portrait forms
      tl.to(materialRef.current!.uniforms.uProgress, {
        value: 1.0, 
        ease: "none",
        duration: 2.5, 
      })
      // 2. Pause to allow user to use the lens on the portrait
      .to({}, { duration: 1.5 }) 
      // 3. Morph the portrait into the 3D Cognitive Sphere
      .to(materialRef.current!.uniforms.uMorph, {
        value: 1.0,
        ease: "power2.inOut", 
        duration: 2.0,
      })
      // 4. Fade in the orbiting skill nodes once the sphere is formed
      .to(domProxy, {
        skillsOpacity: 1,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          // This safely queries the DOM at the exact moment of rendering
          document.querySelectorAll('.skill-node').forEach((el) => {
            (el as HTMLElement).style.opacity = domProxy.skillsOpacity.toString();
          });
        }
      })
      // 5. Pause to allow user to view the rotating skills sphere
      .to({}, { duration: 1.5 })
      // 6. The Grand Finale: Disperse the particles and fade out skills
      .add("disperse")
      .to(domProxy, {
        skillsOpacity: 0,
        duration: 1.0,
        ease: "power2.in",
        onUpdate: () => {
          document.querySelectorAll('.skill-node').forEach((el) => {
            (el as HTMLElement).style.opacity = domProxy.skillsOpacity.toString();
          });
        }
      }, "disperse")
      .to(materialRef.current!.uniforms.uDissolve, {
        value: 1.0,
        ease: "power2.in", 
        duration: 1.5,
      }, "disperse");
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
      {/* NEW: The HTML overlays */}
      {isLoaded && materialRef.current && (
        <SkillNodes />
      )}

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={geometryData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-targetPosition" count={particleCount} array={geometryData.targets} itemSize={3} />
          <bufferAttribute attach="attributes-spherePosition" count={particleCount} array={geometryData.sphereTargets} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={geometryData.colors} itemSize={3} />
        </bufferGeometry>
        
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          uniforms={{
            uProgress: { value: 0.0 }, 
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector3(0, 0, 0) }, 
            uHover: { value: 0.0 },
            uDissolve: { value: 0.0 },
            uMorph: { value: 0.0 } 
          }}
        />
      </points>
    </group>
  );
}