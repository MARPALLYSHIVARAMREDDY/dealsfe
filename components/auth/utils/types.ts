// Component-specific types for authentication

export type AuthMode = "signin" | "signup" | "otp";
export type LoginMethod = "email" | "mobile";

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  termsAccepted: boolean;
}

export interface SigninFormData {
  email: string;
  phone: string;
  phoneCountry?: any; // Optional country object from phone input
}

export interface OtpVerificationProps {
  loginMethod: LoginMethod;
  email?: string;
  phone?: string;
  otp: string;
  isLoading: boolean;
  error: string | null;
  resendTimer: number;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}
