import type { ProductDimension, Product } from '@/types';

interface DimensionDiagramProps {
  product: Product;
  dimensions: ProductDimension[];
}

export function DimensionDiagram({ product, dimensions }: DimensionDiagramProps) {
  if (!dimensions.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">
        Dimensions
      </h3>

      {/* Dimension Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {dimensions.map((dim) => (
          <div
            key={dim.id}
            className="glass rounded-lg p-3 text-center"
          >
            <p className="text-lg font-bold text-surface-50">
              {dim.value_cm}
              <span className="text-xs text-surface-400 font-normal ml-1">cm</span>
            </p>
            {dim.value_in && (
              <p className="text-xs text-surface-500">
                {dim.value_in}&quot;
              </p>
            )}
            <p className="text-[11px] text-surface-400 mt-1 uppercase tracking-wider">
              {dim.label}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Dimension Schematic */}
      {product.width_cm && product.depth_cm && product.height_cm && (
        <div className="glass rounded-xl p-6" id="dimension-schematic">
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 400 250" className="w-full max-w-md" aria-label="Dimension diagram">
              {/* 3D-ish Box Representation */}
              {/* Front face */}
              <rect x="80" y="60" width="200" height="140" rx="4"
                fill="none" stroke="currentColor" className="text-surface-600" strokeWidth="1.5" />
              {/* Top face */}
              <polygon points="80,60 140,20 340,20 280,60"
                fill="none" stroke="currentColor" className="text-surface-600" strokeWidth="1.5" />
              {/* Side face */}
              <polygon points="280,60 340,20 340,160 280,200"
                fill="none" stroke="currentColor" className="text-surface-600" strokeWidth="1.5" />

              {/* Width Arrow (bottom) */}
              <line x1="80" y1="220" x2="280" y2="220"
                stroke="currentColor" className="text-brand-400" strokeWidth="1.5" markerStart="url(#arrowLeft)" markerEnd="url(#arrowRight)" />
              <text x="180" y="240" textAnchor="middle" className="text-xs fill-brand-300 font-medium">
                {product.width_cm} cm ({Math.round(product.width_cm / 2.54)}&quot;)
              </text>

              {/* Height Arrow (left) */}
              <line x1="60" y1="60" x2="60" y2="200"
                stroke="currentColor" className="text-accent-400" strokeWidth="1.5" markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
              <text x="40" y="135" textAnchor="middle" className="text-xs fill-accent-400 font-medium" transform="rotate(-90, 40, 135)">
                {product.height_cm} cm
              </text>

              {/* Depth Arrow (top) */}
              <line x1="290" y1="55" x2="345" y2="15"
                stroke="currentColor" className="text-success" strokeWidth="1.5" />
              <text x="335" y="10" className="text-xs fill-success font-medium">
                {product.depth_cm} cm
              </text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowLeft" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
                  <polygon points="6,0 0,3 6,6" className="fill-brand-400" />
                </marker>
                <marker id="arrowRight" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                  <polygon points="0,0 6,3 0,6" className="fill-brand-400" />
                </marker>
                <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
                  <polygon points="0,6 3,0 6,6" className="fill-accent-400" />
                </marker>
                <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
                  <polygon points="0,0 3,6 6,0" className="fill-accent-400" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* Clearance Warning */}
      {product.min_doorway_clearance_cm && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-warning">Doorway Clearance</p>
            <p className="text-xs text-surface-400 mt-0.5">
              Ensure your doorway clearance is at least{' '}
              <strong className="text-surface-200">{product.min_doorway_clearance_cm} cm ({Math.round(product.min_doorway_clearance_cm / 2.54)}&quot;)</strong>{' '}
              wide for delivery. Measure before ordering.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
