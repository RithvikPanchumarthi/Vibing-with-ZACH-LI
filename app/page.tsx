import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CtaGrid from "@/components/CtaGrid";
import GradientScroll from "@/components/home/GradientScroll";
import AudienceCards from "@/components/home/AudienceCards";
import BuiltForEveryone from "@/components/home/BuiltForEveryone";
import PlatformStats from "@/components/home/PlatformStats";
import LogoTicker from "@/components/home/LogoTicker";
import AiFeatureBlock from "@/components/home/AiFeatureBlock";
import NewsGrid from "@/components/home/NewsGrid";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CtaGrid />
        <GradientScroll />
        <AudienceCards />
        <BuiltForEveryone />
        <PlatformStats />
        <LogoTicker />
        <AiFeatureBlock />
        <NewsGrid />
      </main>
    </>
  );
}
