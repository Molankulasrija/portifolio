"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function MagneticButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const moveButton = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;

      gsap.to(button, { x, y, duration: 0.8, ease: "power3.out" });
      gsap.to(textRef.current, { x: x * 0.5, y: y * 0.5, duration: 0.8, ease: "power3.out" });
    };

    const resetButton = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
      gsap.to(textRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    };

    button.addEventListener("mousemove", moveButton);
    button.addEventListener("mouseleave", resetButton);

    return () => {
      button.removeEventListener("mousemove", moveButton);
      button.removeEventListener("mouseleave", resetButton);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className="relative w-full py-5 rounded-full border border-rose-500/20 bg-rose-500/5 backdrop-blur-md overflow-hidden group hover:bg-rose-500/10 hover:border-rose-400/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-500 flex items-center justify-center"
    >
      <span ref={textRef} className="font-light text-xs tracking-[0.2em] text-rose-100 uppercase pointer-events-none group-hover:text-white transition-colors duration-500">
        Download Resume
      </span>
    </button>
  );
}
