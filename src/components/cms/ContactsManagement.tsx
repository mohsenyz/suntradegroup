'use client';

import React, { useState, useEffect } from 'react';
import { useCMSContext } from './CMSContext';

// Contact interface
interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
  timestamp: string;
  ip: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  user_agent?: string;
}

// Contacts Management Component
export default function ContactsManagement() {
  const { contactsData, updateContactsData } = useCMSContext();
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Data is loaded by CMSContext automatically
    setLoading(false);
  }, [contactsData]);

  const generateDownloadLink = () => {
    const jsonString = JSON.stringify(contactsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateContactStatus = (contactId: string, newStatus: Contact['status']) => {
    const newData = { ...contactsData };
    const contacts = newData.contacts as Contact[];
    if (contacts) {
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      if (contactIndex !== -1) {
        contacts[contactIndex] = { ...contacts[contactIndex], status: newStatus };
        updateContactsData(newData);
      }
    }
  };

  const deleteContact = (contactId: string) => {
    if (confirm('آیا از حذف این پیام اطمینان دارید؟')) {
      const newData = { ...contactsData };
      const contacts = newData.contacts as Contact[];
      if (contacts) {
        const filteredContacts = contacts.filter(c => c.id !== contactId);
        newData.contacts = filteredContacts;
        updateContactsData(newData);
      }
    }
  };

  const markAsRead = (contactId: string) => {
    updateContactStatus(contactId, 'read');
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">در حال بارگذاری پیام‌ها...</p>
      </div>
    );
  }

  const contacts = (contactsData?.contacts as Contact[]) || [];
  
  // Filter contacts based on status and search term
  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'جدید';
      case 'read': return 'خوانده شده';
      case 'responded': return 'پاسخ داده شده';
      case 'archived': return 'بایگانی شده';
      default: return status;
    }
  };

  const statusCounts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    responded: contacts.filter(c => c.status === 'responded').length,
    archived: contacts.filter(c => c.status === 'archived').length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">مدیریت پیام‌های تماس</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-gray-600">
            تعداد پیام‌ها: {contacts.length}
          </span>
          <button
            onClick={generateDownloadLink}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            دانلود فایل
          </button>
        </div>
      </div>

      {/* Status Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder="جستجو در نام، ایمیل یا پیام..."
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">فیلتر وضعیت</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">همه ({statusCounts.all})</option>
              <option value="new">جدید ({statusCounts.new})</option>
              <option value="read">خوانده شده ({statusCounts.read})</option>
              <option value="responded">پاسخ داده شده ({statusCounts.responded})</option>
              <option value="archived">بایگانی ({statusCounts.archived})</option>
            </select>
          </div>
        </div>
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'هیچ پیامی با این معیارها یافت نشد' 
              : 'هیچ پیام تماسی موجود نیست'
            }
          </h3>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      )}

      {filteredContacts.length > 0 && (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {getStatusText(contact.status)}
                    </span>
                    {contact.status === 'new' && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                        جدید!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>📧 {contact.email}</span>
                    {contact.phone && <span>📞 {contact.phone}</span>}
                    <span>🕐 {formatDate(contact.timestamp)}</span>
                  </div>
                  {contact.subject && (
                    <p className="text-sm text-gray-700 font-medium">موضوع: {contact.subject}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => setExpandedItem(expandedItem === contact.id ? null : contact.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    {expandedItem === contact.id ? 'بستن' : 'مشاهده'}
                  </button>
                  {contact.status === 'new' && (
                    <button
                      onClick={() => markAsRead(contact.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      خوانده شد
                    </button>
                  )}
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>

              {/* Message preview */}
              <div className="bg-gray-50 rounded-md p-3 mb-3">
                <p className="text-gray-700 text-right" dir="rtl">
                  {contact.message.length > 150 && expandedItem !== contact.id
                    ? `${contact.message.substring(0, 150)}...`
                    : contact.message
                  }
                </p>
              </div>

              {expandedItem === contact.id && (
                <div className="border-t pt-4 space-y-4">
                  {/* Full message */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">پیام کامل:</h4>
                    <div className="bg-white border rounded-md p-4">
                      <p className="text-gray-700 whitespace-pre-wrap text-right" dir="rtl">
                        {contact.message}
                      </p>
                    </div>
                  </div>

                  {/* Technical details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">جزئیات فنی:</h4>
                    <div className="bg-gray-50 rounded-md p-3 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <strong>شناسه:</strong> <span className="font-mono text-xs">{contact.id}</span>
                        </div>
                        <div>
                          <strong>آی‌پی:</strong> {contact.ip}
                        </div>
                        <div className="md:col-span-2">
                          <strong>مرورگر:</strong> <span className="font-mono text-xs">{contact.user_agent || 'نامشخص'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status management */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">تغییر وضعیت:</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateContactStatus(contact.id, 'new')}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          contact.status === 'new' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        جدید
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact.id, 'read')}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          contact.status === 'read' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        خوانده شده
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact.id, 'responded')}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          contact.status === 'responded' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        پاسخ داده شده
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact.id, 'archived')}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          contact.status === 'archived' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        بایگانی
                      </button>
                    </div>
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