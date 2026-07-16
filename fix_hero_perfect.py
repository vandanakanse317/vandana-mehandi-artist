with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.strip() == "{/* Hero Section */}":
        skip = True
        new_lines.append(line)
        new_lines.append("""      <section id="home" className="relative pt-40 pb-32 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/hero.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white text-sm font-medium mb-8">
          <Leaf className="w-4 h-4" />
          Welcome to Vandana Mehendi Artist
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 tracking-tight max-w-4xl leading-tight">
          Beautiful & Elegant <br className="hidden md:block"/> Mehendi Designs
        </h1>
        <p className="text-base text-gray-300 max-w-2xl mb-10 leading-relaxed">
          For every special occasion—weddings, engagements, festivals, or baby showers. We provide creative designs with premium quality service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#contact" className="px-8 py-4 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#AA6C39] transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2">
            Book an Appointment <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#services" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl text-white border border-white/20 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center justify-center">
            Explore Services
          </a>
        </div>
      </div>
      </section>\n""")
    elif line.strip() == "{/* Services Section */}":
        skip = False
    
    if not skip:
        new_lines.append(line)

with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)

