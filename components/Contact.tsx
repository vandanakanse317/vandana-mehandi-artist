import { useSettings } from '../contexts/SettingsContext'; // Trigger sync
import { Logo } from './Logo';
import { QuickInquiryForm } from './QuickInquiryForm';
import { Link } from 'react-router-dom';

export function Contact() {
  const { settings } = useSettings();
  return (
    <>
      <section id="contact" className="section-shell bg-[#0a0604] relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.05] blur-[2px] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80")' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604] via-transparent to-[#0a0604] pointer-events-none z-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center"><p className="section-kicker">Tell us about your event</p><h2 className="section-title">Quick Inquiry</h2><p className="mx-auto mt-5 max-w-2xl text-stone-300">Share a few details and continue the conversation directly on WhatsApp.</p></div>
          <QuickInquiryForm contactData={settings as any} />
        </div>
      </section>
      <footer className="border-t border-white/10 bg-[#090504] py-8 text-center text-sm text-stone-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-screen pointer-events-none blur-[2px]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80")' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090504] via-[#090504]/50 to-transparent pointer-events-none z-0" />
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8 relative z-10">
          <Logo variant="horizontal" size="sm" />
          <p>© {new Date().getFullYear()} Vandana Mehandi Artist. All Rights Reserved.</p>
          <Link to="/admin" className="mt-2 text-xs hover:text-stone-300 transition-colors underline underline-offset-2">Admin Login</Link>
        </div>
      </footer>
    </>
  );
}
