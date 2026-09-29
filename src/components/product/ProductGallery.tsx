'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductMedia } from '@/types';

interface ProductGalleryProps {
  media: ProductMedia[];
  productName: string;
}

export function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = media[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-800 group">
        {activeMedia && (
          <Image
            src={activeMedia.url}
            alt={activeMedia.alt_text || productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 badge bg-surface-900/80 text-surface-200 backdrop-blur-sm">
          {activeIndex + 1} / {media.length}
        </div>

        {/* Nav Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? media.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-900/70 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-800"
              aria-label="Previous image"
              id="gallery-prev"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === media.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-900/70 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-800"
              aria-label="Next image"
              id="gallery-next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === activeIndex
                  ? 'border-brand-500 shadow-glow'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${i + 1}`}
              id={`gallery-thumb-${i}`}
            >
              <Image
                src={item.url}
                alt={item.alt_text || `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
