import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    
    if (!hasSeenPopup) {
      // Show the popup after a slight delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      // Auto-close after 4 seconds
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 4500);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-[#090504]/90 p-8 text-center shadow-[0_0_40px_rgba(212,175,55,0.15)] backdrop-blur-xl"
          >
            {/* Soft Sparkle Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20 [background-image:radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.5),transparent_60%)]" />
            
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/5 p-2 text-stone-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex items-center justify-center gap-3 font-serif text-[#D4AF37]">
                <Sparkles className="h-5 w-5" />
                <span className="tracking-widest">WELCOME</span>
                <Sparkles className="h-5 w-5" />
              </div>
              
              <h2 className="mb-2 font-serif text-2xl text-white">
                Vandana Mehandi Artist
              </h2>
              
              <p className="mb-8 italic text-stone-400">
                Where every design tells a beautiful story.
              </p>
              
              <div className="mb-8 space-y-2 text-sm text-stone-300">
                <p>Premium Mehndi</p>
                <div className="mx-auto h-1 w-1 rounded-full bg-[#D4AF37]/50" />
                <p>Flower Decoration</p>
                <div className="mx-auto h-1 w-1 rounded-full bg-[#D4AF37]/50" />
                <p>Professional Mehndi Classes</p>
              </div>

              <button
                onClick={handleClose}
                className="w-full rounded-full bg-[#D4AF37] px-8 py-3.5 font-semibold text-[#1a0f0a] transition hover:bg-[#e5c568]"
              >
                Explore Website
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
