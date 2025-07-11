'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Product, Brand, Category } from '@/types';

interface SearchResult {
  type: 'product' | 'brand' | 'category' | 'page';
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  category?: string;
  brand?: string;
}

interface SearchProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  className?: string;
  placeholder?: string;
  onClose?: () => void;
}

const Search: React.FC<SearchProps> = ({
  products,
  brands,
  categories,
  className = '',
  placeholder = 'جستجو...',
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pages = [
    { id: 'home', name: 'خانه', slug: '/', description: 'صفحه اصلی' },
    { id: 'products', name: 'محصولات', slug: '/products', description: 'تمام محصولات' },
    { id: 'brands', name: 'برندها', slug: '/brands', description: 'تمام برندها' },
    { id: 'categories', name: 'دسته‌بندی‌ها', slug: '/categories', description: 'تمام دسته‌بندی‌ها' },
    { id: 'about', name: 'درباره ما', slug: '/about', description: 'اطلاعات شرکت' },
    { id: 'contact', name: 'تماس با ما', slug: '/contact', description: 'اطلاعات تماس' }
  ];

  // Levenshtein distance function for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    const n = str1.length;
    const m = str2.length;

    if (n === 0) return m;
    if (m === 0) return n;

    for (let i = 0; i <= m; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= n; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[m][n];
  };

  // Check if terms match with fuzzy search
  const isMatch = (text: string, searchTerm: string): boolean => {
    const normalizedText = text.toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();
    
    // Exact match
    if (normalizedText.includes(normalizedSearch)) {
      return true;
    }
    
    // Fuzzy match for words longer than 3 characters
    if (searchTerm.length > 3) {
      const words = normalizedText.split(/\s+/);
      return words.some(word => {
        if (word.length > 3) {
          const distance = levenshteinDistance(word, normalizedSearch);
          const threshold = Math.max(1, Math.floor(normalizedSearch.length * 0.3));
          return distance <= threshold;
        }
        return false;
      });
    }
    
    return false;
  };

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search products (prioritized)
    products.forEach(product => {
      if (isMatch(product.name, searchTerm) ||
          (product.shortDescription && isMatch(product.shortDescription, searchTerm)) ||
          product.keywords?.some(keyword => isMatch(keyword, searchTerm)) ||
          (product.brand && isMatch(product.brand, searchTerm)) ||
          (product.category && isMatch(product.category, searchTerm))) {
        searchResults.push({
          type: 'product',
          id: product.id,
          name: product.name,
          slug: `/products/${product.slug}`,
          description: product.shortDescription,
          image: product.mainImage,
          category: product.category,
          brand: product.brand
        });
      }
    });

    // Search brands
    brands.forEach(brand => {
      if (isMatch(brand.name, searchTerm) ||
          (brand.description && isMatch(brand.description, searchTerm))) {
        searchResults.push({
          type: 'brand',
          id: brand.id,
          name: brand.name,
          slug: `/brands/${brand.slug}`,
          description: brand.description
        });
      }
    });

    // Search categories
    categories.forEach(category => {
      if (isMatch(category.name, searchTerm) ||
          (category.description && isMatch(category.description, searchTerm))) {
        searchResults.push({
          type: 'category',
          id: category.id,
          name: category.name,
          slug: `/categories/${category.slug}`,
          description: category.description
        });
      }
    });

    // Search pages
    pages.forEach(page => {
      if (isMatch(page.name, searchTerm) || 
          (page.description && isMatch(page.description, searchTerm))) {
        searchResults.push({
          type: 'page',
          id: page.id,
          name: page.name,
          slug: page.slug,
          description: page.description
        });
      }
    });

    // Sort results by relevance (exact matches first)
    searchResults.sort((a, b) => {
      const aExact = a.name.toLowerCase().includes(searchTerm);
      const bExact = b.name.toLowerCase().includes(searchTerm);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    setResults(searchResults.slice(0, 10));
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query, products, brands, categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResultClick = (_result: SearchResult) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'page': return 'صفحه';
      case 'brand': return 'برند';
      case 'category': return 'دسته‌بندی';
      case 'product': return 'محصول';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'brand': return 'bg-green-100 text-green-800';
      case 'category': return 'bg-purple-100 text-purple-800';
      case 'product': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.slug}
              className={`block px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                {result.image && (
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0 mt-1"
                  />
                )}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="mb-2">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 truncate mt-1">
                      {result.name}
                    </h3>
                  </div>
                  {result.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {result.description}
                    </p>
                  )}
                  {result.brand && result.category && (
                    <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-400">
                      <span>{result.brand}</span>
                      <span>•</span>
                      <span>{result.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;