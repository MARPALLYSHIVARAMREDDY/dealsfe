"use client";

export function CategoriesPageLoading() {
  return (
    <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Categories Skeleton */}
      <div className="border-r overflow-y-auto">
        <div className="p-6">
          <div className="h-7 w-32 bg-accent/50 rounded-md mb-4 animate-pulse" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-accent/30 animate-pulse"
                style={{
                  animationDelay: `${i * 75}ms`,
                }}
              >
                <div className="h-5 bg-accent/50 rounded w-3/4 mb-2" />
                <div className="h-4 bg-accent/40 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Subcategories Skeleton */}
      <div className="overflow-y-auto bg-background">
        <div className="p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accent border-t-primary rounded-full animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Loading categories</p>
                <div className="flex justify-center gap-1">
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubcategoriesLoading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-48 bg-accent/50 rounded-md animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg bg-accent/20 animate-pulse"
            style={{
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div className="h-5 bg-accent/50 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
