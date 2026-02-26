import { create } from 'zustand';

export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
  cta?: string;
}

interface ProductDetailStore {
  isOpen: boolean;
  product: ProductDetail | null;
  openProductDetail: (product: ProductDetail) => void;
  closeProductDetail: () => void;
}

export const useProductDetailStore = create<ProductDetailStore>((set) => ({
  isOpen: false,
  product: null,
  openProductDetail: (product) => set({ isOpen: true, product }),
  closeProductDetail: () => set({ isOpen: false, product: null }),
}));
