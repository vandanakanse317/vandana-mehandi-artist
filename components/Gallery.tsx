import { useEffect, useState, useMemo, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { db } from '../src/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export type GalleryImage = {
  id: string;
  url: string;
  category: string;
  subCategory?: string;
  filename: string;
  order: number;
};

const TABS = ['Signature Mehndi Collection', 'Flower Decoration', 'Mehndi Classes'] as const;

export function Gallery() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Signature Mehndi Collection');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase is not configured. Gallery will not load.");
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const data: GalleryImage[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setAllImages(data);
    }, (error) => {
      console.error("Error fetching gallery images: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Get images for the current active tab
  const currentTabImages = useMemo(() => allImages.filter(img => img.category === activeTab), [activeTab, allImages]);
  
  // Get unique subcategories for the current tab, if any
  const subCategories = useMemo(() => Array.from(new Set(currentTabImages.filter(img => img.subCategory).map(img => img.subCategory as string))), [currentTabImages]);

  const close = () => { setActiveIndex(null); setIsZoomed(false); };
  const move = (direction: number, event?: MouseEvent) => {
    event?.stopPropagation();
    setActiveIndex((current) => current === null ? null : (current + direction + currentTabImages.length) % currentTabImages.length);
    setIsZoomed(false);
  };


  useEffect(() => {
    document.body.style.overflow = activeIndex === null ? '' : 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKeyDown); };
  }, [activeIndex, currentTabImages.length]);

  return (
    <section id="gallery" className="section-shell">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="section-kicker">Our Portfolio</p>
          <h2 className="section-title">Gallery</h2>
          <p className="mx-auto mt-5 max-w-2xl text-stone-300">
            Explore our intricate mehandi designs, stunning flower decorations, and glimpses of our classes.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 ${
                activeTab === tab 
                  ? 'bg-[#D4AF37] text-[#1a0f0a]' 
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentTabImages.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                  <ZoomIn className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-serif text-2xl text-white">Photos Coming Soon</h3>
                <p className="max-w-md text-center text-stone-400">
                  We are currently curating our finest moments for the {activeTab} collection. Check back shortly to explore our latest works.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {subCategories.length > 0 ? (
                  // Group by Subcategories
                  subCategories.map(subCategory => {
                    const subCatImages = currentTabImages.filter(img => img.subCategory === subCategory);
                    if (subCatImages.length === 0) return null;
                    return (
                      <div key={subCategory}>
                        <h3 className="mb-6 font-serif text-2xl text-[#D4AF37]">{subCategory}</h3>
                        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
                          {subCatImages.map((item, index) => {
                            const absoluteIndex = currentTabImages.indexOf(item);
                            return (
                              <button
                                key={item.url}
                                type="button"
                                onClick={() => setActiveIndex(absoluteIndex)}
                                className="group relative block w-full break-inside-avoid overflow-hidden rounded-3xl border border-white/10 text-left"
                              >
                                <img src={item.url} alt={item.filename} loading="lazy" className="w-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                                <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                  <ZoomIn className="mb-2 h-6 w-6 text-white" />
                                  {item.title && <p className="text-white font-medium">{item.title}</p>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // No Subcategories, masonry grid
                  <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
                    {currentTabImages.map((item, index) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className="group relative block w-full break-inside-avoid overflow-hidden rounded-3xl border border-white/10 text-left"
                      >
                        <img src={item.url} alt={item.filename} loading="lazy" className="w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <ZoomIn className="mb-2 h-6 w-6 text-white" />
                          {item.title && <p className="text-white font-medium">{item.title}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeIndex !== null && currentTabImages[activeIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 backdrop-blur-md" onClick={close} role="dialog" aria-modal="true" aria-label={currentTabImages[activeIndex].title || currentTabImages[activeIndex].filename}>
            <button type="button" onClick={close} className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label="Close gallery"><X /></button>
            <div className="absolute left-5 top-5 z-20">
              <h3 className="font-serif text-xl text-white">
                {currentTabImages[activeIndex].title || currentTabImages[activeIndex].subCategory || currentTabImages[activeIndex].category}
              </h3>
              <p className="text-sm text-stone-500">{activeIndex + 1} / {currentTabImages.length}</p>
            </div>
            
            {currentTabImages.length > 1 && (
              <button type="button" onClick={(event) => move(-1, event)} className="absolute left-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:left-8" aria-label="Previous image"><ChevronLeft /></button>
            )}
            
            <img onClick={(event) => { event.stopPropagation(); setIsZoomed((zoomed) => !zoomed); }} src={currentTabImages[activeIndex].url} alt={currentTabImages[activeIndex].title || currentTabImages[activeIndex].filename} className={`max-h-[82vh] max-w-[88vw] cursor-zoom-in rounded-2xl object-contain shadow-2xl transition duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`} />
            
            {currentTabImages.length > 1 && (
              <button type="button" onClick={(event) => move(1, event)} className="absolute right-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:right-8" aria-label="Next image"><ChevronRight /></button>
            )}
            
            <button type="button" onClick={(event) => { event.stopPropagation(); setIsZoomed((zoomed) => !zoomed); }} className="absolute bottom-5 rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label="Toggle zoom">{isZoomed ? <ZoomOut /> : <ZoomIn />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
