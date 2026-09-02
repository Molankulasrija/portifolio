"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function TheEpilogue() {
  const [time, setTime] = useState<string>("");
  const containerRef = useRef<HTMLElement>(null);

  // Live Clock Effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        timeZone: "Asia/Kolkata", 
        hour: "2-digit", 
        minute: "2-digit",
        timeZoneName: "short"
      }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#050505] text-white flex flex-col py-32 overflow-hidden border-t border-white/5"
    >
      
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-16">
        
        {/* Left: The Emotional Core */}
        <div className="w-full md:w-[55%] flex flex-col gap-6 z-10">
          <h2 className="text-sm font-mono tracking-[0.3em] text-[#c3a682] uppercase">
            The Epilogue
          </h2>
          <p 
            className="text-3xl md:text-5xl font-light text-zinc-300 leading-tight"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            Systems scale. <br />
            <span className="text-white italic">Experiences linger.</span>
          </p>
          <p className="text-sm md:text-base text-zinc-500 font-light max-w-md mt-4 leading-relaxed">
            Great architecture isn't just about flawless code—it's about the people we build it for. If you are looking to craft something meaningful and visually unforgettable, let's start a conversation.
          </p>
        </div>

        {/* Right: The Minimalist Links */}
        <div className="w-full md:w-1/3 flex flex-col gap-8 md:items-end z-10">
          <div className="flex flex-col gap-4 text-left md:text-right">
            <h3 className="text-xs font-mono tracking-[0.2em] text-zinc-600 uppercase mb-2">
              Initiate Protocol
            </h3>
            
            {["hello@srija.dev", "LinkedIn", "GitHub", "Twitter / X"].map((link, i) => (
              <a 
                key={i} 
                href="#" 
                className="group relative text-xl md:text-2xl font-light text-zinc-300 hover:text-white transition-colors duration-300 w-fit md:ml-auto"
              >
                {link}
                <span className="absolute -bottom-1 right-0 w-0 h-[1px] bg-[#c3a682] transition-all duration-500 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:items-end gap-1">
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 uppercase">
              Local Time / IST
            </span>
            <span className="text-sm font-mono tracking-widest text-[#c3a682]">
              {time || "00:00 AM"}
            </span>
          </div>
        </div>

      </div>
      
    </section>
  );
}
