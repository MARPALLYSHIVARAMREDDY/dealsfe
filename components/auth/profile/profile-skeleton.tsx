import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-start max-w-7xl mx-auto lg:gap-8 lg:px-8 lg:py-8">
        {/* Desktop Sidebar Skeleton - Matches ProfileSidebar */}
        <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:bg-muted/5 lg:border lg:rounded-xl lg:h-fit sticky">
          {/* Profile Info */}
          <div className="p-6 border-b">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 mb-3 rounded-full bg-accent/30 animate-pulse" />
              <div className="h-6 w-32 bg-accent/30 rounded animate-pulse" />
              <div className="h-4 w-40 bg-accent/20 rounded mt-2 animate-pulse" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[1, 2].map((i) => (
                <li key={i}>
                  <div className="h-10 w-full rounded-lg bg-accent/10 animate-pulse" />
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t">
            <div className="h-10 w-full rounded-md bg-accent/20 animate-pulse" />
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 w-full min-w-0">
          {/* Mobile Header Skeleton - Matches ProfileHeader */}
          <div className="flex items-center gap-4 p-6 lg:hidden">
            <div className="h-16 w-16 rounded-full bg-accent/30 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-accent/30 rounded animate-pulse" />
              <div className="h-4 w-40 bg-accent/20 rounded animate-pulse" />
            </div>
          </div>

          {/* Mobile Tabs Skeleton (Simulated) */}
          <div className="lg:hidden px-6 mb-4">
            <div className="h-10 w-full bg-accent/10 rounded-md animate-pulse" />
          </div>

          {/* Content Area Skeleton */}
          <div className="p-1 md:p-6 lg:p-0 space-y-6">
            <div className="p-2">
              {/* Personal Details Form Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-accent/30 rounded animate-pulse" />
                  <div className="h-10 w-full bg-accent/10 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-accent/30 rounded animate-pulse" />
                  <div className="h-10 w-full bg-accent/10 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-accent/30 rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-5 w-20 bg-accent/10 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-accent/10 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-accent/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Contact Form Skeleton */}
              <div className="space-y-6 pt-4 border-t">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-accent/30 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-10 flex-1 md:w-1/2 bg-accent/10 rounded animate-pulse" />
                      <div className="h-10 w-20 bg-accent/20 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Subscription Form Skeleton */}
              <div className="space-y-4 py-8 border-t mt-6">
                {[1, 2].map((i) => (
                  <div key={i} className="md:max-w-[50%] flex items-center justify-between">
                    <div className="h-5 w-40 bg-accent/20 rounded animate-pulse" />
                    <div className="h-6 w-10 bg-accent/30 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Mobile Sign Out Button */}
              <div className="lg:hidden pt-4">
                <div className="h-10 w-full rounded-md bg-accent/20 animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
