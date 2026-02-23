import Image from "next/image";

const cards = [
  {
    title: "Job seekers",
    description: "Find everything from full time jobs to AI gigs",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Recruiters",
    description: "Connect with tech-fluent candidates",
    image:
      "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AI labs",
    description: "Improve models with human intelligence",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Higher ed",
    description: "Guide students with expertise",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AudienceCards() {
  return (
    <section className="w-full bg-[#F9F6EE] px-4 py-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full border border-black/20 px-4 py-1 text-xs font-semibold tracking-wide text-[#121212]">
              Who uses WorkVibe
            </span>
            <h2 className="text-balance text-3xl font-black tracking-tight text-[#121212] md:text-5xl">
              The largest, most trusted network for work and careers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-3xl ring-1 ring-black/10"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-sm font-semibold tracking-wide text-white/90">
                    {card.title}
                  </p>
                  <p className="mt-2 text-pretty text-lg font-semibold tracking-tight text-white">
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

