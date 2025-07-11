import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import data from '@/data/products.json';
import { ProductData } from '@/types';

export const metadata: Metadata = {
  title: 'همه محصولات - گروه تجاری آفتاب',
  description: 'مشاهده تمامی محصولات گروه تجاری آفتاب با کیفیت بالا و قیمت مناسب',
  keywords: 'محصولات، گروه تجاری آفتاب، کیفیت بالا، ایرانی'
};

export default function ProductsPage() {
  const productData = data as ProductData;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            همه محصولات
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            مجموعه کاملی از محصولات باکیفیت ایرانی را در اینجا مشاهده کنید
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold">
              همه محصولات
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              محصولات ویژه
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              پرفروش‌ترین
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              جدیدترین
            </button>
          </div>
        </div>

        <ProductGrid products={productData.products} />

        <div className="mt-12 bg-golden-50 border border-golden-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-golden-800 mb-2">
            به دنبال محصول خاصی هستید؟
          </h3>
          <p className="text-golden-700 mb-4">
            تیم ما آماده است تا بهترین محصول را برای شما پیدا کند
          </p>
          <button className="btn-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            تماس با ما
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}