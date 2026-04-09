function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateShortId(length: number = 4): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateSku(
  productName: string,
  attributes: Record<string, string>,
  customSku?: string
): string {
  if (customSku && customSku.trim()) {
    return customSku.trim();
  }

  const nameSlug = slugify(productName);

  const attributeValues = Object.values(attributes)
    .map(v => slugify(v))
    .filter(Boolean);

  const attributesSlug = attributeValues.join('-');

  const shortId = generateShortId();

  if (attributesSlug) {
    return `${nameSlug}-${attributesSlug}-${shortId}`;
  }

  return `${nameSlug}-${shortId}`;
}

export function regenerateSku(
  productName: string,
  attributes: Record<string, string>
): string {
  return generateSku(productName, attributes);
}
