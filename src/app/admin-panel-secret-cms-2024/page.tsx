'use client';

import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, CubeIcon, Cog6ToothIcon, DocumentArrowDownIcon, CloudArrowUpIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { CMSProvider, useCMSContext } from '@/components/cms/CMSContext';
import TextsManagement from '@/components/cms/TextsManagement';
import ProductsManagement from '@/components/cms/ProductsManagement';
import CategoriesManagement from '@/components/cms/CategoriesManagement';
import BrandsManagement from '@/components/cms/BrandsManagement';
import ContactsManagement from '@/components/cms/ContactsManagement';
import ExportManagement from '@/components/cms/ExportManagement';
import BuildInfo from '@/components/cms/BuildInfo';

function AdminCMSContent() {
  const [activeTab, setActiveTab] = useState('texts');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { 
    saveAllChanges, 
    hasChanges, 
    isSaving, 
    isLoading, 
    initializeBackend, 
    isInitializing, 
    backendInitialized 
  } = useCMSContext();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('cms-auth');
        if (authData) {
          const { timestamp, authenticated } = JSON.parse(authData);
          const now = Date.now();
          const sessionTimeout = 4 * 60 * 60 * 1000; // 4 hours
          
          if (authenticated && (now - timestamp) < sessionTimeout) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear it
            localStorage.removeItem('cms-auth');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('cms-auth');
      }
      setIsAuthLoading(false);
    };

    checkAuth();
  }, []);

  // Authentication handler
  const handleAuth = () => {
    if (password === 'suntradegroup2024') {
      const authData = {
        authenticated: true,
        timestamp: Date.now()
      };
      localStorage.setItem('cms-auth', JSON.stringify(authData));
      setIsAuthenticated(true);
    } else {
      alert('رمز عبور اشتباه است');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('cms-auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <Cog6ToothIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت محتوا</h1>
            <p className="text-gray-600 mt-2">سیستم مدیریت محتوای سان ترد گروپ</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور:
              </label>
              <input
                id="cms-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="رمز عبور پنل مدیریت را وارد کنید"
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                dir="rtl"
                data-testid="cms-password-input"
              />
            </div>
            <button
              id="cms-login-btn"
              onClick={handleAuth}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              data-testid="cms-login-button"
            >
              ورود
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 space-y-3">
            {/* Title and Main Actions Row */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت محتوا</h1>
                <p className="text-gray-600 text-sm mt-1">سیستم مدیریت فایل‌های JSON</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                {!backendInitialized && (
                  <button
                    onClick={initializeBackend}
                    disabled={isInitializing}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center space-x-2 space-x-reverse disabled:bg-gray-400"
                  >
                    <CloudArrowUpIcon className="h-4 w-4" />
                    <span>{isInitializing ? 'در حال راه‌اندازی...' : 'راه‌اندازی سرور'}</span>
                  </button>
                )}
                {backendInitialized && (
                  <button
                    onClick={saveAllChanges}
                    disabled={isSaving || isLoading || !hasChanges()}
                    className={`px-4 py-2 rounded-md transition-colors text-sm flex items-center space-x-2 space-x-reverse ${
                      hasChanges() && !isSaving && !isLoading
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    data-testid="save-all-changes-button"
                  >
                    <CloudArrowUpIcon className="h-4 w-4" />
                    <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره همه تغییرات'}</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors text-sm"
                >
                  خروج از پنل
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  بازگشت به سایت
                </button>
              </div>
            </div>
            
            {/* Status Indicators and Build Info Row */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2 space-x-reverse">
                {backendInitialized ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full" data-testid="server-status-connected">
                    🟢 سرور متصل
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full" data-testid="server-status-disconnected">
                    🔴 سرور غیرفعال
                  </span>
                )}
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  🔐 جلسه فعال (4 ساعت)
                </span>
                {hasChanges() && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    تغییرات ذخیره نشده
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <BuildInfo />
                <span className="text-sm text-gray-500">
                  آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!backendInitialized && !isInitializing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  سرور راه‌اندازی نشده است
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    برای استفاده از پنل مدیریت، ابتدا باید سرور PHP را راه‌اندازی کنید. 
                    این کار فایل‌های اولیه را از داده‌های محلی به سرور منتقل می‌کند.
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={initializeBackend}
                    disabled={isInitializing}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:bg-gray-400"
                  >
                    {isInitializing ? 'در حال راه‌اندازی...' : 'راه‌اندازی سرور'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-6">
              <button
                onClick={() => setActiveTab('texts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'texts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-texts"
              >
                <DocumentTextIcon className="h-5 w-5 inline-block ml-2" />
                مدیریت متون
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-products"
              >
                <CubeIcon className="h-5 w-5 inline-block ml-2" />
                مدیریت محصولات
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-categories"
              >
                <Cog6ToothIcon className="h-5 w-5 inline-block ml-2" />
                مدیریت دسته‌بندی‌ها
              </button>
              <button
                onClick={() => setActiveTab('brands')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'brands'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-brands"
              >
                <Cog6ToothIcon className="h-5 w-5 inline-block ml-2" />
                مدیریت برندها
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-contacts"
              >
                <EnvelopeIcon className="h-5 w-5 inline-block ml-2" />
                مدیریت پیام‌ها
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'export'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid="tab-export"
              >
                <DocumentArrowDownIcon className="h-5 w-5 inline-block ml-2" />
                خروجی و پیش‌نمایش
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'texts' && <TextsManagement />}
            {activeTab === 'products' && <ProductsManagement />}
            {activeTab === 'categories' && <CategoriesManagement />}
            {activeTab === 'brands' && <BrandsManagement />}
            {activeTab === 'contacts' && <ContactsManagement />}
            {activeTab === 'export' && <ExportManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCMS() {
  return (
    <CMSProvider>
      <AdminCMSContent />
    </CMSProvider>
  );
}