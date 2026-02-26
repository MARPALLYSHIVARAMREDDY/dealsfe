'use client';

import { useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LOCALES, type LocaleCode, DEFAULT_LOCALE } from '@/lib/locale-utils';
import { Check } from 'lucide-react';

/**
 * Mobile Country Picker Component
 *
 * Displays a country selector for mobile devices.
 * Opens as a bottom sheet when clicked.
 *
 * Features:
 * - Flag emoji in trigger button
 * - Bottom sheet with country list
 * - Flag + country name in list
 * - Preserves current path when switching locales
 */
export function CountryPickerMobile() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);

  // Get current locale from URL params
  const currentLocale = (params.locale as LocaleCode) || DEFAULT_LOCALE;

  /**
   * Handle locale change
   * Preserves the current path and navigates to new locale
   */
  function handleLocaleChange(newLocale: string) {
    if (!newLocale) return;

    // Remove current locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');

    // Build new path with new locale prefix
    const newPath = `/${newLocale}${pathWithoutLocale || '/'}`;

    // Navigate to new locale
    router.push(newPath);

    // Close drawer
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* Trigger: Flag emoji only, compact size */}
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          aria-label="Select country"
        >
          <span
            className="text-xl"
            role="img"
            aria-label={`${SUPPORTED_LOCALES[currentLocale].name} flag`}
          >
            {SUPPORTED_LOCALES[currentLocale].flag}
          </span>
        </Button>
      </DrawerTrigger>

      {/* Bottom Sheet Content */}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Country</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-8 pt-2">
          <div className="space-y-1">
            {Object.values(SUPPORTED_LOCALES).map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg
                  transition-colors hover:bg-accent
                  ${currentLocale === locale.code ? 'bg-accent' : ''}
                `}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={`${locale.name} flag`}
                  >
                    {locale.flag}
                  </span>
                  <span className="text-base font-medium">{locale.name}</span>
                </span>
                {currentLocale === locale.code && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
