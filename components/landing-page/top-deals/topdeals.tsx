import Link from 'next/link';
import { getTopDeals } from '@/lib/alldeals-service';
import { type LocaleCode } from '@/lib/locale-utils';

const TopDealsSection = async ({ locale }: { locale: LocaleCode }) => {
  // Get top deals from the service
  const result = await getTopDeals(locale, 6);
  const topDeals = result.success ? result.data : [];

  if (!result.success || topDeals.length === 0) {
    return null; // Don't render if no deals
  }

  const getDealTag = (index: number) => {
    const tags = ['Black Friday Deal', 'Deal selling fast', 'Limited time', 'Top rated', 'Best seller', 'Hot deal'];
    return tags[index % tags.length];
  };

  return (
    <section className="bg-[#E97B30] py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-bold text-white">
            Explore our Top 100+ deals
          </h2>
          <Link
            href="/alldeals"
            className="text-white underline underline-offset-4 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            See more
          </Link>
        </div>

        {/* Deals carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {topDeals.map((deal, index) => (
            <Link
              key={deal.id}
              href={`/alldeals?deal=${deal.id}`}
              className="flex-shrink-0 w-[calc(40%-8px)] md:w-32 lg:w-28 group"
            >
              {/* Card */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md transition-transform duration-200 group-hover:scale-[1.02]">
                {/* Image */}
                <div className="aspect-[4/3] p-1.5 flex items-center justify-center bg-white">
                  <img
                    src={deal.imageUrl || '/placeholder.png'}
                    alt={deal.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="px-2 pb-2 pt-1 space-y-0.5">
                  {/* Tags */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="bg-[#E97B30] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Hot Deal
                    </span>
                  </div>
                  <span className="text-[#E97B30] font-semibold text-[10px] line-clamp-1">
                    {getDealTag(index)}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-foreground">
                      ${deal.salePrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDealsSection;
