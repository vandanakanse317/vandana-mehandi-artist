import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ArrowLeft, Video as VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Logo } from './Logo';

export type VideoItem = {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string;
  video_url: string;
  uploadDate: string;
};

export function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.warn("Videos table might not exist yet:", error.message);
        setLoading(false);
        return;
      }
      
      const formatted = data.map(doc => {
        const { data: thumbData } = supabase.storage.from('videos').getPublicUrl(doc.thumbnail_url);
        const { data: videoData } = supabase.storage.from('videos').getPublicUrl(doc.video_url);
        return {
          id: doc.id,
          title: doc.title,
          category: doc.category,
          thumbnail_url: thumbData.publicUrl,
          video_url: videoData.publicUrl,
          uploadDate: new Date(doc.created_at).toLocaleDateString()
        };
      });
      
      setVideos(formatted);
      setLoading(false);
    };
    
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-white">
      <nav className="border-b border-white/10 bg-[#0a0604]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-stone-300 hover:text-white transition">
            <ArrowLeft className="h-5 w-5" /> Back to Home
          </Link>
          <Logo size="sm" />
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-12 text-center">
          <h1 className="section-title text-[#D4AF37]">All Videos</h1>
          <p className="mt-4 text-stone-400">Watch our complete collection of highlights.</p>
        </div>
        
        {loading ? (
          <div className="py-12 text-center text-stone-500">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
              <VideoIcon className="h-8 w-8" />
            </div>
            <h3 className="mb-2 font-serif text-2xl text-white">No Videos Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <div 
                key={video.id}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/50 transition-all duration-300 hover:border-[#D4AF37]/50"
                onClick={() => setActiveVideo(video)}
              >
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img src={video.thumbnail_url} alt={video.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/90 text-black shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-6 w-6 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                  <span className="mb-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs text-[#D4AF37] backdrop-blur-sm">
                    {video.category}
                  </span>
                  <h3 className="font-serif text-lg text-white">{video.title || 'Featured Video'}</h3>
                  <p className="text-xs text-stone-400">{video.uploadDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md" 
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute right-5 top-5 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" 
              onClick={() => setActiveVideo(null)}
            >
              <X />
            </button>
            <div 
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <video 
                src={activeVideo.video_url} 
                controls 
                 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="absolute bottom-5 left-5 right-5 z-20 text-center pointer-events-none">
               <h3 className="font-serif text-xl text-white drop-shadow-md">{activeVideo.title}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
