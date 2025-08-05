'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CompanyOverview from '@/components/CompanyOverview';
import ProductSlider from '@/components/ProductSlider';
import CategoryBanners from '@/components/CategoryBanners';
import { ProductData } from '@/types';
import { useProducts } from '@/hooks/useData';

export default function Home() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600 mb-4">خطا در بارگذاری اطلاعات</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const productData = products as ProductData;
  const allProducts = productData.products;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <CompanyOverview />
        <CategoryBanners />
        <ProductSlider 
          products={allProducts} 
          title="همه محصولات" 
        />
      </main>
      <Footer />
    </div>
  );
}
