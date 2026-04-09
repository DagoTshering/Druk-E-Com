import React from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { VariantTable } from '../components/VariantTable';
import { AttributeChipInput } from '../components/AttributeChipInput';
import type { VariantAttribute, ProductFormState, Variant } from '../utils/types';
import { COMMON_ATTRIBUTES, VISUAL_ATTRIBUTES } from '../utils/types';

interface VariantsStepProps {
  state: ProductFormState;
  addVariantAttribute: (attribute: VariantAttribute) => void;
  removeVariantAttribute: (name: string) => void;
  updateVariantAttributeValues: (name: string, values: string[]) => void;
  generateAllVariants: () => void;
  updateVariant: (index: number, updates: Partial<Variant>) => void;
  deleteVariant: (index: number) => void;
  updateVariantSku: (index: number, sku: string) => void;
  setHasVariants: (value: boolean) => void;
}

export function VariantsStep({
  state,
  addVariantAttribute,
  removeVariantAttribute,
  updateVariantAttributeValues,
  generateAllVariants,
  updateVariant,
  deleteVariant,
  updateVariantSku,
  setHasVariants,
}: VariantsStepProps) {
  const [attributeDialogOpen, setAttributeDialogOpen] = React.useState(false);
  const [selectedAttribute, setSelectedAttribute] = React.useState<string>('');

  const availableAttributes = COMMON_ATTRIBUTES.filter(
    common => !state.variantAttributes.some(
      existing => existing.name.toLowerCase() === common.name.toLowerCase()
    )
  );

  return (
    <div className="space-y-6">
      {/* Variant Mode Toggle */}
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">Product Type</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="variantMode"
              checked={!state.hasVariants}
              onChange={() => setHasVariants(false)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-warm-white font-body">Single Product (No Variants)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="variantMode"
              checked={state.hasVariants}
              onChange={() => setHasVariants(true)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-warm-white font-body">Multiple Variants</span>
          </label>
        </div>
      </div>

      {/* Single Product Fields */}
      {!state.hasVariants && state.variants.length > 0 && (
        <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-display text-warm-white mb-4">Pricing & Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-warm-gray text-sm font-body mb-2">Price *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={state.variants[0].price}
                  onChange={(e) => updateVariant(0, { price: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                />
              </div>
            </div>
            <div>
              <label className="block text-warm-gray text-sm font-body mb-2">Stock *</label>
              <input
                type="number"
                min="0"
                value={state.variants[0].stock}
                onChange={(e) => updateVariant(0, { stock: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
              />
            </div>
            <div>
              <label className="block text-warm-gray text-sm font-body mb-2">SKU (Auto-generated)</label>
              <input
                type="text"
                value={state.variants[0].sku}
                onChange={(e) => updateVariantSku(0, e.target.value)}
                placeholder="auto-generated"
                className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
              />
            </div>
          </div>
        </div>
      )}

      {/* Multiple Variants Section */}
      {state.hasVariants && (
        <>
          {/* Attribute Selection */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display text-warm-white">Variant Attributes</h3>
              <button
                type="button"
                onClick={() => setAttributeDialogOpen(true)}
                disabled={availableAttributes.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-dark-base rounded-lg text-sm font-body font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Attribute
              </button>
            </div>

            {state.variantAttributes.length === 0 ? (
              <p className="text-warm-gray text-sm font-body py-4 text-center">
                No attributes added. Click "Add Attribute" to start.
              </p>
            ) : (
              <div className="space-y-4">
                {state.variantAttributes.map(attr => (
                  <div key={attr.name} className="border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-warm-white font-body font-medium">{attr.name}</span>
                      {VISUAL_ATTRIBUTES.includes(attr.name.toLowerCase()) && (
                        <span className="text-xs text-gold px-2 py-0.5 bg-gold/20 rounded">Visual</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeVariantAttribute(attr.name)}
                        className="text-warm-gray hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <AttributeChipInput
                      label=""
                      values={attr.values}
                      onValuesChange={(values) => updateVariantAttributeValues(attr.name, values)}
                      placeholder={`Add ${attr.name.toLowerCase()} value`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Variants Button */}
          {state.variantAttributes.length > 0 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={generateAllVariants}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Generate Variants
              </button>
            </div>
          )}

          {/* Variant Table */}
          {state.variants.length > 0 && (
            <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-display text-warm-white mb-4">
                Generated Variants ({state.variants.length})
              </h3>
              <VariantTable
                variants={state.variants}
                variantAttributes={state.variantAttributes}
                productName={state.name}
                onUpdateVariant={updateVariant}
                onDeleteVariant={deleteVariant}
                onUpdateSku={updateVariantSku}
              />
            </div>
          )}
        </>
      )}

      {/* Add Attribute Dialog */}
      <Dialog open={attributeDialogOpen} onOpenChange={setAttributeDialogOpen}>
        <DialogContent className="bg-dark-surface border-white/10">
          <DialogHeader>
            <DialogTitle className="text-warm-white">Add Attribute</DialogTitle>
            <DialogDescription className="text-warm-gray">
              Select an attribute type to add to your variants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {availableAttributes.map(attr => (
              <button
                key={attr.name}
                type="button"
                onClick={() => {
                  setSelectedAttribute(attr.name);
                  addVariantAttribute({ name: attr.name, values: [] });
                  setAttributeDialogOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  selectedAttribute === attr.name
                    ? 'border-gold bg-gold/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-warm-white font-body">{attr.name}</span>
                {attr.values.length > 0 && (
                  <span className="block text-warm-gray text-xs mt-1">
                    Suggested: {attr.values.join(', ')}
                  </span>
                )}
              </button>
            ))}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setAttributeDialogOpen(false)}
              className="px-4 py-2 border border-white/20 text-warm-white rounded-lg hover:bg-white/5"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
