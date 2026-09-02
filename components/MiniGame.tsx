"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const comments = [
  "Touch me if you can",
  "Too slow!",
  "Is that your top speed?",
  "Missed again!",
  "Are you even trying?",
  "You call that a click?",
  "My grandma moves faster!",
  "Nope, not here!",
  "Catch me outside!",
  "Try using both hands!"
];

export default function MiniGame() {
  const [commentIndex, setCommentIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isGameActive, setIsGameActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centerFace = () => {
      if (containerRef.current && faceRef.current && !isGameActive) {
        const container = containerRef.current.getBoundingClientRect();
        const face = faceRef.current.getBoundingClientRect();
        setPosition({
          x: Math.max(0, (container.width - face.width) / 2),
          y: Math.max(0, (container.height - face.height) / 2)
        });
      }
    };
    
    centerFace();
    const timeout = setTimeout(centerFace, 250);
    return () => clearTimeout(timeout);
  }, [isGameActive]);

  const handleMouseEnter = () => {
    if (!containerRef.current || !faceRef.current) return;
    
    if (!isGameActive) setIsGameActive(true);

    const container = containerRef.current.getBoundingClientRect();
    const face = faceRef.current.getBoundingClientRect();
    
    const maxX = Math.max(0, container.width - face.width);
    const maxY = Math.max(0, container.height - face.height);
    
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;
    
    // Prevent infinite loop if container is too small
    let attempts = 0;
    while (Math.abs(newX - position.x) < 100 && Math.abs(newY - position.y) < 100 && attempts < 10) {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      attempts++;
    }
    
    setPosition({ x: newX, y: newY });
    
    setCommentIndex((prev) => {
      const next = prev + 1;
      return next >= comments.length ? 1 : next;
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden"
    >
      <div 
        ref={faceRef}
        className="absolute transition-all duration-300 ease-out flex flex-col items-center gap-3 cursor-pointer z-[100] pointer-events-auto"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseEnter={handleMouseEnter}
        onPointerEnter={handleMouseEnter}
        onPointerOver={handleMouseEnter}
        onTouchStart={handleMouseEnter}
        onClick={handleMouseEnter}
      >
        {/* Sarcastic Comment Bubble */}
        <div className="bg-[#050505]/90 border-2 border-[#c3a682]/60 text-[#c3a682] text-sm md:text-lg font-mono font-semibold tracking-widest px-6 py-3 rounded-full whitespace-nowrap shadow-2xl backdrop-blur-md">
          {comments[commentIndex]}
        </div>
        
        {/* The Face Image */}
        <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-[#c3a682]/60 shadow-[0_0_50px_rgba(195,166,130,0.3)] filter grayscale hover:grayscale-0 transition-all duration-300 pointer-events-auto">
          <Image 
            src="/srija-face.png" 
            alt="Srija's Face" 
            fill 
            sizes="(max-width: 768px) 128px, 176px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
