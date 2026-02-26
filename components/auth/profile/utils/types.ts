// Profile component-specific type definitions

export interface PersonalDetailsForm {
  firstName: string;
  lastName: string;
  gender?: string;
}

export interface ContactForm {
  email: string;
  phone: string | null;
  phoneCountry?: any;
}

export interface SubscriptionForm {
  mobileNotifications: boolean;
  newsletterSubscription: boolean;
}

export interface PreferenceForm {
  categories: string[];
  stores: string[];
  brands: string[];
}

export type ProfileTab = "profile" | "preferences";

export type OtpContactType = "email" | "phone";

export interface OtpContext {
  type: OtpContactType;
  value: string;
}
