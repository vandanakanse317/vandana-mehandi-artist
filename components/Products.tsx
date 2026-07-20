import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { Product } from './ProductsManager';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('public:products_home')
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

  if (loading) {
    return null; // Or a loading skeleton
  }

  if (products.length === 0) {
    return null;
  }

  const handleBuy = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (settings?.whatsappUrl) {
      const msg = encodeURIComponent(`Hi, I'm interested in buying "${product.title}" (₹${product.price}).`);
      window.open(`${settings.whatsappUrl}?text=${msg}`, '_blank');
    }
  };

  return (
    <section id="products" className="py-24 bg-[#0a0604] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.05] blur-[2px] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80")' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604] via-transparent to-[#0a0604] pointer-events-none z-0" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Shop
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Our Products</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-stone-300 hover:text-[#D4AF37] transition group">
            View All Products 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
}
