'use client';

import { useState, useRef } from 'react';

interface ARViewerProps {
  glbUrl?: string;
  usdzUrl?: string;
  productName: string;
  posterUrl?: string;
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': any;
      }
    }
  }
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export function ARViewer({ glbUrl, usdzUrl, productName, posterUrl }: ARViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const viewerRef = useRef<HTMLElement>(null);

  // Check if we have any 3D model to show
  const hasModel = glbUrl || usdzUrl;

  if (!hasModel) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-surface-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
            <path d="M12 22V12" />
            <path d="M22 7L12 12 2 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-surface-200 mb-2">3D Model Coming Soon</h3>
        <p className="text-sm text-surface-400">
          An interactive 3D model for this product is being prepared.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 3D Viewer Container */}
      <div className="relative rounded-2xl overflow-hidden bg-surface-800 aspect-[4/3]" id="ar-viewer-container">
        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-900/80 backdrop-blur-sm animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-surface-600 border-t-brand-500 animate-spin mb-4" />
            <p className="text-sm text-surface-400">Loading 3D model…</p>
          </div>
        )}

        <model-viewer
          ref={viewerRef}
          src={glbUrl}
          ios-src={usdzUrl}
          alt={`3D model of ${productName}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          shadow-intensity="1"
          shadow-softness="0.5"
          environment-image="neutral"
          exposure="1"
          poster={posterUrl}
          loading="lazy"
          camera-orbit="45deg 55deg 2.5m"
          min-camera-orbit="auto auto 1m"
          max-camera-orbit="auto auto 10m"
          field-of-view="30deg"
          interaction-prompt="auto"
          style={{ width: '100%', height: '100%' }}
          onLoad={() => {
            setIsLoaded(true);
            // Check AR support
            const viewer = viewerRef.current as any;
            if (viewer?.canActivateAR) {
              setArSupported(true);
            } else {
              setArSupported(false);
            }
          }}
        />

        {/* AR Button Overlay */}
        {isLoaded && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            {/* Controls hint */}
            <div className="badge bg-surface-900/80 backdrop-blur-sm text-surface-300 text-xs">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
              </svg>
              Drag to rotate · Pinch to zoom
            </div>

            {/* AR Activation */}
            {arSupported && (
              <button
                className="btn btn-primary btn-sm shadow-glow"
                onClick={() => {
                  const viewer = viewerRef.current as any;
                  viewer?.activateAR?.();
                }}
                id="ar-activate-btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                  <path d="M12 22V12" />
                  <path d="M22 7L12 12 2 7" />
                </svg>
                View in Your Room
              </button>
            )}
          </div>
        )}
      </div>

      {/* AR Feature Callout */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
              <path d="M12 22V12" />
              <path d="M22 7L12 12 2 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-surface-200">
              AR Room Visualizer
            </h4>
            <p className="text-xs text-surface-400 mt-1 leading-relaxed">
              {arSupported === true
                ? 'Tap "View in Your Room" to project this piece into your space using your camera. Check scale, style, and fit before you buy.'
                : arSupported === false
                ? 'AR viewing requires a compatible mobile device. Open this page on your iPhone or Android to try AR.'
                : 'Interact with the 3D model above — rotate, zoom, and inspect every detail. On mobile, tap the AR button to place it in your room.'}
            </p>

            {/* Device Compatibility */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-surface-500">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                iOS Quick Look (.usdz)
              </div>
              <div className="flex items-center gap-1.5 text-xs text-surface-500">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.523 2H6.477L2 6.477v11.046L6.477 22h11.046L22 17.523V6.477L17.523 2zM12 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z"/>
                </svg>
                Android Scene Viewer (.glb)
              </div>
              <div className="flex items-center gap-1.5 text-xs text-surface-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a9 9 0 11-18 0V5.25" />
                </svg>
                WebXR (Desktop)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
