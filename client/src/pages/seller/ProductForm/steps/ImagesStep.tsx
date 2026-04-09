import { ImageUploader } from '../components/ImageUploader';
import type { ProductFormState } from '../utils/types';
import { VISUAL_ATTRIBUTES, getVisualAttributeCombinations } from '../utils/types';

interface ImagesStepProps {
  state: ProductFormState;
  uploadProductImages: (files: File[]) => void;
  uploadVariantImages: (key: string, files: File[]) => void;
  removeProductImage: (index: number) => void;
  removeVariantImage: (key: string, index: number) => void;
}

export function ImagesStep({
  state,
  uploadProductImages,
  uploadVariantImages,
  removeProductImage,
  removeVariantImage,
}: ImagesStepProps) {
  if (!state.hasVariants) {
    return (
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">Product Images</h3>
        <p className="text-warm-gray text-sm font-body mb-4">
          Upload up to 5 images. The first image will be the main product image.
        </p>
        <ImageUploader
          images={state.productImages}
          onUpload={uploadProductImages}
          onRemove={removeProductImage}
          maxImages={5}
        />
      </div>
    );
  }

  const visualAttributes = state.variantAttributes.filter(attr =>
    VISUAL_ATTRIBUTES.includes(attr.name.toLowerCase())
  );

  const hasVisualAttributes = visualAttributes.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">Variant Images</h3>
        
        {!hasVisualAttributes ? (
          <div className="text-center py-8">
            <p className="text-warm-gray text-sm font-body mb-2">
              No visual attributes detected.
            </p>
            <p className="text-warm-gray text-xs font-body">
              Add attributes like Color, Design, or Pattern in the Variants step to upload variant-specific images.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {visualAttributes.length === 1 ? (
              <div className="border border-white/10 rounded-lg p-4">
                <h4 className="text-warm-white font-body font-medium mb-4">
                  {visualAttributes[0].name}
                </h4>
                <div className="space-y-4">
                  {visualAttributes[0].values.map(value => {
                    const key = `${visualAttributes[0].name.toLowerCase()}:${value}`;
                    const images = state.variantImageMap[key] || [];
                    return (
                      <div key={value}>
                        <label className="text-warm-gray text-sm font-body mb-2 block">
                          {value}
                        </label>
                        <ImageUploader
                          images={images}
                          onUpload={(files) => uploadVariantImages(key, files)}
                          onRemove={(index) => removeVariantImage(key, index)}
                          maxImages={5}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              getVisualAttributeCombinations(visualAttributes).map(combo => {
                const images = state.variantImageMap[combo.key] || [];
                return (
                  <div key={combo.key} className="border border-white/10 rounded-lg p-4">
                    <h4 className="text-warm-white font-body font-medium mb-4">
                      {combo.label}
                    </h4>
                    <ImageUploader
                      images={images}
                      onUpload={(files) => uploadVariantImages(combo.key, files)}
                      onRemove={(index) => removeVariantImage(combo.key, index)}
                      maxImages={5}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Product Images (shared across all variants) */}
      <div className="bg-dark-surface rounded-xl border border-white/5 p-6">
        <h3 className="text-lg font-display text-warm-white mb-4">
          General Product Images
        </h3>
        <p className="text-warm-gray text-sm font-body mb-4">
          These images will appear for the product regardless of variant selection.
        </p>
        <ImageUploader
          images={state.productImages}
          onUpload={uploadProductImages}
          onRemove={removeProductImage}
          maxImages={5}
        />
      </div>
    </div>
  );
}
