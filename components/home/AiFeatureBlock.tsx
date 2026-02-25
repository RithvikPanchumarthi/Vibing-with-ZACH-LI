"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fellows = [
  {
    title: "Hear from fellows",
    label: "Fellow story • 2:14",
    src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "From application to impact",
    label: "Fellow story • 1:58",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AiFeatureBlock() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-[#121212] px-4 py-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-3xl bg-[#1A1B23] px-6 py-12 md:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-5">
              <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-wide text-white/80">
                [WorkVibe AI]
              </span>
              <h2 className="text-balance text-3xl font-black tracking-tight text-cream md:text-5xl">
                Make AI smarter, safer, and better, while learning and earning in
                a new industry.
              </h2>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
              >
                Work with top AI labs -&gt;
              </Link>
            </div>

            <div className="w-full lg:max-w-[620px]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold tracking-wide text-white/80">
                  Hear from fellows
                </p>
                <p className="text-xs text-white/50">Swipe</p>
              </div>

              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {fellows.map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    className="min-w-[260px] snap-start"
                  >
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1016]">
                      <div className="relative aspect-video">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/25" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-brand/40 blur-xl" />
                            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm">
                              <Play className="h-5 w-5 fill-white text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 p-4">
                        <p className="text-sm font-semibold tracking-tight text-cream">
                          {item.title}
                        </p>
                        <p className="text-xs text-white/55">{item.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

