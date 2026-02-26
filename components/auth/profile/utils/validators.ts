// Pure validation functions for profile forms
// Returns { isValid, errors } for each form type

import { validatePhoneNumber } from '@/lib/utils';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

/**
 * Validate personal details form (firstName, lastName)
 */
export const validatePersonalDetails = (form: {
  firstName: string;
  lastName: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!form.firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  } else if (!NAME_REGEX.test(form.firstName)) {
    errors.firstName = "First name should only contain alphabets";
  }

  if (!form.lastName?.trim()) {
    errors.lastName = "Last name is required";
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  } else if (!NAME_REGEX.test(form.lastName)) {
    errors.lastName = "Last name should only contain alphabets";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email?.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (
  phone: string,
  phoneCountry?: any
): { isValid: boolean; error?: string } => {
  if (!phone?.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (phoneCountry) {
    // Use intelligent validation with country data
    const validationResult = validatePhoneNumber(phone, phoneCountry);
    if (validationResult !== true) {
      return {
        isValid: false,
        error: typeof validationResult === 'string' ? validationResult : 'The phone number is invalid'
      };
    }
  } else {
    // No fallback - country data is required for proper validation
    return {
      isValid: false,
      error: "Unable to validate phone number. Please select a country."
    };
  }

  return { isValid: true };
};

/**
 * Sanitize phone input (remove non-digits)
 */
export const sanitizePhone = (value: string): string => {
  return value.replace(/\D/g, '');
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
