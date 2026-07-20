import React, { useState, useEffect } from 'react';
import { Upload, X, Edit2, Video as VideoIcon, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../src/lib/supabase';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';


function SortableVideo({ v, handleDelete, toggleFeatured, updateTitle }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: v.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden group">
      <div className="aspect-video relative bg-black">
        {v.thumbnail_url && (
          <img src={supabase.storage.from('videos').getPublicUrl(v.thumbnail_url).data.publicUrl} alt={v.title} className="w-full h-full object-cover opacity-60" />
        )}
        <button onClick={() => handleDelete(v.id, v.video_url, v.thumbnail_url)} className="absolute top-2 right-2 bg-red-500/80 p-2 rounded-full text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition">
          <X className="h-4 w-4" />
        </button>
        <div {...attributes} {...listeners} className="absolute top-2 left-2 cursor-grab bg-black/50 p-2 rounded-lg text-stone-300 hover:text-white">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <input 
          type="text" 
          defaultValue={v.title} 
          onBlur={e => e.target.value !== v.title && updateTitle(v.id, e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white" 
        />
        <div className="flex justify-between items-center text-xs text-stone-400">
          <span>{v.category}</span>
          <span>{new Date(v.created_at).toLocaleDateString()}</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-2 bg-white/5 p-2 rounded">
          <input type="checkbox" checked={v.is_featured} onChange={() => toggleFeatured(v.id, v.is_featured)} className="w-4 h-4 rounded text-[#D4AF37]" />
          <span className="text-xs text-stone-300">Featured</span>
        </label>
      </div>
    </div>
  );
}
export function VideosManager() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = videos.findIndex(v => v.id === active.id);
      const newIndex = videos.findIndex(v => v.id === over?.id);
      const newVideos = arrayMove(videos, oldIndex, newIndex) as any[];
      setVideos(newVideos);
      
      // Save order to db (assuming we add 'order' column or just rely on an array, but we have individual rows so we update 'order' field)
      // First we need to make sure 'order' exists. Let's just update order column for all.
      try {
        const updates = newVideos.map((v, i) => ({ id: v.id, order: i }));
        // Supabase doesn't easily do bulk updates unless via RPC or loop. Let's loop.
        for (const update of updates) {
          await supabase.from('videos').update({ order: update.order }).eq('id', update.id);
        }
      } catch(e) {
        console.error("Error saving video order", e);
      }
    }
  };

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Signature Mehndi Collection');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const CATEGORIES = ['Signature Mehndi Collection', 'Flower Decoration', 'Mehndi Classes'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbFile) {
      setError('Both Video and Thumbnail are required');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const vidName = `vid-${Date.now()}-${Math.random().toString(36).substring(7)}.${videoFile.name.split('.').pop()}`;
      const thumbName = `thumb-${Date.now()}-${Math.random().toString(36).substring(7)}.${thumbFile.name.split('.').pop()}`;
      
      const { error: vidErr } = await supabase.storage.from('videos').upload(vidName, videoFile);
      if (vidErr) throw vidErr;
      
      const { error: thumbErr } = await supabase.storage.from('videos').upload(thumbName, thumbFile);
      if (thumbErr) throw thumbErr;
      
      const { error: dbErr } = await supabase.from('videos').insert([{
        title,
        description,
        category,
        is_featured: isFeatured,
        video_url: vidName,
        thumbnail_url: thumbName
      }]);
      
      if (dbErr) throw dbErr;
      
      setSuccessMsg('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbFile(null);
      fetchVideos();
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, vidUrl: string, thumbUrl: string) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await supabase.storage.from('videos').remove([vidUrl, thumbUrl]);
      await supabase.from('videos').delete().eq('id', id);
      setVideos(prev => prev.filter(v => v.id !== id));
      setSuccessMsg('Video deleted!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, is_featured: !current } : v));
      await supabase.from('videos').update({ is_featured: !current }).eq('id', id);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const updateTitle = async (id: string, newTitle: string) => {
    try {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, title: newTitle } : v));
      await supabase.from('videos').update({ title: newTitle }).eq('id', id);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <VideoIcon className="text-[#D4AF37] h-6 w-6" />
        <h2 className="text-xl font-serif text-[#D4AF37]">Videos Manager</h2>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-xl border border-red-500/50">
          {error}
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h3 className="text-lg text-white mb-4">Upload New Video</h3>
        <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-stone-300">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-stone-300">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-stone-300">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white" rows={2} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-stone-300">Video File (MP4, WebM)</label>
            <input required type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-stone-300">Thumbnail Image (JPG, PNG)</label>
            <input required type="file" accept="image/*" onChange={e => setThumbFile(e.target.files?.[0] || null)} className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm" />
          </div>
          <div className="md:col-span-2 flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-black/50 text-[#D4AF37] focus:ring-[#D4AF37]" />
              <span className="text-stone-300">Feature on Homepage</span>
            </label>
            <button type="submit" disabled={uploading} className="bg-[#D4AF37] text-black px-6 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-[#e5c568] disabled:opacity-50">
              {uploading ? 'Uploading...' : <><Upload className="h-4 w-4" /> Upload Video</>}
            </button>
          </div>
        </form>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={videos.map(v => v.id)} strategy={rectSortingStrategy}>
            {videos.map(v => (
              <SortableVideo key={v.id} v={v} handleDelete={handleDelete} toggleFeatured={toggleFeatured} updateTitle={updateTitle} />
            ))}
          </SortableContext>
        </DndContext>
        {!loading && videos.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-500 border border-dashed border-white/10 rounded-2xl">
            No videos uploaded yet.
          </div>
        )}
      </div>
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
            <CheckCircle className="h-5 w-5" /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
