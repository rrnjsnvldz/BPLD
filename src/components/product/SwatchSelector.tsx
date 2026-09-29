'use client';

import { useState } from 'react';
import type { ProductMaterialJoin, Material } from '@/types';

interface SwatchSelectorProps {
  materials: ProductMaterialJoin[];
  basePrice: number;
  onSelect?: (material: Material) => void;
}

export function SwatchSelector({ materials, basePrice, onSelect }: SwatchSelectorProps) {
  const defaultMat = materials.find((m) => m.is_default) || materials[0];
  const [selected, setSelected] = useState<string>(defaultMat?.material_id || '');

  const selectedMaterial = materials.find((m) => m.material_id === selected)?.material;

  const handleSelect = (mat: ProductMaterialJoin) => {
    setSelected(mat.material_id);
    if (mat.material && onSelect) {
      onSelect(mat.material);
    }
  };

  if (!materials.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-surface-200">
          Material:{' '}
          <span className="text-surface-50 font-semibold">
            {selectedMaterial?.name || 'Select'}
          </span>
        </h3>
        {selectedMaterial?.price_modifier !== undefined && selectedMaterial.price_modifier !== 0 && (
          <span className="text-xs text-surface-400">
            {selectedMaterial.price_modifier > 0 ? '+' : ''}${Math.abs(selectedMaterial.price_modifier).toFixed(0)}
          </span>
        )}
      </div>

      {/* Swatch Grid */}
      <div className="flex flex-wrap gap-2">
        {materials.map((pm) => {
          const mat = pm.material;
          if (!mat) return null;

          const isSelected = selected === pm.material_id;

          return (
            <button
              key={pm.id}
              onClick={() => handleSelect(pm)}
              className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-500/10 shadow-glow'
                  : 'border-surface-700 bg-surface-800 hover:border-surface-500'
              }`}
              title={mat.name}
              aria-label={`Select ${mat.name}`}
              aria-pressed={isSelected}
              id={`swatch-${mat.slug}`}
            >
              {/* Color Swatch */}
              <div
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  isSelected ? 'border-brand-400 scale-110' : 'border-surface-600 group-hover:scale-105'
                }`}
                style={{ backgroundColor: mat.hex_color || '#888' }}
              />

              {/* Label */}
              <span className={`text-xs font-medium transition-colors ${
                isSelected ? 'text-brand-300' : 'text-surface-300 group-hover:text-surface-100'
              }`}>
                {mat.name}
              </span>

              {/* Material Type Badge */}
              <span className="text-[10px] uppercase tracking-wider text-surface-500 hidden sm:inline">
                {mat.material_type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Material Description */}
      {selectedMaterial?.description && (
        <p className="text-xs text-surface-400 leading-relaxed animate-fade-in">
          {selectedMaterial.description}
        </p>
      )}
    </div>
  );
}
