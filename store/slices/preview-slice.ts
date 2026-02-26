import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PreviewData {
  id: string
  title: string
  description?: string
  price: string | number
  originalPrice?: number
  salePrice?: number
  discount?: number
  discountPercent?: number
  imageUrl?: string
  image?: string
  images?: string[]
  detailUrl?: string
  store?: string
  brand?: string
  category?: string
  badges?: string[]
  badgeColor?: string
  badgeTextColor?: string
  isHot?: boolean
  isTrending?: boolean
  affiliateUrl?: string
  couponCode?: string
  highlights?: string[]
}

interface PreviewState {
  isOpen: boolean
  data: PreviewData | null
  allProducts: PreviewData[]
  currentIndex: number
}

const initialState: PreviewState = {
  isOpen: false,
  data: null,
  allProducts: [],
  currentIndex: 0,
}

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    openPreview: (
      state,
      action: PayloadAction<{ data: PreviewData; allProducts?: PreviewData[] }>
    ) => {
      const { data, allProducts = [] } = action.payload
      const products = allProducts.length > 0 ? allProducts : [data]
      const index = products.findIndex((p) => p.id === data.id)

      state.isOpen = true
      state.data = data
      state.allProducts = products
      state.currentIndex = index >= 0 ? index : 0
    },

    closePreview: (state) => {
      state.isOpen = false
      state.data = null
      state.allProducts = []
      state.currentIndex = 0
    },

    goToNext: (state) => {
      if (state.currentIndex < state.allProducts.length - 1) {
        const nextIndex = state.currentIndex + 1
        state.data = state.allProducts[nextIndex]
        state.currentIndex = nextIndex
      }
    },

    goToPrev: (state) => {
      if (state.currentIndex > 0) {
        const prevIndex = state.currentIndex - 1
        state.data = state.allProducts[prevIndex]
        state.currentIndex = prevIndex
      }
    },
  },
})

export const { openPreview, closePreview, goToNext, goToPrev } = previewSlice.actions

export default previewSlice.reducer

