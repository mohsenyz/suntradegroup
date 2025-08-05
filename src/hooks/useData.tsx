'use client';

import { useState, useEffect } from 'react';
import { jsonApi } from '@/utils/apiClient';

// Frontend data provider hooks
export function useProducts() {
  const [products, setProducts] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await jsonApi.loadProducts();
        setProducts(data);
      } catch {
        console.warn('Failed to load products from backend, using fallback');
        setError('Failed to load from backend');
        // Fallback to local data
        try {
          const response = await import('@/data/products.json');
          setProducts(response.default);
        } catch (fallbackErr) {
          console.error('Failed to load products:', fallbackErr);
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
}

export function useTexts(category: string = 'common') {
  const [texts, setTexts] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTexts = async () => {
      try {
        setLoading(true);
        const data = await jsonApi.loadTexts(category);
        setTexts(data);
      } catch {
        console.warn(`Failed to load texts-${category} from backend, using fallback`);
        setError('Failed to load from backend');
        // Fallback to local data
        try {
          const response = await import(`@/data/texts/${category}.json`);
          setTexts(response.default);
        } catch (fallbackErr) {
          console.error(`Failed to load texts-${category}:`, fallbackErr);
          setError(`Failed to load texts-${category}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTexts();
  }, [category]);

  return { texts, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await jsonApi.loadCategories();
        setCategories(data);
      } catch {
        console.warn('Failed to load categories from backend, using fallback');
        setError('Failed to load from backend');
        // Fallback to default categories
        setCategories({
          categories: [
            { id: 'locks-cylinders', name: 'قفل و سیلندر', slug: 'locks-cylinders' },
            { id: 'mesh-chains', name: 'توری و زنجیر', slug: 'mesh-chains' },
            { id: 'nails-saws', name: 'میخ و اره', slug: 'nails-saws' },
            { id: 'ropes-threads', name: 'طناب و نخ', slug: 'ropes-threads' },
            { id: 'shovels-pickaxes', name: 'بیل و کلنگ', slug: 'shovels-pickaxes' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
}

export function useBrands() {
  const [brands, setBrands] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        const data = await jsonApi.loadBrands();
        setBrands(data);
      } catch {
        console.warn('Failed to load brands from backend, using fallback');
        setError('Failed to load from backend');
        // Fallback to default brands
        setBrands({
          brands: [
            { id: 'sun-brand', name: 'سان', slug: 'sun-brand', logo: '/images/brands/sun-brand-logo.webp' },
            { id: 'moon-brand', name: 'مون', slug: 'moon-brand', logo: '/images/brands/moon-brand-logo.webp' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  return { brands, loading, error };
}

// Combined data hook for multiple resources
export function useAllData() {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { texts, loading: textsLoading, error: textsError } = useTexts('common');
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();

  const loading = productsLoading || textsLoading || categoriesLoading || brandsLoading;
  const hasErrors = productsError || textsError || categoriesError || brandsError;

  return {
    products,
    texts,
    categories,
    brands,
    loading,
    hasErrors,
    errors: {
      products: productsError,
      texts: textsError,
      categories: categoriesError,
      brands: brandsError
    }
  };
}