'use client';

import React, { useState, useCallback } from 'react';
import { useCMSContext } from './CMSContext';

// Export Management Component
export default function ExportManagement() {
  const { textsData, productsData, originalTextsData, originalProductsData } = useCMSContext();
  const [jsonPreview, setJsonPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState('all');
  const [viewMode, setViewMode] = useState<'preview' | 'diff'>('preview');

  const getCurrentDataFromContext = useCallback(() => {
    try {
      if (selectedFile === 'all') {
        const allData = {
          texts: textsData,
          products: productsData
        };
        return JSON.stringify(allData, null, 2);
      } else if (selectedFile.startsWith('texts/')) {
        const fileName = selectedFile.replace('texts/', '');
        return JSON.stringify(textsData[fileName as keyof typeof textsData] || {}, null, 2);
      } else if (selectedFile === 'products') {
        return JSON.stringify(productsData, null, 2);
      }
      return '';
    } catch (error) {
      console.error('Error getting current data:', error);
      return '';
    }
  }, [selectedFile, textsData, productsData]);

  const getOriginalDataFromContext = useCallback(() => {
    try {
      if (selectedFile === 'all') {
        const allData = {
          texts: originalTextsData,
          products: originalProductsData
        };
        return JSON.stringify(allData, null, 2);
      } else if (selectedFile.startsWith('texts/')) {
        const fileName = selectedFile.replace('texts/', '');
        return JSON.stringify(originalTextsData[fileName as keyof typeof originalTextsData] || {}, null, 2);
      } else if (selectedFile === 'products') {
        return JSON.stringify(originalProductsData, null, 2);
      }
      return '';
    } catch (error) {
      console.error('Error getting original data:', error);
      return '';
    }
  }, [selectedFile, originalTextsData, originalProductsData]);

  const generatePreview = () => {
    try {
      const currentData = getCurrentDataFromContext();
      setJsonPreview(currentData);
      checkForChanges();
    } catch (error) {
      console.error('Error generating preview:', error);
      setJsonPreview('خطا در بارگذاری فایل');
    }
  };

  const generateDiff = () => {
    const currentData = getCurrentDataFromContext();
    if (!currentData) return '';
    
    const originalData = getOriginalDataFromContext();
    if (!originalData) return 'خطا در بارگذاری فایل اصلی';
    
    const originalLines = originalData.split('\n');
    const currentLines = currentData.split('\n');
    const maxLines = Math.max(originalLines.length, currentLines.length);
    const diffLines = [];
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const currentLine = currentLines[i] || '';
      
      if (originalLine === currentLine) {
        diffLines.push(`  ${originalLine}`);
      } else if (!originalLine) {
        diffLines.push(`+ ${currentLine}`);
      } else if (!currentLine) {
        diffLines.push(`- ${originalLine}`);
      } else {
        diffLines.push(`- ${originalLine}`);
        diffLines.push(`+ ${currentLine}`);
      }
    }
    
    return diffLines.join('\n');
  };

  const downloadFile = () => {
    if (!jsonPreview) return;
    
    const blob = new Blob([jsonPreview], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile === 'all' ? 'all-data.json' : `${selectedFile}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [diffContent, setDiffContent] = useState('');
  const [hasChangesState, setHasChangesState] = useState(false);

  const checkForChanges = () => {
    const currentData = getCurrentDataFromContext();
    if (!currentData) {
      setHasChangesState(false);
      return;
    }
    const originalData = getOriginalDataFromContext();
    setHasChangesState(originalData !== currentData);
    
    // Update preview with current context data
    setJsonPreview(currentData);
  };

  const handleViewModeChange = (mode: 'preview' | 'diff') => {
    setViewMode(mode);
    if (mode === 'diff') {
      const diff = generateDiff();
      setDiffContent(diff);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">خروجی و پیش‌نمایش</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">همه فایل‌ها</option>
            <option value="texts/common">متون عمومی</option>
            <option value="texts/pages">متون صفحات</option>
            <option value="texts/forms">متون فرم‌ها</option>
            <option value="products">محصولات</option>
          </select>
          <button
            onClick={generatePreview}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            تولید پیش‌نمایش
          </button>
          <button
            onClick={downloadFile}
            disabled={!jsonPreview}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400"
          >
            دانلود فایل
          </button>
        </div>
      </div>

      {jsonPreview && (
        <div className="mb-4">
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => handleViewModeChange('preview')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              پیش‌نمایش JSON
            </button>
            <button
              onClick={() => handleViewModeChange('diff')}
              disabled={!hasChangesState}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'diff'
                  ? 'bg-blue-600 text-white'
                  : hasChangesState
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              مقایسه تغییرات
              {hasChangesState && <span className="mr-2 bg-red-500 text-white rounded-full w-2 h-2 inline-block"></span>}
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {viewMode === 'diff' ? 'مقایسه تغییرات با فایل اصلی (قرمز: حذف، سبز: اضافه)' : 'پیش‌نمایش JSON'}
        </h3>
        <textarea
          value={viewMode === 'diff' ? diffContent : jsonPreview}
          onChange={(e) => viewMode === 'preview' && setJsonPreview(e.target.value)}
          readOnly={viewMode === 'diff'}
          className={`w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm ${
            viewMode === 'diff' 
              ? 'bg-gray-100 whitespace-pre' 
              : 'bg-white'
          }`}
          dir="ltr"
          placeholder="برای مشاهده محتوای فایل، روی &lsquo;تولید پیش‌نمایش&rsquo; کلیک کنید"
          style={viewMode === 'diff' ? {
            background: `linear-gradient(to right, 
              rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.1) 1ch, 
              rgba(0,255,0,0.1) 1ch, rgba(0,255,0,0.1) 2ch,
              transparent 2ch)`
          } : {}}
        />
      </div>

      {hasChangesState && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-orange-800 mb-2 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
            تغییرات نسبت به فایل اصلی شناسایی شد
          </h4>
          <p className="text-sm text-orange-700">
            محتوای فایل نسبت به نسخه ذخیره شده در دیسک تغییر کرده است. برای مشاهده دقیق تغییرات، روی &lsquo;مقایسه تغییرات&rsquo; کلیک کنید.
          </p>
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-yellow-800 mb-2">راهنمای استفاده</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• پس از ویرایش فایل‌ها، روی دکمه &lsquo;دانلود فایل&rsquo; کلیک کنید</li>
          <li>• فایل‌های دانلود شده را در پوشه src/data/ جایگزین کنید</li>
          <li>• تغییرات به صورت خودکار اعمال نمی‌شود و باید دستی انجام شود</li>
          <li>• پیش از جایگزینی، از فایل‌های فعلی نسخه پشتیبان تهیه کنید</li>
          <li>• مقایسه تغییرات همیشه با نسخه اصلی فایل در دیسک انجام می‌شود</li>
          <li>• در حالت مقایسه: خطوط قرمز (حذف شده) و سبز (اضافه شده) نشان داده می‌شوند</li>
        </ul>
      </div>
    </div>
  );
}