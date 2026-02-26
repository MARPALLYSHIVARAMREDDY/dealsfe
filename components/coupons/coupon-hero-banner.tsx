import { Ticket } from 'lucide-react'

interface CouponHeroBannerProps {
  locale: string
}

export default function CouponHeroBanner({ locale }: CouponHeroBannerProps) {
  return (
    <div className="relative w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Ticket className="h-10 w-10 text-primary-foreground" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
              Best Coupons & Deals
            </h1>
          </div>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-6">
            Save big with exclusive discount codes and offers from top brands
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground/90" />
              <span>Verified Coupons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground/90" />
              <span>Instant Savings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground/90" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
