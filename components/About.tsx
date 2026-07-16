import { Award, Heart, Leaf, MapPin } from 'lucide-react';

const highlights = [
  { label: 'Natural mehandi', Icon: Leaf },
  { label: 'Made with care', Icon: Heart },
  { label: 'Professional finish', Icon: Award },
  { label: 'Shrirampur based', Icon: MapPin },
];

export function About() {
  return (
    <section id="about" className="section-shell bg-[#130b08]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[url('/images/gallery/mandala.svg')] bg-cover bg-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[#120a07]/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-md">
            <p className="font-serif text-2xl text-white">Art rooted in tradition</p>
            <p className="mt-1 text-sm text-stone-300">Created carefully, one line at a time.</p>
          </div>
        </div>
        <div>
          <p className="section-kicker">About the artist</p>
          <h2 className="section-title text-left">A personal touch for every celebration</h2>
          <p className="mt-6 leading-8 text-stone-300">Vandana Mehandi Artist is a professional mehandi service based in Shrirampur, Maharashtra. Every appointment blends traditional technique, contemporary composition, and careful attention to comfort and detail.</p>
          <p className="mt-4 leading-8 text-stone-400">Designs are adapted to your event, style, and available time—from elegant festival trails to deeply detailed bridal work.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {highlights.map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Icon className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-stone-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
