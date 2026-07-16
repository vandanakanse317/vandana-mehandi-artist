import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Update imports
content = content.replace("GALLERY_CATEGORIES } from './data';", "GALLERY_IMAGES, CONTACT_INFO } from './data';")

# 2. Update state and lightbox logic
old_logic = """  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Gallery Controls
  const openGallery = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentImageIndex(0);
    setIsZoomed(false);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setActiveCategory(null);
    document.body.style.overflow = 'auto';
  };

  const activeCategoryData = GALLERY_CATEGORIES.find(c => c.id === activeCategory);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCategoryData) {
      setCurrentImageIndex((prev) => (prev + 1) % activeCategoryData.images.length);
      setIsZoomed(false);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCategoryData) {
      setCurrentImageIndex((prev) => (prev - 1 + activeCategoryData.images.length) % activeCategoryData.images.length);
      setIsZoomed(false);
    }
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeCategoryData) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') setCurrentImageIndex((prev) => (prev + 1) % activeCategoryData.images.length);
      if (e.key === 'ArrowLeft') setCurrentImageIndex((prev) => (prev - 1 + activeCategoryData.images.length) % activeCategoryData.images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategoryData]);"""

new_logic = """  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Gallery Controls
  const openGallery = (index: number) => {
    setActiveImageIndex(index);
    setIsZoomed(false);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setActiveImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev! + 1) % GALLERY_IMAGES.length);
      setIsZoomed(false);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev! - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      setIsZoomed(false);
    }
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') setActiveImageIndex((prev) => (prev! + 1) % GALLERY_IMAGES.length);
      if (e.key === 'ArrowLeft') setActiveImageIndex((prev) => (prev! - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex]);"""

content = content.replace(old_logic, new_logic)

# 3. Logo and text sizes
content = content.replace(
    '<Leaf className="w-8 h-8 text-henna-600" />\n              <span className="font-serif text-3xl font-bold text-henna-900 tracking-tight">Vandana Mehendi Artist</span>',
    '<Leaf className="w-12 h-12 text-henna-600" />\n              <span className="font-serif text-4xl md:text-5xl font-bold text-henna-900 tracking-tight">Vandana Mehendi Artist</span>'
)
content = content.replace(
    '<h1 className="text-4xl md:text-5xl font-serif font-bold text-henna-900 mb-6 tracking-tight max-w-4xl leading-tight">',
    '<h1 className="text-3xl md:text-4xl font-serif font-bold text-henna-900 mb-6 tracking-tight max-w-4xl leading-tight">'
)
content = content.replace(
    '<p className="text-lg text-henna-700 max-w-2xl mb-10 leading-relaxed">',
    '<p className="text-base text-henna-700 max-w-2xl mb-10 leading-relaxed">'
)

# 4. Extract About Us section and remove it
about_us_match = re.search(r'(      {/\* About Us \*/}\n      <section id="about" className="py-20 bg-white">.*?      </section>\n)', content, re.DOTALL)
if about_us_match:
    about_us_code = about_us_match.group(1)
    content = content.replace(about_us_code, '')
    
    # Insert after Location section
    location_end = '      </section>'
    location_section_regex = r'(      {/\* Location & Maps Section \*/}.*?      </section>\n)'
    loc_match = re.search(location_section_regex, content, re.DOTALL)
    if loc_match:
        content = content.replace(loc_match.group(1), loc_match.group(1) + "\n" + about_us_code)

# 5. Gallery rendering
old_gallery = """      {/* Gallery */}
      <section id="gallery" className="py-20 bg-henna-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-henna-900 mb-4">Gallery</h2>
            <p className="text-lg text-henna-700 max-w-2xl mx-auto">Explore our collection of beautiful designs and moments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_CATEGORIES.map((category, index) => (
              <div 
                key={category.id} 
                className="aspect-square rounded-2xl bg-white border border-henna-200 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all cursor-pointer group overflow-hidden relative"
                onClick={() => openGallery(category.id)}
              >
                <img 
                  src={category.coverImage} 
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative z-10 p-6 flex flex-col justify-end h-full w-full">
                  <h3 className="font-serif text-xl font-medium text-white translate-y-2 group-hover:translate-y-0 transition-transform">{category.title}</h3>
                  <div className="w-12 h-1 bg-henna-400 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>"""

