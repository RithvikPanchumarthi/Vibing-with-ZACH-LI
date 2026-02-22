import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CtaGrid from "@/components/CtaGrid";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CtaGrid />
      </main>
    </>
  );
}
