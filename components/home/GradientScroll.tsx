"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export default function GradientScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const actions = ["find jobs", "find AI work", "hire now", "train your model"] as const;
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(actions.length - 1, Math.max(0, Math.floor(latest * actions.length)));
    setActiveIndex(idx);
  });

  const glow = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "0px 0px 0px rgba(211, 251, 82, 0)",
      "0px 0px 28px rgba(211, 251, 82, 0.55)",
      "0px 0px 40px rgba(211, 251, 82, 0.8)",
    ],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "-10deg"]);
  const rotateY = useTransform(scrollYProgress, [0, 1], ["0deg", "12deg"]);

  return (
    <section ref={sectionRef} className="w-full px-4 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative h-[400vh] overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#D3FB52] to-[#052326]">
          <div className="sticky top-0 flex h-[100svh] items-center justify-center bg-transparent px-6">
            <div className="w-full max-w-3xl text-center">
              <h2 className="text-balance text-4xl font-black tracking-tight text-black md:text-6xl">
                AI reinvented work
                <br />
                We&apos;re here to help you
              </h2>

              <ul className="mt-10 space-y-4">
                {actions.map((action, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <li key={action} className="flex justify-center">
                      <span
                        className={`inline-flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "rounded-full bg-[#121212] px-6 py-2 text-white scale-110"
                            : "text-black/40 scale-100"
                        }`}
                      >
                        <span className="text-base font-semibold tracking-tight md:text-lg">
                          {action}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-12 space-y-5">
                <motion.div
                  style={{
                    boxShadow: glow,
                    scale,
                    rotate,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-[#121212] shadow-xl"
                >
                  <div className="flex font-display text-6xl font-black tracking-tighter">
                    <span className="text-white">V</span>
                    <span className="-ml-3 text-[#D3FB52]">V</span>
                  </div>
                </motion.div>

                <Link
                  href="/vision"
                  className="inline-flex text-sm font-semibold text-black underline-offset-4 hover:underline"
                >
                  Read the vision -&gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

