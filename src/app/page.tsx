import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CompanyOverview from '@/components/CompanyOverview';
import ProductSlider from '@/components/ProductSlider';
import CategoryBanners from '@/components/CategoryBanners';
import data from '@/data/products.json';
import { ProductData } from '@/types';

export default function Home() {
  const productData = data as ProductData;
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
