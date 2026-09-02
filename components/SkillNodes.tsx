"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

import { SiC, SiCplusplus, SiPython, SiJavascript, SiRust, SiTypescript, SiReact, SiDocker } from "react-icons/si";
import { FaJava } from "react-icons/fa"; 

const skillsData = [
  { name: "C", icon: SiC, color: "#A8B9CC" },
  { name: "C++", icon: SiCplusplus, color: "#00599C" },
  { name: "Java", icon: FaJava, color: "#5382a1" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Rust", icon: SiRust, color: "#DEA584" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
];

export default function SkillNodes() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // We use a ref array to directly control the 3D position of each icon grouping
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  
  // The boundary radius is slightly smaller than the 4.5 particle sphere 
  // so the physical DOM elements don't clip through the stardust edges.
  const boundaryRadius = 3.6; 
  
  // Generate random starting positions and velocities only ONCE on load
  const { initialPositions, velocities } = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const vel: THREE.Vector3[] = [];
    
    skillsData.forEach(() => {
      // 1. Random position INSIDE the sphere
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(Math.random() * boundaryRadius);
      pos.push(p);
      
      // 2. Random trajectory and speed (SLOWED DOWN)
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(0.2 + Math.random() * 0.3); // Speed decreased significantly
      vel.push(v);
    });
    
    return { initialPositions: pos, velocities: vel };
  }, []);

  const positions = useRef(initialPositions);
  const vels = useRef(velocities);

  // The Physics Engine Loop
  useFrame((state, delta) => {
    // Cap delta to prevent massive jumps if the user switches browser tabs
    const dt = Math.min(delta, 0.1); 
    
    positions.current.forEach((pos, i) => {
      // 1. Move the icon along its trajectory
      pos.addScaledVector(vels.current[i], dt);
      
      // 2. Collision Detection: Did it hit the wall of the sphere?
      if (pos.length() >= boundaryRadius) {
        // Calculate the exact point of impact (the normal vector)
        const normal = pos.clone().normalize();
        
        // Reflect the trajectory mathematically (Bounce)
        vels.current[i].reflect(normal);
        
        // Snap it strictly back inside the boundary so it doesn't escape
        pos.copy(normal.multiplyScalar(boundaryRadius));
      }
      
      // 3. Apply the updated math to the actual 3D HTML node
      if (nodeRefs.current[i]) {
        nodeRefs.current[i].position.copy(pos);
      }
    });
  });

  return (
    <group>
      {skillsData.map((skill, index) => {
        const isHovered = hoveredIndex === index;
        
        return (
          <group 
            key={index} 
            ref={(el) => {
              nodeRefs.current[index] = el;
            }}
            position={positions.current[index]}
          >
            <Html
              center
              distanceFactor={10} 
              className="skill-node opacity-0" 
            >
              <div 
                className="relative group cursor-pointer flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* ICON BADGE */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-300 ease-out group-hover:scale-110">
                  
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                    style={{ backgroundColor: skill.color }}
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-md border-2 border-white/10 transition-colors duration-300 group-hover:border-white/40 shadow-xl" />
                  
                  <skill.icon 
                    className="relative z-10 w-10 h-10 transition-all duration-300" 
                    style={{ color: skill.color }} 
                  />
                </div>

                {/* TOOLTIP */}
                <div 
                  className={`absolute top-full mt-4 flex flex-col items-center transition-all duration-300 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="w-3 h-3 rotate-45 bg-black/90 border-t border-l border-white/30 -mb-1.5 z-10" />
                  <div className="bg-black/90 backdrop-blur-xl border border-white/30 px-5 py-2 rounded-lg shadow-2xl">
                    <span 
                      className="text-sm font-mono tracking-widest uppercase font-bold"
                      style={{ color: skill.color }}
                    >
                      {skill.name}
                    </span>
                  </div>
                </div>

              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}