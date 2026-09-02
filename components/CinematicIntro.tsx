"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=3000", // Scroll distance required to complete the intro sequence
          scrub: true,   // Direct coupling to the mouse wheel / scrollbar
          pin: true,     // Pins the intro section in place during the scroll
        }
      });

      // Initial hidden states
      gsap.set([text1Ref.current, text2Ref.current, nameRef.current], { yPercent: 100, opacity: 0 });

      // 1. First headline scrolls into view
      tl.to(text1Ref.current, { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" })
        .to(text1Ref.current, { yPercent: -100, opacity: 0, duration: 1, ease: "power2.in" }, "+=0.5")

      // 2. Second headline scrolls into view
        .to(text2Ref.current, { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" })
        .to(text2Ref.current, { yPercent: -100, opacity: 0, duration: 1, ease: "power2.in" }, "+=0.5")

      // 3. Final name reveal for Srija Molankula
        .to(nameRef.current, { yPercent: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" })
        .to(nameRef.current, { scale: 1.05, duration: 1 }, "+=0.5"); // Subtle breathing pause while pinned

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={pinRef}
        className="relative h-screen w-full flex items-center justify-center bg-[#050505] text-white overflow-hidden"
      >
        <div className="relative flex flex-col items-center justify-center h-[200px] w-full text-center px-4">
          
          <h2 className="absolute text-xl md:text-3xl font-mono tracking-[0.2em] text-zinc-400">
            <span ref={text1Ref} className="block">SOFTWARE ENGINEER & ARCHITECT</span>
          </h2>

          <h2 className="absolute text-lg md:text-2xl font-mono tracking-[0.2em] text-zinc-300">
            <span ref={text2Ref} className="block">DISTRIBUTED SYSTEMS & WEBGL</span>
          </h2>

          <h1 className="absolute text-5xl md:text-8xl font-bold tracking-tight uppercase w-full text-white">
            <span ref={nameRef} className="block">SRIJA MOLANKULA</span>
          </h1>
          
        </div>
      </div>
    </div>
  );
}