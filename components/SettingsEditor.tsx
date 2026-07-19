import { useState, useEffect, FormEvent } from 'react';
import { useSettings, SiteSettings } from '../contexts/SettingsContext';
import { supabase } from '../src/lib/supabase';
import { Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SettingsEditor() {
  const { settings, loading } = useSettings();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
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
