'use client';

import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  CubeIcon, 
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  DocumentArrowDownIcon 
} from '@heroicons/react/24/outline';
import { CMSProvider } from './components/CMSProvider';
import { TextsEditor } from './components/TextsEditor';
import { useUIStore } from './stores/ui';

// Temporary placeholder components
const ProductsEditor = () => (
  <div className="text-center py-12 text-gray-500">
    محصولات - در حال توسعه
  </div>
);

const CategoriesEditor = () => (
  <div className="text-center py-12 text-gray-500">
    دسته‌بندی‌ها - در حال توسعه
  </div>
);

const BrandsEditor = () => (
  <div className="text-center py-12 text-gray-500">
    برندها - در حال توسعه
  </div>
);

const ExportManager = () => (
  <div className="text-center py-12 text-gray-500">
    خروجی - در حال توسعه
  </div>
);

function CMSContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { activeTab, setActiveTab } = useUIStore();

  // Authentication
  const handleAuth = () => {
    if (password === 'suntradegroup2024') {
      setIsAuthenticated(true);
    } else {
      alert('رمز عبور اشتباه است');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <Cog6ToothIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت محتوا نسخه ۲</h1>
            <p className="text-gray-600 mt-2">سیستم مدیریت محتوای جدید سان ترد گروپ</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="رمز عبور پنل مدیریت را وارد کنید"
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                dir="rtl"
              />
            </div>
            <button
              onClick={handleAuth}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              ورود
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'texts',
      label: 'مدیریت متون',
      icon: DocumentTextIcon,
      component: () => (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-4">متون عمومی</h4>
              <TextsEditor category="common" />
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-4">متون صفحات</h4>
              <TextsEditor category="pages" />
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-medium mb-4">متون فرم‌ها</h4>
              <TextsEditor category="forms" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'products',
      label: 'محصولات',
      icon: CubeIcon,
      component: ProductsEditor,
    },
    {
      id: 'categories',
      label: 'دسته‌بندی‌ها',
      icon: Cog6ToothIcon,
      component: CategoriesEditor,
    },
    {
      id: 'brands',
      label: 'برندها',
      icon: BuildingStorefrontIcon,
      component: BrandsEditor,
    },
    {
      id: 'export',
      label: 'خروجی',
      icon: DocumentArrowDownIcon,
      component: ExportManager,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت محتوا نسخه ۲</h1>
              <p className="text-gray-600">سیستم مدیریت پیشرفته با ذخیره خودکار</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              بازگشت به سایت
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 ml-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <activeTabData.component />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCMS() {
  return (
    <CMSProvider>
      <CMSContent />
    </CMSProvider>
  );
}