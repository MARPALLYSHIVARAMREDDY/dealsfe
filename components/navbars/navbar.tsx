import Link from "next/link";
import MegaMenu from "./megamenu";

interface HeaderProps {
  locale: string;
}

export default function Page({ locale }: HeaderProps) {
  const navItems = [
    { label: "All Deals", href: "/all-deals" },
    { label: "Coupons", href: "/coupons" },
    { label: "Trending", href: "/deals?sort=trending" },
    { label: "Sales", href: "/sales" },
    { label: "Blogs", href: "/blogs" },
    { label: "Categories", href: "#", hasMenu: true },
  ];

  return (
    <div className="pl-4">
      <nav className="hidden md:block">
        <div className="container mx-auto">
          <ul className="flex items-center justify-center gap-4 h-11">
            {navItems.map((item) => (
              <li key={item.label} className="relative">
                {item.hasMenu ? (
                  <MegaMenu itemLabel={item.label} />
                ) : (
                  <Link
                    href={"/" + locale + item.href}
                    className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
