import { LocaleCode, getCurrencySymbol } from '@/lib/locale-utils';
import { HOT_DEALS_PRICE_TIERS, HOT_DEALS_CONFIG } from '@/utils/hot-deals-config';
import PriceRangeCard from './PriceRangeCard';

interface HotDealsSectionProps {
  params: Promise<{ locale: string }>;
}

export default async function HotDealsSection({ params }: HotDealsSectionProps) {
  const { locale } = await params;
  const currencySymbol = getCurrencySymbol(locale as LocaleCode);

  return (
    <section className="w-full py-12 px-4 md:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {HOT_DEALS_CONFIG.heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          {HOT_DEALS_CONFIG.subheading}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {HOT_DEALS_PRICE_TIERS.map((price, idx) => (
          <PriceRangeCard
            key={price}
            price={price}
            currencySymbol={currencySymbol}
            href={`/${locale}/all-deals?maxPrice=${price}`}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
