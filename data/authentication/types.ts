// Auth-related type definitions

import type { ApiResponse, UserProfile } from "@/types/profile.types";

export type OtpRequestType =
  | "signup"
  | "signin_email"
  | "signin_mobile"
  | "update_email"
  | "update_phone";

export interface OtpRequestPayload {
  requestType: OtpRequestType;
  email?: string;
  phone?: string | null;
  countryCode?: string;
  firstName?: string;
  lastName?: string;
}

export interface OtpSendResponse {
  success: boolean;
  sessionId?: string;
  message?: string;
  error?: string;
}

export interface OtpVerifyPayload {
  otp: string;
  sessionId: string;
  requestType: OtpRequestType;
}

export interface OtpVerifyResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    token?: string;
    user?: UserProfile;
  };
}

export interface SignOutResponse extends ApiResponse {}

// ==================== SIGNUP API TYPES ====================

// 1. Send OTP (Signup)
export interface SignupSendOtpRequest {
  email: string;
}

export interface SignupSendOtpResponse {
  status: 200 | 409;
  message: string;
  data?: {
    email: string;
  };
}

// 2. Verify OTP (Signup)
export interface SignupVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface SignupVerifyOtpResponse {
  status: 200 | 400;
  message: string;
  data?: {
    verified: boolean;
    email: string;
  };
}

// 3. Create Account (Signup)
export interface SignupCreateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  termsAccepted: boolean;
}

export interface SignupCreateAccountResponse {
  status: 201;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      emailVerified: boolean;
      status: string;
    };
  };
}

// Unified service response type
export interface SignupServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

// ==================== LOGIN API TYPES ====================

// 1. Send OTP (Login)
export interface LoginSendOtpRequest {
  email?: string;
  phone?: string;
}

export interface LoginSendOtpResponse {
  status: 200;
  message: string;
  data?: {
    email?: string;
    phone?: string;
  };
}

// 2. Verify OTP (Login)
export interface LoginVerifyOtpRequest {
  email?: string;
  phone?: string;
  otp: string;
}

export interface LoginVerifyOtpResponse {
  status: 200;
  message: string;
  data: {
    user: {
      id: string;
      email?: string;
      phoneNumber?: string;
      firstName: string;
      lastName: string;
      emailVerified: boolean;
      phoneNumberVerified: boolean;
      profileCompleted: boolean;
      status: string;
    };
  };
}

// ==================== COMPLETE PROFILE API TYPES ====================

export interface CompleteProfileRequest {
  phoneNumber?: string;
  mobileNotifications?: boolean;
}

export interface CompleteProfileResponse {
  status: 200;
  message: string;
  data: {
    user: UserProfile;
  };
}

// ==================== UPDATE CONTACT API TYPES ====================

export interface UpdateContactSendOtpRequest {
  email?: string;
  phone?: string;
}

export interface UpdateContactSendOtpResponse {
  status: 200;
  message: string;
  data?: any;
}

export interface UpdateContactVerifyOtpRequest {
  email?: string;
  phone?: string;
  otp: string;
}

export interface UpdateContactVerifyOtpResponse {
  status: 200;
  message: string;
  data: {
    user: {
      id: string;
      email?: string;
      emailVerified?: boolean;
      phoneNumber?: string;
      phoneNumberVerified?: boolean;
    };
  };
}

// ==================== PROFILE UPDATE API TYPES ====================

// Update Preferences
export interface UpdatePreferencesRequest {
  gender?: string;
  categoryIds?: string[];
  storeIds?: string[];
  brandIds?: string[];
}

export interface UpdatePreferencesResponse {
  status: 200;
  message: string;
  data: {
    user: UserProfile;
  };
}
