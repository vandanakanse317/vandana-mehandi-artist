import { motion } from 'motion/react';
import { Baby, Crown, Flower2, GraduationCap, PartyPopper, Sparkles } from 'lucide-react';
import { services, type ServiceIcon } from '../data/services';

const iconMap = { Baby, Crown, Flower2, GraduationCap, PartyPopper, Sparkles } satisfies Record<ServiceIcon, typeof Crown>;

export function Services() {
  return (
    <section id="services" className="section-shell henna-pattern">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="section-kicker">Made for your moment</p>
          <h2 className="section-title">Our Services</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-stone-300">From intimate festivities to full bridal celebrations, every design is tailored with patience and clean, natural artistry.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.article key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="group rounded-3xl border border-white/10 bg-black/30 p-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:bg-black/40">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#D4AF37] transition group-hover:rotate-6 group-hover:bg-[#D4AF37] group-hover:text-[#1a0f0a]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl text-white">{service.title}</h3>
                <p className="mt-3 leading-7 text-stone-400">{service.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
