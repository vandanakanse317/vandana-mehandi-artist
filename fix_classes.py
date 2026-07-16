import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# I want to fix issues like "bg-white/5 backdrop-blur-md border-white/10" where they don't make sense.
# E.g. hover:bg-white/5 backdrop-blur-md border-white/10
content = content.replace("hover:bg-white/5 backdrop-blur-md border-white/10", "hover:bg-white/10")
# bg-white/10 backdrop-blur-md border-white/20 -> bg-white/10 (Wait, this is fine, but maybe redundant if it's already a glass effect)

# Let's just fix the classes for all cards and sections.
# Sections should not have "bg-white/5 backdrop-blur-md border-white/10". Sections now have a background image.
# Except Why Choose Us, Testimonials, Map. They don't have bg image right now, but user asked for:
# Testimonials – Bride with Mehendi
# What about Why Choose Us? Maybe we can add a background to it too, or just make it transparent.

# Let's check sections that didn't get backgrounds:
# "Why Choose Us": <section className="py-20 bg-white/5 backdrop-blur-md border-white/10">
# "Testimonials": <section id="testimonials" ...>

# Let's apply backgrounds to Testimonials.
def inject_bg(section_html, bg_image):
    match = re.match(r'(<section[^>]+>)(.*)', section_html, re.DOTALL)
    if not match:
        return section_html
    tag = match.group(1)
    inner = match.group(2)
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
    inner = inner.replace('</section>', '</div>\n      </section>')
    return tag + bg_elements + inner

content = re.sub(
    r'(<section id="testimonials".*?</section>)', 
    lambda m: inject_bg(m.group(1), 'testimonials.jpg'), 
    content, 
    flags=re.DOTALL
)

# Why choose us section? Let's just make it have the services background or transparent. 
# Since it's right after Services, maybe it can be transparent without a background (will take body background? wait, body has no background, it's min-h-screen).
# Let's add a general dark bg to the app container.
content = content.replace('<div className="min-h-screen bg-white/5 backdrop-blur-md border-white/10">', '<div className="min-h-screen bg-[#1a0f0a] text-white">')

# Navbar
content = content.replace('<nav className="fixed w-full z-50 bg-white/5 backdrop-blur-md border-white/10 border-b border-white/10/20">', '<nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">')
content = content.replace('<nav className="fixed w-full z-50 bg-white/5 backdrop-blur-md border-white/10 border-b border-white/20">', '<nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">')
content = content.replace('bg-white/5 backdrop-blur-md border-white/10 border-b border-white/20', 'bg-black/50 backdrop-blur-md border-b border-white/10')
content = content.replace('bg-white/5 backdrop-blur-md border-white/10/20', 'bg-black/50 backdrop-blur-md border-b border-white/10')

# Text color for nav links
content = content.replace('text-gray-300 hover:text-white', 'text-gray-300 hover:text-white')

# Remove duplicate borders
content = content.replace('border-white/10/20', 'border-white/20')
content = content.replace('border-white/10/10', 'border-white/10')
content = content.replace('border-white/10 border-white/20', 'border-white/20')

# Simplify card backgrounds
content = content.replace('bg-white/5 backdrop-blur-md border-white/10 border border-white/20', 'bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl')
content = content.replace('bg-white/5 backdrop-blur-md border-white/10', 'bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl')

# Mobile menu
content = content.replace('md:hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl border-b border-white/20', 'md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10')

with open("src/App.tsx", "w") as f:
    f.write(content)
