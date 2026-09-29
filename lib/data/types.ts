export type Product = {
  id: string;
  name: string;
  brand?: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  images?: string[]; 
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  description?: string;
};