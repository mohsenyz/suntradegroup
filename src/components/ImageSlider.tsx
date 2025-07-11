'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageSliderProps {
  images: string[];
  productName: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        <Image
          src={images[currentIndex]}
          alt={`${productName} - تصویر ${currentIndex + 1}`}
          fill
          className="object-cover"
          unoptimized
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white opacity-80 hover:opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-800" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white opacity-80 hover:opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-golden-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;