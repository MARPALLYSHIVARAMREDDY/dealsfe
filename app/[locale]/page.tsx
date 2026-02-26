import Stories from "@/components/landing-page/stories/StoriesContainer"
import Banner from "@/components/banners/banner"
import AllDealsContainer from "@/components/landing-page/all-deals/AllDealsContainer"
import BlogsContainer from "@/components/landing-page/blogs/BlogsContainer"
import { Suspense } from "react"
import AllDealsClientWrapper from "@/components/landing-page/all-deals/AllDealsClientWrapper"
import { type LocaleCode } from "@/lib/locale-utils"
import DealsSection from "@/components/landing-page/deals/DealsSection"
import HotDealsSection from "@/components/landing-page/hot-deals"
import BestDiscountsSection from "@/components/landing-page/best-discounts"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params

  return (
    <div className="">
      <Stories params={params} />
      <br/>
      <Banner name="banner1" params={params} />
      <br/>

      {/* Two-column layout: 70% Deals + 30% Blogs **/}
      <div className="w-full md:px-8">
        <div className="flex flex-col md:flex-row w-full gap-6 md:px-4">
          {/* Left column: Deals (70%) */}
          <div className="w-full md:w-[70%]">
            <Suspense
              fallback={
                <AllDealsClientWrapper
                  initialDeals={[]}
                  initialFilters={{ tab: "all" }}
                  isLoading={true}
                  pageType="home"
                />
              }
            >
              <DealsSection params={params} />
            </Suspense>
          </div>

          {/* Right column: Blogs (30%) */}
          <div className="w-full md:w-[30%]">
            <Suspense
              fallback={
                <div className="py-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading blogs...</p>
                  </div>
                </div>
              }
            >
              <BlogsContainer locale={locale as LocaleCode} />
            </Suspense>
          </div>
        </div>
      </div>

      <br/>

      {/* Hot Deals Section */}
      <Suspense
        fallback={
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Loading deals...</p>
          </div>
        }
      >
        <HotDealsSection params={params} />
      </Suspense>

      <br/>

      {/* Best Discounts Section */}
      <Suspense
        fallback={
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Loading discounts...</p>
          </div>
        }
      >
        <BestDiscountsSection params={params} />
      </Suspense>

      <br/>
      <Banner name="banner3" params={params} />
    </div>
  )
}
