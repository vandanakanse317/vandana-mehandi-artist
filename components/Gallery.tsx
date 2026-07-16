import { useEffect, useState, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { galleryItems } from '../data/gallery';

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const close = () => { setActiveIndex(null); setIsZoomed(false); };
  const move = (direction: number, event?: MouseEvent) => {
    event?.stopPropagation();
    setActiveIndex((current) => current === null ? null : (current + direction + galleryItems.length) % galleryItems.length);
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
  }, [activeIndex]);

  return (
    <section id="gallery" className="section-shell bg-[#1a0f0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center"><p className="section-kicker">Selected work</p><h2 className="section-title">Mehandi Gallery</h2><p className="mx-auto mt-5 max-w-2xl text-stone-300">Explore signature styles inspired by bridal storytelling, traditional motifs, and graceful Arabic flow.</p></div>
        <div className="grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <motion.button key={item.title} type="button" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onClick={() => setActiveIndex(index)} className={`group relative overflow-hidden rounded-3xl border border-white/10 text-left ${index === 0 || index === 4 ? 'sm:row-span-2' : ''}`}>
              <img src={item.url} alt={item.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6"><span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">{item.category}</span><h3 className="mt-2 font-serif text-2xl text-white">{item.title}</h3></div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4 backdrop-blur-md" onClick={close} role="dialog" aria-modal="true" aria-label={galleryItems[activeIndex].title}>
            <button type="button" onClick={close} className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label="Close gallery"><X /></button>
            <div className="absolute left-5 top-5 z-20"><h3 className="font-serif text-xl">{galleryItems[activeIndex].title}</h3><p className="text-sm text-stone-500">{activeIndex + 1} / {galleryItems.length}</p></div>
            <button type="button" onClick={(event) => move(-1, event)} className="absolute left-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:left-8" aria-label="Previous image"><ChevronLeft /></button>
            <img onClick={(event) => { event.stopPropagation(); setIsZoomed((zoomed) => !zoomed); }} src={galleryItems[activeIndex].url} alt={galleryItems[activeIndex].alt} className={`max-h-[82vh] max-w-[88vw] cursor-zoom-in rounded-2xl object-contain shadow-2xl transition duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'}`} />
            <button type="button" onClick={(event) => move(1, event)} className="absolute right-3 z-20 rounded-full bg-white/10 p-3 hover:bg-white/20 md:right-8" aria-label="Next image"><ChevronRight /></button>
            <button type="button" onClick={(event) => { event.stopPropagation(); setIsZoomed((zoomed) => !zoomed); }} className="absolute bottom-5 rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label="Toggle zoom">{isZoomed ? <ZoomOut /> : <ZoomIn />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
