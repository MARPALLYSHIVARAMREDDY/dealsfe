import DesktopHeader from "./main-header-desktop";
import MobileHeader from "./main-header-mobile";

interface HeaderProps {
  locale: string;
}

export default async function Page({ locale }: HeaderProps) {
  return (
    <div>
      <DesktopHeader locale={locale} />
      <MobileHeader />
    </div>
  );
}
