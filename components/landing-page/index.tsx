import { Suspense } from "react";
import { MarqueeDemo } from "@/components/landing-page/brand-marque";
import StoriesClientWrapper from "@/components/landing-page/stories/StoriesClientWrapper";
import AllDealsContainer from "@/components/landing-page/all-deals/AllDealsContainer";
import AllDealsClientWrapper from "@/components/landing-page/all-deals/AllDealsClientWrapper";
import BlogsContainer from "@/components/landing-page/blogs/BlogsContainer";
import Newsletter from "./news-letter/newsletter";
import TopDealsSection from "./top-deals/topdeals";
import { type LocaleCode } from "@/lib/locale-utils";

export default function LayoutContent({ locale }: { locale: LocaleCode }) {
  return (
    <>
      <Suspense fallback={<StoriesClientWrapper stories={[]} isLoading={true} />}>
   
      </Suspense>
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row w-full gap-6 px-4 ">
          <div className="w-full md:w-[70%] px-2 ">
            <Suspense
              fallback={
                <AllDealsClientWrapper
                  initialDeals={[]}
                  initialFilters={{ tab: 'all' }}
                  isLoading={true}
                  pageType="home"
                  locale={locale}
                />
              }
            >
              <AllDealsContainer locale={locale} />
            </Suspense>
          </div>
          <div className="w-full md:w-[30%] ">
            <Suspense
              fallback={
                <div className="py-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading blogs...</p>
                  </div>
                </div>
              }
            >
              <BlogsContainer locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
      <TopDealsSection locale={locale} />
      <Newsletter/>

      <MarqueeDemo />


    </>
  );
}
