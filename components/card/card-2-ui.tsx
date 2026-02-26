"use client";

import { cn } from "@/lib/utils";

interface CardDemoProps {
  label?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
}

export function CardDemo({
  label = "Featured Sale",
  title = "Author Card",
  description = "Card with Author avatar, complete name and time to read - most suitable for blogs.",
  imageSrc = "https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80",
}: CardDemoProps) {
  return (
    <div className="w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative bg-secondary border-1 border-primary rounded-md shadow-xl backgroundImage flex flex-col justify-between p-4",
          "bg-cover h-full min-h-[290px]"
        )}
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300  opacity-60" />

        <div className="text content z-10">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary-foreground Foregroundmb-2">
            {label}
          </p>
          <h1 className="font-bold text-xl md:text-2xl text-secondary-foreground relative z-10 line-clamp-2">
            {title}
          </h1>
          <p className="font-normal text-sm text-secondary-foreground Foregroundrelative z-10 my-4 line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
