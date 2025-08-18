import { MetadataRoute } from 'next';
import { ProductData } from '@/types';

export const dynamic = 'force-static';

// Fallback data for build time when API might not be available
const fallbackData: ProductData = {
  products: [],
  brands: [
    { 
      id: 'sun', 
      slug: 'sun', 
      name: 'سان', 
      logo: '/images/brands/sun-logo.webp',
      description: 'برند پیشرو در تولید ابزار و یراق آلات',
      founded: '2020',
      country: 'ایران'
    }
  ],
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