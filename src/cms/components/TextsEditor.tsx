'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTexts, useSaveTexts } from '../api/client';
import { FormField } from './FormField';
import { SaveIndicator } from './SaveIndicator';
import { useAutoSave } from '../hooks/useAutoSave';

interface TextsEditorProps {
  category: 'common' | 'pages' | 'forms';
}

export const TextsEditor: React.FC<TextsEditorProps> = ({ category }) => {
  const { data: textsData, isLoading, error } = useTexts(category);
  const saveTextsMutation = useSaveTexts(category);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, watch, setValue, handleSubmit } = useForm<Record<string, string>>({
    defaultValues: {},
  });

  const formData = watch();

  // Initialize form with loaded data
  useEffect(() => {
    if (textsData) {
      const flatData = flattenObject(textsData);
      Object.entries(flatData).forEach(([key, value]) => {
        setValue(key, value as string);
      });
    }
  }, [textsData, setValue]);

  // Auto-save functionality
  const { saveNow } = useAutoSave({
    onSave: async (data) => {
      const nestedData = unflattenObject(data);
      await saveTextsMutation.mutateAsync(nestedData);
    },
    data: formData,
    enabled: Object.keys(formData).length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">خطا در بارگذاری داده‌ها: {error.message}</p>
      </div>
    );
  }

  if (!textsData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">داده‌ای یافت نشد</p>
      </div>
    );
  }

  const flatData = flattenObject(textsData);
  const filteredEntries = Object.entries(flatData).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            ویرایش متون {getCategoryLabel(category)}
          </h3>
          <p className="text-sm text-gray-600">
            {filteredEntries.length} مورد از {Object.keys(flatData).length} مورد
          </p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <SaveIndicator />
          <button
            onClick={saveNow}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            ذخیره دستی
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="جستجو در متون..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit(saveNow)} className="space-y-4">
        {filteredEntries.map(([key, value]) => (
          <FormField
            key={key}
            name={key}
            label={getFieldLabel(key)}
            type={getFieldType(key, value as string)}
            placeholder={`مقدار برای ${key}`}
            register={register}
            rows={getFieldType(key, value as string) === 'textarea' ? 4 : undefined}
          />
        ))}
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هیچ نتیجه‌ای برای "{searchTerm}" یافت نشد
          </div>
        )}
      </form>
    </div>
  );
};

// Helper functions
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

function unflattenObject(obj: Record<string, any>): any {
  const unflattened: any = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current = unflattened;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  return unflattened;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    common: 'عمومی',
    pages: 'صفحات',
    forms: 'فرم‌ها',
  };
  return labels[category] || category;
}

function getFieldLabel(key: string): string {
  return key.split('.').pop() || key;
}

function getFieldType(key: string, value: string): 'text' | 'textarea' {
  if (typeof value === 'string' && value.length > 50) {
    return 'textarea';
  }
  return 'text';
}