import { useState, type FormEvent } from 'react';

type ContactData = {
  whatsapp?: string;
  phone?: string;
};

type QuickInquiryFormProps = {
  contactData?: ContactData;
};

export function QuickInquiryForm({ contactData }: QuickInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = [
      'Hi, I would like to inquire about Mehandi services.',
      `Name: ${formData.get('name')}`,
      `Phone: ${formData.get('phone')}`,
      `Service: ${formData.get('service')}`,
      `Event date: ${formData.get('eventDate') || 'Not decided'}`,
      `Message: ${formData.get('message') || 'No additional details'}`,
    ].join('\n');

    const whatsappNumber = (contactData?.whatsapp || contactData?.phone || '').replace(/\D/g, '');
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }

    setSubmitted(true);
  }

  const fieldClassName = 'w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]';

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid max-w-3xl gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:grid-cols-2 md:p-10">
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Name
        <input className={fieldClassName} name="name" type="text" autoComplete="name" required placeholder="Your name" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Phone
        <input className={fieldClassName} name="phone" type="tel" autoComplete="tel" required placeholder="Your phone number" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Service
        <select className={fieldClassName} name="service" required defaultValue="">
          <option value="" disabled>Select a service</option>
          <option>Bridal Mehandi</option>
          <option>Engagement Mehandi</option>
          <option>Festival Mehandi</option>
          <option>Mehandi Classes</option>
          <option>Other</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-gray-200">
        Event date
        <input className={fieldClassName} name="eventDate" type="date" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-gray-200 md:col-span-2">
        Message
        <textarea className={fieldClassName} name="message" rows={4} placeholder="Tell us about your event" />
      </label>
      <div className="flex flex-col items-center gap-3 md:col-span-2">
        <button type="submit" className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA6C39] px-8 py-4 font-bold text-black transition hover:scale-[1.02] hover:shadow-lg">
          Send Inquiry on WhatsApp
        </button>
        {submitted && (
          <p className="text-sm text-[#D4AF37]" role="status">
            Your inquiry is ready to send in WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
