'use client';

import React, { useState, useEffect } from 'react';
import { useCMSContext } from './CMSContext';

// Categories Management Component
export default function CategoriesManagement() {
  const { categoriesData, updateCategoriesData } = useCMSContext();
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    productCount: 0
  });

  useEffect(() => {
    // Data is loaded by CMSContext automatically
    setLoading(false);
  }, [categoriesData]);

  const generateDownloadLink = () => {
    const jsonString = JSON.stringify(categoriesData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const showAddCategoryForm = () => {
    setShowAddForm(true);
    setEditingItem(null);
  };

  const saveNewCategory = () => {
    if (!newCategory.name.trim()) {
      alert('لطفا نام دسته‌بندی را وارد کنید');
      return;
    }
    
    const newData = { ...categoriesData };
    const categoryToAdd = {
      ...newCategory,
      id: Date.now()
    };
    if (!newData.categories) {
      newData.categories = [];
    }
    (newData.categories as Array<unknown>).push(categoryToAdd);
    updateCategoriesData(newData);
    
    setNewCategory({
      name: '',
      description: '',
      image: '',
      productCount: 0
    });
    setShowAddForm(false);
  };

  const cancelAddCategory = () => {
    setNewCategory({
      name: '',
      description: '',
      image: '',
      productCount: 0
    });
    setShowAddForm(false);
  };

  const updateNewCategory = (field: string, value: unknown) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  const updateCategory = (index: number, field: string, value: unknown) => {
    const newData = { ...categoriesData };
    const categories = newData.categories as Array<Record<string, unknown>>;
    if (categories && categories[index]) {
      categories[index] = { ...categories[index], [field]: value };
      updateCategoriesData(newData);
    }
  };

  const deleteCategory = (index: number) => {
    if (confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      const newData = { ...categoriesData };
      const categories = newData.categories as Array<unknown>;
      if (categories) {
        categories.splice(index, 1);
        updateCategoriesData(newData);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">در حال بارگذاری دسته‌بندی‌ها...</p>
      </div>
    );
  }

  const categories = (categoriesData?.categories as Array<Record<string, unknown>>) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">مدیریت دسته‌بندی‌ها</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-gray-600">
            تعداد دسته‌بندی‌ها: {categories.length}
          </span>
          <button
            onClick={showAddCategoryForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ افزودن دسته‌بندی جدید
          </button>
          <button
            onClick={generateDownloadLink}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            دانلود فایل
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ دسته‌بندی موجود نیست</h3>
          <button
            onClick={showAddCategoryForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ اولین دسته‌بندی را اضافه کنید
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">افزودن دسته‌بندی جدید</h3>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={saveNewCategory}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                ✅ ذخیره دسته‌بندی
              </button>
              <button
                onClick={cancelAddCategory}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                ❌ لغو
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => updateNewCategory('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="نام دسته‌بندی را وارد کنید"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تصویر</label>
              <input
                type="text"
                value={newCategory.image}
                onChange={(e) => updateNewCategory('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                placeholder="آدرس تصویر"
                dir="rtl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => updateNewCategory('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                rows={3}
                placeholder="توضیحات دسته‌بندی را وارد کنید"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      )}

      {categories.length > 0 && !showAddForm && (
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.id as number} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{category.name as string}</h3>
                  <p className="text-sm text-gray-600">شناسه: {category.id as number}</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => setEditingItem(editingItem === index ? null : index)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    {editingItem === index ? 'بستن' : 'ویرایش'}
                  </button>
                  <button
                    onClick={() => deleteCategory(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>

              {editingItem === index && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                    <input
                      type="text"
                      value={category.name as string}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تصویر</label>
                    <input
                      type="text"
                      value={category.image as string || ''}
                      onChange={(e) => updateCategory(index, 'image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      placeholder="آدرس تصویر"
                      dir="rtl"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                    <textarea
                      value={category.description as string || ''}
                      onChange={(e) => updateCategory(index, 'description', e.target.value)}
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