import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the imports
content = re.sub(
    r"import \{ SERVICES.*?from '\./data/siteData';",
    "import { WHY_CHOOSE_US, CLASS_TOPICS, TESTIMONIALS } from './data/siteData';",
    content
)

state_declaration = """  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);"""

new_state = """  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Dynamic Data State
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [galleryData, setGalleryData] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  useEffect(() => {
    // Fetch dynamic data
    const fetchData = async () => {
      try {
        const [servicesRes, galleryRes, contactRes, settingsRes] = await Promise.all([
          fetch('/data/services.json').then(res => res.json()),
          fetch('/data/gallery.json').then(res => res.json()),
          fetch('/data/contact.json').then(res => res.json()),
          fetch('/data/settings.json').then(res => res.json())
        ]);
        setServicesData(servicesRes);
        setGalleryData(galleryRes);
        setContactData(contactRes);
        setSettingsData(settingsRes);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    fetchData();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);"""

content = content.replace(state_declaration, new_state)

# Now I need to replace references in the file:
# CONTACT_INFO -> (contactData || {})
# SERVICES -> servicesData
# GALLERY_IMAGES -> galleryData
content = content.replace("CONTACT_INFO", "(contactData || {})")
content = content.replace("SERVICES", "servicesData")
content = content.replace("GALLERY_IMAGES", "galleryData")

with open("src/App.tsx", "w") as f:
    f.write(content)
