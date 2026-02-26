export interface ApiCoupon {
  id: string
  title: string
  description: string
  code: string
  link: string
  category: string
  store: string
  storeId: string
  seoLabels: string[]
  discount: number
  discountType: 'percentage' | 'fixed'
  expiresAt: string
  publishedAt: string
  createdAt: string
  country: string
  uses: number
  views: number
  verified: boolean
  featured: boolean
  storeImage: string
  bannerImage: string
  termsAndConditions: string
  minimumPurchase: number
}

export interface CouponsApiResponse {
  status: number
  message: string
  data: ApiCoupon[]
  meta: {
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface CouponsFilterParams {
  page?: number
  limit?: number
  category?: string
  store?: string
  minDiscount?: number
  maxDiscount?: number
  tags?: string[]
  country?: string
  search?: string
}
