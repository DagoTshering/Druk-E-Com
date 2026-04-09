export interface ImageItem {
  url: string;
  publicId: string;
  isUploading: boolean;
}

export interface Variant {
  id: string;
  attributes: Record<string, string>;
  price: string;
  originalPrice: string;
  stock: string;
  sku: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface VariantAttribute {
  name: string;
  values: string[];
}

export interface ProductFormState {
  currentStep: number;
  completedSteps: Set<number>;
  name: string;
  description: string;
  categoryId: string;
  brand: string;
  tags: string[];
  hasVariants: boolean;
  variantAttributes: VariantAttribute[];
  variants: Variant[];
  productImages: ImageItem[];
  variantImageMap: Record<string, ImageItem[]>;
  isSubmitting: boolean;
}

export const VISUAL_ATTRIBUTES = ['color', 'design', 'pattern'];

export const COMMON_ATTRIBUTES = [
  { name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Color', values: [] },
  { name: 'Design', values: [] },
  { name: 'Pattern', values: [] },
  { name: 'Material', values: [] },
  { name: 'Style', values: [] },
];

export const STEPS = [
  { number: 0, label: 'Product Info' },
  { number: 1, label: 'Variants' },
  { number: 2, label: 'Images' },
  { number: 3, label: 'Review' },
] as const;

export function getImageMapKey(attributeName: string, attributeValue: string): string {
  return `${attributeName.toLowerCase()}:${attributeValue}`;
}
