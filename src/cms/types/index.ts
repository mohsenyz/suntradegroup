// Base types
export interface BaseEntity {
  id: string | number;
  name: string;
  slug?: string;
}

// Text content types
export interface TextContent {
  [key: string]: string | TextContent;
}

export interface TextsData {
  common: TextContent;
  pages: TextContent;
  forms: TextContent;
}

// Product types
export interface ProductImage {
  src: string;
  alt: string;
  primary?: boolean;
}

export interface ProductVariant {
  id: string | number;
  name: string;
  price: number;
  stock?: number;
  sku?: string;
  attributes?: Record<string, string>;
}

export interface ProductProperty {
  name: string;
  value: string;
  unit?: string;
}

export interface Product extends BaseEntity {
  brandId: string | number;
  categoryId: string | number;
  basePrice: number;
  isSpecial?: boolean;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  properties: ProductProperty[];
  keywords: string[];
  keyFeatures: string[];
  technicalSpecs: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsData {
  products: Product[];
}

// Category types
export interface Category extends BaseEntity {
  description?: string;
  parentId?: string | number;
  order?: number;
  isActive?: boolean;
}

export interface CategoriesData {
  categories: Category[];
}

// Brand types
export interface Brand extends BaseEntity {
  logo?: string;
  description?: string;
  website?: string;
  isActive?: boolean;
}

export interface BrandsData {
  brands: Brand[];
}

// API response types
export interface ApiResponse<T> {
  filename?: string;
  data: T;
  modified?: number;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface SaveResponse {
  success: boolean;
  filename: string;
  size: number;
  modified: number;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// CMS UI types
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface SaveState {
  status: SaveStatus;
  message?: string;
  lastSaved?: Date;
}

export interface CMSTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}