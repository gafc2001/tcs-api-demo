export const PRODUCT_TYPE = {
  PREMIUM: 'premium',
  BASIC: 'basic',
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];
