// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>; // { email: "Invalid email", ... }
}

// Original validation types
interface ValidationRule {
  field: string;
  check: (value: any) => boolean;
  error: {
    title: string;
    description: string;
  };
}

interface ValidationConfig {
  email?: ValidationRule[];
  mobile?: ValidationRule[];
  profile?: ValidationRule[];
}

interface AuthValidationConfig {
  signin: ValidationConfig;
  signup: ValidationConfig;
  profile?: ValidationConfig;
}

// Validation rules
const NAME_REGEX = /^[A-Za-z\s]+$/;

const AUTH_VALIDATION_CONFIG: AuthValidationConfig = {
    profile: {
      profile: [
        {
          field: "firstName",
          check: (value: string) => !value || !value.trim(),
          error: {
            title: "First Name Required",
            description: "Please enter your first name to continue.",
          },
        },
        {
          field: "firstName",
          check: (value: string) => Boolean(value && !NAME_REGEX.test(value)),
          error: {
            title: "Invalid First Name",
            description: "First name should only contain alphabets.",
          },
        },
        {
          field: "lastName",
          check: (value: string) => !value || !value.trim(),
          error: {
            title: "Last Name Required",
            description: "Please enter your last name to continue.",
          },
        },
        {
          field: "lastName",
          check: (value: string) => Boolean(value && !NAME_REGEX.test(value)),
          error: {
            title: "Invalid Last Name",
            description: "Last name should only contain alphabets.",
          },
        },
        {
          field: "email",
          check: (value: string) => !value || !value.trim(),
          error: {
            title: "Email Required",
            description: "Please enter your email address to continue.",
          },
        },
        {
          field: "email",
          check: (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          error: {
            title: "Invalid Email",
            description: "Please enter a valid email address.",
          },
        },
        {
          field: "phone",
          check: (value: string) => !value || !value.trim(),
          error: {
            title: "Phone Number Required",
            description: "Please enter your phone number to continue.",
          },
        },
      ],
    },
  signin: {
    email: [
      {
        field: "email",
        check: (value: string) => !value || !value.trim(),
        error: {
          title: "Email Required",
          description: "Please enter your email address to continue.",
        },
      },
      {
        field: "email",
        check: (value: string) => Boolean(value && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
        error: {
          title: "Invalid Email",
          description: "Please enter a valid email address.",
        },
      },
    ],
    mobile: [
      {
        field: "phone",
        check: (value: string) => !value || !value.trim(),
        error: {
          title: "Phone Number Required",
          description: "Please enter your phone number to continue.",
        },
      },
    ],
  },
  signup: {
    email: [
      {
        field: "firstName",
        check: (value: string) => !value || !value.trim(),
        error: {
          title: "First Name Required",
          description: "Please enter your first name to continue.",
        },
      },
      {
        field: "firstName",
        check: (value: string) => Boolean(value && !NAME_REGEX.test(value)),
        error: {
          title: "Invalid First Name",
          description: "First name should only contain alphabets.",
        },
      },
      {
        field: "lastName",
        check: (value: string) => !value || !value.trim(),
        error: {
          title: "Last Name Required",
          description: "Please enter your last name to continue.",
        },
      },
      {
        field: "lastName",
        check: (value: string) => Boolean(value && !NAME_REGEX.test(value)),
        error: {
          title: "Invalid Last Name",
          description: "Last name should only contain alphabets.",
        },
      },
      {
        field: "email",
        check: (value: string) => !value || !value.trim(),
        error: {
          title: "Email Required",
          description: "Please enter your email address to continue.",
        },
      },
      {
        field: "email",
        check: (value: string) => Boolean(value && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
        error: {
          title: "Invalid Email",
          description: "Please enter a valid email address.",
        },
      },
      {
        field: "agreedToTerms",
        check: (value: boolean) => !value,
        error: {
          title: "Terms and Conditions",
          description: "Please agree to the terms and conditions to continue.",
        },
      },
    ],
  },
};

// Validation function
export const validateAuthForm = (
  mode: "signin" | "signup" | "profile",
  loginMethod: "email" | "mobile" | "profile",
  formData: Record<string, any>
): ValidationResult => {
  const validations = AUTH_VALIDATION_CONFIG[mode]?.[loginMethod];

  const errors: Record<string, string> = {};

  if (!validations) {
    return { isValid: true, errors: {} };
  }

  for (const validation of validations) {
    const fieldValue = formData[validation.field];
    if (validation.check(fieldValue)) {
      // Store error message for this field
      errors[validation.field] = validation.error.description;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
