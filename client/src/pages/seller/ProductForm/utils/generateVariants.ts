import type { Variant, VariantAttribute } from './types';

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

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function generateVariants(
  variantAttributes: VariantAttribute[],
  existingVariants?: Variant[]
): Variant[] {
  if (variantAttributes.length === 0) {
    return [];
  }

  const attributeNames = variantAttributes.map(attr => attr.name);
  const attributeValueArrays = variantAttributes.map(attr => attr.values);

  if (attributeValueArrays.some(arr => arr.length === 0)) {
    return [];
  }

  const combinations = cartesianProduct(attributeValueArrays);

  const newVariants: Variant[] = combinations.map((values, index) => {
    const attributes: Record<string, string> = {};
    attributeNames.forEach((name, i) => {
      attributes[name] = values[i];
    });

    const existingVariant = existingVariants?.find(existing => {
      return Object.keys(existing.attributes).every(
        key => existing.attributes[key] === attributes[key]
      ) && Object.keys(attributes).every(
        key => existing.attributes[key] === attributes[key]
      );
    });

    return {
      id: existingVariant?.id || generateId(),
      attributes,
      price: existingVariant?.price || '',
      originalPrice: existingVariant?.originalPrice || '',
      stock: existingVariant?.stock || '',
      sku: existingVariant?.sku || '',
      isDefault: existingVariant?.isDefault ?? index === 0,
      isActive: existingVariant?.isActive ?? true,
      lowStockThreshold: existingVariant?.lowStockThreshold ?? 5,
    };
  });

  return newVariants;
}
