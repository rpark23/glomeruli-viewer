'use client';

import { useState, useEffect } from 'react';
import ImageViewer from './components/ImageViewer';
import FullPageViewer from './components/FullPageViewer';

interface ImageData {
  filename: string;
  url: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'HE' | 'PAS'>('all');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      
      if (data.images) {
        const imageData = data.images.map((filename: string) => ({
          filename,
          url: `/jpegs/${filename}`
          // url: `/api/images/${filename}`
        }));
        setImages(imageData);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image: ImageData) => {
    setSelectedImage(image);
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  const filteredImages = images.filter(image => {
    if (activeTab === 'all') return true;
    return image.filename.startsWith(activeTab);
  });

  const heCount = images.filter(img => img.filename.startsWith('HE')).length;
  const pasCount = images.filter(img => img.filename.startsWith('PAS')).length;

  if (loading) {
    return (
      <div className="loading">
        <div>Loading images...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Glomeruli Dataset Viewer
          </h1>
          <p className="mt-2 text-gray-600">
            Hi Vivek! <br/><br/>
            These are H&E and PAS stained slides from <a className="text-blue-500" href="https://www.nature.com/articles/s41598-024-51651-1" target="_blank">He et al. (2024)</a> 
            {" "}that have been labeled with glomeruli masks (green for normal and red for sclerosis). 
            Click on a thumbnail to view a region of interest (ROI) and then you can toggle on and off the mask by clicking the button in the top right corner (or pressing 'M').
            <br/><br/>
            Happy viewing!
            <br/>
            Ryan
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {images.length} ROIs available
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All ROIs ({images.length})
            </button>
            <button
              onClick={() => setActiveTab('HE')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'HE'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              H&amp;E ROIs ({heCount})
            </button>
            <button
              onClick={() => setActiveTab('PAS')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'PAS'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              PAS ROIs ({pasCount})
            </button>
          </nav>
        </div>
      </div>

      <ImageViewer 
        images={filteredImages} 
        onImageSelect={handleImageSelect}
      />

      {selectedImage && (
        <FullPageViewer
          image={selectedImage}
          images={filteredImages}
          onClose={handleCloseViewer}
          onImageChange={setSelectedImage}
        />
      )}
    </main>
  );
}
