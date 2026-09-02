"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  { 
    id: "01", 
    title: "Cognitive Engine", 
    role: "Lead WebGL Architect", 
    description: "An interactive 3D cognitive sphere utilizing custom GLSL shaders and matrix math to visualize distributed thought patterns in real-time.",
    stack: ["Three.js", "GLSL", "React"],
    link: "https://github.com/sainathmanda7"
  },
  { 
    id: "02", 
    title: "Neural Ledger", 
    role: "Systems Engineer", 
    description: "A high-performance distributed ledger built from the ground up to handle 10k+ TPS with cryptographic verification and seamless node discovery.",
    stack: ["Rust", "gRPC", "Kubernetes"],
    link: "https://github.com/sainathmanda7"
  },
  { 
    id: "03", 
    title: "Aura Analytics", 
    role: "Frontend Developer", 
    description: "Enterprise dashboard for real-time telemetry, featuring complex D3 visualizations wrapped in a bespoke glassmorphic UI.",
    stack: ["Next.js", "GSAP", "Tailwind"],
    link: "https://github.com/sainathmanda7"
  },
  {
    id: "04",
    title: "Quantum Proxy",
    role: "Backend Architect",
    description: "Reverse proxy and load balancer optimizing WebSocket connections for massive multiplayer state synchronization with zero-downtime deployments.",
    stack: ["Go", "Redis", "Docker"],
    link: "https://github.com/sainathmanda7"
  }
];

const achievements = [
  { year: "2026", title: "Awwwards Site of the Month", context: "Creative Developer" },
  { year: "2025", title: "Speaker at WebGL Paris", context: "Advanced Shader Math" },
  { year: "2024", title: "Lead Systems Architect", context: "Enterprise Migration" }
];

const standingImages = [
  "/Sriju-stand.png",
  "/sriju-stand3.png",
  "/sriju-stand4.png"
];

