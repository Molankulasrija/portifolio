"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillsList = [
  { category: "Core & Systems", items: ["C / C++", "Rust", "Java", "Python", "Distributed Systems", "Software Architecture"] },
  { category: "Frontend & 3D", items: ["WebGL & GLSL", "Three.js / R3F", "React / Next.js", "TypeScript", "Tailwind CSS", "GSAP Animations"] },
  { category: "Cloud & Infrastructure", items: ["Docker", "Kubernetes", "AWS / GCP", "CI/CD Pipelines", "GraphQL / REST APIs", "PostgreSQL / Redis"] }
];

export default function Dashboard() {
  const containerRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very slow, extremely subtle parallax on the portrait
      gsap.to(portraitRef.current, {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Staggered fade-in and slide-up for skill pills
      gsap.from(".skill-pill", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: expertiseRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-[#050505] text-white px-6 md:px-12 py-32 z-10 flex justify-center overflow-hidden dashboard-section"
    >
      
      {/* The Ambient Glow: Deep dark-burgundy/rose-gold light bleeding into the background */}
      <div className="absolute top-1/2 -translate-y-1/2 right-10 w-[600px] h-[600px] bg-rose-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-16 lg:gap-32 relative z-10">
        
        {/* LEFT COLUMN: Identity Anchor (Sticky) */}
        <div className="w-full md:w-[45%] h-fit md:sticky top-32 flex flex-col gap-10">
          
          {/* Minimalist Portrait Container */}
          <div className="w-full aspect-[4/5] relative rounded-3xl overflow-hidden border border-white/5 p-1 bg-[#050505]">
            <div className="relative w-full h-full rounded-[1.3rem] overflow-hidden bg-[#0a0a0a]">
              <div ref={portraitRef} className="absolute -inset-10 portrait-img">
                <Image 
                  src="/Srija-Square.jpg" 
                  alt="Srija Molankula" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover opacity-90"
                  priority
                />
                {/* Extremely subtle dark gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-serif tracking-wide text-zinc-100">
              Srija Molankula
            </h2>
            <p className="font-sans font-light text-sm text-zinc-400 tracking-widest uppercase mt-2">
              Software Architect
            </p>
          </div>
          
        </div>

        {/* RIGHT COLUMN: The Expertise Matrix */}
        <div className="w-full md:w-[55%] flex flex-col gap-16 pt-8" ref={expertiseRef}>
          
          {/* Massive Centered Serif Heading */}
          <div className="w-full text-center mb-4">
            <h3 className="font-serif text-5xl md:text-6xl tracking-wide text-zinc-200">
              Expertise
            </h3>
          </div>

          <div className="flex flex-col gap-12">
            {skillsList.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-5 border-l-2 border-rose-900/40 pl-6">
                
                {/* Muted Rose-Gold Header */}
                <span className="font-sans text-xs text-rose-300/60 uppercase tracking-[0.2em] font-medium">
                  {cat.category}
                </span>
                
                <div className="flex flex-wrap gap-3">
                  {cat.items.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="skill-pill font-sans text-sm font-light px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:border-white hover:text-white hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
