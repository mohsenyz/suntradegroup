import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import data from '@/data/products.json';
import { ProductData, Category } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string): Promise<Category | null> {
  const productData = data as ProductData;
  return productData.categories.find(category => category.slug === slug) || null;
}

export async function generateStaticParams() {
  const productData = data as ProductData;
  return productData.categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'دسته‌بندی یافت نشد',
      description: 'دسته‌بندی مورد نظر یافت نشد'
    };
  }

  return {
    title: `${category.name} - گروه تجاری آفتاب`,
    description: `مشاهده محصولات دسته ${category.name} - ${category.description}`,
    keywords: `${category.name}, محصولات ${category.name}, دسته‌بندی ${category.name}`
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const productData = data as ProductData;
  const categoryProducts = productData.products.filter(
    product => product.category === category.slug
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div 
          className="bg-cover bg-center rounded-lg p-12 mb-12 relative hero-pattern"
          style={{
            backgroundImage: `url(${category.image})`,
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg"></div>
          <div className="relative z-10 text-white text-shadow-xs">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl mb-6 max-w-2xl">
              {category.description}
            </p>
            <div className="inline-block bg-white opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-lg font-semibold">
                {categoryProducts.length} محصول موجود
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold">
              همه محصولات
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              پرفروش‌ترین
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              جدیدترین
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              ارزان‌ترین
            </button>
            <button className="bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 px-6 py-2 rounded-full font-semibold transition-colors">
              گران‌ترین
            </button>
          </div>
        </div>

        <ProductGrid products={categoryProducts} />

        {categoryProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              هنوز محصولی در این دسته‌بندی اضافه نشده است
            </p>
            <button className="btn-primary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              اطلاع از محصولات جدید
            </button>
          </div>
        )}

        <div className="mt-12 bg-golden-50 border border-golden-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-golden-800 mb-4">
            درباره دسته‌بندی {category.name}
          </h3>
          <p className="text-golden-700 mb-4">
            {category.description}
          </p>
          <p className="text-golden-700">
            در این دسته‌بندی شما می‌توانید بهترین و باکیفیت‌ترین محصولات را پیدا کنید که توسط برندهای معتبر تولید شده‌اند.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}