import Link from 'next/link';

interface PriceRangeCardProps {
  price: number;
  currencySymbol: string;
  href: string;
  index: number;
}

export default function PriceRangeCard({
  price,
  currencySymbol,
  href,
  index
}: PriceRangeCardProps) {
  return (
    <Link href={href}>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-4 md:p-6 min-h-[120px] md:min-h-[140px] flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md border border-gray-100">
        <p className="text-xs md:text-sm text-purple-600 font-semibold mb-2">
          DEALS UNDER
        </p>
        <p className="text-2xl md:text-4xl font-bold text-purple-600">
          {currencySymbol}{price}
        </p>
      </div>
    </Link>
  );
}
