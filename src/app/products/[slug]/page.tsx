import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicProductDetails from '@/components/DynamicProductDetails';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// This is required for static export
export async function generateStaticParams() {
  try {
    // Try to fetch from API first
    const response = await fetch('http://localhost:8080/api/products', {
      cache: 'no-store'
    });
    if (response.ok) {
      const result = await response.json();
      const products = result.data?.products || result.products || [];
      return products.map((product: { slug: string }) => ({
        slug: product.slug,
      }));
    }
  } catch {
    console.warn('API not available during build, returning empty params');
  }
  
  // Return empty array if API is not available - pages will be generated on-demand
  return [];
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DynamicProductDetails slug={slug} />
      <Footer />
    </div>
  );
}