const stats = [
  "1M+ employers",
  "500K+ PhDs",
  "1600+ universities",
  "3M+ masters",
  "20M+ job seekers",
];

export default function PlatformStats() {
  return (
    <section className="w-full bg-[#121212] px-4 pb-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center justify-center gap-6 text-center md:flex-row md:gap-8">
          {stats.map((stat, idx) => {
            const [number, ...rest] = stat.split(" ");
            const label = rest.join(" ");

            return (
              <div key={stat} className="contents">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black tracking-tight text-cream md:text-5xl">
                    {number}
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-white/70 md:text-xl">
                    {label}
                  </span>
                </div>

                {idx < stats.length - 1 && (
                  <span className="h-2 w-2 rounded-full bg-brand md:mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

