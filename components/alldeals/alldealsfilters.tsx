"use client";

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AllDealsFilterValues,
  categoriesData,
  getSubcategories,
  storesData,
  brandsData,
  discountOptionsData,
  sortOptionsData,
} from '@/utils/alldealsconfig';

interface SheetFilters extends AllDealsFilterValues {}

interface AllDealsFiltersProps {
  filters: SheetFilters;
  onFiltersChange: (filters: SheetFilters) => void;
  onApply: () => void;
  onClear: () => void;
  activeFiltersCount: number;
  filteredDealsCount: number;
}

export default function AllDealsFilters({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  activeFiltersCount,
  filteredDealsCount,
}: AllDealsFiltersProps) {
  const availableSubcategories = getSubcategories(filters.category);
  const categories = Object.keys(categoriesData);

  return (
    <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
      <SheetHeader>
        <SheetTitle className="flex items-center text-lg justify-between">
          Filters & Sort
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear All
            </Button>
          )}
        </SheetTitle>
      </SheetHeader>
      <div className="pb-4 space-y-6">
        {/* Sort By */}
        <div>
          <h3 className="font-semibold mb-3">Sort By</h3>
          <Select
            value={filters.sortBy}
            onValueChange={(value: string) =>
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptionsData.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <h3 className="font-semibold mb-3">Category</h3>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                category: value === 'all' ? null : value,
                subcategory: null
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        {filters.category && availableSubcategories.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Subcategory</h3>
            <Select
              value={filters.subcategory || ''}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, subcategory: value === 'all' ? null : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {availableSubcategories.map(sub => (
                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Store */}
        <div>
          <h3 className="font-semibold mb-3">Store</h3>
          <Select
            value={filters.store || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, store: value === 'all' ? null : value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {storesData.map(store => (
                <SelectItem key={store} value={store}>{store}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div>
          <h3 className="font-semibold mb-3">Brand</h3>
          <Select
            value={filters.brand || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, brand: value === 'all' ? null : value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brandsData.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Discount */}
        <div>
          <h3 className="font-semibold mb-3">Discount Percentage</h3>
          <div className="flex gap-2 flex-wrap">
            {discountOptionsData.map(discount => (
              <button
                key={discount.value}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  filters.discount === discount.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border hover:bg-muted/80'
                }`}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    discount: filters.discount === discount.value ? null : discount.value
                  })
                }
              >
                {discount.label}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button className="w-full mt-4" onClick={onApply}>
          Apply Filters ({filteredDealsCount} deals)
        </Button>
      </div>
    </SheetContent>
  );
}
