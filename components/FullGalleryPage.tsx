import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import { Logo } from './Logo';
import { ImageWithFallback } from './ImageWithFallback';
import { getSupabaseImageUrl } from '../src/lib/imageLoader';

export type GalleryImage = {
  id: string;
  url: string;
  category?: string;
  filename: string;
  title?: string;
};

export function FullGalleryPage({ type = 'portfolio' }: { type?: 'portfolio' | 'classes' }) {
  const { settings } = useSettings();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCollection = searchParams.get('collection');
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Custom categories setup
  const categories = settings?.portfolio_collections 
    ? settings.portfolio_collections.filter(c => c.name !== 'All Designs' && c.name !== 'Latest Designs').map(c => c.name)
    : ['All Mehandi', 'Flower Decoration', 'Bridal Collection'];

  const defaultCategory = initialCollection || categories[0] || 'All Mehandi';
  const [activeCollection, setActiveCollection] = useState(type === 'classes' ? 'Classes' : defaultCategory);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 4;

  useEffect(() => {
    // Reset on category change
    setImages([]);
    setPage(0);
    setHasMore(true);
  }, [type, activeCollection]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      
      let query = supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        
      if (type === 'classes') {
        query = query.eq('category', 'Classes');
      } else {
        query = query.neq('category', 'Classes');
        if (activeCollection && activeCollection !== 'All') {
          query = query.eq('category', activeCollection);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.warn("Error fetching images: ", error);
        setLoading(false);
        return;
      }
      
      if (data.length < PAGE_SIZE) setHasMore(false);
      
      const formatted = await Promise.all(data.map(async doc => {
        let bucket = doc.bucket || 'gallery';
        if (!doc.bucket) {
          if (doc.category === 'Flower Decoration') bucket = 'flower-decoration';
          else if (doc.category === 'Classes' || doc.category === 'Mehndi Classes') bucket = 'mehandi-classes';
        }
        
        const url = await getSupabaseImageUrl(bucket, doc.image_url);
        
        return {
          id: doc.id,
          url,
          category: doc.category,
          filename: doc.image_url,
          title: doc.title,
        };
      }));
      
      setImages(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newImages = formatted.filter(f => !existingIds.has(f.id));
        return [...prev, ...newImages];
      });
      setLoading(false);
    };
    
    fetchImages();
  }, [type, page, activeCollection]);

  const close = () => { setActiveIndex(null); setIsZoomed(false); };

  const moveZoom = (dir: number, event: any) => {
    event.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => {
      if (prev === null) return prev;
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
  }, [activeIndex, images.length]);

  return (
    <div className="min-h-screen bg-[#0a0604] text-white">
      <nav className="border-b border-white/10 bg-[#0a0604]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-stone-300 hover:text-white transition">
            <ArrowLeft className="h-5 w-5" /> Back to Home
          </Link>
          <Logo size="sm" />
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20 relative z-10">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.05] blur-[2px] mix-blend-screen pointer-events-none z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80")' }} />
        <div className="mb-8 text-center relative z-10">
          <h1 className="font-serif text-4xl text-white mb-4">
            {type === 'classes' ? (settings?.classesGalleryHeading || 'Student Work') : (settings?.galleryHeading || 'Full Portfolio')}
          </h1>
          <p className="mt-4 text-stone-400">
            {type === 'classes' ? (settings?.classesGalleryDescription || 'Explore beautiful mehandi created by our students.') : (settings?.galleryDescription || 'A complete collection of our mehandi designs.')}
          </p>
        </div>

        {type === 'portfolio' && (
          <div className="relative z-10 flex overflow-x-auto gap-3 pb-6 mb-8 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map(col => (
              <button
                key={col}
                onClick={() => setActiveCollection(col)}
                className={`flex-none px-5 py-2 rounded-full text-xs font-medium tracking-wide transition duration-300 border ${
                  activeCollection === col 
                     ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                     : 'bg-transparent text-stone-300 border-[#D4AF37]/40 hover:border-[#D4AF37] hover:text-white'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        )}

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item, index) => (
            <button
              key={item.id + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/20 text-left bg-[#1a0f0a] hover:border-[#D4AF37]/60 transition duration-500"
            >
              <ImageWithFallback src={item.url} alt={item.filename} loading="lazy" className="w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col justify-end">
                <ZoomIn className="mb-2 h-6 w-6 text-white" />
                {item.title && <p className="text-white font-medium text-sm drop-shadow">{item.title}</p>}
              </div>
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="py-12 text-center text-[#D4AF37] text-sm relative z-10">Loading images...</div>
        )}
        
        {!loading && images.length === 0 && (
          <div className="py-20 text-center text-stone-500 relative z-10">
            No images found in this collection.
          </div>
        )}

        {hasMore && !loading && images.length > 0 && (
          <div className="mt-12 text-center relative z-10">
            <button 
              onClick={() => setPage(p => p + 1)}
              className="px-8 py-3 rounded-full border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-medium transition duration-300 uppercase tracking-wider text-sm"
            >
              View More
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {activeIndex !== null && images[activeIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 backdrop-blur-xl" onClick={close}>
            <button type="button" onClick={close} className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 transition text-white"><X /></button>
            <div className="absolute left-5 top-5 z-20">
              {images[activeIndex].title && <h3 className="font-serif text-xl text-white">{images[activeIndex].title}</h3>}
              <p className="text-sm text-stone-500 mt-1">{activeIndex + 1} / {images.length}</p>
            </div>
            
            {images.length > 1 && (
              <button type="button" onClick={(event) => moveZoom(-1, event)} className="absolute left-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:left-8 transition text-white"><ChevronLeft /></button>
            )}
            
            <ImageWithFallback onClick={(event) => { event.stopPropagation(); setIsZoomed((zoomed) => !zoomed); }} src={images[activeIndex].url} alt={images[activeIndex].title || images[activeIndex].filename} className={`max-h-[85vh] max-w-[90vw] cursor-zoom-in rounded-2xl object-contain shadow-2xl transition duration-500 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`} />
            
            {images.length > 1 && (
              <button type="button" onClick={(event) => moveZoom(1, event)} className="absolute right-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:right-8 transition text-white"><ChevronRight /></button>
            )}
            
            <button type="button" onClick={(event) => { event.stopPropagation(); setIsZoomed((zoomed) => !zoomed); }} className="absolute bottom-5 rounded-full bg-white/10 p-3 hover:bg-white/20 transition text-white">{isZoomed ? <ZoomOut /> : <ZoomIn />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
