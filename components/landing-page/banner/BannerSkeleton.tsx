/**
 * Loading skeleton for banner carousel
 * Displayed while banners are being fetched
 */
export function BannerSkeleton() {
  return (
    <div className="w-[95%] max-w-7xl mx-auto my-8">
      <div className="relative overflow-hidden rounded-2xl shadow-card border border-border/50">
        {/* Skeleton Banner */}
        <div className="h-[35vh] lg:h-[55vh] bg-gray-200 animate-pulse" />

        {/* Skeleton Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 h-10 w-10 bg-white/90 rounded-full animate-pulse" />
        <div className="absolute top-1/2 -translate-y-1/2 right-4 h-10 w-10 bg-white/90 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Progress Indicators */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <div className="h-2 w-8 bg-gray-300 rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
