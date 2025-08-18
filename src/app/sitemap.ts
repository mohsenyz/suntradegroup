import { MetadataRoute } from 'next';
import { ProductData } from '@/types';

export const dynamic = 'force-static';

// Fallback data for build time when API might not be available
const fallbackData: ProductData = {
  products: [],
  brands: [
    { id: 'sun', slug: 'sun', name: 'سان', logo: '/images/brands/sun-logo.webp' }
  ],
  categories: [
    { id: 'shovels-pickaxes', slug: 'shovels-pickaxes', name: 'بیل و کلنگ' },
    { id: 'nails-saws', slug: 'nails-saws', name: 'میخ و اره' },
    { id: 'locks-cylinders', slug: 'locks-cylinders', name: 'قفل و سیلندر' },
    { id: 'mesh-chains', slug: 'mesh-chains', name: 'توری و زنجیر' },
    { id: 'ropes-threads', slug: 'ropes-threads', name: 'ریسمانکار و سر رزوه' }
  ],
  companyInfo: {
    name: 'سان ترد گروپ',
    tagline: 'ابزار و یراق آلات',
    phone: '۰۳۱-۳۳۳۶۳۴۵۸',
    email: 'novin113@yahoo.com',
    address: 'اصفهان، میدان جمهوری، خیابان امام خمینی، نبش کوچه ۱۳ (استوار)',
    website: 'www.suntradegroup.ir'
  }
};

async function getProductData(): Promise<ProductData> {
  try {
    // Try to fetch from API if available during build
    const response = await fetch('http://localhost:8080/api/products', {
      cache: 'no-store'
    });
    if (response.ok) {
      const result = await response.json();
      return result.data || result;
    }
  } catch {
    console.warn('API not available during build, using fallback data for sitemap');
  }
  
  return fallbackData;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productData = await getProductData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  const productRoutes = productData.products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const brandRoutes = productData.brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categoryRoutes = productData.categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...brandRoutes, ...categoryRoutes];
}