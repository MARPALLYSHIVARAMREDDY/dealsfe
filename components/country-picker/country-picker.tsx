"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SUPPORTED_LOCALES,
  type LocaleCode,
  DEFAULT_LOCALE,
} from "@/lib/locale-utils";

/**
 * Country Picker Component
 *
 * Displays a compact country selector in the header.
 * Changes the application locale via URL routing.
 *
 * Features:
 * - Flag emoji only in trigger (compact design)
 * - Flag + country name in dropdown
 * - Preserves current path when switching locales
 * - Desktop only (hidden on mobile via header wrapper)
 */
export function CountryPicker() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Get current locale from URL params (all countries now have prefixes)
  const currentLocale = (params.locale as LocaleCode) || DEFAULT_LOCALE;

  /**
   * Handle locale change
   * Preserves the current path and navigates to new locale
   *
   * Examples:
   * - US /us/alldeals → India: /in/alldeals
   * - India /in/profile → US: /us/profile
   * - UK /gb/ → Australia: /au/
   */
  function handleLocaleChange(newLocale: string) {
    // Remove current locale prefix (e.g., "/in" or "/us")
    if (!newLocale) return;
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

    // Build new path with new locale prefix
    const newPath = `/${newLocale}${pathWithoutLocale || "/"}`;

    console.log("DEBUG locale change", {
      pathname,
      pathWithoutLocale,
      newPath,
      newLocale,
    });

    router.push(newPath);
  }

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      {/* Trigger: Flag emoji only, compact size */}
      <SelectTrigger
        className="h-10 w-12 px-0 border-none shadow-none hover:bg-accent focus:ring-0 focus:ring-offset-0"
        aria-label="Select country"
      >
        <SelectValue>
          <span
            className="text-2xl"
            role="img"
            aria-label={`${SUPPORTED_LOCALES[currentLocale].name} flag`}
          >
            {SUPPORTED_LOCALES[currentLocale].flag}
          </span>
        </SelectValue>
      </SelectTrigger>

      {/* Dropdown: Flag + Country name, aligned right */}
      <SelectContent align="end" className="min-w-[180px]">
        {Object.values(SUPPORTED_LOCALES).map((locale) => (
          <SelectItem key={locale.code} value={locale.code}>
            <span className="flex items-center gap-2">
              <span
                className="text-lg"
                role="img"
                aria-label={`${locale.name} flag`}
              >
                {locale.flag}
              </span>
              <span className="text-sm">{locale.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
