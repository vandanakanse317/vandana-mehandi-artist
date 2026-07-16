import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { contact } from '../data/contact';
import { services } from '../data/services';
import { siteSettings } from '../data/settings';
import { Logo } from './Logo';
import { QuickInquiryForm } from './QuickInquiryForm';

export function Contact() {
  return (
    <>
      <section id="contact" className="section-shell bg-[#1a0f0a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center"><p className="section-kicker">Tell us about your event</p><h2 className="section-title">Quick Inquiry</h2><p className="mx-auto mt-5 max-w-2xl text-stone-300">Share a few details and continue the conversation directly on WhatsApp.</p></div>
          <QuickInquiryForm contactData={contact} />
        </div>
      </section>
      <footer className="border-t border-white/10 bg-[#090504] pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
            <div><Logo variant="vertical" size="md" className="items-start text-left" /><p className="mt-5 max-w-xs leading-7 text-stone-400">Elegant mehandi artistry for weddings, festivals, classes, and cherished celebrations.</p></div>
            <div><h3 className="footer-title">Quick Links</h3><div className="grid gap-3">{siteSettings.navigation.slice(0, 5).map((item) => <a key={item.href} href={item.href} className="text-stone-400 transition hover:text-[#D4AF37]">{item.label}</a>)}</div></div>
            <div><h3 className="footer-title">Services</h3><div className="grid gap-3">{services.slice(0, 5).map((service) => <a key={service.title} href="#services" className="text-stone-400 transition hover:text-[#D4AF37]">{service.title}</a>)}</div></div>
            <div><h3 className="footer-title">Contact</h3><div className="grid gap-4 text-stone-400"><a href={`tel:${contact.phone}`} className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-[#D4AF37]" />{contact.phoneDisplay}</a><a href={`mailto:${contact.email}`} className="flex items-center gap-3 break-all hover:text-white"><Mail className="h-4 w-4 shrink-0 text-[#D4AF37]" />{contact.email}</a><a href={contact.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white"><Instagram className="h-4 w-4 text-[#D4AF37]" />Instagram</a><a href={contact.googleMapsLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white"><MapPin className="h-4 w-4 text-[#D4AF37]" />{contact.address}</a></div></div>
          </div>
          <div className="border-t border-white/10 py-7 text-center text-sm text-stone-500">© {new Date().getFullYear()} Vandana Mehandi Artist. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
