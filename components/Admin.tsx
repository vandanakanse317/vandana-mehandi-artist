import React, { useState, useEffect } from 'react';
import { LogOut, Upload, Image as ImageIcon, X, CheckCircle, Key, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import imageCompression from 'browser-image-compression';
import { GalleryImage } from './Gallery';
import { ImageWithFallback } from './ImageWithFallback';
import { getSupabaseImageUrl } from '../src/lib/imageLoader';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2 } from 'lucide-react';

function SortableImage({ img, onDelete, onUpdateTitle, onReplace, onChangeCategory, onToggleFeatured, categories, isSelected, onToggleSelect }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-square">
      <ImageWithFallback src={img.url} alt={img.filename} className="w-full h-full object-cover" />
      <div className={`absolute top-2 left-2 z-20 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={() => onToggleSelect(img.id)} 
          className="w-5 h-5 cursor-pointer rounded border-white/30 bg-black/50 text-[#D4AF37] focus:ring-[#D4AF37]" 
        />
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start pl-8">
          <div {...attributes} {...listeners} className="cursor-grab p-1 bg-black/50 rounded text-stone-300 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16M4 15h16"/></svg>
          </div>
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => onDelete(img.id, img.filename)} 
            className="p-1 bg-red-500/80 rounded text-white hover:bg-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              defaultValue={img.title} 
              onBlur={(e) => { if(e.target.value !== img.title) onUpdateTitle(img.id, e.target.value) }}
              placeholder="Add title..."
              className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-white/50"
            />
          </div>
          <select 
            value={img.category} 
            onChange={(e) => onChangeCategory(img.id, e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none"
          >
            {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer bg-black/50 border border-white/20 rounded px-2 py-1">
            <input type="checkbox" checked={img.is_featured !== false} onChange={() => onToggleFeatured(img.id, img.is_featured)} className="w-3 h-3 rounded text-[#D4AF37]" />
            <span className="text-[10px] text-stone-300">Featured</span>
          </label>
          <label className="flex items-center justify-center gap-1 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded px-2 py-1 cursor-pointer text-xs transition">
            <Edit2 className="h-3 w-3" /> Replace
            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onReplace(img.id, e.target.files[0]);
              }
            }} />
          </label>
        </div>
      </div>
    </div>
  );
}
import { SettingsEditor } from './SettingsEditor';
import { ProductsManager } from './ProductsManager';
import { ClassesManager } from './ClassesManager';
import { CollectionsEditor } from './CollectionsEditor';
import { useSettings } from '../contexts/SettingsContext';
import { VideosManager } from './VideosManager'; // Added for admin UI
import { supabase } from '../src/lib/supabase';


const MEHNDI_CLASSES_ALBUMS = ['Batches', 'Student Practice', 'Student Mehndi'];

const getBucketForCategory = (category: string) => {
  switch (category) {
    case 'Flower Decoration': return 'flower-decoration';
    case 'Classes': return 'mehandi-classes';
    case 'Mehndi Classes': return 'mehandi-classes';
    default: return 'gallery';
  }
};

export function Admin() {
  const { settings } = useSettings();
  const CATEGORIES = settings?.portfolio_collections ? [...settings.portfolio_collections.map(c => c.name), 'Classes'] : ['Classes'];
  const [user, setUser] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageToDelete, setImageToDelete] = useState<{id: string, url: string} | null>(null);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const handleToggleSelect = (id: string) => {
    setSelectedImages(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) setSelectedImages([]);
    else setSelectedImages(images.map(img => img.id));
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) return;
    try {
      const imgsToDelete = images.filter(img => selectedImages.includes(img.id));
      for (const img of imgsToDelete) {
        let bucket = img.bucket || getBucketForCategory(img.category);
        await supabase.storage.from(bucket).remove([img.filename]);
        await supabase.from('gallery').delete().eq('id', img.id);
      }
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [selectedCat, setSelectedCat] = useState('Classes');
  useEffect(() => { if (CATEGORIES.length > 0 && selectedCat === 'Classes') setSelectedCat(CATEGORIES[0]); }, [CATEGORIES]);
  
  const [selectedAlbum, setSelectedAlbum] = useState(MEHNDI_CLASSES_ALBUMS[0]);
  useEffect(() => { setSelectedImages([]); }, [selectedCat, selectedAlbum]);
  
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchGallery();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchGallery();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const formatted = await Promise.all(data?.map(async doc => {
        const bucket = doc.bucket || getBucketForCategory(doc.category);
        const url = await getSupabaseImageUrl(bucket, doc.image_url);
        return {
          id: doc.id,
          url,
          category: doc.category,
          bucket: bucket,
          subCategory: doc.subCategory || undefined,
          filename: doc.image_url,
          title: doc.title,
          order: doc.order || 0,
          is_featured: doc.is_featured !== false,
          uploadDate: doc.created_at,
        };
      }));
      setImages(formatted as any);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setImages([]);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg('Password updated successfully');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg(err.message || 'Failed to update password');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFilesToUpload(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file as unknown as Blob));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    setUploading(true);
    setSuccessMsg('');
    setUploadProgress(0);
    setError('');

    try {
      let i = 0;
      for (const file of filesToUpload) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: false };
        const compressedFile = await imageCompression(file as File, options);
        
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const storagePath = selectedCat === 'Mehndi Classes' ? `${selectedAlbum}/${filename}` : filename;
        
        const bucket = getBucketForCategory(selectedCat);
        const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, compressedFile);
        if (uploadError) throw new Error(`Storage Error (${bucket}): ${uploadError.message}. Make sure the bucket has an RLS policy for inserts.`);
        
        const { error: dbError } = await supabase.from('gallery').insert([{
          category: selectedCat,
          bucket: bucket,
          image_url: storagePath,
          title: '',
        }]);
        if (dbError) throw new Error(`Database Error (gallery): ${dbError.message}. Make sure the table has an RLS policy for inserts.`);
        
        i++;
        setUploadProgress(Math.round((i / filesToUpload.length) * 100));
      }
      
      await fetchGallery();
      setFilesToUpload([]);
      setPreviewUrls([]);
      setSuccessMsg('Photos uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error(e);
      setError('Failed to upload: ' + e.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReplace = async (id: string, file: File) => {
    setUploading(true);
    setSuccessMsg('');
    setError('');
    try {
      const img = images.find(i => i.id === id);
      if (!img) throw new Error('Image not found');
      const bucket = img.bucket || getBucketForCategory(img.category);

      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: false };
      const compressedFile = await imageCompression(file as File, options);
      
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const storagePath = `replaced/${filename}`;
      
      const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, compressedFile);
      if (uploadError) throw new Error(`Storage Error (${bucket}): ${uploadError.message}. Make sure the bucket has an RLS policy for inserts.`);
      
      const { error: dbError } = await supabase.from('gallery').update({ image_url: storagePath }).eq('id', id);
      if (dbError) throw new Error(`Database Error (gallery): ${dbError.message}. Make sure the table has an RLS policy for updates.`);
      
      await fetchGallery();
      setSuccessMsg('Image replaced successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error(e);
      setError('Failed to replace image: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const requestDelete = (id: string, url: string) => {
    setImageToDelete({ id, url });
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    const { id, url } = imageToDelete;
    try {
      const img = images.find(img => img.id === id);
      if (img) {
        const bucket = img.bucket || getBucketForCategory(img.category);
        const { error: storageError } = await supabase.storage.from(bucket).remove([img.filename]);
        if (storageError) throw new Error(`Storage Error (${bucket}): ${storageError.message}. Make sure the bucket has an RLS policy for deletes.`);
      }
      const { error: dbError, data: deletedData } = await supabase.from('gallery').delete().eq('id', id).select();
      if (dbError) throw new Error(`Database Error (gallery): ${dbError.message}. Make sure the table has an RLS policy for deletes.`);
      
      if (deletedData && deletedData.length === 0) {
         console.warn("Delete affected 0 rows, possibly due to RLS.");
      }
      
      await fetchGallery();
      setSuccessMsg('Image deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error('Delete failed:', e);
      setError('Failed to delete image: ' + e.message);
    } finally {
      setImageToDelete(null);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const nextVal = current === false ? true : false;
      setImages(prev => prev.map(img => img.id === id ? { ...img, is_featured: nextVal } : img));
      await supabase.from('gallery').update({ is_featured: nextVal }).eq('id', id);
    } catch (e: any) {
      console.error(e);
      setError('Failed to update featured status: ' + e.message);
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    try {
      setImages(prev => prev.map(img => img.id === id ? { ...img, title: newTitle } : img));
      const { error } = await supabase.from('gallery').update({ title: newTitle }).eq('id', id);
      if (error) throw error;
      setSuccessMsg('Title updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error('Update title failed:', e);
      setError('Failed to update title: ' + e.message);
    }
  };

  const handleChangeCategory = async (id: string, newCategory: string) => {
    try {
      setImages(prev => prev.map(img => img.id === id ? { ...img, category: newCategory, subCategory: newCategory === 'Mehndi Classes' ? MEHNDI_CLASSES_ALBUMS[0] : undefined } : img));
      const { error } = await supabase.from('gallery').update({ 
        category: newCategory, 
        subCategory: newCategory === 'Mehndi Classes' ? MEHNDI_CLASSES_ALBUMS[0] : null 
      }).eq('id', id);
      if (error) throw error;
      setSuccessMsg('Category updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error('Change category failed:', e);
      setError('Failed to update category: ' + e.message);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      
      const newArray = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({ ...(img as any), order: idx }));
      setImages(newArray);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#080504] grid place-items-center text-[#D4AF37]">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080504] grid place-items-center px-4 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#D4AF37] mb-2">Admin Access</h1>
            <p className="text-stone-400">Sign in to manage portfolio</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" placeholder="••••••••" />
            </div>
            {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="w-full bg-[#D4AF37] text-[#1a0f0a] font-semibold py-3.5 rounded-xl hover:bg-[#e5c568] transition duration-300 shadow-lg shadow-[#D4AF37]/20 mt-4">
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const displayedImages = images.filter(img => img.category === selectedCat && (selectedCat !== 'Mehndi Classes' || img.subCategory === selectedAlbum));

  return (
    <div className="min-h-screen bg-[#080504] font-sans text-white pb-20">
      <header className="border-b border-white/10 bg-black/50 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="font-serif text-xl text-[#D4AF37]">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowPasswordChange(!showPasswordChange)} className="text-sm text-stone-400 hover:text-white transition flex items-center gap-2">
              <Key className="h-4 w-4" /> <span className="hidden sm:inline">Password</span>
            </button>
            <a href="/" className="text-sm text-stone-400 hover:text-white transition hidden sm:block">View Site</a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Password Change Section */}
        <AnimatePresence>
          {showPasswordChange && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Key className="h-5 w-5 text-[#D4AF37]" /> Change Password</h2>
                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                  </div>
                  {passwordMsg && <p className={`text-sm ${passwordMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{passwordMsg}</p>}
                  <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-xl hover:bg-[#e5c568] transition">Update</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SettingsEditor />

        {/* Upload Section */}
        <section className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Upload className="h-5 w-5 text-[#D4AF37]" /> Upload Photos</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-stone-400 mb-2">Select Gallery</label>
              <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            {selectedCat === 'Mehndi Classes' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm text-stone-400 mb-2">Choose Album</label>
                <select value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]">
                  {MEHNDI_CLASSES_ALBUMS.map(alb => <option key={alb} value={alb}>{alb}</option>)}
                </select>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-2xl hover:border-[#D4AF37] transition cursor-pointer bg-black/20">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              <ImageIcon className="h-8 w-8 text-stone-400 mb-2" />
              <span className="text-sm text-stone-400">Click to select photos</span>
            </label>

            {previewUrls.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
                      <ImageWithFallback src={url} alt="preview" className="w-full h-full object-cover" />
                      <button onClick={() => {
                        setFilesToUpload(prev => prev.filter((_, idx) => idx !== i));
                        setPreviewUrls(prev => prev.filter((_, idx) => idx !== i));
                      }} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {uploading && (
                  <div className="w-full bg-black/30 rounded-full h-2 mb-4 overflow-hidden border border-white/10">
                    <div className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                
                <button onClick={handleUpload} disabled={uploading} className="bg-[#D4AF37] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#e5c568] transition disabled:opacity-50">
                  {uploading ? `Uploading ${uploadProgress}%...` : `Upload ${filesToUpload.length} Photo${filesToUpload.length > 1 ? 's' : ''}`}
                </button>
              </div>
            )}
            
            <AnimatePresence>
              {successMsg && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
                  <CheckCircle className="h-5 w-5" /> {successMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Manage Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#D4AF37]">Manage: {selectedCat} {selectedCat === 'Mehndi Classes' && `> ${selectedAlbum}`}</h2>
            <span className="text-sm text-stone-400">{displayedImages.length} items</span>
          </div>
          
          {images.length > 0 && (
            <div className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={selectedImages.length === images.length && images.length > 0} 
                  onChange={handleSelectAll} 
                  className="w-4 h-4 rounded border-white/30 bg-black/50 text-[#D4AF37] focus:ring-[#D4AF37]" 
                />
                Select All
              </label>
              {selectedImages.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#D4AF37]">{selectedImages.length} selected</span>
                  <button 
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Bulk Delete
                  </button>
                </div>
              )}
            </div>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={displayedImages.map(img => img.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedImages.map(img => (
                  <SortableImage key={img.id} img={img} onDelete={requestDelete} onUpdateTitle={handleUpdateTitle} onReplace={handleReplace} onChangeCategory={handleChangeCategory} onToggleFeatured={handleToggleFeatured} categories={CATEGORIES} isSelected={selectedImages.includes(img.id)} onToggleSelect={handleToggleSelect} />
                ))}
                {displayedImages.length === 0 && (
                  <div className="col-span-full py-12 text-center text-stone-500 border border-dashed border-white/10 rounded-2xl">
                    No images found in this category.
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        <VideosManager />
        <div className="my-16 border-t border-white/10" />
        <ClassesManager />
        <div className="my-16 border-t border-white/10" />
        <ProductsManager />
      </main>

      <AnimatePresence>
        {imageToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#1a0f0a] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <h3 className="text-xl font-serif text-white mb-2">Delete Image</h3>
              <p className="text-stone-400 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setImageToDelete(null)} className="px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
