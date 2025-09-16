'use client';

import React, { useState } from 'react';
import { Search, Image, Download, Heart, X, ZoomIn } from 'lucide-react';

// Loading state
export const ImageGalleryLoading: React.FC<{ input?: { query: string } }> = ({
  input,
}) => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="bg-blue-100 rounded-lg size-12 flex items-center justify-center">
        <Image className="size-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, _i) => (
        <div key={`skeleton-${crypto.randomUUID()}`} className="space-y-2">
          <div className="bg-gray-200 rounded-lg aspect-square" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>

    <div className="mt-4 flex items-center space-x-2">
      <Search className="size-4 text-gray-400" />
      <span className="text-sm text-gray-500">
        Searching for &ldquo;{input?.query}&rdquo;...
      </span>
    </div>
  </div>
);

// Success state
export const ImageGallery: React.FC<{
  output: {
    query: string;
    results: Array<{
      id: string;
      url: string;
      alt: string;
      title: string;
      photographer: string;
      tags: string[];
      width: number;
      height: number;
      license: string;
      downloadUrl: string;
    }>;
    totalFound: number;
    searchTime: string;
    filters: { count: number; orientation?: string; license: string };
  };
  input?: { query: string };
}> = ({ output, input: _input }) => {
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
    alt: string;
    title: string;
    photographer: string;
    tags: string[];
    width: number;
    height: number;
    downloadUrl: string;
  } | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-100 rounded-lg size-12 flex items-center justify-center">
            <Image className="size-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Image Search Results</h3>
            <p className="text-gray-600 text-sm">
              Found {output.totalFound} images for &ldquo;{output.query}&rdquo;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {output.results.map((image) => (
            <div key={image.id} className="group relative">
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />

                {/* Overlay actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                      title="View full size"
                    >
                      <ZoomIn className="size-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="size-4 text-gray-600" />
                    </button>
                    <a
                      href={image.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="size-4 text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <h4 className="font-medium text-sm truncate">{image.title}</h4>
                <p className="text-xs text-gray-500">by {image.photographer}</p>
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={`${image.id}-tag-${index}`}
                      className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-4">
            <span>
              Resolution: {output.results[0]?.width}x{output.results[0]?.height}
            </span>
            <span>License: {output.filters.license}</span>
            {output.filters.orientation && (
              <span>Orientation: {output.filters.orientation}</span>
            )}
          </div>
          <span>
            Search time: {new Date(output.searchTime).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="size-8" />
            </button>

            {/* Image container */}
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image info overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-200 text-sm mb-2">
                  by {selectedImage.photographer}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedImage.tags.slice(0, 4).map((tag) => (
                    <span
                      key={`modal-tag-${crypto.randomUUID()}`}
                      className="px-2 py-1 bg-white/20 text-white rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-white text-sm">
                  <span>
                    {selectedImage.width} × {selectedImage.height}
                  </span>
                  <a
                    href={selectedImage.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-blue-300 transition-colors"
                  >
                    <Download className="size-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Error state
export const ImageGalleryError: React.FC<{
  error: string;
  input?: { query: string };
}> = ({ error, input }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-center space-x-3">
      <div className="bg-red-100 rounded-lg size-12 flex items-center justify-center">
        <Image className="size-6 text-red-600" />
      </div>
      <div>
        <h3 className="font-semibold text-red-800">Image Search Failed</h3>
        <p className="text-red-600 text-sm">{error}</p>
        {input && (
          <p className="text-red-500 text-xs mt-1">
            Query: &ldquo;{input.query}&rdquo;
          </p>
        )}
      </div>
    </div>
  </div>
);
