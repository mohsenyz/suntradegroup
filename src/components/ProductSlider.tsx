'use client';

import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductSliderProps {
  products: Product[];
  title: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products, title }) => {
  
  const settings = {
    dots: true,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: Math.min(4, products.length),
    slidesToScroll: 1,
    autoplay: products.length > 1,
    autoplaySpeed: 3000,
    rtl: true,
    arrows: products.length > 4,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, products.length),
          slidesToScroll: 1,
          arrows: products.length > 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, products.length),
          slidesToScroll: 1,
          arrows: products.length > 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: products.length > 1,
        }
      }
    ]
  };

  if (products.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
            {title}
          </h2>
          <p className="text-center text-gray-500">هیچ محصولی یافت نشد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
          {title}
        </h2>
        <div className="slider-container">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} dir="rtl">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;