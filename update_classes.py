import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_classes_section = """      <section id="classes" className="py-20 bg-henna-900 text-henna-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-white mb-6">Mehendi Classes</h2>
              <p className="text-xl text-henna-200 mb-8 leading-relaxed">
                Join our professional mehendi classes. Suitable for beginners and advanced learners.
              </p>
              <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6">You will learn:</h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {CLASS_TOPICS.map((topic, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-henna-300"></div>
                      <span className="text-henna-100">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-henna-800 border border-henna-700 flex flex-col items-center justify-center p-12 text-center">
                 <h3 className="font-serif text-3xl text-white mb-4">Master the Art</h3>
                 <p className="text-henna-200">Comprehensive practical training to turn your passion into a profession.</p>
              </div>
            </div>
          </div>
        </div>
      </section>"""

new_classes_section = """      <section id="classes" className="relative py-32 text-henna-50 flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/classes/background.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-[#1a0f0a]/90 to-black/90 z-10"></div>
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-medium tracking-widest uppercase text-white">Professional Training</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Mehendi Classes
              </h2>
              <p className="text-xl md:text-2xl text-henna-200 mb-10 leading-relaxed font-light drop-shadow-md">
                Join our professional mehendi classes. Suitable for beginners and advanced learners. Turn your passion into a successful profession.
              </p>
              <div className="bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                <h3 className="text-2xl font-serif font-semibold text-white mb-8 border-b border-white/10 pb-4">Course Curriculum</h3>
                <ul className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
                  {CLASS_TOPICS.map((topic, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA6C39] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span className="text-henna-100 text-lg leading-snug">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="relative lg:h-full flex flex-col justify-center">
              <div className="relative bg-gradient-to-br from-[#D4AF37]/20 to-transparent p-1 rounded-[2.5rem] shadow-2xl backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-500">
                <div className="aspect-square md:aspect-[4/3] rounded-[2.4rem] overflow-hidden bg-black/60 border border-white/10 flex flex-col items-center justify-center p-12 text-center relative group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0,transparent_70%)] group-hover:scale-110 transition-transform duration-700"></div>
                  <Star className="w-16 h-16 text-[#D4AF37] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                  <h3 className="font-serif text-4xl md:text-5xl text-white mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Master the Art</h3>
                  <p className="text-xl text-henna-200 font-light max-w-md leading-relaxed">
                    Comprehensive practical training with certification. Enroll today and start your creative journey.
                  </p>
                  <a href="#contact" className="mt-10 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA6C39] text-black font-bold tracking-wider uppercase text-sm rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300">
                    Book Your Seat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>"""

content = content.replace(old_classes_section, new_classes_section)

with open("src/App.tsx", "w") as f:
    f.write(content)

