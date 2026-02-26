// Profile configuration and static data
// Migrated from components/profile/config.ts

import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  Baby,
  Dog,
  Car,
  Gamepad2,
  BookOpen,
  ShoppingCart,
  Heart,
  type LucideIcon,
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: Laptop },
  { id: 'fashion', name: 'Fashion', icon: Shirt },
  { id: 'home', name: 'Home & Kitchen', icon: Home },
  { id: 'sports', name: 'Sports & Fitness', icon: Dumbbell },
  { id: 'beauty', name: 'Beauty', icon: Sparkles },
  { id: 'baby', name: 'Baby & Kids', icon: Baby },
  { id: 'pets', name: 'Pets', icon: Dog },
  { id: 'automotive', name: 'Automotive', icon: Car },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
  { id: 'grocery', name: 'Grocery', icon: ShoppingCart },
  { id: 'books', name: 'Books', icon: BookOpen },
  { id: 'health', name: 'Health & Wellness', icon: Heart },
];

export const brands: string[] = [
  "Apple",
  "Samsung",
  "Nike",
  "Sony",
  "Adidas",
  "LG",
  "Dell",
  "HP",
  "Puma",
  "Reebok"
];

export const stores: string[] = [
  "Amazon",
  "Best Buy",
  "Target",
  "Walmart",
  "Costco",
  "IKEA",
  "Sephora",
  "Macy's",
  "Home Depot",
  "Decathlon"
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

export const PROFILE_TABS = [
  { id: 'profile' as const, label: 'Profile' },
  { id: 'preferences' as const, label: 'Preferences' },
] as const;
