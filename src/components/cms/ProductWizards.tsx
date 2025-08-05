'use client';

import React, { useState } from 'react';

// Brand Selector Component
export function BrandSelector({ value, brands, onChange }: { value: number; brands: Array<Record<string, unknown>>; onChange: (brandId: number) => void }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🏷️ انتخاب برند</h4>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        dir="rtl"
      >
        <option value="">برند را انتخاب کنید</option>
        {brands?.map((brand) => (
          <option key={brand.id as number} value={brand.id as number}>
            {brand.name as string}
          </option>
        ))}
      </select>
      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: برند سازنده محصول را از لیست انتخاب کنید
      </div>
    </div>
  );
}

// Category Selector Component
export function CategorySelector({ value, categories, onChange }: { value: number; categories: Array<Record<string, unknown>>; onChange: (categoryId: number) => void }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">📁 انتخاب دسته‌بندی</h4>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        dir="rtl"
      >
        <option value="">دسته‌بندی را انتخاب کنید</option>
        {categories?.map((category) => (
          <option key={category.id as number} value={category.id as number}>
            {category.name as string}
          </option>
        ))}
      </select>
      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: دسته‌بندی محصول را از لیست انتخاب کنید
      </div>
    </div>
  );
}

// Properties Wizard Component
export function PropertiesWizard({ properties, onChange }: { properties: Record<string, string>; onChange: (properties: Record<string, string>) => void }) {
  const [newProperty, setNewProperty] = useState({ key: '', value: '' });

  const addProperty = () => {
    if (newProperty.key.trim() && newProperty.value.trim()) {
      onChange({ ...properties, [newProperty.key.trim()]: newProperty.value.trim() });
      setNewProperty({ key: '', value: '' });
    }
  };

  const removeProperty = (key: string) => {
    const newProperties = { ...properties };
    delete newProperties[key];
    onChange(newProperties);
  };

  const updateProperty = (oldKey: string, newKey: string, value: string) => {
    const newProperties = { ...properties };
    if (oldKey !== newKey) {
      delete newProperties[oldKey];
    }
    newProperties[newKey] = value;
    onChange(newProperties);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🏷️ مدیریت ویژگی‌های محصول</h4>
      
      {/* Add new property */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">افزودن ویژگی جدید:</h5>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">نام ویژگی</label>
            <input
              type="text"
              value={newProperty.key}
              onChange={(e) => setNewProperty({ ...newProperty, key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="رنگ"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">مقدار</label>
            <input
              type="text"
              value={newProperty.value}
              onChange={(e) => setNewProperty({ ...newProperty, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="آبی"
              dir="rtl"
            />
          </div>
        </div>
        <button
          onClick={addProperty}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          ➕ افزودن ویژگی
        </button>
      </div>

      {/* Properties list */}
      <div className="space-y-2">
        {Object.entries(properties).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 bg-white p-3 rounded border">
            <span className="text-sm text-gray-600 w-8">🏷️</span>
            <input
              type="text"
              value={key}
              onChange={(e) => updateProperty(key, e.target.value, value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
              placeholder="نام ویژگی"
              dir="rtl"
            />
            <span className="text-gray-500">:</span>
            <input
              type="text"
              value={value}
              onChange={(e) => updateProperty(key, key, e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
              placeholder="مقدار"
              dir="rtl"
            />
            <button
              onClick={() => removeProperty(key)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {Object.keys(properties).length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
          هیچ ویژگی‌ای اضافه نشده است
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: ویژگی‌های فنی محصول مانند رنگ، سایز، وزن و ... را اضافه کنید
      </div>
    </div>
  );
}

// Images Wizard Component
export function ImagesWizard({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [newImage, setNewImage] = useState('');

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      onChange([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      onChange(newImages);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🖼️ مدیریت تصاویر محصول</h4>
      
      {/* Add new image */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">افزودن تصویر جدید:</h5>
        <div className="flex gap-3">
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-right text-sm"
            placeholder="آدرس تصویر (URL) یا نام فایل"
            dir="rtl"
          />
          <button
            onClick={addImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ افزودن
          </button>
        </div>
      </div>

      {/* Images list */}
      <div className="space-y-2">
        {images.map((image, index) => (
          <div key={index} className="flex items-center gap-2 bg-white p-3 rounded border">
            <span className="text-sm text-gray-600 w-8">🖼️</span>
            <input
              type="text"
              value={image}
              onChange={(e) => {
                const newImages = [...images];
                newImages[index] = e.target.value;
                onChange(newImages);
              }}
              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
              placeholder="آدرس تصویر"
              dir="rtl"
            />
            <div className="flex gap-1">
              <button
                onClick={() => moveImage(index, 'up')}
                disabled={index === 0}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-300"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(index, 'down')}
                disabled={index === images.length - 1}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-300"
              >
                ↓
              </button>
              <button
                onClick={() => removeImage(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
          هیچ تصویری اضافه نشده است
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: تصاویر محصول را به ترتیب اولویت نمایش اضافه کنید. اولین تصویر به عنوان تصویر اصلی نمایش داده می‌شود
      </div>
    </div>
  );
}

// Keywords Wizard Component
export function KeywordsWizard({ keywords, onChange }: { keywords: string[]; onChange: (keywords: string[]) => void }) {
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      onChange([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    onChange(newKeywords);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🔍 مدیریت کلیدواژه‌های جستجو</h4>
      
      {/* Add new keyword */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">افزودن کلیدواژه جدید:</h5>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-right text-sm"
            placeholder="کلیدواژه برای جستجو"
            dir="rtl"
            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
          />
          <button
            onClick={addKeyword}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ افزودن
          </button>
        </div>
      </div>

      {/* Keywords list */}
      <div className="flex flex-wrap gap-2 mb-4">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <span>🔍 {keyword}</span>
            <button
              onClick={() => removeKeyword(index)}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {keywords.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
          هیچ کلیدواژه‌ای اضافه نشده است
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: کلیدواژه‌هایی که کاربران ممکن است برای یافتن این محصول جستجو کنند را اضافه کنید
      </div>
    </div>
  );
}

// Key Features Wizard Component
export function KeyFeaturesWizard({ features, onChange }: { features: string[]; onChange: (features: string[]) => void }) {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onChange(newFeatures);
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...features];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < features.length) {
      [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
      onChange(newFeatures);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">⭐ مدیریت ویژگی‌های کلیدی</h4>
      
      {/* Add new feature */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">افزودن ویژگی کلیدی جدید:</h5>
        <div className="flex gap-3">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-right text-sm"
            placeholder="ویژگی کلیدی محصول"
            dir="rtl"
            onKeyDown={(e) => e.key === 'Enter' && addFeature()}
          />
          <button
            onClick={addFeature}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            ➕ افزودن
          </button>
        </div>
      </div>

      {/* Features list */}
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 bg-white p-3 rounded border">
            <span className="text-sm text-gray-600 w-8">⭐</span>
            <input
              type="text"
              value={feature}
              onChange={(e) => {
                const newFeatures = [...features];
                newFeatures[index] = e.target.value;
                onChange(newFeatures);
              }}
              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
              placeholder="ویژگی کلیدی"
              dir="rtl"
            />
            <div className="flex gap-1">
              <button
                onClick={() => moveFeature(index, 'up')}
                disabled={index === 0}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-300"
              >
                ↑
              </button>
              <button
                onClick={() => moveFeature(index, 'down')}
                disabled={index === features.length - 1}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-300"
              >
                ↓
              </button>
              <button
                onClick={() => removeFeature(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {features.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
          هیچ ویژگی کلیدی اضافه نشده است
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: مهم‌ترین ویژگی‌های محصول که در صفحه محصول به صورت لیست نمایش داده می‌شوند
      </div>
    </div>
  );
}

// Variants Wizard Component
export function VariantsWizard({ variants, onChange }: { variants: Array<Record<string, unknown>>; onChange: (variants: Array<Record<string, unknown>>) => void }) {
  const [newVariant, setNewVariant] = useState({
    name: '',
    value: '',
    price: '',
    stock: ''
  });

  const addVariant = () => {
    if (newVariant.name.trim() && newVariant.value.trim()) {
      const variant: Record<string, unknown> = {
        name: newVariant.name.trim(),
        value: newVariant.value.trim(),
        ...(newVariant.price && { price: Number(newVariant.price) }),
        ...(newVariant.stock && { stock: Number(newVariant.stock) })
      };
      onChange([...variants, variant]);
      setNewVariant({ name: '', value: '', price: '', stock: '' });
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onChange(newVariants);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onChange(newVariants);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🎨 مدیریت تنوع محصول</h4>
      
      {/* Add new variant */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">افزودن تنوع جدید:</h5>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">نوع (مثال: سایز، رنگ)</label>
            <input
              type="text"
              value={newVariant.name}
              onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="سایز"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">مقدار</label>
            <input
              type="text"
              value={newVariant.value}
              onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="بزرگ"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">قیمت (اختیاری)</label>
            <input
              type="number"
              value={newVariant.price}
              onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="50000"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">موجودی (اختیاری)</label>
            <input
              type="number"
              value={newVariant.stock}
              onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="10"
              dir="rtl"
            />
          </div>
        </div>
        <button
          onClick={addVariant}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          ➕ افزودن تنوع
        </button>
      </div>

      {/* Variants list */}
      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div key={index} className="bg-white p-4 rounded border">
            <div className="flex justify-between items-start mb-3">
              <h6 className="font-medium text-gray-800">
                تنوع {index + 1}: {variant.name as string} - {variant.value as string}
              </h6>
              <button
                onClick={() => removeVariant(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
              >
                🗑️ حذف
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">نوع</label>
                <input
                  type="text"
                  value={variant.name as string}
                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-right text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">مقدار</label>
                <input
                  type="text"
                  value={variant.value as string}
                  onChange={(e) => updateVariant(index, 'value', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-right text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">قیمت</label>
                <input
                  type="number"
                  value={variant.price as number || ''}
                  onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-right text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">موجودی</label>
                <input
                  type="number"
                  value={variant.stock as number || ''}
                  onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-right text-sm"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {variants.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
          هیچ تنوعی اضافه نشده است
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: انواع مختلف محصول مثل سایز، رنگ، مدل و قیمت‌های متفاوت
      </div>
    </div>
  );
}

// Technical Specs Wizard Component
export function TechnicalSpecsWizard({ specs, onChange }: { specs: Record<string, string>; onChange: (specs: Record<string, string>) => void }) {
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

  const addSpec = () => {
    if (newSpec.key.trim() && newSpec.value.trim()) {
      onChange({ ...specs, [newSpec.key.trim()]: newSpec.value.trim() });
      setNewSpec({ key: '', value: '' });
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    onChange(newSpecs);
  };

  const updateSpec = (oldKey: string, newKey: string, value: string) => {
    const newSpecs = { ...specs };
    if (oldKey !== newKey) {
      delete newSpecs[oldKey];
    }
    newSpecs[newKey] = value;
    onChange(newSpecs);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🔧 مدیریت مشخصات فنی</h4>
      
      {/* Add new spec */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">افزودن مشخصه فنی جدید:</h5>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">نام مشخصه</label>
            <input
              type="text"
              value={newSpec.key}
              onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="وزن"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">مقدار</label>
            <input
              type="text"
              value={newSpec.value}
              onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-right text-sm"
              placeholder="2.5 کیلوگرم"
              dir="rtl"
            />
          </div>
        </div>
        <button
          onClick={addSpec}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          ➕ افزودن مشخصه
        </button>
      </div>

      {/* Specs list */}
      <div className="space-y-2">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2 bg-white p-3 rounded border">
            <span className="text-sm text-gray-600 w-8">🔧</span>
            <input
              type="text"
              value={key}
              onChange={(e) => updateSpec(key, e.target.value, value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
              placeholder="نام مشخصه"
              dir="rtl"
            />
            <span className="text-gray-500">:</span>
            <input
              type="text"
              value={value}
              onChange={(e) => updateSpec(key, key, e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
              placeholder="مقدار"
              dir="rtl"
            />
            <button
              onClick={() => removeSpec(key)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {Object.keys(specs).length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
          هیچ مشخصه فنی اضافه نشده است
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        💡 راهنما: مشخصات فنی دقیق محصول مانند ابعاد، وزن، قدرت، ولتاژ و ...
      </div>
    </div>
  );
}