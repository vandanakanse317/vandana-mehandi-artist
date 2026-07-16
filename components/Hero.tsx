import { motion } from 'motion/react';
import { ArrowRight, Leaf } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[760px] items-center overflow-hidden pt-28">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/backgrounds/hero.JPG")' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090504]/95 via-[#1a0f0a]/82 to-[#1a0f0a]/40" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_35%,rgba(212,175,55,.4),transparent_25%)]" />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/30 px-4 py-2 text-sm text-[#e5c568] backdrop-blur-md">
            <Leaf className="h-4 w-4" /> Professional mehandi in Shrirampur
          </div>
          <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-8xl">
            Beautiful stories,
            <span className="block italic text-[#D4AF37]">drawn by hand.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">Elegant mehandi for weddings, engagements, festivals, baby showers, and every celebration that deserves a memorable detail.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-[#1a0f0a] transition hover:bg-[#e5c568]">Book an Appointment <ArrowRight className="h-4 w-4" /></a>
            <a href="#gallery" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10">View Our Work</a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
