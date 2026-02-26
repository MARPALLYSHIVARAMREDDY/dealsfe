import React from "react";
import Link from "next/link";
import { CardDemo } from "@/components/card/card-2-ui";
import type { SaleCategory } from "@/types/common.types.ts";
import { Carousel as CardCarousel } from "@/components/ui/apple-cards-carousel";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface ActiveSalesSectionProps {
  items: SaleCategory[];
}

export default function ActiveSalesSection({ items }: ActiveSalesSectionProps) {
  const carouselItems = items.map((sale) => (
    <Link
      key={sale.id}
      href={`/sales/${sale.id}/listing`}
      className="block w-[300px] lg:w-[280px]"
    >
      <CardDemo
        label={`${sale.products.length} Products`}
        title={sale.name}
        description={sale.description}
        imageSrc={sale.imageUrl}
      />
    </Link>
  ));

  return (
    <section>
      <div className="w-full mx-auto flex justify-center">
        <h1 className="text-2xl font-semibold mb-6">Active Sales</h1>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <CardCarousel items={carouselItems} />
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/active-sales">
          <InteractiveHoverButton> View All</InteractiveHoverButton>
        </Link>
      </div>
    </section>
  );
}
