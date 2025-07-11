import productsData from '@/data/products.json';

// Map category slug to display name
export const getCategoryName = (slug: string): string => {
  const category = productsData.categories.find(cat => cat.slug === slug);
  return category ? category.name : slug;
};

// Get all categories
export const getCategories = () => {
  return productsData.categories;
};