"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    position: "object-center",
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2850&q=80",
    position: "object-center",
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80",
    position: "object-center",
  },
  {
    url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=2850&q=80",
    position: "object-center",
  },
  {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2850&q=80",
    position: "object-one-thirds-top",
  },
  {
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2850&q=80",
    position: "object-center",
  },
] as const;

const words = ["CAREER", "TALENT", "VIBE"] as const;

export default function HeroSection() {
  const [tick, setTick] = useState(0);
  const currentImageIndex = tick % heroImages.length;
  const currentImage = heroImages[currentImageIndex];
  const currentWord = words[tick % words.length];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="w-full px-4 pt-2 md:px-6">
      <div className="relative mx-auto h-[70vh] w-full max-w-[1400px] overflow-hidden rounded-[2rem] md:h-[75vh]">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.url}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <Image
                src={currentImage.url}
                alt="WorkVibe hero background"
                fill
                sizes="100vw"
                className={`object-cover ${currentImage.position ?? "object-center"}`}
                priority={currentImageIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 z-10 bg-black/60" />

        <div className="absolute inset-0 z-20 flex flex-col items-start justify-end p-8 pb-12 md:p-16 md:pb-24">
          <h1 className="flex flex-col gap-2 font-display text-[3rem] font-black uppercase leading-tight tracking-normal md:text-[5rem]">
            <span className="block text-white">FIND YOUR</span>
            <span className="relative flex h-[1em]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, position: "absolute" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute left-0 top-0 text-[#D3FB52]"
                >
                  {currentWord}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
