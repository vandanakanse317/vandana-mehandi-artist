import { Instagram, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext'; // Trigger sync
import { WhatsAppIcon } from './WhatsAppIcon';

export function VisitUs() {
  const { settings } = useSettings();
  return (
    <section id="visit-us" className="section-shell bg-[#1a0f0a] relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] mix-blend-screen pointer-events-none blur-[2px]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80")' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-transparent to-[#1a0f0a] pointer-events-none z-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <p className="section-kicker">Find Us</p>
          <h2 className="section-title">Visit Us</h2>
          <p className="mx-auto mt-5 max-w-2xl text-stone-300">
            Come visit our studio for a premium mehandi experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Map */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl lg:h-full">
              <iframe
                title="Google Maps Location"
                src={settings.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:p-12">
            <h3 className="mb-6 font-serif text-3xl text-[#D4AF37]">Contact & Location</h3>
            
            <div className="mb-10 space-y-6">
              <div className="flex items-start gap-4 text-stone-300">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" />
                <div>
                  <h4 className="mb-1 font-medium text-white">Address</h4>
                  <p className="leading-relaxed">{settings.address}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-white transition hover:bg-white/10 hover:text-[#D4AF37]"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </a>
              <a
                href={`${settings.whatsappUrl}?text=${encodeURIComponent('Hi, I would like to inquire about Mehandi services.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl bg-[#25D366]/10 px-6 py-4 font-medium text-[#25D366] transition hover:bg-[#25D366]/20"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-tr from-[#b98543]/20 via-[#a33d55]/20 to-[#74355f]/20 px-6 py-4 font-medium text-white transition hover:border-[#b98543]/50"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
              <a
                href={settings.googleDirections}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] px-6 py-4 font-medium text-[#1a0f0a] transition hover:bg-[#e5c568]"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
