const tags = [
  { label: "bankers", className: "bg-brand text-black" },
  { label: "academics", className: "bg-white/10 text-white" },
  { label: "creators", className: "bg-cyan-400 text-black" },
  { label: "engineers", className: "bg-blue-500 text-white" },
  { label: "founders", className: "bg-purple-500 text-white" },
  { label: "side hustlers", className: "bg-lime-200 text-black" },
  { label: "musicians", className: "bg-pink-500 text-white" },
  { label: "teachers", className: "bg-emerald-400 text-black" },
  { label: "doctors", className: "bg-white/10 text-white" },
  { label: "lawyers", className: "bg-cyan-200 text-black" },
  { label: "students", className: "bg-brand text-black" },
  { label: "professionals", className: "bg-indigo-500 text-white" },
  { label: "interns", className: "bg-white/10 text-white" },
];

export default function BuiltForEveryone() {
  return (
    <section className="w-full bg-[#121212] px-4 py-20 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative py-10 md:py-16">
          <h2 className="text-center font-display text-[3.75rem] font-black leading-[0.85] tracking-tighter text-cream md:text-[7.25rem]">
            BUILT
            <br />
            FOR
            <br />
            EVERYONE
          </h2>

          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className={`inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold tracking-tight ${tag.className}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

