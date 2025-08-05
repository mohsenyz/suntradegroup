'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Search from './Search';
import productsData from '@/data/products.json';
import { useTexts } from '@/hooks/useTexts';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, loading } = useTexts();

  if (loading) {
    return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt={t('company.name')}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div className="mr-3">
                <h1 className="text-xl font-bold text-gray-800">{t('company.name')}</h1>
                <p className="text-sm text-gray-600">{t('company.tagline')}</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-golden-600 transition-colors">
              {t('navigation.home')}
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-golden-600 transition-colors">
              {t('navigation.products')}
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-golden-600 transition-colors">
              {t('navigation.categories')}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-golden-600 transition-colors">
              {t('navigation.about')}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-golden-600 transition-colors">
              {t('navigation.contact')}
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Search
              products={productsData.products}
              brands={productsData.brands}
              categories={productsData.categories}
              className="w-80"
            />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-golden-600 focus:outline-none focus:text-golden-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <div className="mb-4">
                <Search
                  products={productsData.products}
                  brands={productsData.brands}
                  categories={productsData.categories}
                  className="w-full"
                  onClose={() => setIsMenuOpen(false)}
                />
              </div>
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-golden-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-golden-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.products')}
              </Link>
              <Link
                href="/brands"
                className="block px-3 py-2 text-gray-700 hover:text-golden-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.brands')}
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-golden-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.categories')}
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-golden-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.about')}
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-golden-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.contact')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;