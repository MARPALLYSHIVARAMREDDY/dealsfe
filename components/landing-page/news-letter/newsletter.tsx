import Link from 'next/link'
import NewsletterForm from './newsletterclient'
import { cn } from '@/lib/utils'

// Server Component - Static content (SSG)
export default function NewsLetter({ className }: { className?: string }) {
  return (
    <>
      {/* Yellow Newsletter Section */}
      <div className={cn("bg-[#FFD700] py-12 md:py-16", className)}>
        <div className="w-[96%] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 max-w-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground italic mb-6">
                Get all the new deals and savings hacks straight to your inbox
              </h2>

              {/* Client Component for Email Form */}
              <NewsletterForm />

              <p className="text-sm text-foreground/70 mt-3">
                Will be used in accordance with our <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>
              </p>
            </div>

            {/* Right - Phone Mockup (Desktop only) - Static Content */}
            <div className="hidden lg:block relative">
              <div className="w-[280px] h-[500px] bg-foreground rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="bg-muted/30 p-4 border-b">
                    <p className="text-xs text-muted-foreground">From : DealsMocktail </p>
                    <p className=" text-xs mt-1">For : You</p>
                  </div>
                  <div className="p-4 space-y-3 flex-1 overflow-hidden">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-semibold text-primary">🔥 Hot Deal Alert</p>
                      <p className="text-xs mt-1 text-foreground/80">Save 70% on electronics today!</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-semibold text-primary">💰 Savings Hack</p>
                      <p className="text-xs mt-1 text-foreground/80">Stack coupons for max savings</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-xs font-semibold text-primary">🎁 Exclusive Offer</p>
                      <p className="text-xs mt-1 text-foreground/80">Members-only flash sale</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
