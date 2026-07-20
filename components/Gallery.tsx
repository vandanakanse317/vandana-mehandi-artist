import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export type GalleryImage = {
  id: string;
  url: string;
  filename: string;
  title?: string;
};

export function Gallery() {
  const { settings, loading } = useSettings();
  const navigate = useNavigate();
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_featured', true)
        .neq('category', 'Classes') // Exclude classes from main portfolio
        .order('order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (error) {
        console.warn("Error fetching gallery images: ", error);
        return;
      }
      
      const formatted = data.map(doc => {
        let bucket = 'gallery';
        if (doc.category === 'Signature Mehndi Collection') bucket = 'signature-mehandi';
        else if (doc.category === 'Flower Decoration') bucket = 'flower-decoration';
        else if (doc.category === 'Mehndi Classes') bucket = 'mehandi-classes';
        
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(doc.image_url);
        
        return {
          id: doc.id,
          url: publicUrlData.publicUrl,
          filename: doc.image_url,
          title: doc.title,
        };
      });
      
      setFeaturedImages(formatted);
    };
    
    fetchImages();
  }, []);

  // Auto slide
  useEffect(() => {
    if (featuredImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
  const close = () => { setActiveIndex(null); setIsZoomed(false); };
  const moveZoom = (dir: number, event: any) => {
    event.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      let next = prev + dir;
      if (next < 0) next = featuredImages.length - 1;
      if (next >= featuredImages.length) next = 0;
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') moveZoom(-1, e as any);
      if (e.key === 'ArrowRight') moveZoom(1, e as any);
    };
    window.addEventListener('keydown', onKeyDown);
    if (activeIndex !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKeyDown); };
  }, [activeIndex, featuredImages.length]);

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => touchStartX.current = e.touches[0].clientX;
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  if (!loading && !settings?.galleryEnabled) return null;

  return (
    <section id="gallery" className="bg-[#0a0604] pt-12 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.05] blur-[2px] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80")' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604] via-transparent to-[#0a0604] pointer-events-none z-0" />
      
      {/* Profile Header */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
          {/* Cover Image */}
          <div className="h-48 md:h-64 w-full bg-[#1a0f0a] relative">
            {settings?.profileCoverUrl ? (
              <img src={settings.profileCoverUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#D4AF37]/20 to-black/50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          
          {/* Profile Details */}
          <div className="relative px-6 pb-10 md:px-12 md:pb-12 text-center -mt-20 flex flex-col items-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-[#0a0604] bg-[#1a0f0a] shadow-xl mb-6">
              {settings?.profilePhotoUrl ? (
                <img src={settings.profilePhotoUrl} alt={settings.profileName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#D4AF37]">
                  <span className="font-serif text-5xl">{settings?.profileName?.charAt(0) || 'V'}</span>
                </div>
              )}
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-2">{settings?.profileName || 'Vandana Artist'}</h2>
            <p className="text-[#D4AF37] font-medium tracking-widest uppercase text-xs md:text-sm mb-4">{settings?.profileDesignation || 'Professional Mehandi Artist'}</p>
            <p className="max-w-2xl text-stone-300 leading-relaxed text-sm md:text-base mb-8">
              {settings?.profileBio || 'Creating beautiful hand-drawn stories for over a decade. Explore my curated selection of signature works below.'}
            </p>
            
            
          </div>
        </div>
      </div>

      {/* Main Gallery Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Gallery Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl text-white tracking-wide">{settings?.galleryHeading || 'Highlights'}</h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400 text-lg">
            {settings?.galleryDescription || 'Browse our best Mehndi creations.'}
          </p>
        </div>

        {/* Featured Slider */}
        {featuredImages.length > 0 && (
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] shadow-2xl mb-10 border border-white/5" 
               onTouchStart={handleTouchStart} 
               onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-700 ease-in-out h-[40vh] min-h-[300px]"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredImages.map((img, idx) => (
                <div key={img.id} className="relative h-full min-w-full flex-shrink-0 bg-black cursor-pointer group" onClick={() => setActiveIndex(idx)}>
                  <img src={img.url} alt={img.title || img.filename} loading="lazy" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none transition duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 p-10 w-full translate-y-2 group-hover:translate-y-0 transition duration-500 ease-out">
                    {img.title && <h3 className="text-white font-serif text-4xl drop-shadow-xl">{img.title}</h3>}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="rounded-full bg-black/40 backdrop-blur-md p-5 text-white scale-90 group-hover:scale-100 transition duration-500 border border-white/10">
                      <ZoomIn className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {featuredImages.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-transparent">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Dots */}
            {featuredImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 z-10">
                {featuredImages.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-10 bg-[#D4AF37]' : 'w-3 bg-white/40'}`} 
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collections Horizontal Scroll - Max 4 */}
        {settings?.portfolio_collections && settings.portfolio_collections.filter(c => c.enabled !== false).length > 0 && (
          <div className="mb-10 max-w-6xl mx-auto">
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {settings.portfolio_collections.filter(c => c.enabled !== false).slice(0, 4).map((collection) => (
                <button 
                  key={collection.id} 
                  onClick={() => navigate(`/gallery?collection=${encodeURIComponent(collection.name)}`)}
                  className="relative flex-none w-[220px] sm:w-[240px] aspect-[4/5] rounded-[1.5rem] overflow-hidden group snap-start bg-[#0a0604] text-left block"
                >
                  {collection.cover_image ? (
                    <img src={collection.cover_image} alt={collection.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition duration-1000 ease-out" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-black/60" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition duration-500" />
                  <div className="absolute bottom-0 left-0 p-6 w-full transform transition duration-500 ease-out group-hover:-translate-y-2">
                    <h4 className="text-white font-serif text-xl mb-2 drop-shadow-md">{collection.name}</h4>
                    <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition duration-500 border border-[#D4AF37]/30">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* View Complete Gallery Button */}
        <div className="text-center">
          <Link to="/gallery" className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-10 py-4 text-base font-medium text-white transition hover:bg-[#D4AF37] hover:border-transparent hover:text-black">
            <span className="text-lg">✨</span> View Complete Gallery <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && featuredImages[activeIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 backdrop-blur-xl" onClick={close}>
            <button type="button" onClick={close} className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 transition text-white"><X /></button>
            <div className="absolute left-5 top-5 z-20">
              {featuredImages[activeIndex].title && <h3 className="font-serif text-2xl text-white mb-1">{featuredImages[activeIndex].title}</h3>}
            </div>
            
            {featuredImages.length > 1 && (
              <button type="button" onClick={(e) => moveZoom(-1, e)} className="absolute left-3 z-20 rounded-full bg-white/10 p-4 hover:bg-white/20 md:left-10 transition text-white"><ChevronLeft className="w-6 h-6" /></button>
            )}
            
            <img onClick={(e) => { e.stopPropagation(); setIsZoomed((z) => !z); }} src={featuredImages[activeIndex].url} alt={featuredImages[activeIndex].title || featuredImages[activeIndex].filename} className={`max-h-[85vh] max-w-[90vw] cursor-zoom-in rounded-2xl object-contain shadow-2xl transition duration-500 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`} />
            
            {featuredImages.length > 1 && (
              <button type="button" onClick={(e) => moveZoom(1, e)} className="absolute right-3 z-20 rounded-full bg-white/10 p-4 hover:bg-white/20 md:right-10 transition text-white"><ChevronRight className="w-6 h-6" /></button>
            )}
            <button type="button" onClick={(e) => { e.stopPropagation(); setIsZoomed((z) => !z); }} className="absolute bottom-8 rounded-full bg-white/10 p-4 hover:bg-white/20 transition text-white">{isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}