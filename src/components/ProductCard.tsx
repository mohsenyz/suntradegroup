import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { getCategoryName } from '@/utils/categoryUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getDisplayPrice = () => {
    if (!product.variants || product.variants.length === 0) {
      return product.basePrice;
    }
    
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    return defaultVariant.price;
  };

  const getPriceRange = () => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }

    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return null;
    }
    
    return { min: minPrice, max: maxPrice };
  };

  const priceRange = getPriceRange();
  const displayPrice = getDisplayPrice();

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          unoptimized
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-golden-500 to-secondary-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ویژه
          </div>
        )}
        {!product.availability && product.currency !== "تماس بگیرید" && (
          <>
            <div className="absolute inset-0 bg-gray-900 opacity-30"></div>
            <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ناموجود
            </div>
          </>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-golden-600 transition-colors line-clamp-1">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-600 mb-1">برند: {product.brand}</p>
          <p className="text-sm text-gray-600">دسته: {getCategoryName(product.category)}</p>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-1">
          {product.shortDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-golden-600">
            {product.currency === "تماس بگیرید" ? (
              <div>
                {product.currency}
              </div>
            ) : priceRange ? (
              <div>
                <span className="text-sm">از </span>
                {formatPrice(priceRange.min)} 
                <span className="text-sm"> تا </span>
                {formatPrice(priceRange.max)} {product.currency}
              </div>
            ) : (
              <div>
                {formatPrice(displayPrice)} {product.currency}
              </div>
            )}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
          >
            مشاهده
          </Link>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {product.variants && product.variants.length > 1 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {product.variants.length} گزینه
            </span>
          )}
          {product.keywords.slice(0, 2).map((keyword, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;