// Pure validation functions for authentication forms
// Returns { isValid, errors } for each form type

import { validatePhoneNumber } from '@/lib/utils';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  termsAccepted: boolean;
}

export interface SigninEmailForm {
  email: string;
}

export interface SigninMobileForm {
  phone: string;
  phoneCountry?: any; // Optional country object for intelligent validation
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

/**
 * Validate signup form
 */
export const validateSignupForm = (form: SignupForm): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!form.firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (!NAME_REGEX.test(form.firstName)) {
    errors.firstName = "First name should only contain alphabets";
  }

  if (!form.lastName?.trim()) {
    errors.lastName = "Last name is required";
  } else if (!NAME_REGEX.test(form.lastName)) {
    errors.lastName = "Last name should only contain alphabets";
  }

  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.termsAccepted) {
    errors.termsAccepted = "You must agree to the terms and conditions";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate signin email form
 */
export const validateSigninEmailForm = (form: SigninEmailForm): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate signin mobile form
 */
export const validateSigninMobileForm = (form: SigninMobileForm): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!form.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (form.phoneCountry) {
    // Use intelligent validation with country data
    const validationResult = validatePhoneNumber(form.phone, form.phoneCountry);
    if (validationResult !== true) {
      errors.phone = typeof validationResult === 'string' ? validationResult : 'The phone number is invalid';
    }
  } else {
    // No fallback - country data is required for proper validation
    errors.phone = "Unable to validate phone number. Please refresh and try again.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate OTP input
 */
export const validateOtp = (otp: string): { isValid: boolean; error?: string } => {
  if (!otp || otp.length !== 6) {
    return { isValid: false, error: "Please enter the 6-digit OTP" };
  }

  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: "OTP must contain only numbers" };
  }

  return { isValid: true };
};

/**
 * Sanitize OTP input (remove non-digits, limit to 6)
 */
export const sanitizeOtp = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 6);
};
