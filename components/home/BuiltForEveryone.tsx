"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const allRoles = [
  "bankers",
  "academics",
  "creators",
  "engineers",
  "founders",
  "side hustlers",
  "musicians",
  "teachers",
  "doctors",
  "lawyers",
  "students",
  "professionals",
  "interns",
  "designers",
  "developers",
  "writers",
  "marketers",
  "analysts",
  "researchers",
  "managers",
  "product builders",
  "operators",
  "data scientists",
  "consultants",
  "recruiters",
  "entrepreneurs",
  "artists",
  "community leaders",
  "founding teams",
  "educators",
] as const;

const roleStyles = [
  "bg-brand text-black",
  "bg-cyan-300 text-black",
  "bg-cyan-500 text-black",
  "bg-lime-200 text-black",
  "bg-blue-500 text-white",
  "bg-indigo-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-emerald-400 text-black",
  "bg-white/10 text-white",
] as const;

function randomInt(maxExclusive: number) {
  return Math.floor(Math.random() * maxExclusive);
}

function pickUniqueRoles(count: number) {
  const pool = [...allRoles];
  const picked: string[] = [];
  while (picked.length < count && pool.length > 0) {
    const idx = randomInt(pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}

function styleForRole(role: string) {
  let hash = 0;
  for (let i = 0; i < role.length; i += 1) {
    hash = (hash * 31 + role.charCodeAt(i)) >>> 0;
  }
  return roleStyles[hash % roleStyles.length];
}

export default function BuiltForEveryone() {
  const initialRoles = useMemo(() => pickUniqueRoles(12), []);
  const [visibleRoles, setVisibleRoles] = useState<string[]>(initialRoles);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisibleRoles((prev) => {
        if (prev.length === 0) return prev;

        const next = [...prev];
        const replaceIndex = randomInt(next.length);

        const visible = new Set(next);
        const candidates = allRoles.filter((r) => !visible.has(r));
        if (candidates.length === 0) return prev;

        const replacement = candidates[randomInt(candidates.length)];
        next[replaceIndex] = replacement;
        return next;
      });
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="w-full bg-[#121212] px-4 py-20 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative py-10 md:py-16">
          <h2 className="mb-12 pb-8 text-center font-display text-[3.75rem] font-black leading-tight tracking-normal text-cream md:text-[7.25rem] md:leading-none">
            BUILT
            <br />
            FOR
            <br />
            EVERYONE
          </h2>

          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
            <AnimatePresence mode="popLayout">
              {visibleRoles.map((role) => (
                <motion.div
                  key={role}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold tracking-tight ${styleForRole(
                    role,
                  )}`}
                >
                  {role}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

