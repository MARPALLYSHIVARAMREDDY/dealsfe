"use client"
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Slide {
  id: number;
  bgColor: string;
  dealIcon: string;
  dealLabel: string;
  content: string;
}

export default function EnhancedCarousel() {
  const slides: Slide[] = [
    {
      id: 0,
      bgColor: "bg-pink-100",
      dealIcon: "🔥",
      dealLabel: "Hot Deals",
      content: "Slide 1",
    },
    {
      id: 1,
      bgColor: "bg-blue-100",
      dealIcon: "💰",
      dealLabel: "Money Saver",
      content: "Slide 2",
    },
    {
      id: 2,
      bgColor: "bg-green-100",
      dealIcon: "⚡",
      dealLabel: "Latest Deals",
      content: "Slide 3",
    },
  ];

  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHydrated(true);
    setTimeout(() => setAutoSlideEnabled(true), 2000);
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (!hydrated || !autoSlideEnabled) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => nextSlide(), 5000);

    return () => resetTimeout();
  }, [index, hydrated, autoSlideEnabled]);

  const nextSlide = () => {
    setDirection("next");
    setIndex((i) => (i + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection("prev");
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex: number) => {
    setDirection(slideIndex > index ? "next" : "prev");
    setIndex(slideIndex);
  };

  return (
    <div className="relative w-[95%] max-w-7xl mx-auto">
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden h-[35vh] lg:h-[55vh] rounded-2xl shadow-card border border-border/50">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform h-full"
          style={{
            transform: hydrated ? `translateX(-${index * 100}%)` : "translateX(0)",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`${slide.bgColor} min-w-full h-[35vh] lg:h-[55vh] relative flex items-center justify-center text-xl font-semibold text-gray-700 transition-all duration-500`}
            >
              {/* Main Content */}
              <div className="relative z-10 animate-slide-in">
                {slide.content}
              </div>

              {/* Bottom-right Deal Box */}
              <div
                className={`
                  absolute bottom-0 right-0 
                  h-[8vh] w-[20vw] min-w-[140px]
                  bg-white/95 backdrop-blur-sm
                  rounded-tl-2xl 
                  border-l-2 border-t-2 border-gray-200
                  shadow-lg
                  flex items-center justify-center gap-2 p-3
                  transition-all duration-500 ease-out
                  hover:scale-105 hover:shadow-xl
                  ${i === index ? 'animate-slide-in' : ''}
                `}
                style={{
                  animationDelay: '0.3s',
                }}
              >
                {/* Icon */}
                <div className="text-2xl lg:text-3xl animate-glow-pulse">
                  {slide.dealIcon}
                </div>

                {/* Label */}
                <span className="text-xs lg:text-sm font-semibold text-gray-800 text-center leading-tight">
                  {slide.dealLabel}
                </span>

                {/* Sparkle Effect on Hover */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="
            absolute top-1/2 -translate-y-1/2 left-4 
            h-10 w-10 
            bg-white/90 backdrop-blur-sm
            border border-gray-300
            rounded-full 
            flex items-center justify-center
            shadow-md
            hover:scale-110 hover:shadow-lg hover:bg-white
            active:scale-95
            transition-all duration-300 
            group z-20
          "
        >
          <ChevronLeft 
            size={20} 
            className="text-gray-700 transition-transform duration-300 group-hover:-translate-x-0.5" 
            aria-hidden="true" 
          />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute top-1/2 -translate-y-1/2 right-4 
            h-10 w-10 
            bg-white/90 backdrop-blur-sm
            border border-gray-300
            rounded-full 
            flex items-center justify-center
            shadow-md
            hover:scale-110 hover:shadow-lg hover:bg-white
            active:scale-95
            transition-all duration-300 
            group z-20
          "
        >
          <ChevronRight 
            size={20} 
            className="text-gray-700 transition-transform duration-300 group-hover:translate-x-0.5" 
            aria-hidden="true" 
          />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative"
          >
            {/* Indicator Dot */}
            <div
              className={`
                h-2 rounded-full transition-all duration-500
                ${i === index 
                  ? 'w-8 bg-gray-800' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
                }
              `}
            />
            
            {/* Hover Scale Effect */}
            {i !== index && (
              <div className="absolute inset-0 scale-0 rounded-full bg-gray-400/50 
                            group-hover:scale-150 transition-transform duration-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
