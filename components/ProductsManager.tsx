import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../src/lib/supabase';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Edit2, CheckCircle, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type Product = {
  id: string;
  created_at: string;
  title: string;
  short_description: string;
  description: string;
  price: number;
  features: string[];
  image_urls: string[];
  is_featured: boolean;
  is_enabled: boolean;
  in_stock: boolean;
  order: number;
};

function SortableProduct({ product, handleEdit, handleDelete, toggleFeatured, toggleEnabled, toggleInStock }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const mainImageUrl = product.image_urls && product.image_urls.length > 0
    ? supabase.storage.from('products').getPublicUrl(product.image_urls[0]).data.publicUrl
    : null;

  return (
    <div ref={setNodeRef} style={style} className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden group">
      <div className="aspect-square relative bg-black border-b border-white/10">
        {mainImageUrl ? (
          <img src={mainImageUrl} alt={product.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-600">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => handleEdit(product)} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 backdrop-blur-md">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(product)} className="bg-red-500/80 p-2 rounded-full text-white hover:bg-red-500 backdrop-blur-md">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div {...attributes} {...listeners} className="absolute top-2 left-2 cursor-grab bg-black/50 p-2 rounded-lg text-stone-300 hover:text-white backdrop-blur-md">
          <GripVertical className="h-4 w-4" />
        </div>
        {!product.is_enabled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Disabled</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-medium truncate">{product.title}</h3>
          <p className="text-[#D4AF37] font-semibold text-sm">₹{product.price}</p>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={product.is_featured} onChange={() => toggleFeatured(product.id, product.is_featured)} className="w-3.5 h-3.5 rounded text-[#D4AF37]" />
            <span className="text-stone-300">Featured</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={product.is_enabled} onChange={() => toggleEnabled(product.id, product.is_enabled)} className="w-3.5 h-3.5 rounded text-[#D4AF37]" />
            <span className="text-stone-300">Enabled</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={product.in_stock} onChange={() => toggleInStock(product.id, product.in_stock)} className="w-3.5 h-3.5 rounded text-[#D4AF37]" />
            <span className="text-stone-300">In Stock</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);
  const [features, setFeatures] = useState<string[]>(['']);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase.from('products').select('*').order('order', { ascending: true });
      if (err) throw err;
      if (data) {
        setProducts(data as Product[]);
      }
    } catch (err: any) {
      if (err.code === '42P01') {
        setError('Products table not found. Please run the SQL schema script.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = products.findIndex(p => p.id === active.id);
      const newIndex = products.findIndex(p => p.id === over?.id);
      const newProducts = arrayMove(products, oldIndex, newIndex) as Product[];
      setProducts(newProducts);
      
      try {
        const updates = newProducts.map((p, i) => ({ id: p.id, order: i }));
        for (const update of updates) {
          await supabase.from('products').update({ order: update.order }).eq('id', update.id);
        }
      } catch(e: any) {
        console.error("Error saving product order", e);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImages(true);
    
    try {
      const newUrls = [...imageUrls];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
        if (uploadError) throw uploadError;
        newUrls.push(fileName);
      }
      setImageUrls(newUrls);
    } catch (err: any) {
      alert("Error uploading images: " + err.message);
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = async (fileName: string) => {
    setImageUrls(prev => prev.filter(url => url !== fileName));
    // Optional: remove from storage
    // await supabase.storage.from('products').remove([fileName]);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setShortDesc('');
    setDesc('');
    setPrice(0);
    setFeatures(['']);
    setImageUrls([]);
    setIsFeatured(false);
    setIsEnabled(true);
    setInStock(true);
    setIsEditing(false);
  };

  const openAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setShortDesc(product.short_description || '');
    setDesc(product.description || '');
    setPrice(product.price || 0);
    setFeatures(product.features && product.features.length > 0 ? product.features : ['']);
    setImageUrls(product.image_urls || []);
    setIsFeatured(product.is_featured);
    setIsEnabled(product.is_enabled);
    setInStock(product.in_stock);
    setIsEditing(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const cleanedFeatures = features.filter(f => f.trim() !== '');
      
      const productData = {
        title,
        short_description: shortDesc,
        description: desc,
        price,
        features: cleanedFeatures,
        image_urls: imageUrls,
        is_featured: isFeatured,
        is_enabled: isEnabled,
        in_stock: inStock
      };

      if (editingId) {
        const { error: err } = await supabase.from('products').update(productData).eq('id', editingId);
        if (err) throw err;
        setSuccess('Product updated successfully!');
      } else {
        const { error: err } = await supabase.from('products').insert([{ ...productData, order: products.length }]);
        if (err) throw err;
        setSuccess('Product added successfully!');
      }

      await fetchProducts();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.title}"?`)) return;
    try {
      if (product.image_urls && product.image_urls.length > 0) {
        await supabase.storage.from('products').remove(product.image_urls);
      }
      await supabase.from('products').delete().eq('id', product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const toggleBoolean = async (id: string, field: string, currentValue: boolean) => {
    try {
      const newValue = !currentValue;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: newValue } : p));
      await supabase.from('products').update({ [field]: newValue }).eq('id', id);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <div>
          <h2 className="text-2xl font-serif text-white">Manage Products</h2>
          <p className="text-stone-400">Add, edit and organize your products.</p>
        </div>
        {!isEditing && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#e5c568] transition">
            <Plus className="h-5 w-5" /> Add Product
          </button>
        )}
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">{error}</div>}
      
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
            <CheckCircle className="h-5 w-5" /> {success}
          </motion.div>
        )}
      </AnimatePresence>

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-[#D4AF37]">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full transition text-stone-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm text-stone-400">Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="E.g. Bridal Cone Set" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-stone-400">Price (₹)</label>
                <input required type="number" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-stone-400">Short Description</label>
                <input required type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Brief summary for product card" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-stone-400">Full Description</label>
                <textarea required rows={4} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Detailed description for product page" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-stone-400">Features</label>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={feature} onChange={e => {
                      const newFeatures = [...features];
                      newFeatures[idx] = e.target.value;
                      setFeatures(newFeatures);
                    }} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="E.g. 100% Organic" />
                    <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== idx))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setFeatures([...features, ''])} className="text-sm text-[#D4AF37] hover:underline">+ Add Feature</button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-stone-400">Images</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20">
                    <img src={supabase.storage.from('products').getPublicUrl(url).data.publicUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white hover:bg-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 hover:border-[#D4AF37] flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-[#D4AF37] transition bg-black/30">
                  {uploadingImages ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <Plus className="h-6 w-6 mb-1" />
                      <span className="text-xs">Add Image</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImages} />
                </label>
              </div>
            </div>

            <div className="flex gap-6 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-5 h-5 rounded text-[#D4AF37] bg-black/50 border-white/20 focus:ring-[#D4AF37]" />
                <span className="text-stone-300">Featured (Show on Home)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isEnabled} onChange={e => setIsEnabled(e.target.checked)} className="w-5 h-5 rounded text-[#D4AF37] bg-black/50 border-white/20 focus:ring-[#D4AF37]" />
                <span className="text-stone-300">Enabled</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-5 h-5 rounded text-[#D4AF37] bg-black/50 border-white/20 focus:ring-[#D4AF37]" />
                <span className="text-stone-300">In Stock</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl font-medium text-stone-300 hover:text-white hover:bg-white/5 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading || uploadingImages} className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-medium hover:bg-[#e5c568] transition disabled:opacity-50 flex items-center gap-2">
                {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={products.map(p => p.id)} strategy={rectSortingStrategy}>
              {products.map(product => (
                <SortableProduct 
                  key={product.id} 
                  product={product} 
                  handleEdit={openEdit} 
                  handleDelete={handleDelete} 
                  toggleFeatured={(id: string, val: boolean) => toggleBoolean(id, 'is_featured', val)}
                  toggleEnabled={(id: string, val: boolean) => toggleBoolean(id, 'is_enabled', val)}
                  toggleInStock={(id: string, val: boolean) => toggleBoolean(id, 'in_stock', val)}
                />
              ))}
            </SortableContext>
          </DndContext>
          {!loading && products.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-500 border border-dashed border-white/10 rounded-2xl">
              No products found. Add your first product!
            </div>
          )}
          {loading && products.length === 0 && !error && (
            <div className="col-span-full py-12 text-center text-stone-500">
              Loading products...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