new_gallery = """      {/* Gallery */}
      <section id="gallery" className="py-20 bg-henna-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-henna-900 mb-4">Gallery</h2>
            <p className="text-lg text-henna-700 max-w-2xl mx-auto">Explore our collection of beautiful designs and moments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_IMAGES.map((item, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-2xl bg-white border border-henna-200 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all cursor-pointer group overflow-hidden relative"
                onClick={() => openGallery(index)}
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative z-10 p-6 flex flex-col justify-end h-full w-full">
                  <span className="text-henna-300 text-sm uppercase tracking-wider mb-1 translate-y-4 group-hover:translate-y-0 transition-transform">{item.category}</span>
                  <h3 className="font-serif text-xl font-medium text-white translate-y-2 group-hover:translate-y-0 transition-transform">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>"""

content = content.replace(old_gallery, new_gallery)

# 6. Lightbox
old_lightbox = """      {/* Gallery Modal / Lightbox */}
      {activeCategory && activeCategoryData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeGallery}>
          <button 
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="absolute top-6 left-6 z-50">
            <h3 className="text-2xl font-serif text-white tracking-wide">{activeCategoryData.title} Designs</h3>
            <p className="text-white/50 text-sm mt-1">{currentImageIndex + 1} / {activeCategoryData.images.length}</p>
          </div>

          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all z-50"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div 
            className={`relative max-w-5xl w-full max-h-[85vh] px-4 md:px-20 flex items-center justify-center transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
            onClick={toggleZoom}
          >
            <img 
              src={activeCategoryData.images[currentImageIndex].url} 
              alt={activeCategoryData.images[currentImageIndex].description}
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl ring-1 ring-white/10 select-none"
              draggable="false"
            />
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all z-50"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
             <button onClick={toggleZoom} className="text-white/50 hover:text-white p-2 transition-colors">
               {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
             </button>
          </div>
        </div>
      )}"""

new_lightbox = """      {/* Gallery Modal / Lightbox */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeGallery}>
          <button 
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="absolute top-6 left-6 z-50">
            <h3 className="text-2xl font-serif text-white tracking-wide">{GALLERY_IMAGES[activeImageIndex].title}</h3>
            <p className="text-white/50 text-sm mt-1">{activeImageIndex + 1} / {GALLERY_IMAGES.length}</p>
          </div>

          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all z-50"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div 
            className={`relative max-w-5xl w-full max-h-[85vh] px-4 md:px-20 flex items-center justify-center transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
            onClick={toggleZoom}
          >
            <img 
              src={GALLERY_IMAGES[activeImageIndex].url} 
              alt={GALLERY_IMAGES[activeImageIndex].title}
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl ring-1 ring-white/10 select-none"
              draggable="false"
            />
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all z-50"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
             <button onClick={toggleZoom} className="text-white/50 hover:text-white p-2 transition-colors">
               {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
             </button>
          </div>
        </div>
      )}"""

content = content.replace(old_lightbox, new_lightbox)

# 7. Update Contact Details from CONTACT_INFO
# We need to do regex replacement for the hrefs and text.
# Whatsapp
content = re.sub(r'href="https://wa\.me/[0-9]+"', 'href={`https://wa.me/${CONTACT_INFO.whatsapp}`}', content)
# Instagram
content = content.replace('href="https://instagram.com"', 'href={CONTACT_INFO.instagram}')
# Maps Directions
content = content.replace('href="https://www.google.com/maps/dir//Shrirampur,+Maharashtra"', 'href={CONTACT_INFO.googleDirections}')
# Maps embed
content = re.sub(r'src="https://www\.google\.com/maps/embed\?pb=[^"]+"', 'src={CONTACT_INFO.googleMapsEmbed}', content)
# Google Maps review link
content = content.replace('href="https://g.page/r/CQDeSRIsPZUhEBE/review"', 'href={CONTACT_INFO.googleReview}')
# Google Maps Link
content = content.replace('href="https://g.page/r/CQDeSRIsPZUhEBE"', 'href={CONTACT_INFO.googleMapsLink}')
# Phone in footer
content = re.sub(r'href="tel:[0-9]+"', 'href={`tel:${CONTACT_INFO.phone}`}', content)
# Phone text
content = re.sub(r'<span className="text-lg">7666201923</span>', '<span className="text-lg">{CONTACT_INFO.phone}</span>', content)
# Address text
content = re.sub(r'<span className="text-lg">Shrirampur, Maharashtra</span>', '<span className="text-lg">{CONTACT_INFO.address}</span>', content)

with open("src/App.tsx", "w") as f:
    f.write(content)

