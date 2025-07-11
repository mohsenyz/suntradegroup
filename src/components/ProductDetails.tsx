'use client';

import React, { useState } from 'react';
import ImageSlider from '@/components/ImageSlider';
import ShareButtons from '@/components/ShareButtons';
import VariantSelector from '@/components/VariantSelector';
import { Product, ProductVariant } from '@/types';
import { getCategoryName } from '@/utils/categoryUtils';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find(v => v.isDefault) || product.variants?.[0] || null
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const getDisplayPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product.basePrice;
  };

  const getDisplayImages = () => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product.images;
  };

  const getDisplayProperties = () => {
    if (selectedVariant) {
      return { ...product.properties, ...selectedVariant.properties };
    }
    return product.properties;
  };

  const isAvailable = () => {
    if (selectedVariant) {
      return selectedVariant.availability && selectedVariant.stock > 0;
    }
    return product.availability;
  };

  const getStockDisplay = () => {
    if (product.currency === "تماس بگیرید") {
      return 'تماس بگیرید';
    }
    if (selectedVariant) {
      if (selectedVariant.stock === 0) return 'ناموجود';
      if (selectedVariant.stock < 5) return `تنها ${selectedVariant.stock} عدد باقیمانده`;
      return 'موجود';
    }
    return product.availability ? 'موجود' : 'ناموجود';
  };

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <ImageSlider images={getDisplayImages()} productName={product.name} />
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {product.shortDescription}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-600">برند:</span>
              <span className="text-golden-600 font-semibold">{product.brand}</span>
              <span className="text-sm text-gray-600">دسته:</span>
              <span className="text-golden-600 font-semibold">{getCategoryName(product.category)}</span>
            </div>
            
            <div className="text-3xl font-bold text-golden-600 mb-4">
              {product.currency === "تماس بگیرید" ? (
                product.currency
              ) : (
                <>
                  {formatPrice(getDisplayPrice())} {product.currency}
                  {selectedVariant && selectedVariant.priceModifier !== 0 && (
                    <div className="text-sm text-gray-600 font-normal">
                      قیمت پایه: {formatPrice(product.basePrice)} {product.currency}
                      <span className={`ml-2 ${selectedVariant.priceModifier > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ({selectedVariant.priceModifier > 0 ? '+' : ''}{formatPrice(selectedVariant.priceModifier)} {product.currency})
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              product.currency === "تماس بگیرید"
                ? 'bg-blue-100 text-blue-800'
                : isAvailable() 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              {getStockDisplay()}
            </div>

            {selectedVariant && selectedVariant.sku && (
              <div className="mb-4">
                <span className="text-sm text-gray-600">کد محصول: </span>
                <span className="font-medium text-gray-800">{selectedVariant.sku}</span>
              </div>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                انتخاب گزینه
              </h3>
              <VariantSelector
                variants={product.variants}
                onVariantChange={handleVariantChange}
                defaultVariant={selectedVariant || undefined}
                productCurrency={product.currency}
              />
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              ویژگی‌های کلیدی
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(getDisplayProperties()).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">{key}</div>
                  <div className="font-semibold text-gray-800">{value as string}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              کلمات کلیدی
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-golden-100 text-golden-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <ShareButtons
            title={product.name}
            description={product.shortDescription}
            url={currentUrl}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            توضیحات کامل
          </h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed">
            {product.fullDescription.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            مشخصات فنی
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-golden-50 border border-golden-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-golden-800 mb-2">
              اطلاعات برند
            </h3>
            <p className="text-golden-700">
              این محصول توسط برند <strong>{product.brand}</strong> تولید شده است.
              برای مشاهده سایر محصولات این برند، <a href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-golden-600 underline">اینجا کلیک کنید</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;