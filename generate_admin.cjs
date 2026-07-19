const fs = require('fs');

const adminCode = `import { useState, useEffect } from 'react';
import { LogOut, Upload, Image as ImageIcon, X, CheckCircle, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import imageCompression from 'browser-image-compression';
import { GalleryImage } from './Gallery';
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
import { SortableImage } from './SortableImage';
import { SettingsEditor } from './SettingsEditor'; // Added for admin UI
import { supabase } from '../src/lib/supabase';

const CATEGORIES = ['Signature Mehndi Collection', 'Flower Decoration', 'Mehndi Classes'];
const MEHNDI_CLASSES_ALBUMS = ['Batches', 'Student Practice', 'Student Mehndi'];

export function Admin() {
  const [user, setUser] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedAlbum, setSelectedAlbum] = useState(MEHNDI_CLASSES_ALBUMS[0]);
  
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
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
    const { data, error } = await supabase.from('gallery').select('*').order('order', { ascending: true });
    if (!error && data) {
      const formatted = data.map(doc => {
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(doc.image_url);
        return {
          id: doc.id,
          url: publicUrlData.publicUrl,
          category: doc.category,
          subCategory: doc.subCategory || undefined,
          filename: doc.image_url,
          title: doc.title,
          order: doc.order || 0,
          uploadDate: doc.created_at,
        };
      });
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
      const urls = files.map(file => URL.createObjectURL(file));
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
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        
        const filename = \`\${Date.now()}-\${Math.random().toString(36).substring(7)}.jpg\`;
        const storagePath = \`\${selectedCat}\${selectedCat === 'Mehndi Classes' ? \`/\${selectedAlbum}\` : ''}/\${filename}\`;
        
        const { error: uploadError } = await supabase.storage.from('gallery').upload(storagePath, compressedFile);
        if (uploadError) throw uploadError;
        
        const { error: dbError } = await supabase.from('gallery').insert([{
          category: selectedCat,
          subCategory: selectedCat === 'Mehndi Classes' ? selectedAlbum : null,
          image_url: storagePath,
          title: '',
          order: images.length + i,
        }]);
        if (dbError) throw dbError;
        
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
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const filename = \`\${Date.now()}-\${Math.random().toString(36).substring(7)}.jpg\`;
      const storagePath = \`replaced/\${filename}\`;
      
      const { error: uploadError } = await supabase.storage.from('gallery').upload(storagePath, compressedFile);
      if (uploadError) throw uploadError;
      
      const { error: dbError } = await supabase.from('gallery').update({ image_url: storagePath }).eq('id', id);
      if (dbError) throw dbError;
      
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

  const handleDelete = async (id: string, url: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const img = images.find(img => img.id === id);
      if (img) {
        await supabase.storage.from('gallery').remove([img.filename]);
      }
      await supabase.from('gallery').delete().eq('id', id);
      setImages(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
      alert('Failed to delete image');
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    try {
      setImages(prev => prev.map(img => img.id === id ? { ...img, title: newTitle } : img));
      await supabase.from('gallery').update({ title: newTitle }).eq('id', id);
    } catch (e) {
      console.error('Update title failed:', e);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      
      const newArray = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({ ...img, order: idx }));
      setImages(newArray);
      
      try {
        const updates = newArray.map(img => ({
          id: img.id,
          order: img.order,
        }));
        
        for (const update of updates) {
          await supabase.from('gallery').update({ order: update.order }).eq('id', update.id);
        }
      } catch (e) {
        console.error('Reorder failed:', e);
      }
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
                  {passwordMsg && <p className={\`text-sm \${passwordMsg.includes('success') ? 'text-green-400' : 'text-red-400'}\`}>{passwordMsg}</p>}
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
                      <img src={url} alt="preview" className="w-full h-full object-cover" />
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
                    <div className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300" style={{ width: \`\${uploadProgress}%\` }}></div>
                  </div>
                )}
                
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                
                <button onClick={handleUpload} disabled={uploading} className="bg-[#D4AF37] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#e5c568] transition disabled:opacity-50">
                  {uploading ? \`Uploading \${uploadProgress}%...\` : \`Upload \${filesToUpload.length} Photo\${filesToUpload.length > 1 ? 's' : ''}\`}
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
            <h2 className="text-lg font-medium text-[#D4AF37]">Manage: {selectedCat} {selectedCat === 'Mehndi Classes' && \`> \${selectedAlbum}\`}</h2>
            <span className="text-sm text-stone-400">{displayedImages.length} items</span>
          </div>
          
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={displayedImages.map(img => img.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedImages.map(img => (
                  <SortableImage key={img.id} img={img} onDelete={handleDelete} onUpdateTitle={handleUpdateTitle} onReplace={handleReplace} />
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
      </main>
    </div>
  );
}
`;

fs.writeFileSync('components/Admin.tsx', adminCode);
