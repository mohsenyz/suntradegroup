'use client';

import React, { useState, useRef, useEffect } from 'react';

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
  const [availableImages, setAvailableImages] = useState<Array<{filename: string; url: string; width: number; height: number}>>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available images on component mount
  useEffect(() => {
    loadAvailableImages();
  }, []);

  const loadAvailableImages = async () => {
    setLoadingAvailable(true);
    try {
      const response = await fetch('http://localhost:8080/upload.php');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableImages(data.images);
        }
      }
    } catch (error) {
      console.error('Failed to load available images:', error);
    }
    setLoadingAvailable(false);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8080/upload.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Password': 'suntradegroup2024'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Add the new image to the product images
        const newImageUrl = result.webp_url || result.url;
        if (!images.includes(newImageUrl)) {
          onChange([...images, newImageUrl]);
        }
        
        // Refresh available images list
        await loadAvailableImages();
        
        alert(`تصویر با موفقیت آپلود شد!\nنام فایل: ${result.filename}\nابعاد: ${result.dimensions.width} × ${result.dimensions.height}`);
      } else {
        alert(`خطا در آپلود تصویر: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('خطا در آپلود تصویر. لطفا دوباره تلاش کنید.');
    }
    
    setUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      onChange([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const addImageFromBrowser = (imageUrl: string) => {
    if (!images.includes(imageUrl)) {
      onChange([...images, imageUrl]);
    }
    setShowImageBrowser(false);
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

  const deleteImageFromServer = async (filename: string) => {
    if (!confirm('آیا از حذف این تصویر از سرور اطمینان دارید؟')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/upload.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Password': 'suntradegroup2024'
        },
        body: JSON.stringify({ filename })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('تصویر با موفقیت حذف شد');
        await loadAvailableImages();
      } else {
        alert(`خطا در حذف تصویر: ${result.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('خطا در حذف تصویر');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🖼️ مدیریت تصاویر محصول</h4>
      
      {/* Upload section */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">آپلود تصویر جدید:</h5>
        
        {/* Drag and drop area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            uploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 ml-3"></div>
              <span className="text-blue-600">در حال آپلود...</span>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📤</div>
              <p className="text-gray-600 mb-2">فایل تصویر را اینجا رها کنید یا کلیک کنید</p>
              <p className="text-xs text-gray-500">حداکثر 10 مگابایت - فرمت‌های JPG, PNG, WebP, GIF</p>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
          />
        </div>
        
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
          >
            📁 انتخاب فایل
          </button>
          
          <button
            onClick={() => setShowImageBrowser(!showImageBrowser)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            🖼️ انتخاب از گالری
          </button>
        </div>
      </div>

      {/* Image browser */}
      {showImageBrowser && (
        <div className="mb-4 p-4 bg-white rounded border">
          <div className="flex justify-between items-center mb-3">
            <h5 className="text-sm font-medium text-gray-700">گالری تصاویر موجود:</h5>
            <button
              onClick={() => setShowImageBrowser(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {loadingAvailable ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">در حال بارگذاری...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
              {availableImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-75"
                    onClick={() => addImageFromBrowser(img.url)}
                  />
                  <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {img.width}×{img.height}
                  </div>
                  <button
                    onClick={() => deleteImageFromServer(img.filename)}
                    className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              
              {availableImages.length === 0 && (
                <div className="col-span-full text-center py-4 text-gray-500">
                  هیچ تصویری در گالری موجود نیست
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual URL input */}
      <div className="mb-4 p-4 bg-white rounded border">
        <h5 className="text-sm font-medium text-gray-700 mb-3">یا آدرس تصویر را وارد کنید:</h5>
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

      {/* Current images list with previews */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">تصاویر محصول ({images.length}):</h5>
        
        {images.map((image, index) => (
          <div key={index} className="flex items-center gap-3 bg-white p-3 rounded border">
            {/* Image preview */}
            <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden bg-gray-100">
              <img
                src={image}
                alt={`تصویر ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">❌</div>';
                  }
                }}
              />
            </div>
            
            {/* Image info and URL */}
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">
                {index === 0 && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs ml-2">تصویر اصلی</span>}
                تصویر {index + 1}
              </div>
              <input
                type="text"
                value={image}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = e.target.value;
                  onChange(newImages);
                }}
                className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
                placeholder="آدرس تصویر"
                dir="rtl"
              />
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveImage(index, 'up')}
                disabled={index === 0}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs disabled:bg-gray-300"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(index, 'down')}
                disabled={index === images.length - 1}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs disabled:bg-gray-300"
              >
                ↓
              </button>
              <button
                onClick={() => removeImage(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded border border-dashed">
            <div className="text-4xl mb-2">🖼️</div>
            <p>هیچ تصویری اضافه نشده است</p>
            <p className="text-sm mt-1">تصویر آپلود کنید یا از گالری انتخاب کنید</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <p><strong>راهنما:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>اولین تصویر به عنوان تصویر اصلی نمایش داده می‌شود</li>
              <li>تصاویر به صورت خودکار بهینه‌سازی و به WebP تبدیل می‌شوند</li>
              <li>حداکثر اندازه فایل: 10 مگابایت</li>
              <li>فرمت‌های مجاز: JPG, PNG, WebP, GIF</li>
            </ul>
          </div>
        </div>
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

// SEO Wizard Component
export function SEOWizard({ seoData, onChange }: { seoData: { title?: string; description?: string; keywords?: string } | null; onChange: (seoData: { title?: string; description?: string; keywords?: string }) => void }) {
  const data = seoData || { title: '', description: '', keywords: '' };

  const updateSEOField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-3">🎯 تنظیمات SEO محصول</h4>
      
      <div className="space-y-4">
        {/* SEO Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 عنوان SEO
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => updateSEOField('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            placeholder="عنوان محصول برای موتورهای جستجو"
            dir="rtl"
            maxLength={60}
          />
          <div className="mt-1 text-xs text-gray-500 text-left">
            {(data.title || '').length}/60 کاراکتر
          </div>
        </div>

        {/* SEO Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📖 توضیحات SEO
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => updateSEOField('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            placeholder="توضیح کوتاه محصول برای موتورهای جستجو"
            dir="rtl"
            rows={3}
            maxLength={160}
          />
          <div className="mt-1 text-xs text-gray-500 text-left">
            {(data.description || '').length}/160 کاراکتر
          </div>
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏷️ کلیدواژه‌های SEO
          </label>
          <input
            type="text"
            value={data.keywords || ''}
            onChange={(e) => updateSEOField('keywords', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            placeholder="کلیدواژه‌ها را با کاما جدا کنید"
            dir="rtl"
          />
          <div className="mt-1 text-xs text-gray-500">
            مثال: اره سامورایی, ابزار ساختمانی, برند سان
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded">
        💡 راهنما: این اطلاعات برای بهینه‌سازی محصول در موتورهای جستجو استفاده می‌شود
      </div>
    </div>
  );
}