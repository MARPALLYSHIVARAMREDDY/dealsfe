// Type definitions for Profile/User management

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  countryCode: string;
  country: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  gender?: "male" | "female" | "others" | null;
  status: string;
  detailsVerified: boolean;
  profileCompleted: boolean;
  isActive: boolean;
  termsAccepted: boolean;
  preferencesSelected: boolean;
  mobileNotifications: boolean;
  newsletterSubscription: boolean;
  isDeleted: boolean;
  preferences: {
    categories?: string[];
    stores?: string[];
    brands?: string[];
  };
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  countryCode?: string;
  mobileNotifications?: boolean;
  newsletterSubscription?: boolean;
  categoryIds?: string[];
  storeIds?: string[];
  brandIds?: string[];
}

export interface EmailUpdatePayload {
  newEmail: string;
}

export interface PhoneUpdatePayload {
  newPhone: string;
  countryCode: string;
}

export interface OtpVerificationPayload {
  otp: string;
  type: "email" | "phone";
  newValue: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface OtpResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
}

export interface ProfilePreferences {
  notificationsEnabled: boolean;
  newsletterEnabled: boolean;
}
