import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { CheckCircle, ChevronDown, ChevronUp, Star, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { getSupabaseImageUrl } from '../src/lib/imageLoader';
import { ImageWithFallback } from './ImageWithFallback';

export type ClassesInfo = {
  id: number;
  banner_image: string;
  heading: string;
  description: string;
  course_fee: string;
  course_duration: string;
  batch_timing: string;
  class_location: string;
  cta_primary: string;
  cta_secondary: string;
  highlights: any[];
  curriculum: any[];
  gallery: any[];
  reviews: any[];
};

export function Classes() {
  const { settings } = useSettings();
  const [info, setInfo] = useState<ClassesInfo | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfo();
    const channel = supabase.channel('classes_info_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes_info' }, () => {
        fetchInfo();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const [bannerUrl, setBannerUrl] = useState<string>('');

  const fetchInfo = async () => {
    try {
      const { data, error } = await supabase.from('classes_info').select('*').eq('id', 1).single();
      if (data) {
        if (data.banner_image) {
          const url = await getSupabaseImageUrl('classes', data.banner_image);
          setBannerUrl(url);
        }
        
        if (data.gallery) {
          data.gallery = await Promise.all(data.gallery.map(async (img: any) => ({
            ...img,
            resolvedUrl: await getSupabaseImageUrl('classes', img.url)
          })));
        }
        if (data.reviews) {
          data.reviews = await Promise.all(data.reviews.map(async (rev: any) => ({
            ...rev,
            resolvedPhoto: rev.photo ? await getSupabaseImageUrl('classes', rev.photo) : null
          })));
        }

        setInfo(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!info) return null;

  const featuredStudent = info.gallery?.find(img => img.is_featured) || info.gallery?.[0];
  const galleryImages = info.gallery?.filter(img => img.id !== featuredStudent?.id) || [];

  return (
    <section id="classes" className="py-24 bg-[#0a0604] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-screen pointer-events-none blur-[2px]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80")' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604] via-transparent to-[#0a0604] pointer-events-none z-0" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-16 bg-[#1a0f0a] border border-white/10 shadow-2xl">
          {bannerUrl && (
            <div className="absolute inset-0 opacity-40">
              <ImageWithFallback src={bannerUrl} alt="Mehndi Classes" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0604] via-[#0a0604]/80 to-transparent" />
            </div>
          )}
          <div className="relative p-10 lg:p-16 max-w-3xl">
            <p className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm mb-3">Professional Mehndi Training</p>
            <h2 className="text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">{info.heading}</h2>
            <p className="text-lg text-stone-300 leading-relaxed mb-10">{info.description}</p>
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-stone-400 text-sm mb-1">Fee</p>
                <p className="text-white font-medium">{info.course_fee}</p>
              </div>
              <div>
                <p className="text-stone-400 text-sm mb-1">Duration</p>
                <p className="text-white font-medium">{info.course_duration}</p>
              </div>
              <div>
                <p className="text-stone-400 text-sm mb-1">Timing</p>
                <p className="text-white font-medium">{info.batch_timing}</p>
              </div>
              <div>
                <p className="text-stone-400 text-sm mb-1">Location</p>
                <p className="text-white font-medium">{info.class_location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Highlights */}
          <div>
            <h3 className="text-2xl font-serif text-white mb-8">Course Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {info.highlights?.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="text-stone-200 text-sm">{hl.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h3 className="text-2xl font-serif text-white mb-8">Curriculum</h3>
            <div className="space-y-3">
              {info.curriculum?.map((item) => (
                <div key={item.id} className="border border-white/10 rounded-2xl bg-[#1a0f0a] overflow-hidden">
                  <button 
                    onClick={() => setExpandedTopic(expandedTopic === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left transition hover:bg-white/5"
                  >
                    <span className="text-white font-medium">{item.topic}</span>
                    {expandedTopic === item.id ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedTopic === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 text-stone-400 text-sm leading-relaxed"
                      >
                        {item.details}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Gallery */}
        {(featuredStudent || galleryImages.length > 0) && (
          <div className="mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h3 className="text-3xl font-serif text-white mb-2">Student Work</h3>
                <p className="text-stone-400">Glimpses of what our students achieve</p>
              </div>
              <Link to="/classes-gallery" className="text-[#D4AF37] hover:text-[#e5c568] transition flex items-center gap-2 text-sm uppercase tracking-wider font-medium">
                ✨ View Complete Gallery &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredStudent && (
                <div className="lg:col-span-2 relative aspect-square lg:aspect-auto lg:h-[400px] rounded-3xl overflow-hidden border border-white/10">
                  <ImageWithFallback src={featuredStudent.resolvedUrl} alt="Featured Student Work" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
              )}
              <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-6 pb-4 lg:pb-0 scrollbar-hide">
                {galleryImages.slice(0, 4).map((img) => (
                  <div key={img.id} className="relative w-48 lg:w-full aspect-square rounded-3xl overflow-hidden border border-white/10 flex-shrink-0">
                    <ImageWithFallback src={img.resolvedUrl} alt="Student Work" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {info.reviews && info.reviews.length > 0 && (
          <div className="mt-24">
            <h3 className="text-3xl font-serif text-white mb-10 text-center">Student Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {info.reviews.map((review) => (
                <div key={review.id} className="bg-[#1a0f0a] border border-white/10 p-8 rounded-3xl relative">
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-stone-300 italic mb-8 relative z-10 leading-relaxed">
                    "{review.review}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    {review.photo ? (
                       <ImageWithFallback src={review.resolvedPhoto} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-medium border border-white/10">{review.name.charAt(0)}</div>
                    )}
                    <span className="text-white font-medium">{review.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={`${settings?.whatsappUrl}?text=${encodeURIComponent('Hi, I would like to enroll in the Professional Mehndi Training class.')}`} target="_blank" rel="noreferrer" className="bg-[#D4AF37] text-black px-10 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#e5c568] transition shadow-xl shadow-[#D4AF37]/10">
              <MessageCircle className="w-5 h-5" />
              {info.cta_primary}
            </a>
            <a href={`tel:${settings?.phone}`} className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-white/20 transition">
              <Phone className="w-5 h-5" />
              {info.cta_secondary}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
