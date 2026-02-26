import "./globals.css";
import type { Metadata } from "next";
import { Geist, Lora, Fira_Code } from "next/font/google";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/providers/redux-provider";
import { AddMobilePopup } from "@/components/auth/profile-completion/add-mobile-popup";
import { PreferenceSelectionPopup } from "@/components/auth/profile-completion/preference-selection-popup";
import { MobileKeyboardProvider } from "@/components/providers/mobile-keyboard-provider";
import PreviewModal from "@/components/preview-modal";
import ProfileFetecher from "@/components/providers/profile-fetcher";
import CatelogueFetecher from "@/components/providers/catalogue/catalogue-fetcher";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deals Mocktail - Best Deals and Offers",
  description:
    "Discover the best deals, trending sales, and exclusive offers on products from top stores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${lora.variable} ${firaCode.variable}`}
    >
      <ReduxProvider>
        <MobileKeyboardProvider>
          <body>{children}</body>
          <AddMobilePopup />
          <PreferenceSelectionPopup />
          <PreviewModal />
          <Toaster position="top-center" richColors />
        </MobileKeyboardProvider>
        <ProfileFetecher />
        <CatelogueFetecher />
      </ReduxProvider>
    </html>
  );
}
