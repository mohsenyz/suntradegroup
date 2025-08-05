'use client';

import React, { useState, useEffect } from 'react';
import { useCMSContext } from './CMSContext';
import { 
  BrandSelector, 
  CategorySelector, 
  PropertiesWizard, 
  ImagesWizard, 
  KeywordsWizard, 
  KeyFeaturesWizard, 
  VariantsWizard, 
  TechnicalSpecsWizard 
} from './ProductWizards';

// Products Management Component
export default function ProductsManagement() {
  const { productsData, updateProductsData } = useCMSContext();
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brandId: 1,
    categoryId: 1,
    basePrice: 0,
    isSpecial: false,
    description: '',
    images: [],
    variants: [],
    keywords: [],
    keyFeatures: [],
    technicalSpecs: {},
    properties: {}
  });

  useEffect(() => {
    // Data is loaded by CMSContext automatically
    setLoading(false);
  }, [productsData]);

  const generateDownloadLink = () => {
    const jsonString = JSON.stringify(productsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const showAddProductForm = () => {
    setShowAddForm(true);
    setEditingItem(null);
  };

  const saveNewProduct = () => {
    if (!newProduct.name.trim()) {
      alert('لطفا نام محصول را وارد کنید');
      return;
    }
    
    const newData = { ...productsData };
    const productToAdd = {
      ...newProduct,
      id: Date.now()
    };
    (newData.products as Array<unknown>).push(productToAdd);
    updateProductsData(newData);
    
    setNewProduct({
      name: '',
      brandId: 1,
      categoryId: 1,
      basePrice: 0,
      isSpecial: false,
      description: '',
      images: [],
      variants: [],
      keywords: [],
      keyFeatures: [],
      technicalSpecs: {},
      properties: {}
    });
    setShowAddForm(false);
  };

  const cancelAddProduct = () => {
    setNewProduct({
      name: '',
      brandId: 1,
      categoryId: 1,
      basePrice: 0,
      isSpecial: false,
      description: '',
      images: [],
      variants: [],
      keywords: [],
      keyFeatures: [],
      technicalSpecs: {},
      properties: {}
    });
    setShowAddForm(false);
  };

  const updateNewProduct = (field: string, value: unknown) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index: number, field: string, value: unknown) => {
    const newData = { ...productsData };
    const products = newData.products as Array<Record<string, unknown>>;
    if (products && products[index]) {
      products[index] = { ...products[index], [field]: value };
      updateProductsData(newData);
    }
  };

  const deleteProduct = (index: number) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      const newData = { ...productsData };
      const products = newData.products as Array<unknown>;
      if (products) {
        products.splice(index, 1);
        updateProductsData(newData);
      }
    }
  };

  const getProductFieldInfo = (field: string) => {
    const productFields: Record<string, { label: string; hint: string; placeholder: string; type: string }> = {
      'id': { label: 'شناسه محصول', hint: 'شناسه یکتا برای محصول (نباید تغییر کند)', placeholder: '12345', type: 'number' },
      'name': { label: 'نام محصول', hint: 'نام کامل محصول که در سایت نمایش داده می‌شود', placeholder: 'مثال: اره ساموراییی با غلاف', type: 'text' },
      'brandId': { label: 'برند', hint: 'برند سازنده این محصول', placeholder: '', type: 'brandSelect' },
      'categoryId': { label: 'دسته‌بندی', hint: 'دسته‌بندی اصلی این محصول', placeholder: '', type: 'categorySelect' },
      'basePrice': { label: 'قیمت پایه (تومان)', hint: 'قیمت اصلی محصول بدون تخفیف', placeholder: '50000', type: 'number' },
      'isSpecial': { label: 'محصول ویژه', hint: 'آیا این محصول در بخش محصولات ویژه نمایش داده شود؟', placeholder: '', type: 'boolean' },
      'description': { label: 'توضیحات محصول', hint: 'توضیح کامل محصول که در صفحه محصول نمایش داده می‌شود', placeholder: 'توضیح کاملی از محصول...', type: 'textarea' },
      'slug': { label: 'آدرس URL', hint: 'آدرس یکتای صفحه محصول (فقط حروف انگلیسی و خط تیره)', placeholder: 'product-name', type: 'text' },
      'images': { label: 'تصاویر محصول', hint: 'لیست تصاویر محصول', placeholder: '', type: 'images' },
      'keywords': { label: 'کلیدواژه‌های جستجو', hint: 'کلیدواژه‌هایی که کاربران برای یافتن این محصول جستجو می‌کنند', placeholder: '', type: 'keywords' },
      'keyFeatures': { label: 'ویژگی‌های کلیدی', hint: 'مهم‌ترین ویژگی‌های محصول', placeholder: '', type: 'keyFeatures' },
      'variants': { label: 'تنوع محصول', hint: 'انواع مختلف محصول (سایز، رنگ، مدل)', placeholder: '', type: 'variants' },
      'technicalSpecs': { label: 'مشخصات فنی', hint: 'مشخصات فنی دقیق محصول', placeholder: '', type: 'technicalSpecs' },
      'properties': { label: 'ویژگی‌های محصول', hint: 'ویژگی‌های عمومی محصول', placeholder: '', type: 'properties' }
    };

    return productFields[field] || { 
      label: field, 
      hint: `ویرایش فیلد ${field}`,
      placeholder: 'مقدار را وارد کنید...',
      type: 'text'
    };
  };

  const renderField = (product: Record<string, unknown>, index: number, field: string, value: unknown, isNewProduct = false) => {
    const fieldInfo = getProductFieldInfo(field);
    const brands = (productsData.brands as Array<Record<string, unknown>>) || [];
    const categories = (productsData.categories as Array<Record<string, unknown>>) || [];

    switch (fieldInfo.type) {
      case 'brandSelect':
        return (
          <BrandSelector
            value={value as number}
            brands={brands}
            onChange={(brandId) => isNewProduct ? updateNewProduct(field, brandId) : updateProduct(index, field, brandId)}
          />
        );

      case 'categorySelect':
        return (
          <CategorySelector
            value={value as number}
            categories={categories}
            onChange={(categoryId) => isNewProduct ? updateNewProduct(field, categoryId) : updateProduct(index, field, categoryId)}
          />
        );

      case 'boolean':
        return (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">✨ {fieldInfo.label}</h4>
            <label className="flex items-center space-x-3 space-x-reverse">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => isNewProduct ? updateNewProduct(field, e.target.checked) : updateProduct(index, field, e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{fieldInfo.hint}</span>
            </label>
          </div>
        );

      case 'textarea':
        return (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">📝 {fieldInfo.label}</h4>
            <textarea
              value={String(value || '')}
              onChange={(e) => isNewProduct ? updateNewProduct(field, e.target.value) : updateProduct(index, field, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] text-right"
              placeholder={fieldInfo.placeholder}
              dir="rtl"
            />
            <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
              💡 {fieldInfo.hint}
            </div>
          </div>
        );

      case 'images':
        return (
          <ImagesWizard
            images={value as string[] || []}
            onChange={(images) => isNewProduct ? updateNewProduct(field, images) : updateProduct(index, field, images)}
          />
        );

      case 'keywords':
        return (
          <KeywordsWizard
            keywords={value as string[] || []}
            onChange={(keywords) => isNewProduct ? updateNewProduct(field, keywords) : updateProduct(index, field, keywords)}
          />
        );

      case 'keyFeatures':
        return (
          <KeyFeaturesWizard
            features={value as string[] || []}
            onChange={(features) => isNewProduct ? updateNewProduct(field, features) : updateProduct(index, field, features)}
          />
        );

      case 'variants':
        return (
          <VariantsWizard
            variants={value as Array<Record<string, unknown>> || []}
            onChange={(variants) => isNewProduct ? updateNewProduct(field, variants) : updateProduct(index, field, variants)}
          />
        );

      case 'technicalSpecs':
        return (
          <TechnicalSpecsWizard
            specs={value as Record<string, string> || {}}
            onChange={(specs) => isNewProduct ? updateNewProduct(field, specs) : updateProduct(index, field, specs)}
          />
        );

      case 'properties':
        return (
          <PropertiesWizard
            properties={value as Record<string, string> || {}}
            onChange={(properties) => isNewProduct ? updateNewProduct(field, properties) : updateProduct(index, field, properties)}
          />
        );

      case 'number':
        return (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">🔢 {fieldInfo.label}</h4>
            <input
              type="number"
              value={String(value || '')}
              onChange={(e) => isNewProduct ? updateNewProduct(field, Number(e.target.value)) : updateProduct(index, field, Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder={fieldInfo.placeholder}
              dir="rtl"
            />
            <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
              💡 {fieldInfo.hint}
            </div>
          </div>
        );

      default:
        return (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">📝 {fieldInfo.label}</h4>
            <input
              type="text"
              value={String(value || '')}
              onChange={(e) => isNewProduct ? updateNewProduct(field, e.target.value) : updateProduct(index, field, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder={fieldInfo.placeholder}
              dir="rtl"
            />
            <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
              💡 {fieldInfo.hint}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  const products = (productsData.products as Array<Record<string, unknown>>) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">مدیریت محصولات</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-gray-600">
            تعداد محصولات: {products.length}
          </span>
          <button
            onClick={showAddProductForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ افزودن محصول جدید
          </button>
          <button
            onClick={generateDownloadLink}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            دانلود فایل
          </button>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ محصولی موجود نیست</h3>
          <p className="text-gray-600 mb-6">برای شروع، اولین محصول خود را اضافه کنید</p>
          <button
            onClick={showAddProductForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ اولین محصول را اضافه کنید
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">افزودن محصول جدید</h3>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={saveNewProduct}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                ✅ ذخیره محصول
              </button>
              <button
                onClick={cancelAddProduct}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                ❌ لغو
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(newProduct).map(([field, value]) => (
              <div key={field}>
                {renderField(newProduct, -1, field, value, true)}
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && !showAddForm && (
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={product.id as number} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name as string || `محصول ${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600">شناسه: {product.id as number}</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => setEditingItem(editingItem === index ? null : index)}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      editingItem === index
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {editingItem === index ? '🔼 بستن' : '✏️ ویرایش'}
                  </button>
                  <button
                    onClick={() => deleteProduct(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>

              {editingItem === index && (
                <div className="p-6 space-y-6">
                  {Object.entries(product).map(([field, value]) => (
                    <div key={field}>
                      {renderField(product, index, field, value)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}