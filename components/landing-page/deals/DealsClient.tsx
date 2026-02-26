import { Deal } from "@/types/alldeals.types";
import ProductCard from "@/components/card/productcard";
import Link from "next/link";

interface DealsClientProps {
  deals: Deal[];
  locale: string;
}

export default function DealsClient({ deals, locale }: DealsClientProps) {
  if (!deals || deals.length === 0) {
    return null;
  }

  return (
    <div className="deals-section w-full px-2 md:px-4 py-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Deals</h2>
          <Link
            href={locale + "/all-deals"}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All Deals →
          </Link>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {deals.map((deal) => (
            <ProductCard
              key={deal.id}
              id={deal.id}
              title={deal.title}
              description={deal.description}
              category={deal.category}
              store={deal.store}
              brand={deal.brand}
              imageUrl={deal.imageUrl}
              originalPrice={deal.originalPrice}
              salePrice={deal.salePrice}
              discountPercent={deal.discountPercent}
              affiliateUrl={deal.affiliateUrl}
              badges={deal.badges}
              badgeColor={deal.badgeColor}
              badgeTextColor={deal.badgeTextColor}
              isTrending={deal.isTrending}
              isHot={deal.isHot}
              postedAt={deal.postedAt}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
