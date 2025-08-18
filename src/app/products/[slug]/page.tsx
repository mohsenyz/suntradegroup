import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import { ProductData, Product } from '@/types';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface ProductPageProps {
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
    categories: [],
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

async function getProduct(slug: string): Promise<Product | null> {
  const productData = await getProductData();
  if (!productData) return null;
  return productData.products.find(product => product.slug === slug) || null;
}

// This is required for static export
export async function generateStaticParams() {
  try {
    const productData = await getProductData();
    if (productData && productData.products.length > 0) {
      return productData.products.map((product: Product) => ({
        slug: product.slug,
      }));
    }
  } catch (error) {
    console.error('API failed during build:', error);
  }
  
  // Only provide fallback params during build time (CI/CD environment)
  // In production, this should fail if API is unavailable
  if (process.env.NODE_ENV === 'production' && process.env.BUILD_TIME) {
    console.warn('API not available during build, using minimal fallback product params for static export');
    return [
      { slug: 'steel-spade-shovel-black-gold-sun' },
      { slug: 'galvanized-steel-nails-sun' },
      { slug: 'mason-line-sun' },
      { slug: 'padlock-sun' },
      { slug: 'cylinder-7cm-full-brass-5-keys-sun' }
    ];
  }
  
  // If we're not in build mode and API failed, return empty array
  console.error('API unavailable and not in build mode - no static params generated');
  return [];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'محصول یافت نشد',
      description: 'محصول مورد نظر یافت نشد'
    };
  }

  return {
    title: product.seoTitle || `${product.name} - گروه تجاری آفتاب`,
    description: product.seoDescription || product.shortDescription,
    keywords: product.seoKeywords || product.keywords.join(', ')
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const productData = await getProductData();
  if (!productData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProductDetails product={product} />
      <Footer />
    </div>
  );
}