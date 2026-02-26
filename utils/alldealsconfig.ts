// All Deals Filter Configuration

export type FilterComponentType =
  | 'shadcn-select'
  | 'chip-group'
  | 'input'
  | 'range';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterValidation {
  min?: number;
  max?: number;
  message?: string;
}

export interface FilterRowConfig {
  fieldsPerRow?: number;
  startNewRow?: boolean;
}

export interface FilterConfig {
  label: string;
  name: string;
  component: FilterComponentType;
  type?: string;
  required?: boolean;
  validation?: FilterValidation;
  placeholder?: string;
  section?: string;
  rowConfig?: FilterRowConfig;
  options?: FilterOption[];
  defaultValue?: any;
  conditional?: {
    dependsOn: string;
    show: (value: any) => boolean;
  };
}

// Categories and their subcategories
export const categoriesData = {
  'Electronics': ['Phones', 'Laptops', 'TVs', 'Audio', 'Cameras', 'Accessories'],
  'Fashion': ['Men', 'Women', 'Kids', 'Shoes', 'Accessories', 'Watches'],
  'Home & Kitchen': ['Furniture', 'Appliances', 'Decor', 'Kitchen', 'Bedding'],
  'Beauty': ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
  'Sports': ['Fitness', 'Outdoor', 'Team Sports', 'Cycling'],
  'Toys': ['Action Figures', 'Board Games', 'Educational', 'Outdoor Toys'],
  'Health': ['Vitamins', 'Personal Care', 'Medical Supplies'],
  'Automotive': ['Parts', 'Accessories', 'Tools'],
};

// Get subcategories based on selected category
export const getSubcategories = (category: string | null): string[] => {
  if (!category) return [];
  return categoriesData[category as keyof typeof categoriesData] || [];
};

// Stores list
export const storesData = [
  'Amazon',
  'Best Buy',
  'Walmart',
  'Target',
  'Macy\'s',
  'Nike',
  'Adidas',
  'Home Depot',
  'Costco'
];

// Brands list
export const brandsData = [
  'Apple',
  'Samsung',
  'Sony',
  'Nike',
  'Adidas',
  'LG',
  'Dell',
  'HP',
  'Bose',
  'Dyson'
];

// Discount options
export const discountOptionsData = [
  { value: '10', label: '10%+ Off' },
  { value: '25', label: '25%+ Off' },
  { value: '50', label: '50%+ Off' },
  { value: '70', label: '70%+ Off' },
];

// Sort options
export const sortOptionsData = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Highest Discount' },
  { value: 'popular', label: 'Most Popular' },
];

// All Deals Filters Configuration
export const allDealsFiltersConfig: FilterConfig[] = [
  {
    label: "Sort By",
    name: "sortBy",
    component: "shadcn-select",
    required: false,
    defaultValue: "newest",
    options: sortOptionsData,
    placeholder: "Sort by",
    section: "sorting",
    rowConfig: {
      fieldsPerRow: 1,
      startNewRow: true
    }
  },
  {
    label: "Category",
    name: "category",
    component: "shadcn-select",
    required: false,
    options: [
      { value: 'all', label: 'All Categories' },
      ...Object.keys(categoriesData).map(cat => ({ value: cat, label: cat }))
    ],
    placeholder: "Select category",
    section: "filters",
    rowConfig: {
      fieldsPerRow: 1,
      startNewRow: true
    }
  },
  {
    label: "Subcategory",
    name: "subcategory",
    component: "shadcn-select",
    required: false,
    options: [], // Will be populated dynamically
    placeholder: "Select subcategory",
    section: "filters",
    rowConfig: {
      fieldsPerRow: 1,
      startNewRow: true
    },
    conditional: {
      dependsOn: "category",
      show: (categoryValue) => {
        return categoryValue && categoryValue !== 'all' && getSubcategories(categoryValue).length > 0;
      }
    }
  },
  {
    label: "Store",
    name: "store",
    component: "shadcn-select",
    required: false,
    options: [
      { value: 'all', label: 'All Stores' },
      ...storesData.map(store => ({ value: store, label: store }))
    ],
    placeholder: "Select store",
    section: "filters",
    rowConfig: {
      fieldsPerRow: 1,
      startNewRow: true
    }
  },
  {
    label: "Brand",
    name: "brand",
    component: "shadcn-select",
    required: false,
    options: [
      { value: 'all', label: 'All Brands' },
      ...brandsData.map(brand => ({ value: brand, label: brand }))
    ],
    placeholder: "Select brand",
    section: "filters",
    rowConfig: {
      fieldsPerRow: 1,
      startNewRow: true
    }
  },
  {
    label: "Discount Percentage",
    name: "discount",
    component: "chip-group",
    required: false,
    options: discountOptionsData,
    section: "filters",
    rowConfig: {
      fieldsPerRow: 1,
      startNewRow: true
    }
  },
];

