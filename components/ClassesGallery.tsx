import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useSettings } from '../contexts/SettingsContext';

export type GalleryImage = {
  id: string;
  url: string;
  filename: string;
  title?: string;
};

export function ClassesGallery() {
  const { settings, loading } = useSettings();
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([]);
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGallery, setActiveGallery] = useState<'featured' | 'recent' | null>(null); // To know which array to use for lightbox
  
  useEffect(() => {
    const fetchImages = async () => {
      // Fetch 1 featured image
      const { data: featuredData, error: fError } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_featured', true)
        .eq('category', 'Classes') // Only Classes category
        .order('order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(1);
        
      // Fetch 4 recent images (not the featured one)
      const { data: recentData, error: rError } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', 'Classes')
        .order('created_at', { ascending: false })
        .limit(5); // Fetch 5 to ensure we have 4 excluding the featured one
        
      if (fError || rError) {
        console.warn("Error fetching classes gallery images");
        return;
      }

      const formatImages = (data: any[]) => data.map(doc => {
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
      
      const formattedFeatured = formatImages(featuredData || []);
      setFeaturedImages(formattedFeatured);
      
      const featuredId = formattedFeatured[0]?.id;
      let filteredRecent = recentData || [];
      if (featuredId) {
        filteredRecent = filteredRecent.filter(d => d.id !== featuredId);
      }
      setRecentImages(formatImages(filteredRecent.slice(0, 4)));
    };
    
    fetchImages();
  }, []);

  const openLightbox = (index: number, type: 'featured' | 'recent') => {
    setActiveGallery(type);
    setActiveIndex(index);
    setIsZoomed(false);
  };

  const close = () => { setActiveIndex(null); setIsZoomed(false); setActiveGallery(null); };
  
  const moveZoom = (dir: number, event: any) => {
    event.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => {
      if (prev === null || !activeGallery) return prev;
      const images = activeGallery === 'featured' ? featuredImages : recentImages;
      let next = prev + dir;
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
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
  }, [activeIndex, activeGallery, featuredImages.length, recentImages.length]);


  if (!loading && !settings?.classesGalleryEnabled) return null;

  const currentLightboxImages = activeGallery === 'featured' ? featuredImages : recentImages;

  return (
    <div className="mt-24 w-full max-w-7xl mx-auto pt-16 border-t border-white/5">
      <div className="mb-12 text-center">
        <p className="section-kicker">Gallery</p>
        <h3 className="font-serif text-3xl md:text-4xl text-white">{settings?.classesGalleryHeading || 'Student Work'}</h3>
        <p className="mt-4 text-stone-400 max-w-2xl mx-auto">{settings?.classesGalleryDescription || 'Glimpses of what our students achieve.'}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Large Featured Student Image */}
        {featuredImages.length > 0 ? (
          <div className="lg:w-1/2">
            <button 
              onClick={() => openLightbox(0, 'featured')}
              className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden group border border-white/10 bg-[#1a0f0a] text-left block"
            >
              <img src={featuredImages[0].url} alt={featuredImages[0].title || 'Student work'} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition duration-500 group-hover:from-black/80" />
              <div className="absolute bottom-0 left-0 p-8 w-full transform transition duration-500 ease-out">
                <span className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-full mb-3 shadow-lg">Featured Work</span>
                {featuredImages[0].title && <h4 className="text-white font-serif text-2xl mb-1 drop-shadow-md">{featuredImages[0].title}</h4>}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="rounded-full bg-black/60 p-4 text-white backdrop-blur-md">
                  <ZoomIn className="h-6 w-6" />
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="lg:w-1/2 flex h-[400px] flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-sm">
             <p className="text-stone-500">Featured work coming soon.</p>
          </div>
        )}
        
        {/* Horizontal Scroll of Recent Student Work */}
        <div className="lg:w-1/2 flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {recentImages.length > 0 ? (
             recentImages.map((img, idx) => (
                <button 
                  key={img.id} 
                  onClick={() => openLightbox(idx, 'recent')}
                  className="relative flex-none w-64 h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden group snap-start border border-white/10 bg-[#1a0f0a] text-left block"
                >
                  <img src={img.url} alt={img.title || 'Student work'} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition duration-500" />
                  <div className="absolute bottom-0 left-0 p-6 w-full transform transition duration-500 ease-out group-hover:-translate-y-2">
                    {img.title && <h4 className="text-white font-serif text-lg mb-1">{img.title}</h4>}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="rounded-full bg-black/60 p-3 text-white backdrop-blur-md">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              ))
          ) : (
            <div className="w-full flex h-[400px] md:h-[500px] flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-sm">
             <p className="text-stone-500">More student works coming soon.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/classes-gallery" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37]">
          View More Student Works <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <AnimatePresence>
        {activeIndex !== null && activeGallery && currentLightboxImages[activeIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 backdrop-blur-xl" onClick={close}>
            <button type="button" onClick={close} className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 transition text-white"><X /></button>
            <div className="absolute left-5 top-5 z-20">
              {currentLightboxImages[activeIndex].title && <h3 className="font-serif text-xl text-white">{currentLightboxImages[activeIndex].title}</h3>}
              <p className="text-sm text-stone-500 mt-1">{activeIndex + 1} / {currentLightboxImages.length}</p>
            </div>
            {currentLightboxImages.length > 1 && <button type="button" onClick={(e) => moveZoom(-1, e)} className="absolute left-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:left-8 transition text-white"><ChevronLeft /></button>}
            <img onClick={(e) => { e.stopPropagation(); setIsZoomed((z) => !z); }} src={currentLightboxImages[activeIndex].url} alt={currentLightboxImages[activeIndex].title || currentLightboxImages[activeIndex].filename} className={`max-h-[85vh] max-w-[90vw] cursor-zoom-in rounded-2xl object-contain shadow-2xl transition duration-500 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`} />
            {currentLightboxImages.length > 1 && <button type="button" onClick={(e) => moveZoom(1, e)} className="absolute right-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:right-8 transition text-white"><ChevronRight /></button>}
            <button type="button" onClick={(e) => { e.stopPropagation(); setIsZoomed((z) => !z); }} className="absolute bottom-5 rounded-full bg-white/10 p-3 hover:bg-white/20 transition text-white">{isZoomed ? <ZoomOut /> : <ZoomIn />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
