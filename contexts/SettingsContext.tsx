import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../src/lib/supabase';
import { contact } from '../data/contact';

export type Collection = { id: string, name: string, cover_image: string };

export type SiteSettings = {
  heroHeading: string;
  heroSubtitle: string;
  aboutText: string;
  phone: string;
  whatsappUrl: string;
  instagram: string;
  address: string;
  googleMapsEmbed: string;
  googleMapsLink: string;
  googleDirections: string;
  profilePhotoUrl: string;
  profileName: string;
  profileDesignation: string;
  profileBio: string;
  profileCoverUrl: string;
  profileWhatsapp: string;
  galleryEnabled: boolean;
  galleryHeading: string;
  galleryDescription: string;
  classesGalleryEnabled: boolean;
  classesGalleryHeading: string;
  classesGalleryDescription: string;
  portfolio_collections: Collection[];
};

const defaultSettings: SiteSettings = {
  heroHeading: "Beautiful stories,\ndrawn by hand.",
  heroSubtitle: "Elegant mehandi for weddings, engagements, festivals, baby showers, and every celebration that deserves a memorable detail.",
  aboutText: "Vandana Mehandi Artist provides premium mehandi services tailored to your special occasions. With years of experience and a passion for intricate designs, we ensure every pattern tells a unique story.",
  phone: contact.phone,
  whatsappUrl: contact.whatsappUrl,
  instagram: contact.instagram,
  address: contact.address,
  googleMapsEmbed: contact.googleMapsEmbed,
  googleMapsLink: contact.googleMapsLink,
  googleDirections: contact.googleDirections,
  profilePhotoUrl: '',
  profileName: 'Vandana Artist',
  profileDesignation: 'Professional Mehandi Artist',
  profileBio: 'Creating beautiful hand-drawn stories for over a decade.',
  profileCoverUrl: '',
  profileWhatsapp: '',
  galleryEnabled: true,
  galleryHeading: 'Highlights',
  galleryDescription: 'Explore our signature collections.',
  classesGalleryEnabled: true,
  classesGalleryHeading: 'Student Work',
  classesGalleryDescription: 'Glimpses of what our students achieve.',
  portfolio_collections: [
    { id: '1', name: 'Bridal Collection', cover_image: '' },
    { id: '2', name: 'Arabic Collection', cover_image: '' },
    { id: '3', name: 'Traditional Collection', cover_image: '' },
    { id: '4', name: 'Flower Decoration', cover_image: '' }
  ],
};

type SettingsContextType = {
  settings: SiteSettings;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType>({ settings: defaultSettings, loading: true });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (data) {
        // Migration logic
        let cols = data.portfolio_collections;
        if (cols && cols.some(c => c.name === 'Latest Designs')) {
          const newCols = [
            { id: '1', name: 'Bridal Collection', cover_image: '' },
            { id: '2', name: 'Arabic Collection', cover_image: '' },
            { id: '3', name: 'Traditional Collection', cover_image: '' },
            { id: '5', name: 'Flower Decoration', cover_image: '' }
          ];
          newCols.forEach(nc => {
            const existing = cols.find(ec => ec.name === nc.name);
            if (existing) nc.cover_image = existing.cover_image;
          });
          data.portfolio_collections = newCols;
          supabase.from('settings').update({ portfolio_collections: newCols }).eq('id', 1).then();
        }
        setSettings({ ...defaultSettings, ...data });
      } else if (error && error.code === 'PGRST116') {
        // Not found, insert default
        await supabase.from('settings').insert([{ id: 1, ...defaultSettings }]);
      }
      setLoading(false);
    };

    fetchSettings();
    
    const channel = supabase.channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings', filter: 'id=eq.1' }, payload => {
        if (payload.new) {
          setSettings({ ...defaultSettings, ...(payload.new as SiteSettings) });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
