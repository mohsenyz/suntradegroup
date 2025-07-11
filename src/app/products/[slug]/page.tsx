import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import data from '@/data/products.json';
import { ProductData, Product } from '@/types';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const productData = data as ProductData;
  return productData.products.find(product => product.slug === slug) || null;
}

export async function generateStaticParams() {
  const productData = data as ProductData;
  return productData.products.map((product) => ({
    slug: product.slug,
  }));
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
    title: product.seoTitle,
    description: product.seoDescription,
    keywords: product.seoKeywords,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.mainImage],
      type: 'website'
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
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