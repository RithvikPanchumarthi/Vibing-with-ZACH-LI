import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full px-4 pt-2 md:px-6">
      <div className="relative mx-auto h-[70vh] w-full max-w-[1400px] overflow-hidden rounded-[2rem] md:h-[75vh]">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
          alt="Diverse team collaborating in a modern office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-center font-display text-[8rem] leading-[0.8] tracking-tighter text-cream uppercase md:text-[12rem]">
            GROW YOUR
            <br />
            CAREER
          </h1>
        </div>
      </div>
    </section>
  );
}
