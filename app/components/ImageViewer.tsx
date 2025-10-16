'use client';

import { useState } from 'react';
import { Search, Grid, List } from 'lucide-react';

interface ImageData {
  filename: string;
  url: string;
}

interface ImageViewerProps {
  images: ImageData[];
  onImageSelect: (image: ImageData) => void;
}

export default function ImageViewer({ images, onImageSelect }: ImageViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search and controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredImages.length} of {images.length} images
      </div>

      {/* Image grid */}
      {viewMode === 'grid' ? (
        <div className="image-grid">
          {filteredImages.map((image) => (
            <div
              key={image.filename}
              className="image-item"
              onClick={() => onImageSelect(image)}
            >
              <img
                src={image.url}
                alt={image.filename}
                loading="lazy"
                className="w-full h-40 object-cover"
              />
              <div className="image-label">
                {getImageLabel(image.filename)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((image) => (
            <div
              key={image.filename}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onImageSelect(image)}
            >
              <img
                src={image.url}
                alt={image.filename}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-900">
                  {getImageLabel(image.filename)}
                </h3>
                <p className="text-sm text-gray-500">{image.filename}</p>
              </div>
              <div className="text-sm text-gray-400">
                Click to view
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No images found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your search terms
          </div>
        </div>
      )}
    </div>
  );
}
