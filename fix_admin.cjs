const fs = require('fs');
let code = fs.readFileSync('components/Admin.tsx', 'utf-8');

code = code.replace(
  "import { SortableImage } from './SortableImage';",
  `import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2 } from 'lucide-react';

function SortableImage({ img, onDelete, onUpdateTitle, onReplace }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-square">
      <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div {...attributes} {...listeners} className="cursor-grab p-1 bg-black/50 rounded text-stone-300 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16M4 15h16"/></svg>
          </div>
          <button onClick={() => onDelete(img.id, img.filename)} className="p-1 bg-red-500/80 rounded text-white hover:bg-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              defaultValue={img.title} 
              onBlur={(e) => { if(e.target.value !== img.title) onUpdateTitle(img.id, e.target.value) }}
              placeholder="Add title..."
              className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-white/50"
            />
          </div>
          <label className="flex items-center justify-center gap-1 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded px-2 py-1 cursor-pointer text-xs transition">
            <Edit2 className="h-3 w-3" /> Replace
            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onReplace(img.id, e.target.files[0]);
              }
            }} />
          </label>
        </div>
      </div>
    </div>
  );
}`
);

// Fix React namespace errors
code = code.replace(/import \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect } from 'react';");

// Fix URL.createObjectURL error:
code = code.replace(/const urls = files\.map\(file => URL\.createObjectURL\(file\)\);/, "const urls = files.map(file => URL.createObjectURL(file as unknown as Blob));");
code = code.replace(/const compressedFile = await imageCompression\(file, options\);/g, "const compressedFile = await imageCompression(file as File, options);");
code = code.replace(/const compressedFile = await imageCompression\(file, options\);/, "const compressedFile = await imageCompression(file as File, options);"); // For both occurrences

// Fix spread type error on arrayMove:
code = code.replace(/const newArray = arrayMove\(images, oldIndex, newIndex\).map\(\(img, idx\) => \(\{ \.\.\.img, order: idx \}\)\);/, "const newArray = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({ ...(img as any), order: idx }));");


fs.writeFileSync('components/Admin.tsx', code);
