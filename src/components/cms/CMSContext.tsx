'use client';

import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { jsonApi, apiClient } from '@/utils/apiClient';

// Create a context for shared CMS data
interface CMSContextType {
  textsData: {
    common: Record<string, unknown>;
    pages: Record<string, unknown>;
    forms: Record<string, unknown>;
  };
  originalTextsData: {
    common: Record<string, unknown>;
    pages: Record<string, unknown>;
    forms: Record<string, unknown>;
  };
  productsData: Record<string, unknown>;
  originalProductsData: Record<string, unknown>;
  categoriesData: Record<string, unknown>;
  originalCategoriesData: Record<string, unknown>;
  brandsData: Record<string, unknown>;
  originalBrandsData: Record<string, unknown>;
  updateTextsData: (file: string, data: Record<string, unknown>) => void;
  updateProductsData: (data: Record<string, unknown>) => void;
  updateCategoriesData: (data: Record<string, unknown>) => void;
  updateBrandsData: (data: Record<string, unknown>) => void;
  saveAllChanges: () => Promise<void>;
  loadData: () => Promise<void>;
  hasChanges: () => boolean;
  initializeBackend: () => Promise<void>;
  checkBackendStatus: () => Promise<{ initialized: boolean; missing: string[] }>;
  isLoading: boolean;
  isSaving: boolean;
  isInitializing: boolean;
  backendInitialized: boolean;
}

const CMSContext = createContext<CMSContextType | null>(null);

export const useCMSContext = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMSContext must be used within CMSProvider');
  }
  return context;
};

