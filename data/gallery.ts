export type GalleryItem = {
  title: string;
  category: string;
  url: string;
  alt: string;
};

export const galleryItems: GalleryItem[] = [
  { title: 'Royal Bridal Story', category: 'Bridal', url: '/images/gallery/bridal.svg', alt: 'Intricate bridal mehandi inspired floral artwork' },
  { title: 'Arabic Garden Trail', category: 'Arabic', url: '/images/gallery/arabic.svg', alt: 'Flowing Arabic mehandi inspired floral artwork' },
  { title: 'Heritage Mandala', category: 'Traditional', url: '/images/gallery/mandala.svg', alt: 'Traditional mandala mehandi inspired artwork' },
  { title: 'Festive Florals', category: 'Festival', url: '/images/gallery/festival.svg', alt: 'Festive floral mehandi inspired artwork' },
  { title: 'Jaali & Paisley', category: 'Contemporary', url: '/images/gallery/jaali.svg', alt: 'Jaali and paisley mehandi inspired artwork' },
  { title: 'Celebration Vines', category: 'Occasion', url: '/images/gallery/vines.svg', alt: 'Celebration vine mehandi inspired artwork' },
];
