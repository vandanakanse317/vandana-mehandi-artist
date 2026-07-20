import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Product } from './ProductsManager';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { Logo } from './Logo';
import { siteSettings } from '../data/settings';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();

    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_enabled', true)
        .order('order', { ascending: true });

      if (error) {
        if (error.code !== '42P01') {
          console.error('Error fetching products:', error);
        }
        return;
      }

      if (data) {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (settings?.whatsappUrl) {
      const msg = encodeURIComponent(`Hi, I'm interested in buying "${product.title}" (₹${product.price}).`);
      window.open(`${settings.whatsappUrl}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0604] text-white">
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0604]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-stone-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:block">Back to Home</span>
          </Link>
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm mb-3 flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Shop Collection
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">Our Products</h1>
          <p className="text-stone-400 max-w-2xl mx-auto text-lg">
            Discover our premium range of Mehndi cones, oils, and aftercare products designed for the perfect stain.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
            <ShoppingBag className="w-12 h-12 text-stone-500 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">No Products Available</h3>
            <p className="text-stone-400">Please check back later for our new collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => {
              const mainImageUrl = product.image_urls && product.image_urls.length > 0
                ? supabase.storage.from('products').getPublicUrl(product.image_urls[0]).data.publicUrl
                : null;

              return (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group relative bg-[#1a0f0a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 cursor-pointer flex flex-col h-full"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    {mainImageUrl ? (
                      <img 
                        src={mainImageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
                    )}
                    
                    {!product.in_stock && (
                      <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Out of Stock
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <button 
                        onClick={(e) => handleBuy(e, product)}
                        disabled={!product.in_stock}
                        className="w-full bg-[#D4AF37] text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e5c568] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        Buy on WhatsApp
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">{product.title}</h3>
                    <p className="text-stone-400 text-sm line-clamp-2 mb-4 flex-1">
                      {product.short_description || product.description}
                    </p>
                    <div className="flex items-end justify-between mt-auto">
                      <span className="text-2xl font-serif text-[#D4AF37]">₹{product.price}</span>
                      <span className="text-stone-500 text-xs font-medium uppercase tracking-wider group-hover:text-white transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
