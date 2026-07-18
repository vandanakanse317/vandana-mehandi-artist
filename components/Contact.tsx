import { contact } from '../data/contact';
import { Logo } from './Logo';
import { QuickInquiryForm } from './QuickInquiryForm';

export function Contact() {
  return (
    <>
      <section id="contact" className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center"><p className="section-kicker">Tell us about your event</p><h2 className="section-title">Quick Inquiry</h2><p className="mx-auto mt-5 max-w-2xl text-stone-300">Share a few details and continue the conversation directly on WhatsApp.</p></div>
          <QuickInquiryForm contactData={contact} />
        </div>
      </section>
      <footer className="border-t border-white/10 bg-[#090504] py-8 text-center text-sm text-stone-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo variant="horizontal" size="sm" />
          <p>© {new Date().getFullYear()} Vandana Mehandi Artist. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
