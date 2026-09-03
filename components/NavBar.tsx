"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NavBar() {
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Initial drop-down cinematic animation
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 1.5 }
    );
  }, []);

  const handleHover = (index: number, isHovering: boolean) => {
    if (linksRef.current[index]) {
      gsap.to(linksRef.current[index], {
        scale: isHovering ? 1.05 : 1.0,
        color: isHovering ? "#ffffff" : "#a1a1aa",
        textShadow: isHovering ? "0px 0px 15px rgba(255,255,255,0.8)" : "none",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const navItems = [
    { name: "Dashboard", id: "dashboard" },
    { name: "Archive", id: "archive" },
    { name: "Contact", id: "contact" }
  ];

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav 
      ref={navRef}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-10 py-4 rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/30 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8),_0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center gap-10 md:gap-16 transition-all duration-700 hover:bg-[#0a0a0a]/50 hover:border-white/20 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8),_0_0_40px_rgba(255,255,255,0.1)]"
    >
      {navItems.map((item, index) => (
        <a
          key={item.name}
          href={`#${item.id}`}
          ref={(el) => { linksRef.current[index] = el; }}
          onMouseEnter={() => handleHover(index, true)}
          onMouseLeave={() => handleHover(index, false)}
          className="font-sans text-[10px] md:text-xs font-light tracking-[0.3em] uppercase text-zinc-400 transition-colors cursor-pointer select-none"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(item.id);
          }}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
}
