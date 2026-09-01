import CinematicIntro from "@/components/CinematicIntro";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505]">
      {/* Page 1: Scroll-driven interactive headline sequence */}
      <CinematicIntro />
      
      {/* Page 2: The Particle Constellation Portrait & Lens Reveal */}
      <Hero />
    </main>
  );
}