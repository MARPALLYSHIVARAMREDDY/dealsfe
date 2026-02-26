import type { Deal } from '@/types/alldeals.types'
import type { Story, StoryProduct, ApiStory, ApiDeal } from '@/types/stories.types'

export const transformStories = (data: unknown): Story[] => {
  if (!Array.isArray(data)) return []
  return data.map((store) => transformStoryForCard(store)).filter((s): s is Story => Boolean(s))
}

export const transformStoryForCard = (storyData: any): Story | null => {
  if (!storyData) return null

  const {
    id,
    name,
    description,
    icon,
    imageUrl,
    timeAgo,
    startDate,
    endDate,
    status,
    products = [],
  } = storyData

  const formatDate = (dateString: any) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const calculateDaysRemaining = () => {
    if (!endDate) return null
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusInfo = () => {
    const daysRemaining = calculateDaysRemaining()

    if (status === 'expiring' || (daysRemaining !== null && daysRemaining <= 3 && daysRemaining > 0)) {
      return { status: 'expiring', label: 'Expiring Soon', variant: 'warning' } as const
    }

    if (status === 'new' || (daysRemaining !== null && daysRemaining > 20)) {
      return { status: 'new', label: 'New', variant: 'success' } as const
    }

    return { status: 'active', label: 'Active', variant: 'default' } as const
  }

  const transformStoryProduct = (product: any): (StoryProduct & Record<string, unknown>) | null => {
    if (!product) return null

    const normalizeBadges = (badges: any): NonNullable<StoryProduct['badges']> => {
      if (!badges || !Array.isArray(badges)) return []

      const labelByType: Record<'hot' | 'new' | 'limited' | 'flash', string> = {
        hot: 'Hot',
        new: 'New',
        limited: 'Limited',
        flash: 'Flash',
      }

      return badges
        .map((badge: any) => {
          if (typeof badge === 'string') {
            const type = badge
            if (!(type in labelByType)) return null
            return { type, label: labelByType[type as keyof typeof labelByType] }
          }

          if (typeof badge === 'object' && badge && 'type' in badge) {
            const type = (badge as any).type
            if (typeof type !== 'string' || !(type in labelByType)) return null
            const rawLabel = (badge as any).label
            const label =
              typeof rawLabel === 'string' && rawLabel.trim().length > 0
                ? rawLabel
                : labelByType[type as keyof typeof labelByType]
            return { type: type as 'hot' | 'new' | 'limited' | 'flash', label }
          }

          return null
        })
        .filter((b): b is NonNullable<StoryProduct['badges']>[number] => Boolean(b))
    }

    const parsePrice = (priceStr: any) => {
      if (typeof priceStr === 'number') return priceStr
      if (typeof priceStr === 'string') return parseFloat(priceStr.replace(/[^0-9.]/g, ''))
      return 0
    }

    const price = parsePrice(product.price)
    const originalPrice = parsePrice(product.originalPrice)
    const badges = normalizeBadges(product.badges)
    const badgeTypes = badges.map((b) => b.type)

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      numericPrice: price,
      numericOriginalPrice: originalPrice,
      discount: product.discount || 0,
      savings: originalPrice - price,
      badges,
      isHot: badgeTypes.includes('hot') || product.discount >= 50,
      isNew: badgeTypes.includes('new'),
      metadata: { rawData: product },
    }
  }

  const transformedProducts = Array.isArray(products)
    ? products.map(transformStoryProduct).filter((p): p is StoryProduct & Record<string, unknown> => Boolean(p))
    : []

  const statusInfo = getStatusInfo()
  const daysRemaining = calculateDaysRemaining()

  return {
    id,
    name,
    imageUrl,
    icon,
    timeAgo: timeAgo || null,
    status: statusInfo.status,
    products: transformedProducts as any,

    title: name,
    description,
    image: imageUrl,
    startDate,
    endDate,
    formattedStartDate: formatDate(startDate),
    formattedEndDate: formatDate(endDate),
    daysRemaining,
    statusLabel: statusInfo.label,
    statusVariant: statusInfo.variant,
    isExpiring: statusInfo.status === 'expiring',
    isNew: statusInfo.status === 'new',
    isActive: statusInfo.status === 'active',
    productCount: transformedProducts.length,
    hasProducts: transformedProducts.length > 0,
    totalDeals: transformedProducts.length,
    hotDeals: transformedProducts.filter((p: any) => p.isHot).length,
    newDeals: transformedProducts.filter((p: any) => p.isNew).length,
    maxDiscount: Math.max(...transformedProducts.map((p: any) => p.discount), 0),
    shareUrl: typeof window !== 'undefined' ? `${window.location.origin}/stories/${id}` : `/stories/${id}`,
    storyUrl: `/stories/${id}`,
    pageType: 'story',
    metadata: { rawData: storyData, originalStatus: status },
  } as unknown as Story
}

