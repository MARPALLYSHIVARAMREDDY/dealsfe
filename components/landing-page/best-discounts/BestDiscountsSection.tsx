import { BEST_DISCOUNTS_TIERS, BEST_DISCOUNTS_CONFIG } from '@/utils/best-discounts-config';
import DiscountCard from './DiscountCard';

interface BestDiscountsSectionProps {
  params: Promise<{ locale: string }>;
}

export default async function BestDiscountsSection({ params }: BestDiscountsSectionProps) {
  const { locale } = await params;

  return (
    <section className="w-full py-12 px-4 md:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {BEST_DISCOUNTS_CONFIG.heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          {BEST_DISCOUNTS_CONFIG.subheading}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {BEST_DISCOUNTS_TIERS.map((discount, idx) => (
          <DiscountCard
            key={discount}
            discount={discount}
            href={`/${locale}/all-deals?minDiscount=${discount}`}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
