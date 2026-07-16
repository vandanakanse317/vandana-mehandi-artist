import re

with open("src/App.tsx", "r") as f:
    content = f.read()

def inject_bg(section_html, bg_image):
    # section_html is like <section id="id" className="..."> ... </section>
    # We want to replace the starting tag and add the background divs.
    match = re.match(r'(<section[^>]+>)(.*)', section_html, re.DOTALL)
    if not match:
        return section_html
    tag = match.group(1)
    inner = match.group(2)
    
    # Update tag classes
    tag = re.sub(r'className="[^"]+"', 'className="relative py-24 text-white flex items-center justify-center overflow-hidden"', tag)
    
    bg_elements = f"""
        {{/* Fixed Background Image for Parallax Effect */}}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{{{ backgroundImage: 'url("/images/backgrounds/{bg_image}")' }}}}
        ></div>
        
        {{/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {{/* Content */}}
        <div className="relative z-20 w-full">
"""
    # we need to close the extra div at the end of section
    # Wait, inner ends with </section>. We can replace </section> with </div></section>
    
    inner = inner.replace('</section>', '</div>\n      </section>')
    return tag + bg_elements + inner


# Hero
content = re.sub(
    r'(<section id="home".*?</section>)', 
    lambda m: inject_bg(m.group(1), 'hero.jpg'), 
    content, 
    flags=re.DOTALL
)

# Services
content = re.sub(
    r'(<section id="services".*?</section>)', 
    lambda m: inject_bg(m.group(1), 'services.jpg'), 
    content, 
    flags=re.DOTALL
)

# Gallery
content = re.sub(
    r'(<section id="gallery".*?</section>)', 
    lambda m: inject_bg(m.group(1), 'gallery.jpg'), 
    content, 
    flags=re.DOTALL
)

# Location
content = re.sub(
    r'(<section id="location".*?</section>)', 
    lambda m: inject_bg(m.group(1), 'contact.jpg'), 
    content, 
    flags=re.DOTALL
)

# About
content = re.sub(
    r'(<section id="about".*?</section>)', 
    lambda m: inject_bg(m.group(1), 'about.jpg'), 
    content, 
    flags=re.DOTALL
)

# Footer (Contact)
footer_bg_elements = """      <footer id="contact" className="relative pt-20 text-white overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/contact.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#1a0f0a]/90 to-black/95 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <div className="relative z-20 w-full">"""

content = re.sub(r'<footer id="contact"[^>]+>', footer_bg_elements, content)
content = content.replace('</footer>', '</div>\n      </footer>')

# Also, update text colors globally inside the sections so they are legible against dark background.
# E.g. text-henna-900 -> text-white, text-henna-700 -> text-henna-200, bg-white -> bg-white/5 border-white/10 backdrop-blur-md
content = content.replace('text-henna-900', 'text-white')
content = content.replace('text-henna-800', 'text-white')
content = content.replace('text-henna-700', 'text-gray-300')
content = content.replace('bg-white', 'bg-white/5 backdrop-blur-md border-white/10')
content = content.replace('bg-henna-50', 'bg-white/5 backdrop-blur-md border-white/10')
content = content.replace('bg-henna-100', 'bg-white/10 backdrop-blur-md border-white/20')
content = content.replace('border-henna-100', 'border-white/10')
content = content.replace('border-henna-200', 'border-white/20')
content = content.replace('border-henna-300', 'border-white/30')

# However, replacing 'bg-white' globally might break the modal/lightbox or other things. Let's check Lightbox.
# Actually, the modal has `bg-black/95`, so it's fine.

with open("src/App.tsx", "w") as f:
    f.write(content)
