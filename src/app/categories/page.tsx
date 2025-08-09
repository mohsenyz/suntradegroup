'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductData } from '@/types';
import { useProducts, useCategories } from '@/hooks/useData';

export default function CategoriesPage() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const loading = productsLoading || categoriesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</p>
        </div>
      </div>
    );
  }

  if (!products || !categories) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">خطا در بارگذاری دسته‌بندی‌ها</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const productData = products as ProductData;
  const categoryData = categories as { categories: Array<{ id: string; name: string; slug: string; description?: string; image?: string; }> };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            دسته‌بندی محصولات
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            محصولات ما را بر اساس دسته‌بندی‌های مختلف مشاهده کنید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryData.categories.map((category) => {
            const categoryProducts = productData.products.filter(
              product => product.category === category.slug
            );
            
            return (
              <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div 
                  className="h-48 bg-cover bg-center relative hero-pattern"
                  style={{
                    backgroundImage: `url(${category.image})`,
                    backgroundBlendMode: 'overlay'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      {categoryProducts.length} محصول
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {categoryProducts.length} محصول موجود
                    </span>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="btn-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      مشاهده
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-golden-50 to-secondary-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            دسته‌بندی مورد نظر خود را پیدا نکردید؟
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            ما مجموعه‌ای گسترده از محصولات در دسته‌بندی‌های مختلف داریم. 
            برای یافتن محصول مورد نظر با ما تماس بگیرید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              مشاهده همه محصولات
            </Link>
            <button className="border-2 border-golden-500 text-golden-600 px-8 py-3 rounded-lg font-semibold hover:bg-golden-500 hover:text-white hover:text-shadow-xs transition-all">
              تماس با ما
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}