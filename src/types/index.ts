export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  priceModifier: number;
  stock: number;
  properties: Record<string, string> | object;
  images: string[];
  availability: boolean;
  isDefault?: boolean;
  isLimited?: boolean;
  limitedQuantity?: number;
  size?: string;
  color?: string;
  material?: string;
  finish?: string;
  edition?: string;
  packaging?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  keywords: string[];
  basePrice: number;
  currency: string;
  images: string[];
  mainImage: string;
  shortDescription: string;
  fullDescription: string;
  properties: Record<string, string> | object;
  specifications: Record<string, string> | object;
  variants?: ProductVariant[];
  availability: boolean;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  founded: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CompanyInfo {
  name: string;
  description: string;
  mission: string;
  vision: string;
  founded: string;
  employees: string;
  headquarters: string;
  phone: string;
  email: string;
  website: string;
}

export interface ProductData {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  companyInfo: CompanyInfo;
}