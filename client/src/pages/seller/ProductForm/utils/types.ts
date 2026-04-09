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
  lowStockThreshold: number;
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

export function getImageMapKey(
  attributeNameOrPairs: string | [string, string][],
  attributeValue?: string
): string {
  if (Array.isArray(attributeNameOrPairs)) {
    return attributeNameOrPairs
      .map(([name, value]) => `${name.toLowerCase()}:${value}`)
      .join('|');
  }
  return `${attributeNameOrPairs.toLowerCase()}:${attributeValue}`;
}

export interface VisualAttributeCombination {
  key: string;
  label: string;
  attributes: Record<string, string>;
}

function cartesianProduct(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [[]];
  if (arrays.length === 1) return arrays[0].map(item => [item]);
  const result: string[][] = [];
  const [first, ...rest] = arrays;
  const restCombinations = cartesianProduct(rest);
  for (const item of first) {
    for (const combination of restCombinations) {
      result.push([item, ...combination]);
    }
  }
  return result;
}

export function getVisualAttributeCombinations(
  visualAttributes: VariantAttribute[]
): VisualAttributeCombination[] {
  if (visualAttributes.length === 0) return [];
  if (visualAttributes.length === 1) {
    return visualAttributes[0].values.map(value => ({
      key: getImageMapKey(visualAttributes[0].name, value),
      label: value,
      attributes: { [visualAttributes[0].name]: value },
    }));
  }

  const names = visualAttributes.map(a => a.name);
  const valueArrays = visualAttributes.map(a => a.values);
  const combinations = cartesianProduct(valueArrays);

  return combinations.map(values => {
    const attributes: Record<string, string> = {};
    names.forEach((name, i) => {
      attributes[name] = values[i];
    });
    const pairs: [string, string][] = names.map((name, i) => [name, values[i]]);
    return {
      key: getImageMapKey(pairs),
      label: values.join(' + '),
      attributes,
    };
  });
}
