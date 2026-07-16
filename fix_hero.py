import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix hero section
old_hero = """      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">"""

new_hero = """      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-32 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/hero.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">"""

if old_hero in content:
    content = content.replace(old_hero, new_hero)
    # We need to close the div we just opened `w-full max-w-7xl...`
    # Let's find the end of hero section
    end_hero = """        </div>
      </section>"""
    # Wait, the old hero section didn't have an inner wrapper div, it had the content directly in the section.
    # So replacing `</section>` with `</div></section>` is needed, but we have to do it exactly before `      {/* Services Section */}`
    content = content.replace('      </section>\n      {/* Services Section */}', '      </div>\n      </section>\n      {/* Services Section */}')

content = content.replace('shadow-henna-600/20', 'shadow-[#D4AF37]/20')

with open("src/App.tsx", "w") as f:
    f.write(content)
