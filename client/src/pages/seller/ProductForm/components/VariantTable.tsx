import { Trash2 } from 'lucide-react';
import type { Variant, VariantAttribute } from '../utils/types';
import { regenerateSku } from '../utils/generateSku';

interface VariantTableProps {
  variants: Variant[];
  variantAttributes: VariantAttribute[];
  productName: string;
  onUpdateVariant: (index: number, updates: Partial<Variant>) => void;
  onDeleteVariant: (index: number) => void;
  onUpdateSku: (index: number, sku: string) => void;
}

export function VariantTable({
  variants,
  variantAttributes,
  productName,
  onUpdateVariant,
  onDeleteVariant,
  onUpdateSku,
}: VariantTableProps) {
  const attributeNames = variantAttributes.map(attr => attr.name);

  const handleAttributeChange = (
    index: number,
    attributeName: string,
    value: string,
    variant: Variant
  ) => {
    const newAttributes = { ...variant.attributes, [attributeName]: value };
    onUpdateVariant(index, { attributes: newAttributes });
    onUpdateSku(index, regenerateSku(productName, newAttributes));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {attributeNames.map(name => (
              <th
                key={name}
                className="px-4 py-3 text-left text-warm-gray text-sm font-body font-medium"
              >
                {name}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-warm-gray text-sm font-body font-medium w-32">
              Price *
            </th>
            <th className="px-4 py-3 text-left text-warm-gray text-sm font-body font-medium w-32">
              Original
            </th>
            <th className="px-4 py-3 text-left text-warm-gray text-sm font-body font-medium w-28">
              Stock *
            </th>
            <th className="px-4 py-3 text-left text-warm-gray text-sm font-body font-medium">
              SKU
            </th>
            <th className="px-4 py-3 text-center text-warm-gray text-sm font-body font-medium w-20">
              Default
            </th>
            <th className="px-4 py-3 text-center text-warm-gray text-sm font-body font-medium w-20">
              Active
            </th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, idx) => (
            <tr key={variant.id} className="border-b border-white/5 hover:bg-white/5">
              {attributeNames.map(attrName => (
                <td key={attrName} className="px-4 py-2">
                  <input
                    type="text"
                    value={variant.attributes[attrName] || ''}
                    onChange={(e) => handleAttributeChange(idx, attrName, e.target.value, variant)}
                    className="w-full px-2 py-1.5 bg-dark-base border border-white/10 rounded text-warm-white text-sm font-body focus:border-gold focus:outline-none"
                  />
                </td>
              ))}
              <td className="px-4 py-2">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-warm-gray text-xs">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={variant.price}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      const parts = val.split('.');
                      const formatted = parts.length > 2 
                        ? parts[0] + '.' + parts.slice(1).join('')
                        : val;
                      onUpdateVariant(idx, { price: formatted });
                    }}
                    className="w-full pl-6 pr-2 py-1.5 bg-dark-base border border-white/10 rounded text-warm-white text-sm font-body focus:border-gold focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-warm-gray text-xs">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={variant.originalPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      const parts = val.split('.');
                      const formatted = parts.length > 2 
                        ? parts[0] + '.' + parts.slice(1).join('')
                        : val;
                      onUpdateVariant(idx, { originalPrice: formatted });
                    }}
                    className="w-full pl-6 pr-2 py-1.5 bg-dark-base border border-white/10 rounded text-warm-white text-sm font-body focus:border-gold focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={variant.stock}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    onUpdateVariant(idx, { stock: val });
                  }}
                  className="w-full px-2 py-1.5 bg-dark-base border border-white/10 rounded text-warm-white text-sm font-body focus:border-gold focus:outline-none"
                  placeholder="0"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) => onUpdateSku(idx, e.target.value)}
                  className="w-full px-2 py-1.5 bg-dark-base border border-white/10 rounded text-warm-white text-sm font-body focus:border-gold focus:outline-none"
                  placeholder="auto"
                />
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="radio"
                  name={`default-${variant.id}`}
                  checked={variant.isDefault}
                  onChange={() => onUpdateVariant(idx, { isDefault: true })}
                  className="w-4 h-4 accent-gold"
                />
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={variant.isActive}
                  onChange={(e) => onUpdateVariant(idx, { isActive: e.target.checked })}
                  className="w-4 h-4 accent-gold"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => onDeleteVariant(idx)}
                  disabled={variants.length === 1}
                  className="p-1.5 text-warm-gray hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
