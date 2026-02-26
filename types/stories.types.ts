// Product within a story
export interface StoryProduct {
  id: string
  title: string
  description: string
  price: string // Formatted price (e.g., "$99.99")
  originalPrice?: string // Formatted original price
  discount?: number // Percentage (e.g., 50)
  imageUrl?: string // Product/deal image
  badges?: Array<{
    type: 'hot' | 'new' | 'limited' | 'flash'
    label: string
  }>
}

// Story/Store item
export interface Story {
  id: string
  name: string
  imageUrl: string
  icon?: string // Emoji or icon
  timeAgo?: string // e.g., "2h", "1d"
  status?: 'new' | 'expiring' | 'active'
  products: StoryProduct[]
}

// Status badge configuration
export interface StatusBadgeConfig {
  status: 'new' | 'expiring' | 'active'
  label: string
  color: string // Tailwind class (e.g., 'bg-red-400')
  gradient: string // Tailwind gradient classes
}

// Status badge configuration map
export type StatusBadgeConfigMap = {
  [key in 'new' | 'expiring' | 'active']: StatusBadgeConfig
}

// Callback function types
export type OnStoryClickCallback = (storyIndex: number, story: Story) => void
export type OnCloseCallback = () => void
export type OnStoryActionClickCallback = (product: StoryProduct, story: Story) => void

// Main Stories component props
export interface StoriesProps {
  // Data
  stories: Story[]

  // Loading & Error states
  isLoading?: boolean
  error?: string | null

  // Callbacks
  onStoryClick?: OnStoryClickCallback
  onClose?: OnCloseCallback
  onStoryActionClick?: OnStoryActionClickCallback

  // Configuration
  statusBadgeConfig?: Partial<StatusBadgeConfigMap>

  // Optional customization
  className?: string
  showStatusBadge?: boolean
  showNewIndicator?: boolean
}

// StoryViewer component props
export interface StoryViewerProps {
  stores: Story[]
  initialStoreIndex: number

  // Callbacks
  onClose: OnCloseCallback
  onStoryActionClick?: OnStoryActionClickCallback

  // Configuration
  autoAdvanceInterval?: number // Default: 5000ms
  showNavigationArrows?: boolean // Default: true
  showStoreDots?: boolean // Default: true
}

// ============================================
// API Response Types
// ============================================

// API Response structure from backend
export interface StoriesApiResponse {
  status: number
  message: string
  data: {
    stories: ApiStory[]
  }
}

// Story structure from API
export interface ApiStory {
  id: string
  name: string
  slug: string
  iconUrl: string
  displayOrder: number
  country: string | null
  deals: ApiDeal[]
}

// Deal structure from API
export interface ApiDeal {
  id: string
  title: string
  slug: string | null
  dealUrl: string
  affiliateUrl: string
  regularPrice: string
  dealPrice: string
  percentageOff: string | null
  images: string[]
  store: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  }
  tags: Array<{
    id: string
    name: string
  }>
  coupons: Array<{
    id: string
    image: string | null
    title: string
    code: string
  }>
}

// ============================================
// Progress Tracking Types
// ============================================

// Progress data for a single story
export interface StoryProgress {
  storyId: string
  viewedProductIds: string[]
  totalProducts: number
  lastViewedAt: string
}

// Root progress data structure stored in localStorage
export interface StoryProgressData {
  version: number
  stories: Record<string, StoryProgress>
}

// Calculated progress statistics for a story
export interface StoryProgressStats {
  viewedCount: number
  totalCount: number
  percentage: number  // 0-100
  isComplete: boolean
}
