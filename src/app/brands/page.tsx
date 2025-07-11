import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import data from '@/data/products.json';
import { ProductData } from '@/types';

export const metadata: Metadata = {
  title: 'برندهای ما - گروه تجاری آفتاب',
  description: 'آشنایی با برندهای معتبر همکار گروه تجاری آفتاب',
  keywords: 'برندها، گروه تجاری آفتاب، همکاران، کیفیت'
};

export default function BrandsPage() {
  const productData = data as ProductData;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            برندهای ما
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            آشنایی با برندهای معتبر و باکیفیت که با ما همکاری می‌کنند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productData.brands.map((brand) => {
            const brandProducts = productData.products.filter(
              product => product.brand === brand.name
            );
            
            return (
              <div key={brand.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-golden-100 to-secondary-100 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-golden-600">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {brand.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">تأسیس:</span>
                      <span className="text-gray-800 font-semibold mr-2">{brand.founded}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">کشور:</span>
                      <span className="text-gray-800 font-semibold mr-2">{brand.country}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">تعداد محصولات: </span>
                    <span className="text-sm font-semibold text-golden-600">
                      {brandProducts.length} محصول
                    </span>
                  </div>
                  
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="btn-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all w-full text-center block"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            می‌خواهید برند خود را معرفی کنید؟
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            ما همواره به دنبال همکاری با برندهای معتبر و باکیفیت هستیم. 
            اگر تولیدکننده محصولات باکیفیت هستید، با ما تماس بگیرید.
          </p>
          <button className="btn-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            همکاری با ما
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}