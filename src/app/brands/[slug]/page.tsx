import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import data from '@/data/products.json';
import { ProductData, Brand } from '@/types';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

async function getBrand(slug: string): Promise<Brand | null> {
  const productData = data as ProductData;
  return productData.brands.find(brand => brand.slug === slug) || null;
}

export async function generateStaticParams() {
  const productData = data as ProductData;
  return productData.brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    return {
      title: 'برند یافت نشد',
      description: 'برند مورد نظر یافت نشد'
    };
  }

  return {
    title: `محصولات ${brand.name} - گروه تجاری آفتاب`,
    description: `مشاهده تمامی محصولات برند ${brand.name} - ${brand.description}`,
    keywords: `${brand.name}, محصولات ${brand.name}, برند ${brand.name}`
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    notFound();
  }

  const productData = data as ProductData;
  const brandProducts = productData.products.filter(
    product => product.brand === brand.name
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-golden-100 to-secondary-100 rounded-lg p-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-golden-600">
                {brand.name.charAt(0)}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {brand.name}
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
              {brand.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-golden-600">{brand.founded}</div>
                <div className="text-sm text-gray-600">سال تأسیس</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-golden-600">{brand.country}</div>
                <div className="text-sm text-gray-600">کشور</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-golden-600">{brandProducts.length}</div>
                <div className="text-sm text-gray-600">محصول</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            محصولات {brand.name}
          </h2>
          <p className="text-gray-600">
            {brandProducts.length} محصول از این برند موجود است
          </p>
        </div>

        <ProductGrid products={brandProducts} />

        {brandProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              هنوز محصولی از این برند اضافه نشده است
            </p>
            <button className="btn-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              اطلاع از محصولات جدید
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}