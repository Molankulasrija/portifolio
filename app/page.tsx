import CinematicIntro from "@/components/CinematicIntro";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Archive from "@/components/Archive";

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505] min-h-screen">
      <CinematicIntro />
      <Hero />
      <Dashboard />
      <Archive />
    </main>
  );
}