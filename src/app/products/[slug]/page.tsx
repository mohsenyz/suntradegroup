import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicProductDetails from '@/components/DynamicProductDetails';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// This is required for static export
export async function generateStaticParams() {
  // Import the product data to generate static paths
  const productsData = await import('@/data/products.json');
  const products = productsData.default.products;
  
  return products.map((product) => ({
    slug: product.slug,
  }));
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