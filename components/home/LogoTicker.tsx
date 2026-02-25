"use client";

import { motion, useReducedMotion } from "framer-motion";

const orgs = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "OpenAI",
  "Stripe",
  "Salesforce",
  "NVIDIA",
] as const;

function LogoText({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap text-base font-semibold tracking-wide text-white/70 md:text-lg">
      {label}
    </span>
  );
}

export default function LogoTicker() {
  const reduceMotion = useReducedMotion();

  const row = (
    <div className="flex items-center gap-16 pr-16">
      {orgs.map((label) => (
        <LogoText key={label} label={label} />
      ))}
    </div>
  );

  return (
    <section className="w-full bg-[#121212] px-4 py-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center justify-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold tracking-wide text-white/85">
            Looking forward to collaborate
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 py-10">
          <div className="wv-edge-fade">
            <motion.div
              className="flex w-max items-center will-change-transform"
              animate={reduceMotion ? undefined : { x: [0, "-50%"] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 28, ease: "linear", repeat: Infinity }
              }
            >
              {row}
              <div aria-hidden className="flex items-center gap-16 pr-16">
                {orgs.map((label) => (
                  <LogoText key={`dup-${label}`} label={label} />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#121212] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#121212] to-transparent" />
        </div>
      </div>
    </section>
  );
}

