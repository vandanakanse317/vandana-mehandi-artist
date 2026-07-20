import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSettings, SiteSettings } from '../contexts/SettingsContext';
import { supabase } from '../src/lib/supabase';
import { Save, CheckCircle, Image as ImageIcon, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SettingsEditor() {
  const { settings, loading } = useSettings();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  }, [settings, formData]);

  if (loading || !formData) return <div className="text-stone-400">Loading settings...</div>;

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'profileCoverUrl' | 'profilePhotoUrl') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (field === 'profileCoverUrl') setUploadingCover(true);
    else setUploadingPhoto(true);
    
    setError('');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
      handleChange(field, data.publicUrl);
      
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      if (field === 'profileCoverUrl') setUploadingCover(false);
      else setUploadingPhoto(false);
    }
  };

  const removeImage = (field: 'profileCoverUrl' | 'profilePhotoUrl') => {
    handleChange(field, '');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      await supabase.from('settings').update(formData).eq('id', 1);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-6 rounded-3xl bg-white/5 border border-white/10 mt-8">
      <h2 className="text-lg font-medium mb-6 flex items-center gap-2 text-[#D4AF37]">
        Site Settings
      </h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Hero Section</h3>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Heading</label>
              <textarea 
                value={formData.heroHeading} 
                onChange={e => handleChange('heroHeading', e.target.value)} 
                rows={3}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Subtitle</label>
              <textarea 
                value={formData.heroSubtitle} 
                onChange={e => handleChange('heroSubtitle', e.target.value)} 
                rows={4}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Contact & Social</h3>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Phone</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={e => handleChange('phone', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">WhatsApp URL</label>
              <input 
                type="text" 
                value={formData.whatsappUrl} 
                onChange={e => handleChange('whatsappUrl', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Instagram URL</label>
              <input 
                type="text" 
                value={formData.instagram} 
                onChange={e => handleChange('instagram', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">About & Location</h3>
          <div>
            <label className="block text-sm text-stone-400 mb-1">About Text</label>
            <textarea 
              value={formData.aboutText} 
              onChange={e => handleChange('aboutText', e.target.value)} 
              rows={4}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
            />
          </div>
          <div>
            <label className="block text-sm text-stone-400 mb-1">Address</label>
            <textarea 
              value={formData.address} 
              onChange={e => handleChange('address', e.target.value)} 
              rows={2}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Google Maps Embed URL</label>
              <input 
                type="text" 
                value={formData.googleMapsEmbed} 
                onChange={e => handleChange('googleMapsEmbed', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Google Maps Link</label>
              <input 
                type="text" 
                value={formData.googleMapsLink} 
                onChange={e => handleChange('googleMapsLink', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Google Directions Link</label>
              <input 
                type="text" 
                value={formData.googleDirections} 
                onChange={e => handleChange('googleDirections', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>
        </div>

        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Profile Header (Gallery)</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Profile Name</label>
              <input 
                type="text" 
                value={formData.profileName || ''} 
                onChange={e => handleChange('profileName', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Designation</label>
              <input 
                type="text" 
                value={formData.profileDesignation || ''} 
                onChange={e => handleChange('profileDesignation', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Profile Cover Photo</label>
            <div className="flex gap-4">
              {formData.profileCoverUrl ? (
                <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-white/20 bg-black/50 shrink-0">
                  <ImageWithFallback src={formData.profileCoverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage('profileCoverUrl')} className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-full text-white hover:bg-red-600 transition shadow-lg">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="w-40 h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4AF37] flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-[#D4AF37] transition bg-black/30 shrink-0">
                  {uploadingCover ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-xs">Upload Cover</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileCoverUrl')} className="hidden" disabled={uploadingCover} />
                </label>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-2">Recommended: Landscape format (e.g. 1920x1080)</p>
          </div>
          <div>
            <label className="block text-sm text-stone-400 mb-1">WhatsApp Number (For Gallery)</label>
            <input 
              type="text" 
              value={formData.profileWhatsapp || ''} 
              onChange={e => handleChange('profileWhatsapp', e.target.value)} 
              placeholder="https://wa.me/..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
            />
          </div>
          <div>
            <label className="block text-sm text-stone-400 mb-2">Profile Photo</label>
            <div className="flex gap-4">
              {formData.profilePhotoUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-white/20 bg-black/50 shrink-0">
                  <ImageWithFallback src={formData.profilePhotoUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage('profilePhotoUrl')} className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white hover:bg-red-600 transition shadow-lg">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 hover:border-[#D4AF37] flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-[#D4AF37] transition bg-black/30 shrink-0">
                  {uploadingPhoto ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mb-1" />
                      <span className="text-[10px]">Upload Photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePhotoUrl')} className="hidden" disabled={uploadingPhoto} />
                </label>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-2">Recommended: Square format (e.g. 500x500)</p>
          </div>
          <div>
            <label className="block text-sm text-stone-400 mb-1">Short Bio</label>
            <textarea 
              value={formData.profileBio || ''} 
              onChange={e => handleChange('profileBio', e.target.value)} 
              rows={2}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
            />
          </div>
        </div>

        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Main Gallery Settings</h3>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.galleryEnabled !== false} 
              onChange={e => handleChange('galleryEnabled', e.target.checked)} 
              className="w-4 h-4"
            />
            <label className="text-sm text-stone-400">Enable Main Gallery Section</label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Heading</label>
              <input 
                type="text" 
                value={formData.galleryHeading || ''} 
                onChange={e => handleChange('galleryHeading', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Description</label>
              <input 
                type="text" 
                value={formData.galleryDescription || ''} 
                onChange={e => handleChange('galleryDescription', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Classes Gallery Settings</h3>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.classesGalleryEnabled !== false} 
              onChange={e => handleChange('classesGalleryEnabled', e.target.checked)} 
              className="w-4 h-4"
            />
            <label className="text-sm text-stone-400">Enable Classes Gallery Section</label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Heading</label>
              <input 
                type="text" 
                value={formData.classesGalleryHeading || ''} 
                onChange={e => handleChange('classesGalleryHeading', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1">Description</label>
              <input 
                type="text" 
                value={formData.classesGalleryDescription || ''} 
                onChange={e => handleChange('classesGalleryDescription', e.target.value)} 
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
              <CheckCircle className="h-5 w-5" /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-medium hover:bg-[#e5c568] transition disabled:opacity-50">
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </section>
  );
}
