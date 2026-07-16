import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# First, extract QuickInquiryForm section
inquiry_pattern = r'<div className="lg:justify-self-center w-full max-w-md">\s*<QuickInquiryForm />\s*</div>'
content = re.sub(inquiry_pattern, '', content)

# Second, find where to put the inquiry form. Put it inside the #location section, next to the map.
# Or put it in a new section before the footer. Let's add it right before the footer.

footer_start = r'<footer id="contact" className="relative pt-20 text-white overflow-hidden">'
new_contact_section = """      {/* Quick Inquiry Section */}
      <section className="relative py-24 bg-[#1a0f0a] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Book an Appointment</h2>
            <p className="text-lg text-gray-300">Fill out the quick inquiry form below and we will get back to you shortly.</p>
          </div>
          <QuickInquiryForm />
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contact" className="relative pt-20 text-white overflow-hidden">"""

content = content.replace(footer_start, new_contact_section)

# Now, let's replace the grid inside the footer
old_grid_pattern = r'<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-12 pb-16 border-b border-white/10">.*?<div className="py-8 text-center text-\[#D4AF37\] text-sm">\s*<p>&copy; \{new Date\(\)\.getFullYear\(\)\} Vandana Mehendi Artist\. All rights reserved\.</p>\s*</div>'

new_grid = """<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 pb-16 border-b border-white/10">
            {/* Column 1: Brand */}
            <div>
              <div className="mb-6">
                <Logo variant="horizontal" size="lg" className="brightness-200 contrast-125 grayscale-[0.2]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">Vandana Mehendi Artist</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Professional Mehendi Artist specializing in elegant and detailed designs for weddings, festivals, and special occasions.
              </p>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'About', 'Services', 'Classes', 'Gallery', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#D4AF37]" /> {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services List */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Our Services</h3>
              <ul className="space-y-3">
                {['Bridal Mehendi', 'Arabic Mehendi', 'Traditional Mehendi', 'Festival Mehendi', 'Mehendi Classes'].map((service) => (
                  <li key={service}>
                    <a href="#services" className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-[#D4AF37]" /> {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Contact Us</h3>
              <div className="space-y-4">
                <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span>{CONTACT_INFO.email}</span>
                </a>
                <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <span>WhatsApp</span>
                </a>
                <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span>Instagram</span>
                </a>
                <a href={CONTACT_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#4285F4] transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="py-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4 border-t border-white/10">
            <p>&copy; {new Date().getFullYear()} Vandana Mehendi Artist. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</a>
            </div>
          </div>"""

content = re.sub(old_grid_pattern, new_grid, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)