export default function TheArchive() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const halfContainerRef = useRef<HTMLDivElement>(null);
  const standingRef = useRef<HTMLDivElement>(null);
  
  const [currentStandIndex, setCurrentStandIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // 5-Second Auto-Cycle for Standing Cutout Image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStandIndex((prev) => (prev + 1) % standingImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Background & Standing Cutout Parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".bg-text", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Scroll Parallax for standing cutout
      if (standingRef.current) {
        gsap.to(standingRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // 3D Interactive Mouse Tilt for Standing Cutout
  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (standingRef.current) {
      gsap.to(standingRef.current, {
        rotateY: x * 25,
        rotateX: -y * 15,
        x: x * 35,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const handleHeaderMouseLeave = () => {
    if (standingRef.current) {
      gsap.to(standingRef.current, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    const halfContainer = halfContainerRef.current;
    if (!container || !halfContainer) return;

    let scrollSpeed = 0.8; // Smooth, elegant speed

    const scrollLoop = () => {
      if (!isAutoScrolling) {
        animationRef.current = requestAnimationFrame(scrollLoop);
        return;
      }

      container.scrollLeft += scrollSpeed;

      // If we've scrolled past the exact width of the first set of items, snap back seamlessly
      // 32px accounts for the gap-8 between sets
      if (container.scrollLeft >= halfContainer.clientWidth + 32) { 
        container.scrollLeft -= (halfContainer.clientWidth + 32);
      }

      animationRef.current = requestAnimationFrame(scrollLoop);
    };

    animationRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAutoScrolling]);

  const handleUserInteraction = () => {
    setIsAutoScrolling(false);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    
    inactivityTimer.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 5000);
  };

  const renderProjectBox = (project: typeof projectsData[0], idx: number) => (
    <div key={idx} className="w-[320px] md:w-[450px] h-full flex-shrink-0 flex flex-col p-8 md:p-10 border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-700 rounded-[2rem] group relative overflow-hidden">
      
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex flex-col gap-4 mb-6 relative z-10">
        <span className="font-sans font-light text-[#c3a682] text-xs md:text-sm tracking-[0.2em] uppercase">
          {project.id} <span className="opacity-40 mx-2">/</span> {project.role}
        </span>
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-sans font-light text-[10px] md:text-xs tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-full px-5 py-2.5 transition-all duration-300 flex items-center justify-center gap-2 uppercase w-fit"
        >
          View Repository ↗
        </a>
      </div>
      
      <h3 className="font-serif text-3xl md:text-4xl text-zinc-200 mb-4 relative z-10 tracking-wide transition-colors duration-500 group-hover:text-white">
        {project.title}
      </h3>
      
      <p className="font-sans font-light text-sm text-zinc-400 leading-relaxed mb-8 relative z-10">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {project.stack.map((s, sIdx) => (
          <span key={sIdx} className="font-sans font-light text-[10px] md:text-xs tracking-widest uppercase px-4 py-1.5 bg-[#050505]/60 rounded-full border border-white/5 text-zinc-500">
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="relative w-full bg-[#050505] text-white overflow-hidden pb-32">
      
      {/* THE ARCHIVE HEADER & AUTO-CYCLING STANDING CUTOUT */}
      <div 
        className="relative w-full pt-20 pb-16 flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer [perspective:1000px]"
        onMouseMove={handleHeaderMouseMove}
        onMouseLeave={handleHeaderMouseLeave}
      >
        {/* Large ARCHIVE Text */}
        <h1 className="bg-text relative z-10 text-[20vw] md:text-[18vw] font-bold text-white/10 tracking-tighter font-serif uppercase text-center leading-none">
          ARCHIVE
        </h1>
        
        {/* Standing Cutout Container (In Front of ARCHIVE Title, Lowered Significantly to Floor Baseline) */}
        <div 
          ref={standingRef}
          className="absolute bottom-0 z-20 w-[280px] h-[450px] md:w-[460px] md:h-[680px] flex items-end justify-center pointer-events-none translate-y-16 md:translate-y-28"
        >
          {standingImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentStandIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image 
                src={src} 
                alt="Srija Standing" 
                fill 
                sizes="(max-width: 768px) 280px, 460px"
                className="object-contain object-bottom filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16">
        
        {/* SECTION I: HORIZONTAL AUTO-SCROLLING PROJECTS */}
        <div className="flex flex-col mb-40">
          <h2 className="text-xs md:text-sm font-sans font-light tracking-[0.3em] text-[#c3a682] uppercase mb-12 ml-2">
            Selected Works
          </h2>

          {/* Scrolling Container Wrapper (Fixed Fade Masks) */}
          <div className="relative w-full h-[450px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a]/30">
            
            {/* Left Fade Mask */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
            
            {/* Actual Scrollable Area */}
            <div 
              className="w-full h-full overflow-x-auto overflow-y-hidden hide-scrollbar relative py-6 md:py-8"
              ref={scrollContainerRef}
              onScroll={handleUserInteraction}
              onWheel={handleUserInteraction}
              onTouchMove={handleUserInteraction}
              onMouseEnter={() => setIsAutoScrolling(false)}
              onMouseLeave={() => {
                if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
                inactivityTimer.current = setTimeout(() => {
                  setIsAutoScrolling(true);
                }, 5000);
              }}
            >
              <div className="flex flex-row gap-8 pl-8 md:pl-16 h-full items-center w-max">
                {/* Set 1 (Tracked for exact width) */}
                <div ref={halfContainerRef} className="flex flex-row gap-8 h-full">
                  {projectsData.map((project, idx) => renderProjectBox(project, idx))}
                </div>
                
                {/* Set 2 (Duplicate for infinite illusion) */}
                <div className="flex flex-row gap-8 h-full pr-8 md:pr-16">
                  {projectsData.map((project, idx) => renderProjectBox(project, idx + projectsData.length))}
                </div>
              </div>
            </div>

            {/* Right Fade Mask */}
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />
          </div>

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        {/* SECTION II: THE LEDGER */}
        <div className="flex flex-col mt-20">
          <h2 className="text-xs md:text-sm font-sans font-light tracking-[0.3em] text-[#c3a682] uppercase mb-16 ml-2">
            The Ledger
          </h2>

          <div className="w-full flex flex-col group/ledger border-t border-white/10">
            {achievements.map((item, i) => (
              <div 
                key={i} 
                className="w-full flex flex-col md:flex-row md:items-center border-b border-white/10 py-10 transition-opacity duration-500 hover:!opacity-100 group-hover/ledger:opacity-30 cursor-crosshair"
              >
                <div className="w-full md:w-[20%] font-mono text-sm text-[#c3a682] tracking-widest mb-3 md:mb-0">
                  {item.year}
                </div>
                <div className="w-full md:w-[45%] text-2xl md:text-4xl font-serif text-zinc-200 tracking-wide">
                  {item.title}
                </div>
                <div className="w-full md:w-[35%] font-sans font-light text-xs text-zinc-500 tracking-[0.2em] md:text-right uppercase mt-3 md:mt-0">
                  {item.context}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}