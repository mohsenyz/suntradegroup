'use client';

import React from 'react';
import { 
  ShareIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, description, url }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('لینک کپی شد!');
    } catch (err) {
      console.error('خطا در کپی کردن:', err);
    }
  };

  const shareData = {
    title,
    text: description,
    url
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('خطا در اشتراک‌گذاری:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <ShareIcon className="h-5 w-5 ml-2" />
        اشتراک‌گذاری
      </h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ShareIcon className="h-4 w-4" />
          اشتراک‌گذاری
        </button>
        
        <button
          onClick={shareOnTelegram}
          className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          تلگرام
        </button>
        
        <button
          onClick={shareOnWhatsApp}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          واتساپ
        </button>
        
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          کپی لینک
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;