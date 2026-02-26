interface ListingHeaderProps {
  title?: string;
  className?: string;
}

/**
 * ListingHeader component displays a hero section with background image and title
 * Used on listing pages like /all-deals
 *
 * @param title - Header title text (defaults to "All Deals")
 * @param className - Optional additional CSS classes
 */
export default function ListingHeader({
  title = "All Deals",
  className = ""
}: ListingHeaderProps) {
  return (
    <div
      className={`relative w-full h-[15rem] md:h-[25rem] bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url('https://buyhatke.com/_app/immutable/assets/heroBg.DBTMNOQd.png')"
      }}
    >
      {/* Dark overlay for text readability */}

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          {title}
        </h1>
      </div>
    </div>
  );
}
