"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchPrompts = [
  "Search for deals...",
  "Find electronics deals",
  "Search fashion sales",
  "Discover hot offers",
  "Find best discounts",
  "Looking for coupons?",
  "Browse top deals",
];

export function SearchBar() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const i = loopNum % searchPrompts.length;
    const fullText = searchPrompts[i];

    let speed = 100; // Normal typing speed
    if (isDeleting) speed = 50; // Deleting speed

    if (!isDeleting && text === fullText) {
      speed = 2000; // Pause at end of phrase
    } else if (isDeleting && text === "") {
      speed = 500; // Pause before next phrase
    }

    const timer = setTimeout(() => {
      if (!isDeleting && text === fullText) {
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      } else {
        setText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  return (
    <Link href="/search" className="hidden md:flex flex-1 max-w-xl w-full">
      <Button
        variant="ghost"
        className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-full bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 transition-all cursor-pointer"
        style={{ justifyContent: 'flex-start' }}
      >
        <Search className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm text-muted-foreground font-normal truncate min-w-0 flex items-center">
          {text}
          <span className="animate-pulse ml-0.5 opacity-70">|</span>
        </span>
      </Button>
    </Link>
  );
}
