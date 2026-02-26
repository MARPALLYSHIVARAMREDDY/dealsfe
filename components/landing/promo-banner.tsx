

const PromoBanner = () => {
  return (
    <div className="w-[93%] mx-auto  py-2">
      <div className="block w-full text-left">
        <div className="relative rounded-xl overflow-hidden group cursor-pointer">
          <img
            src="/path/to/banner-image.jpg" // Replace with actual image path
            alt="Banner Alt Text" // Replace with appropriate alt text
            className="w-full object-cover border object-center group-hover:scale-105 transition-transform duration-500 h-24 sm:h-28 md:h-32" // Adjust classes as needed for variant
          />
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;