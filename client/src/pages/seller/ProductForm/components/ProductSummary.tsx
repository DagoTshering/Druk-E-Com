import type { ProductFormState } from '../utils/types';
import { getImageMapKey, VISUAL_ATTRIBUTES } from '../utils/types';

interface ProductSummaryProps {
  state: ProductFormState;
  categories: Array<{ id: string; name: string }>;
}

export function ProductSummary({ state, categories }: ProductSummaryProps) {
  const category = categories.find(c => c.id === state.categoryId);

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">Product Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-warm-gray text-sm font-body">Name</span>
            <p className="text-warm-white font-body">{state.name}</p>
          </div>
          <div>
            <span className="text-warm-gray text-sm font-body">Category</span>
            <p className="text-warm-white font-body">{category?.name || 'N/A'}</p>
          </div>
          {state.brand && (
            <div>
              <span className="text-warm-gray text-sm font-body">Brand</span>
              <p className="text-warm-white font-body">{state.brand}</p>
            </div>
          )}
          <div>
            <span className="text-warm-gray text-sm font-body">Tags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {state.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-dark-elevated text-warm-white text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-warm-gray text-sm font-body">Description</span>
            <p className="text-warm-white font-body text-sm mt-1">{state.description}</p>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">
          Variants ({state.variants.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-warm-gray font-body">Attributes</th>
                <th className="text-left py-2 text-warm-gray font-body">Price</th>
                <th className="text-left py-2 text-warm-gray font-body">Original</th>
                <th className="text-left py-2 text-warm-gray font-body">Stock</th>
                <th className="text-left py-2 text-warm-gray font-body">SKU</th>
                <th className="text-left py-2 text-warm-gray font-body">Default</th>
              </tr>
            </thead>
            <tbody>
              {state.variants.map(variant => (
                <tr key={variant.id} className="border-b border-white/5">
                  <td className="py-2 text-warm-white">
                    {Object.entries(variant.attributes)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')}
                  </td>
                  <td className="py-2 text-warm-white">${variant.price}</td>
                  <td className="py-2 text-warm-gray">
                    {variant.originalPrice ? `$${variant.originalPrice}` : '-'}
                  </td>
                  <td className="py-2 text-warm-white">{variant.stock}</td>
                  <td className="py-2 text-warm-gray text-xs">{variant.sku}</td>
                  <td className="py-2">{variant.isDefault && <span className="text-gold">★</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Images */}
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">
          Images ({state.hasVariants ? 'Variant-based' : 'Product Images'}
        </h3>

        {!state.hasVariants ? (
          <div className="grid grid-cols-4 gap-3">
            {state.productImages
              .filter(img => !img.isUploading)
              .map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {state.variantAttributes
              .filter(attr => VISUAL_ATTRIBUTES.includes(attr.name.toLowerCase()))
              .map(attr => (
                <div key={attr.name}>
                  <h4 className="text-warm-white font-body font-medium mb-2">{attr.name}</h4>
                  <div className="space-y-3">
                    {attr.values.map(value => {
                      const key = getImageMapKey(attr.name, value);
                      const images = state.variantImageMap[key] || [];
                      return (
                        <div key={value}>
                          <span className="text-warm-gray text-sm">{value}</span>
                          <div className="grid grid-cols-4 gap-2 mt-1">
                            {images
                              .filter(img => !img.isUploading)
                              .map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
