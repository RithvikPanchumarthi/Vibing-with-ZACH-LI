import type { ReactNode } from "react";
import Image from "next/image";

type Article = {
  title: string;
  description: string;
  image: string;
};

const articles: Article[] = [
  {
    title: "A new category of career network",
    description: "Opportunity at scale — built for a fast-changing economy.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "What we’re building for the AI economy",
    description: "Safer systems, better outcomes, real work — for everyone.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  },
];

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  );
}

export default function NewsGrid() {
  return (
    <section className="w-full bg-[#121212] px-4 py-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tight text-cream md:text-5xl">
            Research and news
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#052326] p-8">
              <div className="flex items-center gap-2">
                <Pill>Updates</Pill>
              </div>
              <h3 className="mt-6 text-balance text-3xl font-black tracking-tight text-cream md:text-4xl">
                The career network for the AI economy
              </h3>
              <p className="mt-4 max-w-xl text-sm text-white/70">
                A bento-style hero card for the final stretch — swap in real
                research highlights and links after copy lock.
              </p>

              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:col-span-5">
            {articles.map((a) => (
              <article
                key={a.title}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1A1B23]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill>Updates</Pill>
                  </div>
                  <h3 className="text-pretty text-lg font-semibold tracking-tight text-cream">
                    {a.title}
                  </h3>
                  <p className="text-sm text-white/60">{a.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

