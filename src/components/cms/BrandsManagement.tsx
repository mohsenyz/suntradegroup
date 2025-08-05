'use client';

import React, { useState, useEffect } from 'react';
import { useCMSContext } from './CMSContext';

// Brands Management Component
export default function BrandsManagement() {
  const { brandsData, updateBrandsData } = useCMSContext();
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    logo: '',
    website: ''
  });

  useEffect(() => {
    // Data is loaded by CMSContext automatically
    setLoading(false);
  }, [brandsData]);

  const generateDownloadLink = () => {
    const jsonString = JSON.stringify(brandsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brands.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const showAddBrandForm = () => {
    setShowAddForm(true);
    setEditingItem(null);
  };

  const saveNewBrand = () => {
    if (!newBrand.name.trim()) {
      alert('لطفا نام برند را وارد کنید');
      return;
    }
    
    const newData = { ...brandsData };
    const brandToAdd = {
      ...newBrand,
      id: Date.now()
    };
    (newData.brands as Array<unknown>).push(brandToAdd);
    updateBrandsData(newData);
    
    setNewBrand({
      name: '',
      description: '',
      logo: '',
      website: ''
    });
    setShowAddForm(false);
  };

  const cancelAddBrand = () => {
    setNewBrand({
      name: '',
      description: '',
      logo: '',
      website: ''
    });
    setShowAddForm(false);
  };

  const updateNewBrand = (field: string, value: unknown) => {
    setNewBrand(prev => ({ ...prev, [field]: value }));
  };

  const updateBrand = (index: number, field: string, value: unknown) => {
    const newData = { ...brandsData };
    const brands = newData.brands as Array<Record<string, unknown>>;
    if (brands && brands[index]) {
      brands[index] = { ...brands[index], [field]: value };
      updateBrandsData(newData);
    }
  };

  const deleteBrand = (index: number) => {
    if (confirm('آیا از حذف این برند اطمینان دارید؟')) {
      const newData = { ...brandsData };
      const brands = newData.brands as Array<unknown>;
      if (brands) {
        brands.splice(index, 1);
        updateBrandsData(newData);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">در حال بارگذاری برندها...</p>
      </div>
    );
  }

  const brands = (brandsData.brands as Array<Record<string, unknown>>) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">مدیریت برندها</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-gray-600">
            تعداد برندها: {brands.length}
          </span>
          <button
            onClick={showAddBrandForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ افزودن برند جدید
          </button>
          <button
            onClick={generateDownloadLink}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            دانلود فایل
          </button>
        </div>
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ برندی موجود نیست</h3>
          <button
            onClick={showAddBrandForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ اولین برند را اضافه کنید
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">افزودن برند جدید</h3>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={saveNewBrand}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                ✅ ذخیره برند
              </button>
              <button
                onClick={cancelAddBrand}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                ❌ لغو
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام برند</label>
              <input
                type="text"
                value={newBrand.name}
                onChange={(e) => updateNewBrand('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="نام برند را وارد کنید"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وب‌سایت</label>
              <input
                type="url"
                value={newBrand.website}
                onChange={(e) => updateNewBrand('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">لوگو</label>
              <input
                type="text"
                value={newBrand.logo}
                onChange={(e) => updateNewBrand('logo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="آدرس لوگو"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                value={newBrand.description}
                onChange={(e) => updateNewBrand('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                rows={3}
                placeholder="توضیحات برند را وارد کنید"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      )}

      {brands.length > 0 && !showAddForm && (
        <div className="space-y-4">
          {brands.map((brand, index) => (
            <div key={brand.id as number} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{brand.name as string}</h3>
                  <p className="text-sm text-gray-600">شناسه: {brand.id as number}</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => setEditingItem(editingItem === index ? null : index)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    {editingItem === index ? 'بستن' : 'ویرایش'}
                  </button>
                  <button
                    onClick={() => deleteBrand(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>

              {editingItem === index && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام برند</label>
                    <input
                      type="text"
                      value={brand.name as string}
                      onChange={(e) => updateBrand(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">وب‌سایت</label>
                    <input
                      type="url"
                      value={brand.website as string || ''}
                      onChange={(e) => updateBrand(index, 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">لوگو</label>
                    <input
                      type="text"
                      value={brand.logo as string || ''}
                      onChange={(e) => updateBrand(index, 'logo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      placeholder="آدرس لوگو"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                    <textarea
                      value={brand.description as string || ''}
                      onChange={(e) => updateBrand(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}