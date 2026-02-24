"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GradientScroll() {
  const actions = ["find jobs", "find AI work", "hire now", "train your model"] as const;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % actions.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [actions.length]);

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#D3FB52] to-[#052326] px-6">
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
            className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-[#121212] shadow-xl"
            animate={{
              boxShadow: [
                "0px 0px 10px rgba(211, 251, 82, 0.25)",
                "0px 0px 40px rgba(211, 251, 82, 0.85)",
                "0px 0px 10px rgba(211, 251, 82, 0.25)",
              ],
              scale: [1, 1.08, 1],
              rotate: [0, -4, 0],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
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
    </section>
  );
}

