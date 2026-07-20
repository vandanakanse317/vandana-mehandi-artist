import { useState, FormEvent, useEffect } from 'react';
import { useSettings, Collection } from '../contexts/SettingsContext';
import { supabase } from '../src/lib/supabase';
import { Save, Plus, Trash2, CheckCircle, Image as ImageIcon, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCollection({ col, index, handleChange, removeCollection }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: col.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-black/30 p-4 rounded-xl border border-white/10 relative">
      <div {...attributes} {...listeners} className="cursor-grab p-2 -ml-2 text-stone-500 hover:text-white transition">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-sm text-stone-400 font-mono shrink-0">
        {index + 1}
      </div>
      <div className="flex-1 space-y-2 w-full">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            value={col.name} 
            onChange={e => handleChange(col.id, 'name', e.target.value)}
            placeholder="Collection Name"
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" 
            required
          />
          <label className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-stone-300 hover:text-white transition">
            <input 
              type="checkbox" 
              checked={col.enabled !== false} 
              onChange={e => handleChange(col.id, 'enabled', e.target.checked)} 
              className="w-4 h-4 rounded text-[#D4AF37]" 
            />
            Enabled
          </label>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-3 focus-within:border-[#D4AF37]">
            <ImageIcon className="h-4 w-4 text-stone-500 shrink-0" />
            <input 
              type="text" 
              value={col.cover_image || ''} 
              onChange={e => handleChange(col.id, 'cover_image', e.target.value)}
              placeholder="Cover Image URL (https://...)"
              className="w-full bg-transparent py-2 text-sm text-white focus:outline-none" 
            />
          </div>
        </div>
      </div>
      {col.cover_image && (
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/20 hidden md:block bg-black">
          <img src={col.cover_image} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <button 
        type="button" 
        onClick={() => removeCollection(col.id)}
        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition self-end md:self-auto"
        title="Remove Collection"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}

export function CollectionsEditor() {
  const { settings, loading } = useSettings();
  const [collections, setCollections] = useState<Collection[]>(settings?.portfolio_collections || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings?.portfolio_collections) {
      setCollections(settings.portfolio_collections);
    }
  }, [settings]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCollections((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) return <div className="text-stone-400">Loading collections...</div>;

  const handleChange = (id: string, field: keyof Collection, value: any) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCollection = () => {
    const newId = Date.now().toString();
    setCollections(prev => [...prev, { id: newId, name: 'New Collection', cover_image: '', enabled: true }]);
  };

  const removeCollection = (id: string) => {
    if (confirm("Are you sure you want to remove this collection? Note: You will need to manually reassign or delete images that belong to this collection.")) {
      setCollections(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    
    try {
      await supabase.from('settings').update({ portfolio_collections: collections }).eq('id', 1);
      setSuccess('Collections saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-6 rounded-[2rem] bg-white/5 border border-white/10 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium flex items-center gap-2 text-[#D4AF37]">
          Portfolio Collections
        </h2>
        <button onClick={addCollection} type="button" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition text-white">
          <Plus className="h-4 w-4" /> Add Collection
        </button>
      </div>
      
      <p className="text-sm text-stone-400 mb-6">
        Manage the collections shown in your main portfolio. Drag and drop to reorder.
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={collections.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {collections.map((col, index) => (
                <SortableCollection 
                  key={col.id} 
                  col={col} 
                  index={index} 
                  handleChange={handleChange} 
                  removeCollection={removeCollection} 
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {collections.length === 0 && (
            <div className="text-center py-8 text-stone-500 border border-dashed border-white/10 rounded-xl">
              No collections found. Click "Add Collection" to create one.
            </div>
          )}
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
            {saving ? 'Saving...' : 'Save Collections'}
          </button>
        </div>
      </form>
    </section>
  );
}
