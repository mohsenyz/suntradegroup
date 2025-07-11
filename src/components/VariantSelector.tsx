'use client';

import React, { useState, useEffect } from 'react';
import { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant) => void;
  defaultVariant?: ProductVariant;
  productCurrency?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ 
  variants, 
  onVariantChange, 
  defaultVariant,
  productCurrency 
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    defaultVariant || variants.find(v => v.isDefault) || variants[0]
  );

  useEffect(() => {
    onVariantChange(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  const getVariantGroups = () => {
    const groups: { [key: string]: { label: string; variants: ProductVariant[] } } = {};

    variants.forEach(variant => {
      if (variant.size) {
        if (!groups.size) groups.size = { label: 'سایز', variants: [] };
        if (!groups.size.variants.find(v => v.size === variant.size)) {
          groups.size.variants.push(variant);
        }
      }
      if (variant.color) {
        if (!groups.color) groups.color = { label: 'رنگ', variants: [] };
        if (!groups.color.variants.find(v => v.color === variant.color)) {
          groups.color.variants.push(variant);
        }
      }
      if (variant.material) {
        if (!groups.material) groups.material = { label: 'جنس', variants: [] };
        if (!groups.material.variants.find(v => v.material === variant.material)) {
          groups.material.variants.push(variant);
        }
      }
      if (variant.finish) {
        if (!groups.finish) groups.finish = { label: 'نوع پرداخت', variants: [] };
        if (!groups.finish.variants.find(v => v.finish === variant.finish)) {
          groups.finish.variants.push(variant);
        }
      }
      if (variant.edition) {
        if (!groups.edition) groups.edition = { label: 'ادیشن', variants: [] };
        if (!groups.edition.variants.find(v => v.edition === variant.edition)) {
          groups.edition.variants.push(variant);
        }
      }
    });

    return groups;
  };

  const getMatchingVariant = (attribute: string, value: string) => {
    return variants.find(variant => {
      const currentAttrs = {
        size: selectedVariant.size || '',
        color: selectedVariant.color || '',
        material: selectedVariant.material || '',
        finish: selectedVariant.finish || '',
        edition: selectedVariant.edition || ''
      };
      
      currentAttrs[attribute as keyof typeof currentAttrs] = value;
      
      return variant.size === currentAttrs.size &&
             variant.color === currentAttrs.color &&
             variant.material === currentAttrs.material &&
             variant.finish === currentAttrs.finish &&
             variant.edition === currentAttrs.edition;
    });
  };

  const handleAttributeChange = (attribute: string, value: string) => {
    const matchingVariant = getMatchingVariant(attribute, value);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    } else {
      // If no exact match, find a variant with the selected attribute value
      const variantWithAttribute = variants.find(variant => 
        variant[attribute as keyof ProductVariant] === value
      );
      if (variantWithAttribute) {
        setSelectedVariant(variantWithAttribute);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const variantGroups = getVariantGroups();

  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className="variant-selector space-y-4">
      {Object.entries(variantGroups).map(([groupKey, group]) => (
        <div key={groupKey} className="variant-group">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {group.label}:
          </h4>
          <div className="flex flex-wrap gap-2">
            {group.variants.map((variant) => {
              const isSelected = selectedVariant[groupKey as keyof ProductVariant] === 
                                variant[groupKey as keyof ProductVariant];
              const isAvailable = variant.availability && variant.stock > 0;
              
              return (
                <button
                  key={variant.id}
                  onClick={() => handleAttributeChange(groupKey, variant[groupKey as keyof ProductVariant] as string)}
                  className={`
                    px-3 py-2 text-sm rounded-md border transition-all
                    ${isSelected 
                      ? 'border-golden-500 bg-golden-50 text-golden-700 font-semibold' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-golden-300'
                    }
                    ${!isAvailable 
                      ? 'opacity-70 bg-gray-50 hover:bg-gray-100' 
                      : 'hover:bg-golden-50'
                    }
                  `}
                >
                  {String(variant[groupKey as keyof ProductVariant])}
                  {!isAvailable && productCurrency !== "تماس بگیرید" && (
                    <span className="text-xs block text-red-500">
                      ناموجود
                    </span>
                  )}
                  {variant.priceModifier !== 0 && (
                    <span className="text-xs block">
                      {variant.priceModifier > 0 ? '+' : ''}
                      {formatPrice(variant.priceModifier)} تومان
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="variant-info bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">انتخاب شده:</span>
          <span className="font-semibold text-gray-800">{selectedVariant.name}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">کد محصول:</span>
          <span className="text-sm font-medium text-gray-800">{selectedVariant.sku}</span>
        </div>

        {productCurrency !== "تماس بگیرید" && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">موجودی:</span>
            <span className={`text-sm font-medium ${
              selectedVariant.stock > 5 ? 'text-green-600' : 
              selectedVariant.stock > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} عدد` : 'ناموجود'}
            </span>
          </div>
        )}

        {selectedVariant.isLimited && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <span className="text-sm text-red-700 font-medium">
              ادیشن محدود - تنها {selectedVariant.limitedQuantity} عدد تولید شده
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantSelector;