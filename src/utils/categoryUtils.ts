import { jsonApi } from '@/utils/apiClient';

let categoriesCache: { id: string; slug: string; name: string }[] | null = null;

// Load categories from API with fallback
const loadCategories = async () => {
  if (categoriesCache) {
    return categoriesCache;
  }

  try {
    const data = await jsonApi.loadProducts();
    categoriesCache = data?.categories || [];
    return categoriesCache;
  } catch {
    console.warn('Failed to load categories from API, using fallback');
    // Fallback to hardcoded categories
    categoriesCache = [
      { id: 'shovels-pickaxes', slug: 'shovels-pickaxes', name: 'بیل و کلنگ' },
      { id: 'nails-saws', slug: 'nails-saws', name: 'میخ و اره' },
      { id: 'locks-cylinders', slug: 'locks-cylinders', name: 'قفل و سیلندر' },
      { id: 'mesh-chains', slug: 'mesh-chains', name: 'توری و زنجیر' },
      { id: 'ropes-threads', slug: 'ropes-threads', name: 'ریسمانکار و سر رزوه' }
    ];
    return categoriesCache;
  }
};

// Map category slug to display name (async)
export const getCategoryName = async (slug: string): Promise<string> => {
  const categories = await loadCategories();
  const category = categories?.find(cat => cat.slug === slug);
  return category ? category.name : slug;
};

// Get all categories (async)
export const getCategories = async () => {
  return await loadCategories();
};

// Synchronous version for components that already have the data
export const getCategoryNameSync = (categories: { slug: string; name: string }[], slug: string): string => {
  const category = categories.find(cat => cat.slug === slug);
  return category ? category.name : slug;
};