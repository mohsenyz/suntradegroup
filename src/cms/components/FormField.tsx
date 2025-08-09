'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'email' | 'tel';
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
}) => {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-md text-right
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          dir="rtl"
          className={baseInputClasses}
        />
      ) : (
        <input
          id={name}
          type={type}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          dir="rtl"
          className={baseInputClasses}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600" dir="rtl">
          {error.message}
        </p>
      )}
    </div>
  );
};