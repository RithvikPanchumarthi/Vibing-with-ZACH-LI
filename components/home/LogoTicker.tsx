"use client";

import { motion, useReducedMotion } from "framer-motion";

const orgs = [
  "Anheuser-Busch",
  "TikTok",
  "Cornell University",
  "Wake Forest University",
  "UNC Asheville",
  "Wellesley",
  "UPS",
];

function LogoText({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-white/75 md:text-base">
      {label}
    </span>
  );
}

export default function LogoTicker() {
  const reduceMotion = useReducedMotion();

  const row = (
    <div className="flex items-center gap-10 pr-10">
      {orgs.map((label) => (
        <LogoText key={label} label={label} />
      ))}
    </div>
  );

  return (
    <section className="w-full bg-[#121212] px-4 py-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center justify-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold tracking-wide text-white/80">
            [Trusted by leading organizations]
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 py-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#121212] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#121212] to-transparent" />

          <motion.div
            className="flex w-max items-center"
            animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 22, ease: "linear", repeat: Infinity }
            }
          >
            {row}
            <div aria-hidden className="flex items-center gap-10 pr-10">
              {orgs.map((label) => (
                <LogoText key={`dup-${label}`} label={label} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

