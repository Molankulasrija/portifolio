"use client";

import MiniGame from "./MiniGame";

export default function TheEndGame() {
  return (
    <section id="contact" className="relative w-full h-screen bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
      
      {/* Giant Typography Background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-20 z-0">
        <h1 
          className="text-[18vw] md:text-[15vw] font-bold tracking-tighter leading-[0.8] text-zinc-700"
          style={{ fontFamily: "var(--font-playfair, serif)" }}
        >
          SRIJA
        </h1>
        <h1 
          className="text-[11vw] md:text-[9vw] font-bold tracking-tighter leading-[0.8] text-zinc-700"
          style={{ fontFamily: "var(--font-playfair, serif)" }}
        >
          MOLANKULA
        </h1>
      </div>

      {/* Interactive Layer */}
      <div className="absolute inset-0 z-10 w-full h-full p-6 md:p-12">
        <div className="w-full h-full">
          <MiniGame />
        </div>
      </div>

    </section>
  );
}
