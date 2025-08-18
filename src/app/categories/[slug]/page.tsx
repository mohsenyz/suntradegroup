import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
// Removed static import - using API data instead
import { ProductData, Category } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(): Promise<ProductData | null> {
  try {
    const response = await fetch('http://localhost:8080/api/products', {
      cache: 'no-store'
    });
    if (response.ok) {
      const result = await response.json();
      return result.data || result;
    }
  } catch {
    console.warn('API not available, using fallback data');
  }
  
  // Fallback data
  return {
    products: [],
    brands: [],
    categories: [
      { 
        id: 'shovels-pickaxes', 
        slug: 'shovels-pickaxes', 
        name: 'بیل و کلنگ',
        description: 'انواع بیل و کلنگ با کیفیت بالا',
        image: '/images/categories/shovels-pickaxes.jpg'
      },
      { 
        id: 'nails-saws', 
        slug: 'nails-saws', 
        name: 'میخ و اره',
        description: 'میخ و اره های مختلف برای کارهای ساختمانی',
        image: '/images/categories/nails-saws.jpg'
      },
      { 
        id: 'locks-cylinders', 
        slug: 'locks-cylinders', 
        name: 'قفل و سیلندر',
        description: 'قفل و سیلندر با امنیت بالا',
        image: '/images/categories/locks-cylinders.jpg'
      },
      { 
        id: 'mesh-chains', 
        slug: 'mesh-chains', 
        name: 'توری و زنجیر',
        description: 'توری و زنجیر مقاوم و با دوام',
        image: '/images/categories/mesh-chains.jpg'
      },
      { 
        id: 'ropes-threads', 
        slug: 'ropes-threads', 
        name: 'ریسمانکار و سر رزوه',
        description: 'ریسمان و سر رزوه برای کارهای مختلف',
        image: '/images/categories/ropes-threads.jpg'
      }
    ],
    companyInfo: { 
      name: 'سان ترد گروپ', 
      description: 'شرکت پیشرو در ابزار و یراق آلات',
      mission: 'ارائه بهترین محصولات',
      vision: 'پیشرو در بازار ایران',
      founded: '2020',
      employees: '50+',
      headquarters: 'تهران',
      phone: '021-12345678',
      email: 'info@suntradegroup.com',
      website: 'suntradegroup.com'
    }
  };
}

async function getCategory(slug: string): Promise<Category | null> {
  const productData = await getProductData();
  if (!productData) return null;
  return productData.categories.find(category => category.slug === slug) || null;
}

export async function generateStaticParams() {
  try {
    const productData = await getProductData();
    if (productData && productData.categories.length > 0) {
      return productData.categories.map((category) => ({
        slug: category.slug,
      }));
    }
  } catch {
    console.warn('API not available during build, using fallback category params');
  }
  
  // Return fallback category slugs for static export when API is not available
  return [
    { slug: 'shovels-pickaxes' },
    { slug: 'nails-saws' },
    { slug: 'locks-cylinders' },
    { slug: 'mesh-chains' },
    { slug: 'ropes-threads' }
  ];
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

  const productData = await getProductData();
  if (!productData) {
    notFound();
  }
  
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