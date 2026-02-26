/**
 * Banner type definitions
 * Matches API response from /api/v1/banners
 */

// API Response structure
export interface BannerApiResponse {
  status: number
  message: string
  data: {
    banners: Banner[]
  }
}

// Banner from API
export interface Banner {
  id: string
  name: string
  desktopImageUrl: string
  mobileImageUrl: string
  redirectUrl: string
}
