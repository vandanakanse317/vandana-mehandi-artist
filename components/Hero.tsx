import { motion } from 'motion/react';
import { ArrowRight, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext'; // trigger sync

function Sparkles() {
  const [sparkles, setSparkles] = useState<{ id: number, size: number, top: string, left: string, duration: number, delay: number }[]>([]);

  useEffect(() => {
    const generateSparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setSparkles(generateSparkles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-[#D4AF37] blur-[1px]"
          style={{ width: sparkle.size, height: sparkle.size, top: sparkle.top, left: sparkle.left }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: [0, -30]
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const { settings } = useSettings();
  return (
    <section id="home" className="relative flex min-h-[760px] items-center overflow-hidden pt-28">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero/hero.JPG")' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090504]/95 via-[#1a0f0a]/82 to-[#1a0f0a]/40" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_70%_35%,rgba(212,175,55,.4),transparent_25%)]" />
      <Sparkles />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/30 px-4 py-2 text-sm text-[#e5c568] backdrop-blur-md">
            <Leaf className="h-4 w-4" /> Professional mehandi in Shrirampur
          </div>
          <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-8xl whitespace-pre-line">
            {settings.heroHeading}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300 whitespace-pre-line">{settings.heroSubtitle}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-[#1a0f0a] transition hover:bg-[#e5c568]">Book an Appointment <ArrowRight className="h-4 w-4" /></a>
            <a href="#gallery" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10">View Our Work</a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
