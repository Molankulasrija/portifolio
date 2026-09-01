import Hero from "@/components/Hero";
//import CinematicIntro from "@/components/CinematicIntro";

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505] min-h-screen">
      {/* 
        Commented out the cinematic intro temporarily so we can verify 
        the portrait is rendering perfectly without waiting 5 seconds.
        Remove the // to turn it back on later!
      */}
      {/* <CinematicIntro /> */}
      
      <Hero />
      
      {/* A temporary spacer to allow you to scroll and test the dissolve */}
      <div className="h-screen w-full bg-[#050505]" />
    </main>
  );
}