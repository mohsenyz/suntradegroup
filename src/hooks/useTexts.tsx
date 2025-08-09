import React, { useState, useEffect, createContext, useContext } from 'react';

// Type definitions for text structure
export interface CommonTexts {
  company: {
    name: string;
    tagline: string;
    description: string;
    fullDescription: string;
    website: string;
  };
  navigation: {
    home: string;
    products: string;
    categories: string;
    about: string;
    contact: string;
    brands: string;
  };
  buttons: {
    viewProducts: string;
    contactUs: string;
    sendMessage: string;
    view: string;
    share: string;
    selectOption: string;
    copyLink: string;
    viewAllProducts: string;
    cooperateWithUs: string;
  };
  labels: {
    brand: string;
    category: string;
    basePrice: string;
    productCode: string;
    from: string;
    to: string;
    product: string;
    availableProducts: string;
    keyFeatures: string;
    keywords: string;
    fullDescription: string;
    technicalSpecs: string;
    brandInfo: string;
    selected: string;
    inventory: string;
    establishedYear: string;
    country: string;
    productCount: string;
  };
  status: {
    special: string;
    unavailable: string;
    available: string;
    limitedStock: string;
    limitedEdition: string;
    callForPrice: string;
  };
  search: {
    placeholder: string;
    types: {
      page: string;
      brand: string;
      category: string;
      product: string;
    };
  };
  sharing: {
    title: string;
    telegram: string;
    whatsapp: string;
    linkCopied: string;
  };
  emptyStates: {
    noProducts: string;
    noProductsFound: string;
    productNotFound: string;
    categoryNotFound: string;
    brandNotFound: string;
    noCategoryProducts: string;
    notifyNewProducts: string;
  };
  copyright: string;
}

export interface PageTexts {
  home: Record<string, unknown>;
  about: Record<string, unknown>;
  contact: Record<string, unknown>;
  products: Record<string, unknown>;
  categories: Record<string, unknown>;
  brands: Record<string, unknown>;
}

export interface FormTexts {
  contactForm: Record<string, unknown>;
  productVariants: Record<string, unknown>;
}

// Custom hook for loading and accessing texts
export function useTexts() {
  const [commonTexts, setCommonTexts] = useState<CommonTexts | null>(null);
  const [pageTexts, setPageTexts] = useState<PageTexts | null>(null);
  const [formTexts, setFormTexts] = useState<FormTexts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTexts = async () => {
      try {
        setLoading(true);
        
        // Try to load from API first, then fall back to static files
        try {
          const apiResponse = await fetch('http://localhost:8080/api/texts-common');
          if (apiResponse.ok) {
            const responseData = await apiResponse.json();
            const commonData = responseData.data || responseData;
            console.log('[useTexts] Loaded common texts from API successfully');
            setCommonTexts(commonData);
          } else {
            throw new Error('API response not ok');
          }
        } catch (apiErr) {
          console.warn('[useTexts] API failed, falling back to static files');
          const commonResponse = await import('../data/texts/common.json');
          setCommonTexts(commonResponse.default);
        }

        // Load pages and forms from static files (CMS doesn't manage these yet)
        const [pageResponse, formResponse] = await Promise.all([
          import('../data/texts/pages.json'),
          import('../data/texts/forms.json')
        ]);

        setPageTexts(pageResponse.default);
        setFormTexts(formResponse.default);
        setError(null);
      } catch (err) {
        console.error('Error loading texts:', err);
        setError('Failed to load text configuration');
      } finally {
        setLoading(false);
      }
    };

    loadTexts();
  }, []);

  // Helper function to get text with interpolation support
  const getText = (path: string, variables?: Record<string, string | number>) => {
    const pathParts = path.split('.');
    let current: unknown = commonTexts;

    // Try to find the text in common texts first
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        current = null;
        break;
      }
    }

    // If not found in common, try page texts
    if (!current && pageTexts) {
      current = pageTexts;
      for (const part of pathParts) {
        if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[part];
        } else {
          current = null;
          break;
        }
      }
    }

    // If not found in page texts, try form texts
    if (!current && formTexts) {
      current = formTexts;
      for (const part of pathParts) {
        if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[part];
        } else {
          current = null;
          break;
        }
      }
    }

    if (typeof current === 'string' && variables) {
      // Replace variables in the text
      return current.replace(/\{(\w+)\}/g, (match, key) => {
        return variables[key]?.toString() || match;
      });
    }

    return (typeof current === 'string' ? current : path) as string; // Return the path as fallback if text not found
  };

  return {
    commonTexts,
    pageTexts,
    formTexts,
    loading,
    error,
    getText,
    // Convenience getters
    t: getText, // Short alias for getText
  };
}

// Higher-order component for providing texts context

const TextsContext = createContext<ReturnType<typeof useTexts> | null>(null);

export function TextsProvider({ children }: { children: React.ReactNode }) {
  const texts = useTexts();
  
  return (
    <TextsContext.Provider value={texts}>
      {children}
    </TextsContext.Provider>
  );
}

export function useTextsContext() {
  const context = useContext(TextsContext);
  if (!context) {
    throw new Error('useTextsContext must be used within a TextsProvider');
  }
  return context;
}