// Export filter sections
export const filterSections = {
  sorting: 'sorting',
  filters: 'filters',
};

// Type for filter values
export type AllDealsFilterValues = {
  sortBy: string;
  category: string | null;
  subcategory: string | null;
  store: string | null;
  brand: string | null;
  discount: string | null;
};

// Default filter values
export const defaultFilterValues: AllDealsFilterValues = {
  sortBy: 'newest',
  category: null,
  subcategory: null,
  store: null,
  brand: null,
  discount: null,
};

// Top Filter Tabs Configuration
export type FilterTabType = 'all' | 'blackfriday' | 'yours' | 'hot' | 'new' | 'mostviewed';

export interface FilterTabConfig {
  id: FilterTabType;
  label: string;
  icon?: React.ReactNode;
}

export const filterTabsConfig: FilterTabConfig[] = [
  { id: 'all', label: 'All' },
  { id: 'blackfriday', label: 'Black Friday' },
  { id: 'yours', label: 'Yours' },
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New Today' },
  { id: 'mostviewed', label: 'Most Viewed' },
];

// Filter logic for each tab type
export const applyTabFilter = (deals: any[], filterType: FilterTabType): any[] => {
  const now = new Date().getTime();

  switch (filterType) {
    case 'all':
      return deals;

    case 'blackfriday':
      return deals.filter(d =>
        d.badges?.includes('flash') ||
        d.badges?.includes('hot') ||
        d.discountPercent >= 40
      );

    case 'yours':
      return deals.filter(d => d.isTrending);

    case 'hot':
      return deals.filter(d => d.isHot || d.badges?.includes('hot'));

    case 'new':
      return deals.filter(d => {
        const postedTime = new Date(d.postedAt).getTime();
        return now - postedTime < 24 * 60 * 60 * 1000;
      });

    case 'mostviewed':
      return deals.sort((a, b) =>
        (b.discountPercent + (b.isTrending ? 20 : 0)) -
        (a.discountPercent + (a.isTrending ? 20 : 0))
      );

    default:
      return deals;
  }
};

// Apply sidebar filters
export const applySidebarFilters = (deals: any[], filters: AllDealsFilterValues): any[] => {
  let filteredDeals = [...deals];

  if (filters.category) {
    filteredDeals = filteredDeals.filter(d =>
      d.category?.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters.store) {
    filteredDeals = filteredDeals.filter(d =>
      d.store?.toLowerCase() === filters.store?.toLowerCase()
    );
  }

  if (filters.brand) {
    filteredDeals = filteredDeals.filter(d =>
      d.brand?.toLowerCase() === filters.brand?.toLowerCase()
    );
  }

  if (filters.discount) {
    const discountVal = parseInt(filters.discount);
    if (!isNaN(discountVal)) {
      filteredDeals = filteredDeals.filter(d => d.discountPercent >= discountVal);
    }
  }

  return filteredDeals;
};

// Apply sorting
export const applySorting = (deals: any[], sortBy: string): any[] => {
  const sortedDeals = [...deals];

  switch (sortBy) {
    case 'price-low':
      return sortedDeals.sort((a, b) => a.salePrice - b.salePrice);

    case 'price-high':
      return sortedDeals.sort((a, b) => b.salePrice - a.salePrice);

    case 'discount':
      return sortedDeals.sort((a, b) => b.discountPercent - a.discountPercent);

    case 'popular':
      return sortedDeals.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));

    case 'newest':
    default:
      return sortedDeals.sort((a, b) =>
        new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
  }
};
