import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../src/lib/supabase';
import { Plus, Trash2, Edit2, CheckCircle, Image as ImageIcon, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassesInfo } from './Classes';

export function ClassesManager() {
  const [info, setInfo] = useState<ClassesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('classes_info').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setInfo(data);
      } else {
        // Not found, will be inserted on save
        setInfo({
          id: 1,
          banner_image: '',
          heading: '',
          description: '',
          course_fee: '',
          course_duration: '',
          batch_timing: '',
          class_location: '',
          cta_primary: 'Enroll Now on WhatsApp',
          cta_secondary: 'Call Now',
          highlights: [],
          curriculum: [],
          gallery: [],
          reviews: []
        });
      }
    } catch (err: any) {
      if (err.code === '42P01') {
        setError('Classes Info table not found. Please run the SQL schema script.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { error } = await supabase.from('classes_info').upsert([info]).eq('id', 1);
      if (error) throw error;
      setSuccess('Classes information saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'banner' | 'gallery' | 'review', reviewId?: string) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('classes').upload(fileName, file);
      if (error) throw error;
      return fileName;
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <div className="text-stone-400 p-8">Loading...</div>;
  if (!info) return null;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-white mb-2">Classes Management</h2>
          <p className="text-stone-400">Manage your premium Mehndi classes section.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving || uploadingImage} 
          className="bg-[#D4AF37] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#e5c568] transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2"><CheckCircle className="w-5 h-5" /> {success}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Banner & Basic Info */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-6">
          <h3 className="text-xl font-medium text-white mb-4">Banner & Basic Info</h3>
          
          <div className="space-y-2">
            <label className="block text-sm text-stone-400">Banner Image</label>
            <div className="flex items-center gap-4">
              {info.banner_image && (
                <img src={supabase.storage.from('classes').getPublicUrl(info.banner_image).data.publicUrl} alt="Banner" className="w-32 h-20 object-cover rounded-lg border border-white/20" />
              )}
              <label className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-stone-300 hover:text-white cursor-pointer transition flex items-center gap-2">
                <Upload className="w-4 h-4" /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const filename = await handleImageUpload(e.target.files[0], 'banner');
                    if (filename) setInfo({ ...info, banner_image: filename });
                  }
                }} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Heading</label>
              <input type="text" value={info.heading} onChange={e => setInfo({...info, heading: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Description</label>
              <textarea rows={3} value={info.description} onChange={e => setInfo({...info, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-6">
          <h3 className="text-xl font-medium text-white mb-4">Course Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Course Fee</label>
              <input type="text" value={info.course_fee} onChange={e => setInfo({...info, course_fee: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. ₹15,000" />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Duration</label>
              <input type="text" value={info.course_duration} onChange={e => setInfo({...info, course_duration: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. 2 Months" />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Batch Timing</label>
              <input type="text" value={info.batch_timing} onChange={e => setInfo({...info, batch_timing: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. 11:00 AM to 2:00 PM" />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Location</label>
              <input type="text" value={info.class_location} onChange={e => setInfo({...info, class_location: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Studio Name" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Primary CTA Button</label>
              <input type="text" value={info.cta_primary} onChange={e => setInfo({...info, cta_primary: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Secondary CTA Button</label>
              <input type="text" value={info.cta_secondary} onChange={e => setInfo({...info, cta_secondary: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white">Highlights</h3>
            <button onClick={() => setInfo({...info, highlights: [...info.highlights, { id: Date.now().toString(), text: '' }]})} className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {info.highlights?.map((hl, idx) => (
              <div key={hl.id} className="flex gap-2">
                <input type="text" value={hl.text} onChange={e => {
                  const newHls = [...info.highlights];
                  newHls[idx].text = e.target.value;
                  setInfo({...info, highlights: newHls});
                }} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Certificate Included" />
                <button onClick={() => setInfo({...info, highlights: info.highlights.filter((_, i) => i !== idx)})} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {info.highlights.length === 0 && <p className="text-stone-500 text-sm">No highlights added.</p>}
          </div>
        </div>

        {/* Curriculum */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white">Curriculum</h3>
            <button onClick={() => setInfo({...info, curriculum: [...info.curriculum, { id: Date.now().toString(), topic: '', details: '' }]})} className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {info.curriculum?.map((curr, idx) => (
              <div key={curr.id} className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-3 relative group">
                <button onClick={() => setInfo({...info, curriculum: info.curriculum.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <input type="text" value={curr.topic} onChange={e => {
                  const newCurr = [...info.curriculum];
                  newCurr[idx].topic = e.target.value;
                  setInfo({...info, curriculum: newCurr});
                }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm" placeholder="Topic Name" />
                <textarea rows={2} value={curr.details} onChange={e => {
                  const newCurr = [...info.curriculum];
                  newCurr[idx].details = e.target.value;
                  setInfo({...info, curriculum: newCurr});
                }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm" placeholder="Details" />
              </div>
            ))}
            {info.curriculum.length === 0 && <p className="text-stone-500 text-sm">No curriculum topics added.</p>}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white">Student Gallery</h3>
            <label className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Image
              <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const filename = await handleImageUpload(e.target.files[0], 'gallery');
                  if (filename) setInfo({...info, gallery: [...info.gallery, { id: Date.now().toString(), url: filename, is_featured: false }]});
                }
              }} />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {info.gallery?.map((img, idx) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/20 group">
                <img src={supabase.storage.from('classes').getPublicUrl(img.url).data.publicUrl} alt="Gallery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-2">
                  <button onClick={() => {
                    const newGal = info.gallery?.map((g, i) => ({ ...g, is_featured: i === idx }));
                    setInfo({...info, gallery: newGal});
                  }} className={`text-xs px-2 py-1 rounded-full ${img.is_featured ? 'bg-[#D4AF37] text-black' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                    {img.is_featured ? 'Featured' : 'Make Featured'}
                  </button>
                  <button onClick={() => setInfo({...info, gallery: info.gallery.filter((_, i) => i !== idx)})} className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {info.gallery.length === 0 && <p className="text-stone-500 text-sm col-span-3">No images added.</p>}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white">Student Reviews</h3>
            <button onClick={() => setInfo({...info, reviews: [...info.reviews, { id: Date.now().toString(), name: '', photo: '', rating: 5, review: '' }]})} className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Review
            </button>
          </div>
          <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-2">
            {info.reviews?.map((rev, idx) => (
              <div key={rev.id} className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-3 relative group">
                <button onClick={() => setInfo({...info, reviews: info.reviews.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex gap-4">
                  <div className="w-16 flex-shrink-0">
                    <div className="aspect-square rounded-full overflow-hidden border border-white/20 bg-black/50 mb-2 relative group/img">
                      {rev.photo ? (
                        <img src={supabase.storage.from('classes').getPublicUrl(rev.photo).data.publicUrl} alt="Review" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600"><ImageIcon className="w-6 h-6" /></div>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center cursor-pointer">
                        <Upload className="w-4 h-4 text-white" />
                        <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const filename = await handleImageUpload(e.target.files[0], 'review');
                            if (filename) {
                              const newRevs = [...info.reviews];
                              newRevs[idx].photo = filename;
                              setInfo({...info, reviews: newRevs});
                            }
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="text" value={rev.name} onChange={e => {
                      const newRevs = [...info.reviews];
                      newRevs[idx].name = e.target.value;
                      setInfo({...info, reviews: newRevs});
                    }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm" placeholder="Student Name" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">Rating:</span>
                      <input type="number" min="1" max="5" value={rev.rating} onChange={e => {
                        const newRevs = [...info.reviews];
                        newRevs[idx].rating = parseInt(e.target.value) || 5;
                        setInfo({...info, reviews: newRevs});
                      }} className="w-16 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#D4AF37] text-sm" />
                    </div>
                  </div>
                </div>
                <textarea rows={3} value={rev.review} onChange={e => {
                  const newRevs = [...info.reviews];
                  newRevs[idx].review = e.target.value;
                  setInfo({...info, reviews: newRevs});
                }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] text-sm" placeholder="Review Text" />
              </div>
            ))}
            {info.reviews.length === 0 && <p className="text-stone-500 text-sm">No reviews added.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
