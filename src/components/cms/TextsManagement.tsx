'use client';

import React, { useState, useEffect } from 'react';
import { useCMSContext } from './CMSContext';

// Recursive Text Editor Component
function TextEditor({ data, onChange, prefix = '' }: { 
  data: Record<string, unknown>; 
  onChange: (path: string, value: string) => void; 
  prefix?: string 
}) {
  // Persian field labels and hints
  const getFieldInfo = (path: string) => {
    const fieldLabels: Record<string, { label: string; hint: string; placeholder: string }> = {
      'company.name': { 
        label: 'نام شرکت', 
        hint: 'نام رسمی شرکت که در سراسر سایت نمایش داده می‌شود',
        placeholder: 'مثال: سان ترد گروپ'
      },
      'company.tagline': { 
        label: 'شعار شرکت', 
        hint: 'شعار کوتاه شرکت که زیر نام در هدر نمایش داده می‌شود',
        placeholder: 'مثال: ابزار و یراق آلات'
      },
      'company.description': { 
        label: 'توضیحات شرکت', 
        hint: 'توضیح کامل شرکت برای متا دیتا و SEO',
        placeholder: 'توضیح کاملی از فعالیت‌های شرکت...'
      },
      'navigation.home': { 
        label: 'منوی خانه', 
        hint: 'متن لینک صفحه اصلی در منوی ناوبری',
        placeholder: 'مثال: خانه'
      },
      'navigation.products': { 
        label: 'منوی محصولات', 
        hint: 'متن لینک صفحه محصولات در منوی ناوبری',
        placeholder: 'مثال: محصولات'
      },
      'navigation.categories': { 
        label: 'منوی دسته‌بندی‌ها', 
        hint: 'متن لینک صفحه دسته‌بندی‌ها در منوی ناوبری',
        placeholder: 'مثال: دسته‌بندی‌ها'
      },
      'navigation.about': { 
        label: 'منوی درباره ما', 
        hint: 'متن لینک صفحه درباره ما در منوی ناوبری',
        placeholder: 'مثال: درباره ما'
      },
      'navigation.contact': { 
        label: 'منوی تماس', 
        hint: 'متن لینک صفحه تماس در منوی ناوبری',
        placeholder: 'مثال: تماس با ما'
      },
      'navigation.brands': { 
        label: 'منوی برندها', 
        hint: 'متن لینک صفحه برندها در منوی ناوبری',
        placeholder: 'مثال: برندها'
      },
      'buttons.viewProducts': { 
        label: 'دکمه مشاهده محصولات', 
        hint: 'متن دکمه‌ای که کاربر را به صفحه محصولات هدایت می‌کند',
        placeholder: 'مثال: مشاهده محصولات'
      },
      'buttons.contactUs': { 
        label: 'دکمه تماس با ما', 
        hint: 'متن دکمه‌ای که کاربر را به صفحه تماس هدایت می‌کند',
        placeholder: 'مثال: تماس با ما'
      },
      'search.placeholder': { 
        label: 'متن جستجو', 
        hint: 'متن راهنمای کادر جستجو که قبل از تایپ نمایش داده می‌شود',
        placeholder: 'مثال: جستجو...'
      },
      'copyright': { 
        label: 'متن کپی‌رایت', 
        hint: 'متن کپی‌رایت که در پایین صفحه نمایش داده می‌شود',
        placeholder: 'مثال: © ۱۴۰۳ سان ترد گروپ. تمامی حقوق محفوظ است.'
      }
    };

    return fieldLabels[path] || { 
      label: path, 
      hint: `ویرایش فیلد ${path}`,
      placeholder: 'متن مورد نظر را وارد کنید...'
    };
  };

  const renderField = (key: string, value: unknown, currentPath: string) => {
    if (typeof value === 'string') {
      const fieldInfo = getFieldInfo(currentPath);
      return (
        <div key={currentPath} className="mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            {fieldInfo.label}
          </label>
          <p className="text-xs text-gray-600 mb-3 bg-blue-50 p-2 rounded border-r-4 border-blue-400">
            💡 {fieldInfo.hint}
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange(currentPath, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-right"
            dir="rtl"
            placeholder={fieldInfo.placeholder}
          />
          <div className="text-xs text-gray-500 mt-1">
            مسیر فیلد: <code className="bg-gray-100 px-1 rounded">{currentPath}</code>
          </div>
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div key={currentPath} className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-3 bg-gray-50 px-4 py-2 rounded-t">
            📂 {key}
          </h3>
          <div className="pr-6 border-r-4 border-gray-200 bg-gray-50 p-4 rounded-b">
            {Object.entries(value).map(([subKey, subValue]) =>
              renderField(subKey, subValue, currentPath ? `${currentPath}.${subKey}` : subKey)
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) =>
        renderField(key, value, prefix ? `${prefix}.${key}` : key)
      )}
    </div>
  );
}

// Texts Management Component
export default function TextsManagement() {
  const { textsData, updateTextsData } = useCMSContext();
  const [selectedFile, setSelectedFile] = useState('common');
  const [loading, setLoading] = useState(true);

  // Get current file data from context
  const textData = textsData[selectedFile as keyof typeof textsData] || {};

  const loadTextFile = async (fileName: string) => {
    setLoading(true);
    try {
      const response = await import(`@/data/texts/${fileName}.json`);
      updateTextsData(fileName, response.default);
    } catch (error) {
      console.error('Error loading text file:', error);
      updateTextsData(fileName, {});
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTextFile(selectedFile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  const updateNestedValue = (obj: Record<string, unknown>, path: string, value: string) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((o, k) => {
      if (!o[k] || typeof o[k] !== 'object') {
        o[k] = {} as Record<string, unknown>;
      }
      return o[k] as Record<string, unknown>;
    }, obj);
    target[lastKey] = value;
  };

  const handleTextChange = (path: string, value: string) => {
    const newData = { ...textData };
    updateNestedValue(newData, path, value);
    updateTextsData(selectedFile, newData);
  };

  const generateDownloadLink = () => {
    const jsonString = JSON.stringify(textData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">مدیریت متون</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="common">متون عمومی (common.json)</option>
            <option value="pages">متون صفحات (pages.json)</option>
            <option value="forms">متون فرم‌ها (forms.json)</option>
          </select>
          <button
            onClick={generateDownloadLink}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            دانلود فایل
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">در حال بارگذاری...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <TextEditor data={textData} onChange={handleTextChange} />
        </div>
      )}
    </div>
  );
}