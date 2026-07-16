export type ServiceIcon = 'Crown' | 'Sparkles' | 'Flower2' | 'PartyPopper' | 'Baby' | 'GraduationCap';

export type Service = {
  title: string;
  description: string;
  icon: ServiceIcon;
};

export const services: Service[] = [
  { title: 'Bridal Mehandi', description: 'Detailed, personalized bridal compositions planned around your outfit, traditions, and story.', icon: 'Crown' },
  { title: 'Arabic Mehandi', description: 'Flowing floral trails and graceful negative space for a modern, elegant finish.', icon: 'Sparkles' },
  { title: 'Traditional Mehandi', description: 'Classic Indian motifs, jaali work, paisleys, and ceremonial details drawn with care.', icon: 'Flower2' },
  { title: 'Festival Mehandi', description: 'Beautiful designs for Diwali, Eid, Karwa Chauth, Teej, and family celebrations.', icon: 'PartyPopper' },
  { title: 'Baby Shower Mehandi', description: 'Joyful, gentle designs created especially for baby showers and naming celebrations.', icon: 'Baby' },
  { title: 'Mehandi Classes', description: 'Beginner-friendly and advanced guidance covering cone control, motifs, layout, and finishing.', icon: 'GraduationCap' },
];
