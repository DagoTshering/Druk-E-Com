import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type {
  ProductFormState,
  Variant,
  VariantAttribute,
  ImageItem,
} from '../utils/types';
import { VISUAL_ATTRIBUTES, getImageMapKey } from '../utils/types';
import { generateVariants } from '../utils/generateVariants';
import { generateSku, regenerateSku } from '../utils/generateSku';
import { productsApi } from '@/apis/productsApi';

const initialVariant = (isDefault = true): Variant => ({
  id: Math.random().toString(36).substring(2, 11),
  attributes: {},
  price: '',
  originalPrice: '',
  stock: '',
  sku: '',
  isDefault,
  isActive: true,
});

const initialState: ProductFormState = {
  currentStep: 0,
  completedSteps: new Set(),
  name: '',
  description: '',
  categoryId: '',
  brand: '',
  tags: [],
  hasVariants: false,
  variantAttributes: [],
  variants: [initialVariant()],
  productImages: [],
  variantImageMap: {},
  isSubmitting: false,
};

export function useProductForm() {
  const [state, setState] = useState<ProductFormState>(initialState);

  const updateState = useCallback((updates: Partial<ProductFormState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const markStepCompleted = useCallback((step: number) => {
    setState(prev => {
      const newCompleted = new Set(prev.completedSteps);
      newCompleted.add(step);
      return { ...prev, completedSteps: newCompleted };
    });
  }, []);

  const validateStep1 = useCallback((): boolean => {
    if (!state.name.trim() || state.name.length < 2) {
      toast.error('Product name must be at least 2 characters');
      return false;
    }
    if (!state.description.trim() || state.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return false;
    }
    if (!state.categoryId) {
      toast.error('Please select a category');
      return false;
    }
    return true;
  }, [state.name, state.description, state.categoryId]);

  const validateStep2 = useCallback((): boolean => {
    if (!state.hasVariants) {
      if (!state.variants[0]?.price) {
        toast.error('Price is required');
        return false;
      }
      if (!state.variants[0]?.stock) {
        toast.error('Stock is required');
        return false;
      }
    } else {
      if (state.variantAttributes.length === 0) {
        toast.error('Please add at least one attribute');
        return false;
      }
      if (state.variantAttributes.some(attr => attr.values.length === 0)) {
        toast.error('Each attribute must have at least one value');
        return false;
      }
      if (state.variants.length === 0) {
        toast.error('Please generate variants');
        return false;
      }
      const invalidVariant = state.variants.find(v => !v.price || !v.stock);
      if (invalidVariant) {
        toast.error('All variants must have price and stock');
        return false;
      }
    }
    return true;
  }, [state.hasVariants, state.variantAttributes, state.variants]);

  const validateStep3 = useCallback((): boolean => {
    if (!state.hasVariants) {
      const completedImages = state.productImages.filter(img => !img.isUploading);
      if (completedImages.length === 0) {
        toast.error('Please upload at least one product image');
        return false;
      }
    } else {
      const visualAttributes = state.variantAttributes.filter(attr =>
        VISUAL_ATTRIBUTES.includes(attr.name.toLowerCase())
      );
      for (const attr of visualAttributes) {
        for (const value of attr.values) {
          const key = getImageMapKey(attr.name, value);
          const images = state.variantImageMap[key] || [];
          const completedImages = images.filter(img => !img.isUploading);
          if (completedImages.length === 0) {
            toast.error(`Please upload at least one image for ${attr.name}: ${value}`);
            return false;
          }
        }
      }
    }
    return true;
  }, [state.hasVariants, state.productImages, state.variantAttributes, state.variantImageMap]);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 0: return validateStep1();
      case 1: return validateStep2();
      case 2: return validateStep3();
      default: return true;
    }
  }, [validateStep1, validateStep2, validateStep3]);

  const canGoToStep = useCallback((step: number): boolean => {
    if (step < 0 || step > 3) return false;
    if (step === state.currentStep) return true;
    if (step < state.currentStep) return true;
    for (let i = 0; i < step; i++) {
      if (!state.completedSteps.has(i)) return false;
    }
    return false;
  }, [state.currentStep, state.completedSteps]);

  const nextStep = useCallback(() => {
    if (!validateStep(state.currentStep)) return;
    markStepCompleted(state.currentStep);
    if (state.currentStep < 3) {
      updateState({ currentStep: state.currentStep + 1 });
    }
  }, [state.currentStep, validateStep, markStepCompleted, updateState]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 0) {
      updateState({ currentStep: state.currentStep - 1 });
    }
  }, [state.currentStep, updateState]);

  const goToStep = useCallback((step: number) => {
    if (canGoToStep(step)) {
      updateState({ currentStep: step });
    }
  }, [canGoToStep, updateState]);

  const setName = useCallback((name: string) => updateState({ name }), [updateState]);
  const setDescription = useCallback((description: string) => updateState({ description }), [updateState]);
  const setCategoryId = useCallback((categoryId: string) => updateState({ categoryId }), [updateState]);
  const setBrand = useCallback((brand: string) => updateState({ brand }), [updateState]);
  const setHasVariants = useCallback((hasVariants: boolean) => {
    if (!hasVariants) {
      const singleVariant = initialVariant();
      singleVariant.sku = regenerateSku(state.name || 'product', {});
      updateState({
        hasVariants: false,
        variantAttributes: [],
        variants: [singleVariant],
        variantImageMap: {},
      });
    } else {
      updateState({
        hasVariants: true,
        variantAttributes: [],
        variants: [],
        variantImageMap: {},
      });
    }
  }, [updateState, state.name]);

  const addTag = useCallback((tag: string) => {
    setState(prev => {
      if (prev.tags.includes(tag)) return prev;
      return { ...prev, tags: [...prev.tags, tag] };
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setState(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }, []);

  const addVariantAttribute = useCallback((attribute: VariantAttribute) => {
    setState(prev => {
      const existing = prev.variantAttributes.find(
        a => a.name.toLowerCase() === attribute.name.toLowerCase()
      );
      if (existing) return prev;
      return { ...prev, variantAttributes: [...prev.variantAttributes, attribute] };
    });
  }, []);

  const removeVariantAttribute = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes.filter(a => a.name.toLowerCase() !== name.toLowerCase()),
    }));
  }, []);

  const updateVariantAttributeValues = useCallback((name: string, values: string[]) => {
    setState(prev => ({
      ...prev,
      variantAttributes: prev.variantAttributes.map(attr =>
        attr.name.toLowerCase() === name.toLowerCase() ? { ...attr, values } : attr
      ),
    }));
  }, []);

  const generateAllVariants = useCallback(() => {
    if (state.variantAttributes.length === 0) {
      toast.error('Please add at least one attribute with values');
      return;
    }
    if (state.variantAttributes.some(attr => attr.values.length === 0)) {
      toast.error('Each attribute must have at least one value');
      return;
    }

    const newVariants = generateVariants(state.variantAttributes, []);
    
    const variantsWithSku = newVariants.map(variant => ({
      ...variant,
      sku: generateSku(state.name || 'product', variant.attributes),
    }));

    const defaultIndex = 0;
    const variantsFinal = variantsWithSku.map((v, i) => ({
      ...v,
      isDefault: i === defaultIndex,
    }));

    updateState({ variants: variantsFinal });
    toast.success(`Generated ${variantsFinal.length} variants`);
  }, [state.variantAttributes, state.name, updateState]);

  const updateVariant = useCallback((index: number, updates: Partial<Variant>) => {
    setState(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], ...updates };

      if (updates.isDefault === true) {
        newVariants.forEach((v, i) => {
          v.isDefault = i === index;
        });
      }

      if (updates.attributes && prev.name) {
        newVariants[index].sku = regenerateSku(prev.name, newVariants[index].attributes);
      }

      return { ...prev, variants: newVariants };
    });
  }, []);

  const deleteVariant = useCallback((index: number) => {
    if (state.variants.length === 1) {
      toast.error('At least one variant is required');
      return;
    }
    setState(prev => {
      const newVariants = prev.variants.filter((_, i) => i !== index);
      if (newVariants.length > 0 && !newVariants.some(v => v.isDefault)) {
        newVariants[0].isDefault = true;
      }
      return { ...prev, variants: newVariants };
    });
  }, [state.variants.length]);

  const updateVariantSku = useCallback((index: number, sku: string) => {
    setState(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], sku };
      return { ...prev, variants: newVariants };
    });
  }, []);

  const uploadProductImages = useCallback(async (files: File[]) => {
    const maxImages = 5 - state.productImages.length;
    if (files.length > maxImages) {
      toast.error(`You can only upload ${maxImages} more images`);
      return;
    }

    const placeholders: ImageItem[] = files.map(() => ({
      url: '',
      publicId: '',
      isUploading: true,
    }));

    setState(prev => ({
      ...prev,
      productImages: [...prev.productImages, ...placeholders],
    }));

    try {
      const response = await productsApi.uploadImages(files);
      const { imageUrls } = response.data;

      setState(prev => {
        const updatedImages = [...prev.productImages];
        let placeholderIndex = 0;
        for (let i = 0; i < updatedImages.length; i++) {
          if (updatedImages[i].isUploading && imageUrls[placeholderIndex]) {
            const fullUrl = imageUrls[placeholderIndex];
            const publicId = `products/${fullUrl.split('/').pop()!.split('.')[0]}`;
            updatedImages[i] = {
              url: fullUrl,
              publicId,
              isUploading: false,
            };
            placeholderIndex++;
          }
        }
        return { ...prev, productImages: updatedImages };
      });

      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload images');
      setState(prev => ({
        ...prev,
        productImages: prev.productImages.filter(img => !img.isUploading),
      }));
    }
  }, [state.productImages.length]);

  const uploadVariantImages = useCallback(async (key: string, files: File[]) => {
    const existing = state.variantImageMap[key] || [];
    const maxImages = 5 - existing.length;
    if (files.length > maxImages) {
      toast.error(`You can only upload ${maxImages} more images`);
      return;
    }

    const placeholders: ImageItem[] = files.map(() => ({
      url: '',
      publicId: '',
      isUploading: true,
    }));

    setState(prev => ({
      ...prev,
      variantImageMap: { ...prev.variantImageMap, [key]: [...(prev.variantImageMap[key] || []), ...placeholders] },
    }));

    try {
      const response = await productsApi.uploadImages(files);
      const { imageUrls } = response.data;

      setState(prev => {
        const currentImages = prev.variantImageMap[key] || [];
        const updatedImages = [...currentImages];
        let placeholderIndex = 0;
        for (let i = 0; i < updatedImages.length; i++) {
          if (updatedImages[i].isUploading && imageUrls[placeholderIndex]) {
            const fullUrl = imageUrls[placeholderIndex];
            const publicId = `products/${fullUrl.split('/').pop()!.split('.')[0]}`;
            updatedImages[i] = {
              url: fullUrl,
              publicId,
              isUploading: false,
            };
            placeholderIndex++;
          }
        }
        return { ...prev, variantImageMap: { ...prev.variantImageMap, [key]: updatedImages } };
      });

      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload images');
      setState(prev => ({
        ...prev,
        variantImageMap: {
          ...prev.variantImageMap,
          [key]: (prev.variantImageMap[key] || []).filter(img => !img.isUploading),
        },
      }));
    }
  }, [state.variantImageMap]);

  const removeProductImage = useCallback(async (index: number) => {
    const image = state.productImages[index];
    if (!image.isUploading && image.publicId) {
      try {
        await productsApi.deleteImage(image.publicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }
    setState(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  }, [state.productImages]);

  const removeVariantImage = useCallback(async (key: string, index: number) => {
    const images = state.variantImageMap[key] || [];
    const image = images[index];
    if (!image.isUploading && image.publicId) {
      try {
        await productsApi.deleteImage(image.publicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }
    setState(prev => ({
      ...prev,
      variantImageMap: {
        ...prev.variantImageMap,
        [key]: (prev.variantImageMap[key] || []).filter((_, i) => i !== index),
      },
    }));
  }, [state.variantImageMap]);

  const buildSubmitPayload = useCallback(() => {
    const productImages = state.productImages
      .filter(img => !img.isUploading)
      .map(img => img.url);

    const variants = state.hasVariants
      ? state.variants.map(v => {
          const attrKey = getImageMapKey(
            Object.keys(v.attributes)[0],
            Object.values(v.attributes)[0]
          );
          const variantImages = (state.variantImageMap[attrKey] || [])
            .filter(img => !img.isUploading)
            .map(img => img.url);

          return {
            attributes: v.attributes,
            sku: v.sku || regenerateSku(state.name, v.attributes),
            price: v.price,
            originalPrice: v.originalPrice || undefined,
            stock: parseInt(v.stock, 10),
            isDefault: v.isDefault,
            isActive: v.isActive,
            images: variantImages.length > 0 ? variantImages : undefined,
          };
        })
      : [
          {
            attributes: {},
            sku: generateSku(state.name, {}),
            price: state.variants[0]?.price || '',
            originalPrice: state.variants[0]?.originalPrice || undefined,
            stock: parseInt(state.variants[0]?.stock || '0', 10),
            isDefault: true,
            isActive: true,
          },
        ];

    return {
      name: state.name,
      description: state.description,
      categoryId: state.categoryId,
      brand: state.brand || undefined,
      tags: state.tags,
      images: productImages,
      isFeatured: false,
      variants,
    };
  }, [state]);

  const submit = useCallback(async (): Promise<boolean> => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      return false;
    }

    updateState({ isSubmitting: true });

    try {
      const payload = buildSubmitPayload();
      await productsApi.createProduct(payload);
      toast.success('Product created successfully');
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create product');
      return false;
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [validateStep, buildSubmitPayload, updateState]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const isUploading = useMemo(() => {
    const productUploading = state.productImages.some(img => img.isUploading);
    const variantUploading = Object.values(state.variantImageMap).some(imgs =>
      imgs.some(img => img.isUploading)
    );
    return productUploading || variantUploading;
  }, [state.productImages, state.variantImageMap]);

  return {
    state,
    setState,
    updateState,
    validateStep,
    canGoToStep,
    nextStep,
    prevStep,
    goToStep,
    setName,
    setDescription,
    setCategoryId,
    setBrand,
    setHasVariants,
    addTag,
    removeTag,
    addVariantAttribute,
    removeVariantAttribute,
    updateVariantAttributeValues,
    generateAllVariants,
    updateVariant,
    deleteVariant,
    updateVariantSku,
    uploadProductImages,
    uploadVariantImages,
    removeProductImage,
    removeVariantImage,
    submit,
    reset,
    isUploading,
  };
}

export type UseProductFormReturn = ReturnType<typeof useProductForm>;
