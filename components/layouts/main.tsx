import Header from "@/components/headers/main-header/main-header";
import Footer from "@/components/common/footer";
import Newsletter from "../landing-page/news-letter/newsletter";
import BottomNavbar from "@/components/navbars/bottom-navbar";

export default function LayoutContent({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <>
      <Header locale={locale} />
      <div className="w-full pt-14 pb-16 md:pb-0">
        {children}
      </div>
      <Newsletter className="mb-16 md:mb-0" />
      <Footer />
      <BottomNavbar locale={locale} />
    </>
  );
}
