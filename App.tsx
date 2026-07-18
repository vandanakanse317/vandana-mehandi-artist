import { useState } from 'react';
import { Instagram, Menu, X } from 'lucide-react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Logo } from './components/Logo';
import { VisitUs } from './components/VisitUs';
import { contact } from './data/contact';
import { classTopics, testimonials, whyChooseUs } from './data/siteData';
import { siteSettings } from './data/settings';

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#1a0f0a] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/15 bg-[#0a0604]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" aria-label="Vandana Mehandi Artist home">
            <Logo size="md" />
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {siteSettings.navigation.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-stone-300 transition hover:text-[#e5c568]">
                {item.label}
              </a>
            ))}
            <a href="#contact" className="rounded-full bg-[#D4AF37] px-5 py-2.5 font-semibold text-[#1a0f0a] transition hover:bg-[#e5c568]">
              Book Now
            </a>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 p-2 text-white md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="border-t border-white/10 bg-[#0a0604] px-4 py-4 md:hidden">
            {siteSettings.navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="block rounded-lg px-4 py-3 text-stone-200 hover:bg-white/10">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main>
        <Hero />
        <section className="border-y border-white/10 bg-white/[0.04] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="section-kicker">The Vandana standard</p>
              <h2 className="section-title">Why Choose Us</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseUs.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                  <span className="mb-5 block font-serif text-3xl text-[#D4AF37]">0{index + 1}</span>
                  <p className="leading-relaxed text-stone-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="classes" className="section-shell henna-pattern">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="section-kicker">Learn the craft</p>
              <h2 className="section-title text-left">Mehandi Classes</h2>
              <p className="mt-6 max-w-lg leading-8 text-stone-300">Practical, patient instruction for beginners and developing artists, from confident cone control to complete bridal layouts.</p>
              <a href="#contact" className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-7 py-3.5 font-semibold text-[#1a0f0a] transition hover:bg-[#e5c568]">Ask About Classes</a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {classTopics.map((topic, index) => (
                <div key={topic} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D4AF37]/50 text-sm text-[#D4AF37]">{index + 1}</span>
                  <span className="text-stone-200">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Gallery />

        <VisitUs />
        <About />
        <Contact />
      </main>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <a href={contact.instagram} target="_blank" rel="noreferrer" className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-tr from-[#b98543] via-[#a33d55] to-[#74355f] shadow-xl transition hover:-translate-y-1" aria-label="Instagram">
          <Instagram className="h-6 w-6" />
        </a>
        <a href={`${contact.whatsappUrl}?text=${encodeURIComponent('Hi, I would like to inquire about Mehandi services.')}`} target="_blank" rel="noreferrer" className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-xl transition hover:-translate-y-1 hover:bg-[#20b858]" aria-label="WhatsApp">
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
