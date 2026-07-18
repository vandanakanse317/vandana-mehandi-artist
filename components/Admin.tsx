import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogOut, Upload, X, Trash2, GripVertical, Image as ImageIcon, CheckCircle, Key } from 'lucide-react';
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
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { auth, db } from '../src/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';

export type GalleryImage = {
  id: string;
  url: string;
  category: string;
  subCategory?: string;
  filename: string;
  title?: string;
  uploadDate?: string;
  order: number;
};

const CATEGORIES = [
  'Signature Mehndi Collection',
  'Flower Decoration',
  'Mehndi Classes'
];

const MEHNDI_CLASSES_ALBUMS = [
  'Classroom Photos',
  'Student Practice',
  'Certificate & Achievement'
];

function SortableImage({ img, onDelete, onUpdateTitle, onReplace }: { key?: string | number; img: GalleryImage; onDelete: (id: string, url: string) => Promise<void> | void; onUpdateTitle: (id: string, newTitle: string) => void; onReplace: (id: string, file: File) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group overflow-hidden rounded-xl border border-white/10 ${isDragging ? 'opacity-50' : 'opacity-100'} bg-black/40`}>
      <img src={img.url} alt={img.filename} className="w-full h-40 object-cover" />
      <div className="p-3">
         <input 
            type="text" 
            value={img.title || ''} 
            onChange={(e) => onUpdateTitle(img.id, e.target.value)}
            placeholder="Image title..." 
            className="w-full bg-transparent text-sm text-stone-300 border-b border-transparent focus:border-[#D4AF37] focus:outline-none transition-colors"
         />
      </div>
      <div className="absolute top-0 inset-x-0 h-40 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        <div {...attributes} {...listeners} className="p-2 bg-white/10 rounded-full cursor-grab hover:bg-white/20">
          <GripVertical className="h-5 w-5 text-white" />
        </div>
        
        <label className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/40 cursor-pointer">
          <Upload className="h-5 w-5" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onReplace(img.id, e.target.files[0]);
            }
          }} />
        </label>

        <button onClick={() => onDelete(img.id, img.url)} className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500/40">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Dashboard state
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedAlbum, setSelectedAlbum] = useState(MEHNDI_CLASSES_ALBUMS[0]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchImages();
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchImages = async () => {
    try {
      if (!db) return;
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const data: GalleryImage[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as GalleryImage);
      });
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setImages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordMsg('Password updated successfully!');
        setNewPassword('');
        setTimeout(() => setShowPasswordChange(false), 2000);
      }
    } catch (err: any) {
      setPasswordMsg(err.message || 'Failed to update password');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      setFilesToUpload(files);
      const urls = files.map(f => URL.createObjectURL(f));
      setPreviewUrls(urls);
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    setUploading(true);
    setSuccessMsg('');
    setUploadProgress(0);
    setError('');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      setError('Cloudinary cloud name is not configured.');
      setUploading(false);
      return;
    }

    try {
      const newImages: GalleryImage[] = [];
      let i = 0;
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vandana_mehandi_upload');
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload to Cloudinary failed');
        }

        const data = await response.json();
        const url = data.secure_url;
        const filename = data.original_filename || file.name;
        
        const newImgData = {
          url,
          category: selectedCat,
          subCategory: selectedCat === 'Mehndi Classes' ? selectedAlbum : null,
          filename,
          title: '',
          uploadDate: new Date().toISOString(),
          order: images.length + newImages.length
        };
        
        const docRef = await addDoc(collection(db, 'gallery'), newImgData);
        newImages.push({ id: docRef.id, ...newImgData });
        
        i++;
        setUploadProgress(Math.round((i / filesToUpload.length) * 100));
      }
      
      setImages(prev => [...prev, ...newImages]);
      setFilesToUpload([]);
      setPreviewUrls([]);
      setSuccessMsg('Images uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error(e);
      setError('Failed to upload: ' + e.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplace = async (id: string, file: File) => {
    setUploading(true);
    setSuccessMsg('');
    setError('');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      setError('Cloudinary cloud name is not configured.');
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'vandana_mehandi_upload');
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload to Cloudinary failed');
      }

      const data = await response.json();
      const url = data.secure_url;
      
      setImages(prev => prev.map(img => img.id === id ? { ...img, url, uploadDate: new Date().toISOString() } : img));
      
      const itemRef = doc(db, 'gallery', id);
      await updateDoc(itemRef, { url, uploadDate: new Date().toISOString() });
      
      setSuccessMsg('Image replaced successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      console.error(e);
      setError('Failed to replace image: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, title: newTitle } : img));
    try {
      const itemRef = doc(db, 'gallery', id);
      await updateDoc(itemRef, { title: newTitle });
    } catch (err) {
      console.error('Failed to update title', err);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      let newOrder: GalleryImage[] = [];
      setImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        newOrder = arrayMove(items, oldIndex, newIndex);
        newOrder = newOrder.map((item, idx) => ({ ...item, order: idx }));
        return newOrder;
      });

      // Save new order to backend
      if (newOrder.length > 0) {
        try {
          const batch = writeBatch(db);
          newOrder.forEach(item => {
            const itemRef = doc(db, 'gallery', item.id);
            batch.update(itemRef, { order: item.order });
          });
          await batch.commit();
        } catch (err) {
          console.error('Failed to save order', err);
        }
      }
    }
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080504] grid place-items-center px-4 font-sans text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-serif text-[#D4AF37]">Admin Login</h2>
            <p className="text-stone-400 text-sm mt-2">Secure access for Vandana Mehandi Artist</p>
          </div>
          
          {!auth ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm">
              Firebase is not configured. Please set up your Firebase credentials in the settings to enable the admin dashboard.
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-medium rounded-xl hover:bg-[#e5c568] transition">Login</button>
            </form>
          )}
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
