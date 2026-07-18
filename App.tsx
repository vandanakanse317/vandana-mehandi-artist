import { useState } from 'react';
import { Instagram, Menu, X } from 'lucide-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Contact } from './components/Contact';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Logo } from './components/Logo';
import { VisitUs } from './components/VisitUs';
import { WelcomePopup } from './components/WelcomePopup';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import { contact } from './data/contact';
import { classTopics } from './data/siteData';
import { siteSettings } from './data/settings';
import { Admin } from './components/Admin';

function MainSite() {
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
      <WelcomePopup />
      <main>
        <Hero />
        <Gallery />
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
        <VisitUs />
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}
