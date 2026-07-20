import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-[#1a0f0a] text-stone-600 ${className}`} {...props}>
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
      {...props} 
    />
  );
};
