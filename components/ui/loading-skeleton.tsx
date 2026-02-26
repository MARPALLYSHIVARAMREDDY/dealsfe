"use client";

export function LoadingSkeleton() {
  return (
    <div className="flex items-center gap-1 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-9 w-24 bg-accent/50 rounded-md"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
      <div className="h-9 w-28 bg-accent/70 rounded-md" />
    </div>
  );
}

export function CategoryLoadingDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Loading categories</span>
      <div className="flex gap-1">
        <div
          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="border-4 border-accent border-t-primary rounded-full animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    </div>
  );
}

export function CategorySkeletonGrid() {
  const widths = [95, 110, 88, 105, 92, 115];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center gap-1">
        {widths.map((width, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-md bg-accent/30 animate-pulse"
            style={{
              animationDelay: `${i * 75}ms`,
              width: `${width}px`,
              height: "36px",
            }}
          />
        ))}
        <div
          className="px-4 py-2 rounded-md bg-accent/50 animate-pulse"
          style={{
            animationDelay: "450ms",
            width: "100px",
            height: "36px",
          }}
        />
      </div>
    </div>
  );
}
