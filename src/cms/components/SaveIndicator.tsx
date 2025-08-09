'use client';

import React from 'react';
import { CheckIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useUIStore } from '../stores/ui';

export const SaveIndicator: React.FC = () => {
  const { saveStatus, saveMessage, lastSaved } = useUIStore();

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <ArrowPathIcon className="h-4 w-4 animate-spin" />;
      case 'saved':
        return <CheckIcon className="h-4 w-4" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'text-yellow-600 bg-yellow-50';
      case 'saved':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'در حال ذخیره...';
      case 'saved':
        return lastSaved ? `ذخیره شد - ${lastSaved.toLocaleTimeString('fa-IR')}` : 'ذخیره شد';
      case 'error':
        return saveMessage || 'خطا در ذخیره';
      default:
        return '';
    }
  };

  if (saveStatus === 'idle') {
    return null;
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="mr-2">{getStatusText()}</span>
    </div>
  );
};