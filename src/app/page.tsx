import HeroSection from "@/components/home-hero-section";
import Carousels from "@/components/home-carousels";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <HeroSection />
      <div className="relative z-10 py-24 w-full">
        <Carousels />
      </div>
    </div>
  );
}
