

// Legacy interface for backward compatibility with existing components
export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  price: number;
  name: string;
  imageUrl?: string;
}

// Legacy interface for products
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
}


// Legacy interface for sale categories
export interface SaleCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  products: Product[];
}

// Interface for navigation categories with subcategories
export interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}