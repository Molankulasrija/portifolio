import CinematicIntro from "@/components/CinematicIntro";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import TheArchive from "@/components/TheArchive";
import TheEpilogue from "@/components/TheEpilogue";
import TheEndGame from "@/components/TheEndGame";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#050505]">
      <NavBar />
      <CinematicIntro />
      <Hero />
      <Dashboard />
      <TheArchive />
      <TheEpilogue />
      <TheEndGame />
    </main>
  );
}