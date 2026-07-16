import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Logo } from './components/Logo';
import { QuickInquiryForm } from './components/QuickInquiryForm';
import { Leaf, MapPin, Phone, Instagram, CheckCircle, Star, Menu, X, ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { WHY_CHOOSE_US, CLASS_TOPICS, TESTIMONIALS } from './data/siteData';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Dynamic Data State
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    // Fetch dynamic data
    const fetchData = async () => {
      try {
        const [servicesRes, galleryRes, contactRes, settingsRes] = await Promise.all([
          fetch('/data/services.json').then(res => res.json()),
          fetch('/data/gallery.json').then(res => res.json()),
          fetch('/data/contact.json').then(res => res.json()),
          fetch('/data/settings.json').then(res => res.json())
        ]);
        setServicesData(servicesRes);
        setGalleryData(galleryRes);
        setContactData(contactRes);
        setSettingsData(settingsRes);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    fetchData();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate loading time for the premium feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
      setActiveImageIndex((prev) => (prev! + 1) % galleryData.length);
      setIsZoomed(false);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev! - 1 + galleryData.length) % galleryData.length);
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
      if (e.key === 'ArrowRight') setActiveImageIndex((prev) => (prev! + 1) % galleryData.length);
      if (e.key === 'ArrowLeft') setActiveImageIndex((prev) => (prev! - 1 + galleryData.length) % galleryData.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0604]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <Logo variant="vertical" size="lg" className="brightness-200 contrast-125 grayscale-[0.2]" />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#1a0f0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Logo variant="horizontal" size="lg" />
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['About', 'Services', 'Classes', 'Gallery', 'Testimonials'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white font-medium transition-colors">
                  {item}
                </a>
              ))}
              <a href="#contact" className="px-5 py-2 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#AA6C39] transition-colors">
                Book Now
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['About', 'Services', 'Classes', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={closeMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-32 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/hero.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white text-sm font-medium mb-8">
          <Leaf className="w-4 h-4" />
          Welcome to Vandana Mehandi Artist
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 tracking-tight max-w-4xl leading-tight">
          Beautiful & Elegant <br className="hidden md:block"/> Mehandi Designs
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
      </motion.div>
      </section>
      {/* Services Section */}
      <section id="services" className="relative py-24 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/services.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Our Services</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Specialized in all styles of mehandi and more for your memorable events.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, index) => {
              // @ts-ignore
              const IconComponent = LucideIcons[service.icon] || Leaf;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-colors group flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center group-hover:bg-white/10 backdrop-blur-md border-white/20 transition-colors mb-2">
                    <IconComponent className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Why Choose Us?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                <span className="font-medium text-white">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes */}
      <section id="classes" className="relative py-32 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/classes.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-medium tracking-widest uppercase text-white">Professional Training</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Mehandi Classes
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed font-light drop-shadow-md">
                Join our professional mehandi classes. Suitable for beginners and advanced learners. Turn your passion into a successful profession.
              </p>
              <div className="bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                <h3 className="text-2xl font-serif font-semibold text-white mb-8 border-b border-white/10 pb-4">Course Curriculum</h3>
                <ul className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
                  {CLASS_TOPICS.map((topic, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA6C39] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span className="text-gray-300 text-lg leading-snug">{topic}</span>
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
                  <p className="text-xl text-gray-300 font-light max-w-md leading-relaxed">
                    Comprehensive practical training with certification. Enroll today and start your creative journey.
                  </p>
                  <a href="#contact" className="mt-10 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA6C39] text-black font-bold tracking-wider uppercase text-sm rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300">
                    Book Your Seat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative py-24 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/gallery.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Gallery</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Explore our collection of beautiful designs and moments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryData.map((item, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-all cursor-pointer group overflow-hidden relative"
                onClick={() => openGallery(index)}
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative z-10 p-6 flex flex-col justify-end h-full w-full">
                  <span className="text-[#D4AF37] text-sm uppercase tracking-wider mb-1 translate-y-4 group-hover:translate-y-0 transition-transform">{item.category}</span>
                  <h3 className="font-serif text-xl font-medium text-white translate-y-2 group-hover:translate-y-0 transition-transform">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/testimonials.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Testimonials</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-henna-500 text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-white font-medium leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a 
              href={(contactData || {}).googleReview} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl text-white rounded-full font-medium hover:bg-white/10 hover:border-white/30 transition-colors shadow-sm"
            >
              <Star className="w-5 h-5 fill-henna-500 text-[#D4AF37]" />
              Review us on Google
            </a>
          </div>
        </div>
      </motion.div>
      </section>

      {/* Location & Maps Section */}
      <section id="location" className="relative py-24 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/contact.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Visit Us</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Find us at our studio in Shrirampur or book a home service.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-lg h-[400px] bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <iframe 
                src={(contactData || {}).googleMapsEmbed} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Vandana Mehandi Artist Location"
              ></iframe>
            </div>
            <div className="space-y-8 md:pl-8">
              <div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Vandana Mehandi Artist</h3>
                <p className="text-gray-300 text-lg flex items-start gap-3 mt-4">
                  <MapPin className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                  <span>Shrirampur, Maharashtra, India<br/>Available for studio appointments and home services.</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href={(contactData || {}).googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#AA6C39] transition-colors shadow-sm"
                >
                  <MapPin className="w-5 h-5" /> View on Google Maps
                </a>
                <a 
                  href={(contactData || {}).googleDirections} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl text-white border border-white/20 rounded-full font-medium hover:bg-white/10 transition-colors shadow-sm"
                >
                  <ArrowRight className="w-5 h-5" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </section>

      {/* About Us */}
      <section id="about" className="relative py-24 text-white flex items-center justify-center overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/about.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-[#1a0f0a]/80 to-black/85 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-henna-100 to-henna-200 border border-white/10 flex items-center justify-center">
              {/* Elegant CSS placeholder since we don't have images */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #853b24 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="relative z-10 text-center px-8">
                <Leaf className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 opacity-50" />
                <h3 className="font-serif text-3xl text-white font-medium">Professional Artistry</h3>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-serif font-bold text-white mb-6">About Us</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Vandana Mehandi Artist is a professional mehandi service based in Shrirampur, Maharashtra.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Our aim is to make every occasion memorable with unique, stylish, and traditional mehandi designs. We also provide beginner-friendly and professional mehandi classes for students who want to learn the art of mehandi.
              </p>
              <div className="flex items-center gap-4 text-white font-medium">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl px-4 py-2 rounded-full border border-white/20">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  Shrirampur, Maharashtra
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </section>

      {/* Contact & Footer */}
                  {/* Quick Inquiry Section */}
      <section className="relative py-24 bg-[#1a0f0a] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Book an Appointment</h2>
            <p className="text-lg text-gray-300">Fill out the quick inquiry form below and we will get back to you shortly.</p>
          </div>
          <QuickInquiryForm contactData={contactData} />
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contact" className="relative pt-20 text-white overflow-hidden">
        {/* Fixed Background Image for Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0" 
          style={{ backgroundImage: 'url("/images/backgrounds/contact.jpg")' }}
        ></div>
        
        {/* Dark Black/Brown Gradient Overlay for Opacity & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#1a0f0a]/90 to-black/95 z-10 backdrop-blur-[2px]"></div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 pb-16 border-b border-white/10">
            {/* Column 1: Brand */}
            <div>
              <div className="mb-6">
                <Logo variant="horizontal" size="lg" className="brightness-200 contrast-125 grayscale-[0.2]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">Vandana Mehandi Artist</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Professional Mehandi Artist specializing in elegant and detailed designs for weddings, festivals, and special occasions.
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
                {['Bridal Mehandi', 'Arabic Mehandi', 'Traditional Mehandi', 'Festival Mehandi', 'Mehandi Classes'].map((service) => (
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
                <a href={`tel:${(contactData || {}).phone}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{(contactData || {}).phone}</span>
                </a>
                <a href={`mailto:${(contactData || {}).email}`} className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <span>{(contactData || {}).email}</span>
                </a>
                <a href={`https://wa.me/${(contactData || {}).whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <span>WhatsApp</span>
                </a>
                <a href={(contactData || {}).instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span>Instagram</span>
                </a>
                <a href={(contactData || {}).googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#4285F4] transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="py-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4 border-t border-white/10">
            <p>&copy; {new Date().getFullYear()} Vandana Mehandi Artist. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </motion.div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a 
          href={(contactData || {}).instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(220,39,67,0.39)] hover:shadow-[0_6px_20px_rgba(220,39,67,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center"
          aria-label="Follow on Instagram"
        >
          <Instagram className="w-7 h-7" />
        </a>
        <a 
          href={`https://wa.me/${(contactData || {}).whatsapp}?text=${encodeURIComponent('Hi, I would like to inquire about Mehandi services')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:bg-[#20b858] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-7 h-7"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </div>

      {/* Gallery Modal / Lightbox */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeGallery}>
          <button 
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="absolute top-6 left-6 z-50">
            <h3 className="text-2xl font-serif text-white tracking-wide">{galleryData[activeImageIndex].title}</h3>
            <p className="text-white/50 text-sm mt-1">{activeImageIndex + 1} / {galleryData.length}</p>
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
              src={galleryData[activeImageIndex].url} 
              alt={galleryData[activeImageIndex].title}
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
      )}
    </div>
    </>
  );
}
