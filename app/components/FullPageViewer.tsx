'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface ImageData {
  filename: string;
  url: string;
}

interface FullPageViewerProps {
  image: ImageData;
  images: ImageData[];
  onClose: () => void;
  onImageChange: (image: ImageData) => void;
}

export default function FullPageViewer({ 
  image, 
  images, 
  onClose, 
  onImageChange 
}: FullPageViewerProps) {
  const [showMask, setShowMask] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [maskLoaded, setMaskLoaded] = useState(false);
  const [maskError, setMaskError] = useState(false);
  const [maskOpacity, setMaskOpacity] = useState(0.6);

  const currentIndex = images.findIndex(img => img.filename === image.filename);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      onImageChange(images[currentIndex - 1]);
    }
  }, [currentIndex, images, onImageChange]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onImageChange(images[currentIndex + 1]);
    }
  }, [currentIndex, images, onImageChange]);




  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'm':
        case 'M':
          setShowMask(!showMask);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevious, goToNext, showMask]);

  // Reset state when image changes
  useEffect(() => {
    setImageLoaded(false);
    setMaskLoaded(false);
    setMaskError(false);
  }, [image.filename]);

  const getImageLabel = (filename: string) => {
    const nameWithoutExt = filename.replace('.jpg', '');
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 7) {
      let stain = parts[0]; // HE or PAS
      if (stain === 'HE') {
        stain = "H&E";
      }
      const slideNumber = parts[4]; // The number after S (parts[4])
      const roiNumber = parts[6]; // The number after ROI (parts[6])
      
      return `${stain} Slide ${slideNumber} ROI ${roiNumber}`;
    }
    return nameWithoutExt;
  };

  return (
    <div className="fullpage-viewer">
      {/* Header */}
      <div className="viewer-header">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            {getImageLabel(image.filename)}
          </h2>
          <span className="text-sm text-gray-300">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <div className="controls">
          {showMask && (
            <div className="flex items-center gap-2">
              <label className="text-white text-sm">Opacity:</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={maskOpacity}
                onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
                className="w-20"
                title="Adjust mask opacity"
              />
              <span className="text-white text-sm w-8">
                {Math.round(maskOpacity * 100)}%
              </span>
            </div>
          )}

          <button
            onClick={() => setShowMask(!showMask)}
            className={`btn toggle-btn ${showMask ? 'active' : ''} min-w-[120px]`}
            title="Toggle mask overlay (M)"
          >
            {showMask ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="whitespace-nowrap">{showMask ? 'Hide' : 'Show'} Mask</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            title="Close viewer (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="viewer-content">
        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="nav-arrow prev"
            title="Previous image (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            onClick={goToNext}
            className="nav-arrow next"
            title="Next image (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main image */}
        <div className="relative max-w-full max-h-full">
          <img
            src={image.url}
            alt={image.filename}
            className="viewer-image"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading indicator */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white">Loading...</div>
            </div>
          )}

          {/* Mask overlay */}
          {showMask && (
            <div className="mask-overlay">
              {maskError ? (
                <div className="text-white text-center">
                  <div className="text-lg font-semibold mb-2">Mask Not Available</div>
                  <div className="text-sm opacity-75">
                    No mask found for this image
                  </div>
                </div>
              ) : (
                <img
                  src={`/masks/${image.filename}`}
                  alt="Mask overlay"
                  className="viewer-image"
                  style={{
                    mixBlendMode: 'multiply',
                    opacity: maskOpacity,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                  }}
                  onLoad={() => setMaskLoaded(true)}
                  onError={() => setMaskError(true)}
                />
              )}
              {!maskLoaded && !maskError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white">Loading mask...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75 text-center">
        <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          <div>Arrow keys: Navigate between images</div>
          <div>M: Toggle mask • ESC: Close</div>
        </div>
      </div>
    </div>
  );
}
