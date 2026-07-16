import { Clock3, MapPin, Navigation } from 'lucide-react';
import { contact } from '../data/contact';

export function VisitUs() {
  return (
    <section id="visit-us" className="section-shell henna-pattern">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="section-kicker">Studio & home service</p>
          <h2 className="section-title">Visit Us</h2>
          <p className="mx-auto mt-5 max-w-2xl text-stone-300">Find us in Shrirampur or contact us to discuss home service availability for your event.</p>
        </div>
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-2xl lg:grid-cols-[1.45fr_0.75fr]">
          <iframe title="Vandana Mehandi Artist location" src={contact.googleMapsEmbed} className="min-h-[430px] w-full border-0 grayscale-[0.2]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <div className="mb-7 flex gap-4">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" />
              <div><h3 className="font-serif text-2xl">Shrirampur Studio</h3><p className="mt-2 leading-7 text-stone-400">{contact.address}<br />Studio appointments and home services available.</p></div>
            </div>
            <div className="mb-8 flex gap-4">
              <Clock3 className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" />
              <div><h3 className="font-serif text-xl">By appointment</h3><p className="mt-2 text-stone-400">Please call or message before visiting so your time is reserved.</p></div>
            </div>
            <div className="flex flex-col gap-3">
              <a href={contact.googleDirections} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3.5 font-semibold text-[#1a0f0a] transition hover:bg-[#e5c568]"><Navigation className="h-4 w-4" /> Get Directions</a>
              <a href={contact.googleMapsLink} target="_blank" rel="noreferrer" className="inline-flex justify-center rounded-full border border-white/20 px-6 py-3.5 font-semibold transition hover:bg-white/10">Open in Google Maps</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
