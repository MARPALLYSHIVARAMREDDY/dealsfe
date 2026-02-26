/**
 * Loading skeleton for stories component
 * Displayed while stories are being fetched
 * Matches the built-in loading state from Stories.tsx
 */
export function StoriesSkeleton() {
  return (
    <section className="pt-4 py-3 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:justify-center">
          {/* Loading skeleton - matches Stories.tsx:49-53 */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted animate-pulse" />
              <div className="w-16 h-3 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StoriesSkeleton
