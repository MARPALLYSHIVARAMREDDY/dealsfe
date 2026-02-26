import React from "react";

/**
 * Utility functions for preference management
 * These helpers can be used across different components
 */

/**
 * Get category name by ID
 * @param id - Category ID
 * @param catalogueCategories - Array of categories from catalogue
 * @returns Category name or the ID if not found
 */
export const getCategoryName = (id: string, catalogueCategories: any[]): string => {
  return catalogueCategories.find((c) => c.id === id)?.name || id;
};

/**
 * Get category object by ID
 * @param id - Category ID
 * @param catalogueCategories - Array of categories from catalogue
 * @returns Category object or null if not found
 */
export const getCategoryById = (id: string, catalogueCategories: any[]) => {
  return catalogueCategories.find((c) => c.id === id) || null;
};

/**
 * Validate if a category ID exists
 * @param id - Category ID
 * @param catalogueCategories - Array of categories from catalogue
 * @returns True if category exists
 */
export const isCategoryValid = (id: string, catalogueCategories: any[]): boolean => {
  return catalogueCategories.some((c) => c.id === id);
};

/**
 * Filter invalid categories from a list
 * @param categoryIds - Array of category IDs
 * @param catalogueCategories - Array of categories from catalogue
 * @returns Array of valid category IDs only
 */
export const filterValidCategories = (categoryIds: string[], catalogueCategories: any[]): string[] => {
  return categoryIds.filter(id => isCategoryValid(id, catalogueCategories));
};

/**
 * Extract IDs from preference items which might be objects or strings
 * @param items - Array of items (strings or objects with id property)
 * @returns Array of ID strings
 */
export const extractPreferenceIds = (items: any[] | undefined): string[] => {
  if (!items) return [];
  return items.map((item) =>
    typeof item === "object" && item !== null && "id" in item
      ? item.id
      : String(item)
  );
};
