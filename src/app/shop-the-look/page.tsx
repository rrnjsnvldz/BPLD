'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

// Mock curated rooms
const CURATED_ROOMS = [
  {
    id: 'room-1',
    title: 'The Modern Living Room',
    description: 'Clean lines meet warmth in this contemporary living space. Natural materials, ambient lighting, and plush seating create the perfect retreat.',
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=700&fit=crop',
    room_type: 'Living Room',
    total_price: 5847,
    hotspots: [
      { id: 'h1', x: 35, y: 55, product: MOCK_PRODUCTS[0] },
      { id: 'h2', x: 70, y: 40, product: MOCK_PRODUCTS[5] },
      { id: 'h3', x: 55, y: 70, product: MOCK_PRODUCTS[7] },
    ],
  },
  {
    id: 'room-2',
    title: 'The Serene Bedroom',
    description: 'A sanctuary designed for rest. Our Aurora bed anchors this calming bedroom with organic textures and soft, layered lighting.',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=700&fit=crop',
    room_type: 'Bedroom',
    total_price: 3748,
    hotspots: [
      { id: 'h4', x: 50, y: 50, product: MOCK_PRODUCTS[1] },
      { id: 'h5', x: 20, y: 45, product: MOCK_PRODUCTS[5] },
    ],
  },
  {
    id: 'room-3',
    title: 'The Gathering Table',
    description: 'Where meals become memories. The Solstice dining table seats eight in warmth and elegance, anchored by natural wood and statement lighting.',
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=700&fit=crop',
    room_type: 'Dining Room',
    total_price: 4297,
    hotspots: [
      { id: 'h6', x: 50, y: 55, product: MOCK_PRODUCTS[2] },
      { id: 'h7', x: 75, y: 30, product: MOCK_PRODUCTS[5] },
    ],
  },
];

export default function ShopTheLookPage() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="section">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge badge-brand text-xs mb-4">Curated Collections</span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-surface-50">
            Shop the Look
          </h1>
          <p className="text-lg text-surface-400 mt-4 max-w-2xl mx-auto">
            Explore designer-curated rooms and shop individual pieces or complete the entire look with one click.
          </p>
        </div>

        {/* Rooms */}
        <div className="space-y-20">
          {CURATED_ROOMS.map((room, roomIndex) => (
            <div key={room.id} className="animate-fade-in" style={{ animationDelay: `${roomIndex * 200}ms` }}>
              {/* Room Header */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-brand-400 font-medium">
                    {room.room_type}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-surface-50 mt-1">
                    {room.title}
                  </h2>
                  <p className="text-surface-400 mt-2 max-w-xl">{room.description}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-xs text-surface-500">Complete the look for</p>
                  <p className="text-2xl font-bold text-surface-50">{formatPrice(room.total_price)}</p>
                  <button className="btn btn-primary btn-sm mt-2">
                    Add All to Cart
                  </button>
                </div>
              </div>

              {/* Interactive Room Image */}
              <div className="relative rounded-2xl overflow-hidden group" id={`room-${room.id}`}>
                <div className="relative aspect-[16/9]">
                  <Image
                    src={room.image_url}
                    alt={room.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />

                  {/* Hotspots */}
                  {room.hotspots.map((hotspot) => (
                    <button
                      key={hotspot.id}
                      className="absolute z-10 group/hotspot"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                      onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                      aria-label={`View ${hotspot.product.name}`}
                      id={`hotspot-${hotspot.id}`}
                    >
                      {/* Pulsing Dot */}
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-brand-400 transition-transform hover:scale-110">
                          <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-brand-400/30 animate-ping" />
                      </div>

                      {/* Product Tooltip */}
                      {activeHotspot === hotspot.id && (
                        <div className="absolute z-20 bottom-full mb-3 left-1/2 -translate-x-1/2 animate-fade-in-scale">
                          <div className="glass rounded-xl p-3 w-56 shadow-elevated">
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2">
                              {hotspot.product.primary_image_url && (
                                <Image
                                  src={hotspot.product.primary_image_url}
                                  alt={hotspot.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="224px"
                                />
                              )}
                            </div>
                            <p className="text-xs text-surface-400">{hotspot.product.category_name}</p>
                            <p className="text-sm font-semibold text-surface-100 mt-0.5">{hotspot.product.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-bold text-surface-50">
                                {formatPrice(hotspot.product.base_price)}
                              </span>
                              <Link
                                href={`/products/${hotspot.product.slug}`}
                                className="text-xs text-brand-400 hover:text-brand-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View →
                              </Link>
                            </div>
                          </div>
                          {/* Arrow */}
                          <div className="w-3 h-3 bg-surface-800 border-b border-r border-white/6 rotate-45 mx-auto -mt-1.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Strip */}
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                {room.hotspots.map((hotspot) => (
                  <Link
                    key={hotspot.id}
                    href={`/products/${hotspot.product.slug}`}
                    className="flex items-center gap-3 glass rounded-lg p-3 min-w-[240px] hover:bg-surface-700/50 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      {hotspot.product.primary_image_url && (
                        <Image
                          src={hotspot.product.primary_image_url}
                          alt={hotspot.product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-200 truncate">{hotspot.product.name}</p>
                      <p className="text-sm font-bold text-brand-400">{formatPrice(hotspot.product.base_price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
