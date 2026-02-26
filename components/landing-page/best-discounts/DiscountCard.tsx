import Link from 'next/link';

interface DiscountCardProps {
  discount: number;
  href: string;
  index: number;
}

export default function DiscountCard({ discount, href, index }: DiscountCardProps) {
  return (
    <Link href={href}>
      <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-4 md:p-6 min-h-[120px] md:min-h-[140px] flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md border border-rose-100">
        <p className="text-xs md:text-sm text-rose-800 font-semibold mb-1">
          Min.
        </p>
        <p className="text-3xl md:text-5xl font-bold text-rose-800">
          {discount}%
        </p>
        <p className="text-xs md:text-sm text-rose-800 font-semibold mt-1">
          off
        </p>
      </div>
    </Link>
  );
}