export const transformAllProducts = (productsData: unknown): Deal[] => {
  if (!Array.isArray(productsData)) return []
  return productsData.map((p) => transformProductForCard(p)).filter((d): d is Deal => Boolean(d))
}

export const transformProductForCard = (productData: any): Deal | null => {
  if (!productData) return null

  const {
    id,
    title,
    description,
    originalPrice,
    salePrice,
    discountPercent,
    image,
    store,
    brand,
    category,
    subcategory,
    badges = [],
    postedAt,
    affiliateUrl,
    isHot,
    isTrending,
    couponCode,
    highlights = [],
  } = productData

  const formatPrice = (price: any) => {
    const numericPrice = typeof price === 'number' ? price : parseFloat(price) || 0
    return `$${numericPrice.toFixed(2)}`
  }

  const calculateDiscount = () => {
    if (discountPercent) return discountPercent
    if (!originalPrice || !salePrice) return 0
    const discount = ((originalPrice - salePrice) / originalPrice) * 100
    return Math.round(discount)
  }

  const calculateSavings = () => {
    if (!originalPrice || !salePrice) return 0
    return originalPrice - salePrice
  }

  const formatCategory = () => {
    if (!category) return ''
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getBadgeList = () => {
    const badgeList = Array.isArray(badges) ? [...badges] : []

    if (isHot && !badgeList.includes('hot')) badgeList.push('hot')
    if (isTrending && !badgeList.includes('trending')) badgeList.push('trending')
    if (calculateDiscount() >= 50 && !badgeList.includes('hot')) badgeList.push('hot')

    return badgeList
  }

  const getShareUrl = () => {
    if (typeof window !== 'undefined') return `${window.location.origin}/deals/${id}`
    return `/deals/${id}`
  }

  return {
    id,
    title,
    description,
    category,
    subcategory: subcategory || undefined,
    store,
    brand: brand || undefined,
    imageUrl: image,
    image: image,
    originalPrice,
    salePrice,
    discountPercent: calculateDiscount(),
    affiliateUrl: affiliateUrl || undefined,
    badges: getBadgeList(),
    isHot: isHot || calculateDiscount() >= 50,
    isTrending: isTrending || false,
    postedAt,
    couponCode: couponCode || undefined,
    highlights: highlights,

    formattedOriginalPrice: formatPrice(originalPrice),
    formattedSalePrice: formatPrice(salePrice),
    savings: calculateSavings(),
    formattedSavings: formatPrice(calculateSavings()),
    images: image ? [image] : [],
    storeName: store,
    brandName: brand,
    formattedCategory: formatCategory(),
    isNew: Array.isArray(badges) && badges.includes('new'),
    isLimited: Array.isArray(badges) && badges.includes('limited'),
    isFlash: Array.isArray(badges) && badges.includes('flash'),
    hasCoupon: !!couponCode,
    hasHighlights: Array.isArray(highlights) && highlights.length > 0,
    shareUrl: getShareUrl(),
    postedDate: formatDate(postedAt),
    timeAgo: formatDate(postedAt),
    isWishlisted: productData.isWishlisted || false,
    status: productData.status || 'active',
    pageType: 'all-deals',
    dealType: subcategory || category,
    metadata: { rawData: productData, category: category, subcategory: subcategory },
  } as unknown as Deal
}

export const transformAllBlogs = (blogsData: unknown): any[] => {
  if (!Array.isArray(blogsData)) return []
  return blogsData.map((blog) => transformBlogForCard(blog)).filter(Boolean)
}

export const transformBlogForCard = (blogData: any): any | null => {
  if (!blogData) return null

  const {
    id,
    title,
    content,
    image,
    author,
    category,
    seoLabels = [],
    publishedAt,
    createdAt,
    // Legacy fields for backward compatibility
    excerpt,
    coverImage,
    tags,
    publishedDate,
    readTime,
    likes = 0,
    views = 0
  } = blogData

  // Helper: Generate excerpt from HTML content
  const generateExcerpt = (htmlContent: string, maxLength: number = 150): string => {
    if (!htmlContent) return ''
    // Strip HTML tags
    const text = htmlContent.replace(/<[^>]*>/g, '').trim()
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Helper: Calculate read time from content
  const calculateReadTime = (htmlContent: string): string => {
    if (!htmlContent) return '5 min read'
    const text = htmlContent.replace(/<[^>]*>/g, '')
    const wordCount = text.split(/\s+/).length
    const readTimeMinutes = Math.ceil(wordCount / 200) // Average reading speed
    return `${readTimeMinutes} min read`
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getShareUrl = () => {
    if (typeof window !== 'undefined') return `${window.location.origin}/blogs/${id}`
    return `/blogs/${id}`
  }

  // Handle author - can be string (from API) or object (legacy)
  const authorName = typeof author === 'string' ? author : (author?.name || 'Anonymous')
  const authorAvatar = typeof author === 'string' ? null : (author?.avatar || null)

  // Use API fields with fallback to legacy fields
  const finalImage = image || coverImage || null
  const finalTags = seoLabels.length > 0 ? seoLabels : (tags || [])
  const finalPublishedDate = publishedAt || publishedDate
  const finalExcerpt = excerpt || generateExcerpt(content)
  const finalReadTime = readTime || calculateReadTime(content)

  return {
    id,
    title,
    excerpt: finalExcerpt,
    content,
    author: { name: authorName, avatar: authorAvatar },
    authorName,
    authorAvatar,
    category: category || 'General',
    tags: finalTags,
    hasTags: finalTags.length > 0,
    coverImage: finalImage,
    image: finalImage,
    hasCoverImage: !!finalImage,
    publishedDate: finalPublishedDate,
    publishedAt: new Date(finalPublishedDate),
    formattedDate: formatDate(finalPublishedDate),
    timeAgo: formatDate(finalPublishedDate),
    readTime: finalReadTime,
    likes,
    views,
    hasEngagement: likes > 0 || views > 0,
    shareUrl: getShareUrl(),
    blogUrl: `/blogs/${id}`,
    pageType: 'blog',
    metadata: {
      rawData: blogData,
      category: category,
      tags: finalTags,
      country: blogData.country
    },
  }
}

// ============================================
// API Stories Transformation Functions
// ============================================

/**
 * Helper to transform API tags to frontend badges
 */
const transformDealTagsToBadges = (tags: ApiDeal['tags']): StoryProduct['badges'] => {
  const tagNameToBadgeType: Record<string, 'hot' | 'new' | 'limited' | 'flash'> = {
    'hot deal': 'hot',
    'best seller': 'hot',
    'new arrival': 'new',
    'limited time': 'limited',
    'flash sale': 'flash',
  }

  return tags
    .map((tag) => {
      const lowerName = tag.name.toLowerCase()
      const type = tagNameToBadgeType[lowerName]
      if (!type) return null
      return {
        type,
        label: tag.name,
      }
    })
    .filter((badge): badge is NonNullable<typeof badge> => badge !== null)
}

/**
 * Transform a single API story to frontend Story type
 */
export const transformApiStoryToStory = (apiStory: ApiStory): Story => {
  // Transform API deals to frontend products
  const products: StoryProduct[] = apiStory.deals.map((deal) => ({
    id: deal.id,
    title: deal.title,
    description: `${deal.brand.name} - ${deal.store.name}`, // Construct description
    price: `$${deal.dealPrice}`, // Format price
    originalPrice: `$${deal.regularPrice}`, // Format original price
    discount: deal.percentageOff ? parseInt(deal.percentageOff, 10) : undefined,
    imageUrl: deal.images[0] || apiStory.iconUrl, // Use first deal image, fallback to story icon
    badges: transformDealTagsToBadges(deal.tags), // Transform tags to badges
  }))

  return {
    id: apiStory.id,
    name: apiStory.name,
    imageUrl: apiStory.iconUrl, // Map iconUrl to imageUrl
    icon: undefined, // API doesn't provide emoji icon
    timeAgo: undefined, // API doesn't provide timeAgo
    status: 'active', // Default status (could be enhanced based on deal dates)
    products,
  }
}

/**
 * Transform array of API stories to frontend Story types
 */
export const transformApiStories = (apiStories: ApiStory[]): Story[] => {
  return apiStories.map(transformApiStoryToStory)
}

// ============================================
// API Deals Transformation Functions
// ============================================

import type {
  ApiDeal as ApiDealFromDealsApi,
  ApiTag as ApiTagFromDealsApi,
} from '@/types/deals-api.types'

/**
 * Helper to transform API tags to frontend badge strings
 */
const transformApiTagsToBadges = (tags: ApiTagFromDealsApi[]): string[] => {
  const tagToBadgeMap: Record<string, string> = {
    'hot deal': 'hot',
    'best seller': 'hot',
    'trending': 'trending',
    'trending deals': 'trending',
    'new arrival': 'new',
    'new today': 'new',
    'limited time': 'limited',
    'flash sale': 'flash',
    'flash': 'flash',
  }

  return tags
    .map((tag) => {
      const lowerName = tag.name.toLowerCase()
      return tagToBadgeMap[lowerName] || null
    })
    .filter((badge): badge is string => badge !== null)
}

/**
 * Helper to infer category from tags
 */
const inferCategoryFromTags = (tags: ApiTagFromDealsApi[]): string => {
  const tagToCategoryMap: Record<string, string> = {
    electronics: 'electronics',
    phones: 'electronics',
    laptops: 'electronics',
    tv: 'electronics',
    audio: 'electronics',
    camera: 'electronics',
    fashion: 'fashion',
    clothing: 'fashion',
    shoes: 'fashion',
    apparel: 'fashion',
    accessories: 'fashion',
    home: 'home',
    'home & kitchen': 'home',
    kitchen: 'home',
    furniture: 'home',
    appliances: 'home',
    decor: 'home',
    beauty: 'beauty',
    skincare: 'beauty',
    makeup: 'beauty',
    haircare: 'beauty',
    fragrance: 'beauty',
    sports: 'sports',
    fitness: 'sports',
    outdoor: 'sports',
    cycling: 'sports',
    toys: 'toys',
    games: 'toys',
    kids: 'toys',
    health: 'health',
    vitamins: 'health',
    wellness: 'health',
    automotive: 'automotive',
    car: 'automotive',
    parts: 'automotive',
  }

  // Find first matching tag
  for (const tag of tags) {
    const lowerName = tag.name.toLowerCase()
    if (tagToCategoryMap[lowerName]) {
      return tagToCategoryMap[lowerName]
    }
  }

  // Default to 'general' if no match
  return 'general'
}

/**
 * Helper to infer subcategory from tags based on category
 */
const inferSubcategoryFromTags = (tags: ApiTagFromDealsApi[], category: string): string | undefined => {
  const subcategoryMaps: Record<string, Record<string, string>> = {
    electronics: {
      phones: 'phones',
      laptops: 'laptops',
      tv: 'tvs',
      audio: 'audio',
      camera: 'cameras',
    },
    fashion: {
      men: 'men',
      women: 'women',
      kids: 'kids',
      shoes: 'shoes',
      accessories: 'accessories',
      watches: 'watches',
    },
    home: {
      furniture: 'furniture',
      appliances: 'appliances',
      decor: 'decor',
      kitchen: 'kitchen',
      bedding: 'bedding',
    },
  }

  const categoryMap = subcategoryMaps[category]
  if (!categoryMap) return undefined

  // Find first matching subcategory tag
  for (const tag of tags) {
    const lowerName = tag.name.toLowerCase()
    if (categoryMap[lowerName]) {
      return categoryMap[lowerName]
    }
  }

  return undefined
}

/**
 * Helper to calculate discount percentage from prices
 */
const calculateDiscountFromPrices = (regular: string, deal: string): number => {
  const regularPrice = parseFloat(regular)
  const dealPrice = parseFloat(deal)

  if (regularPrice <= 0 || dealPrice <= 0) return 0

  const discount = ((regularPrice - dealPrice) / regularPrice) * 100
  return Math.round(discount)
}

/**
 * Transform a single API deal to frontend Deal type
 */
export const transformApiDealToDeal = (apiDeal: ApiDealFromDealsApi): Deal => {
  // Parse prices
  const regularPrice = parseFloat(apiDeal.regularPrice)
  const dealPrice = parseFloat(apiDeal.dealPrice)

  // Calculate discount
  const discountPercent = apiDeal.percentageOff
    ? parseInt(apiDeal.percentageOff, 10)
    : calculateDiscountFromPrices(apiDeal.regularPrice, apiDeal.dealPrice)

  // Infer category and subcategory from tags
  const category = inferCategoryFromTags(apiDeal.tags)
  const subcategory = inferSubcategoryFromTags(apiDeal.tags, category)

  // Transform tags to badges
  const badges = transformApiTagsToBadges(apiDeal.tags)

  // Determine if deal is hot or trending
  const isHot = discountPercent >= 50
  const isTrending = apiDeal.viewCount > 100 // Threshold for trending

  // Get first coupon if available
  const couponCode = apiDeal.coupons.length > 0 ? apiDeal.coupons[0].code : undefined

  // Get highlights from coupon titles
  const highlights = apiDeal.coupons.map((coupon) => coupon.title)

  return {
    id: apiDeal.id,
    title: apiDeal.title,
    description: apiDeal.title.slice(0, 100), // Truncate title for description
    category,
    subcategory,
    store: apiDeal.store.name,
    brand: apiDeal.brand.name,
    imageUrl: apiDeal.images[0] || '',
    image: apiDeal.images[0] || '',
    originalPrice: regularPrice,
    salePrice: dealPrice,
    discountPercent,
    affiliateUrl: apiDeal.affiliateUrl,
    badges,
    isHot,
    isTrending,
    postedAt: new Date().toISOString(), // Fallback since API doesn't provide
    couponCode,
    highlights,
  }
}