// CMS Provider Component
export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [textsData, setTextsData] = useState({
    common: {},
    pages: {},
    forms: {}
  });
  const [originalTextsData, setOriginalTextsData] = useState({
    common: {},
    pages: {},
    forms: {}
  });
  const [productsData, setProductsData] = useState<Record<string, unknown>>({});
  const [originalProductsData, setOriginalProductsData] = useState<Record<string, unknown>>({});
  const [categoriesData, setCategoriesData] = useState<Record<string, unknown>>({});
  const [originalCategoriesData, setOriginalCategoriesData] = useState<Record<string, unknown>>({});
  const [brandsData, setBrandsData] = useState<Record<string, unknown>>({});
  const [originalBrandsData, setOriginalBrandsData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [backendInitialized, setBackendInitialized] = useState(false);

  // Load all data from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load texts
      const textFiles = ['common', 'pages', 'forms'];
      for (const file of textFiles) {
        try {
          const data = await jsonApi.loadTexts(file);
          updateTextsData(file, data);
        } catch (error) {
          console.warn(`Failed to load ${file} texts:`, error);
        }
      }

      // Load products
      try {
        const products = await jsonApi.loadProducts();
        updateProductsData(products as Record<string, unknown>);
      } catch (error) {
        console.warn('Failed to load products:', error);
      }

      // Load categories
      try {
        const categories = await jsonApi.loadCategories();
        updateCategoriesData(categories as Record<string, unknown>);
      } catch (error) {
        console.warn('Failed to load categories:', error);
      }

      // Load brands
      try {
        const brands = await jsonApi.loadBrands();
        updateBrandsData(brands as Record<string, unknown>);
      } catch (error) {
        console.warn('Failed to load brands:', error);
      }
    } catch (error) {
      console.error('Failed to load CMS data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Global save all changes
  const saveAllChanges = async () => {
    setIsSaving(true);
    const errors = [];
    
    try {
      // Save all text files
      const textFiles = ['common', 'pages', 'forms'];
      for (const file of textFiles) {
        try {
          const data = textsData[file as keyof typeof textsData];
          if (JSON.stringify(data) !== JSON.stringify(originalTextsData[file as keyof typeof originalTextsData])) {
            await jsonApi.saveTexts(file, data);
            console.log(`${file} texts saved successfully`);
          }
        } catch (error) {
          console.error(`Failed to save ${file} texts:`, error);
          errors.push(`${file} texts`);
        }
      }

      // Save products if changed
      try {
        if (JSON.stringify(productsData) !== JSON.stringify(originalProductsData)) {
          await jsonApi.saveProducts(productsData);
          console.log('Products saved successfully');
        }
      } catch (error) {
        console.error('Failed to save products:', error);
        errors.push('products');
      }

      // Save categories if changed
      try {
        if (JSON.stringify(categoriesData) !== JSON.stringify(originalCategoriesData)) {
          await jsonApi.saveCategories(categoriesData);
          console.log('Categories saved successfully');
        }
      } catch (error) {
        console.error('Failed to save categories:', error);
        errors.push('categories');
      }

      // Save brands if changed
      try {
        if (JSON.stringify(brandsData) !== JSON.stringify(originalBrandsData)) {
          await jsonApi.saveBrands(brandsData);
          console.log('Brands saved successfully');
        }
      } catch (error) {
        console.error('Failed to save brands:', error);
        errors.push('brands');
      }

      if (errors.length === 0) {
        // Update original data to reflect current state
        setOriginalTextsData({...textsData});
        setOriginalProductsData({...productsData});
        setOriginalCategoriesData({...categoriesData});
        setOriginalBrandsData({...brandsData});
        
        alert('تمام تغییرات با موفقیت در سرور ذخیره شد!');
      } else {
        alert(`خطا در ذخیره: ${errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('خطا در ذخیره تغییرات');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are any changes
  const hasChanges = () => {
    const textFiles = ['common', 'pages', 'forms'];
    
    // Check text changes
    for (const file of textFiles) {
      if (JSON.stringify(textsData[file as keyof typeof textsData]) !== 
          JSON.stringify(originalTextsData[file as keyof typeof originalTextsData])) {
        return true;
      }
    }
    
    // Check other data changes
    return (
      JSON.stringify(productsData) !== JSON.stringify(originalProductsData) ||
      JSON.stringify(categoriesData) !== JSON.stringify(originalCategoriesData) ||
      JSON.stringify(brandsData) !== JSON.stringify(originalBrandsData)
    );
  };

  // Check backend initialization status
  const checkBackendStatus = async () => {
    try {
      const status = await apiClient.checkInitialization();
      setBackendInitialized(status.initialized);
      return status;
    } catch (error) {
      console.error('Failed to check backend status:', error);
      setBackendInitialized(false);
      return { initialized: false, missing: [] };
    }
  };

  // Initialize backend with local data
  const initializeBackend = async () => {
    setIsInitializing(true);
    try {
      // Load local data files
      const localData: Record<string, unknown> = {};

      // Load products
      try {
        const productsResponse = await import('@/data/products.json');
        localData.products = productsResponse.default;
      } catch {
        console.warn('No local products file found');
      }

      // Load text files
      const textFiles = ['common', 'pages', 'forms'];
      for (const file of textFiles) {
        try {
          const textResponse = await import(`@/data/texts/${file}.json`);
          localData[`texts-${file}`] = textResponse.default;
        } catch {
          console.warn(`No local ${file} texts file found`);
        }
      }

      // Add default categories
      localData.categories = {
        categories: [
          { id: 'locks-cylinders', name: 'قفل و سیلندر', slug: 'locks-cylinders' },
          { id: 'mesh-chains', name: 'توری و زنجیر', slug: 'mesh-chains' },
          { id: 'nails-saws', name: 'میخ و اره', slug: 'nails-saws' },
          { id: 'ropes-threads', name: 'طناب و نخ', slug: 'ropes-threads' },
          { id: 'shovels-pickaxes', name: 'بیل و کلنگ', slug: 'shovels-pickaxes' }
        ]
      };

      // Add default brands
      localData.brands = {
        brands: [
          { id: 'sun-brand', name: 'سان', slug: 'sun-brand', logo: '/images/brands/sun-brand-logo.png' },
          { id: 'moon-brand', name: 'مون', slug: 'moon-brand', logo: '/images/brands/moon-brand-logo.png' }
        ]
      };

      // Initialize backend
      const result = await apiClient.initializeBackend(localData) as { success: boolean; initialized?: string[]; message?: string };
      
      if (result.success) {
        setBackendInitialized(true);
        alert(`سرور با موفقیت راه‌اندازی شد!\nفایل‌های ایجاد شده: ${result.initialized?.join(', ') || 'نامشخص'}`);
        
        // Reload data from the newly initialized backend
        await loadData();
      } else {
        throw new Error(result.message || 'Initialization failed');
      }
    } catch (error) {
      console.error('Failed to initialize backend:', error);
      alert(`خطا در راه‌اندازی سرور: ${error instanceof Error ? error.message : 'خطای نامشخص'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const updateTextsData = (file: string, data: Record<string, unknown>) => {
    setTextsData(prev => ({
      ...prev,
      [file]: data
    }));
    
    // Set original data only if it's empty (first load)
    setOriginalTextsData(prev => ({
      ...prev,
      [file]: Object.keys(prev[file as keyof typeof prev]).length === 0 ? data : prev[file as keyof typeof prev]
    }));
  };

  const updateProductsData = (data: Record<string, unknown>) => {
    setProductsData(data);
    
    // Set original data only if it's empty (first load)
    if (Object.keys(originalProductsData).length === 0) {
      setOriginalProductsData(data);
    }
  };

  const updateCategoriesData = (data: Record<string, unknown>) => {
    setCategoriesData(data);
    
    // Set original data only if it's empty (first load)
    if (Object.keys(originalCategoriesData).length === 0) {
      setOriginalCategoriesData(data);
    }
  };

  const updateBrandsData = (data: Record<string, unknown>) => {
    setBrandsData(data);
    
    // Set original data only if it's empty (first load)
    if (Object.keys(originalBrandsData).length === 0) {
      setOriginalBrandsData(data);
    }
  };

  // Load data on mount and check backend status
  useEffect(() => {
    const initializeApp = async () => {
      // First check if backend is initialized
      await checkBackendStatus();
      // Then load data
      await loadData();
    };
    
    initializeApp();
  }, [loadData]);

  return (
    <CMSContext.Provider value={{
      textsData,
      originalTextsData,
      productsData,
      originalProductsData,
      categoriesData,
      originalCategoriesData,
      brandsData,
      originalBrandsData,
      updateTextsData,
      updateProductsData,
      updateCategoriesData,
      updateBrandsData,
      saveAllChanges,
      loadData,
      hasChanges,
      initializeBackend,
      checkBackendStatus,
      isLoading,
      isSaving,
      isInitializing,
      backendInitialized
    }}>
      {children}
    </CMSContext.Provider>
  );
}