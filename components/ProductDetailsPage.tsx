import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Product } from './ProductsManager';
import { ShoppingBag, ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { Logo } from './Logo';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();

    if (!id) return;

    const channel = supabase
      .channel(`public:products:${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: `id=eq.${id}` },
        () => {
          fetchProductDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      if (!id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProduct(data as Product);
        
        // Fetch related products (e.g. 3 other featured products)
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('is_enabled', true)
          .neq('id', id)
          .limit(3);
          
        if (related) {
          setRelatedProducts(related as Product[]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0604] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0604] text-white flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-16 h-16 text-stone-500 mb-6" />
        <h1 className="text-3xl font-serif mb-4">Product Not Found</h1>
        <Link to="/products" className="text-[#D4AF37] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const handleBuy = () => {
    if (settings?.whatsappUrl) {
      const msg = encodeURIComponent(`Hi, I'm interested in buying "${product.title}" (₹${product.price}).`);
      window.open(`${settings.whatsappUrl}?text=${msg}`, '_blank');
    }
  };

  const images = product.image_urls || [];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-[#0a0604] text-white">
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0604]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="flex items-center gap-2 text-stone-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:block">All Products</span>
          </Link>
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="w-20" />
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] sm:aspect-square bg-[#1a0f0a] rounded-[2rem] overflow-hidden border border-white/5">
              {images.length > 0 ? (
                <>
                  <img 
                    src={supabase.storage.from('products').getPublicUrl(images[currentImageIndex]).data.publicUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-stone-700" />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#D4AF37]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={supabase.storage.from('products').getPublicUrl(url).data.publicUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {!product.in_stock && (
              <span className="inline-block bg-red-500/20 text-red-400 font-bold uppercase tracking-wider px-4 py-2 rounded-lg text-sm mb-6 self-start">
                Currently Out of Stock
              </span>
            )}
            
            <h1 className="text-4xl sm:text-5xl font-serif text-white mb-4 leading-tight">{product.title}</h1>
            <p className="text-3xl font-serif text-[#D4AF37] mb-8">₹{product.price}</p>
            
            <div className="prose prose-invert prose-stone max-w-none mb-10">
              <p className="text-lg text-stone-300 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-stone-300">
                      <span className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-auto pt-8 border-t border-white/10">
              <button 
                onClick={handleBuy}
                disabled={!product.in_stock}
                className="w-full sm:w-auto bg-[#D4AF37] text-black px-12 py-4 rounded-xl font-semibold text-lg hover:bg-[#e5c568] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.in_stock ? 'Buy on WhatsApp' : 'Out of Stock'}
              </button>
              <p className="text-stone-500 text-sm mt-4 text-center sm:text-left">
                Secure checkout and discussion directly on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-white/5">
            <h2 className="text-3xl font-serif text-white mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(rel => {
                const mainImageUrl = rel.image_urls && rel.image_urls.length > 0
                  ? supabase.storage.from('products').getPublicUrl(rel.image_urls[0]).data.publicUrl
                  : null;

                return (
                  <div 
                    key={rel.id} 
                    onClick={() => {
                      navigate(`/product/${rel.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="group flex gap-4 bg-[#1a0f0a] rounded-2xl p-4 border border-white/5 hover:border-[#D4AF37]/30 transition cursor-pointer"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0">
                      {mainImageUrl ? (
                        <img src={mainImageUrl} alt={rel.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-white font-serif mb-1 group-hover:text-[#D4AF37] transition line-clamp-2">{rel.title}</h4>
                      <p className="text-[#D4AF37] font-medium">₹{rel.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
