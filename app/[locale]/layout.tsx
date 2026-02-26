import {
  DEFAULT_LOCALE,
  isValidLocale,
  SUPPORTED_LOCALES,
} from "@/lib/locale-utils";
import { redirect } from "next/navigation";
import LayoutContent from "../../components/layouts/main";

/**
 * Generate static params for all supported locales
 * This tells Next.js which locale paths to pre-render at build time
 */
export async function generateStaticParams() {
  return Object.keys(SUPPORTED_LOCALES).map((locale) => ({
    locale,
  }));
}



export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params (Next.js 15 requirement)
  const { locale } = await params;

  // Validate locale - redirect to default if invalid
  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  return <LayoutContent locale={locale}>{children}</LayoutContent>;
}
