'use client';

import React, { useState, useEffect } from 'react';
import ProductDetails from '@/components/ProductDetails';
import { ProductData, Product } from '@/types';
import { useProducts } from '@/hooks/useData';

interface DynamicProductDetailsProps {
  slug: string;
}

const DynamicProductDetails: React.FC<DynamicProductDetailsProps> = ({ slug }) => {
  const { products, loading, error } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products && slug) {
      const productData = products as ProductData;
      const foundProduct = productData.products.find(p => p.slug === slug);
      setProduct(foundProduct || null);
      
      // Update page title if product is found
      if (foundProduct && typeof document !== 'undefined') {
        document.title = foundProduct.seoTitle || `${foundProduct.name} - سان ترد گروپ`;
      }
    }
  }, [products, slug]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری محصول...</p>
        </div>
      </main>
    );
  }

  if (error || !products) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">خطا در بارگذاری محصول</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">محصول یافت نشد</h1>
          <p className="text-gray-600 mb-6">محصول مورد نظر در دسترس نیست یا حذف شده است</p>
          <Link 
            href="/products" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            بازگشت به فهرست محصولات
          </Link>
        </div>
      </main>
    );
  }

  return <ProductDetails product={product} />;
};

export default DynamicProductDetails;