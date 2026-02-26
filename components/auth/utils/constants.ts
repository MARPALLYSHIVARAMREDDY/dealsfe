// Authentication UI Configuration
// Defines mode-specific settings for signin and signup

export const AUTH_CONFIG = {
  signin: {
    heading: "Welcome Back!",
    description: "Sign in to access your personalized deals and saved items.",
    showLoginMethodToggle: true,
    showNameFields: false,
    showTermsCheckbox: false,
    getButtonText: (loginMethod: "email" | "mobile") =>
      `Continue with ${loginMethod === "email" ? "Email" : "Mobile"}`,
    footerText: {
      question: "Don't have an account? ",
      actionText: "Sign up",
    },
  },
  signup: {
    heading: "Join Deals Mocktail",
    description:
      "Create an account to unlock exclusive deals and personalized recommendations.",
    showLoginMethodToggle: false,
    showNameFields: true,
    showTermsCheckbox: true,
    getButtonText: () => "Create Account",
    footerText: {
      question: "Already have an account? ",
      actionText: "Sign in",
    },
  },
} as const;

export const LOGIN_METHOD_TABS = [
  { id: "email" as const, label: "Email" },
  { id: "mobile" as const, label: "Mobile" },
] as const;

export const SOCIAL_LOGIN_PROVIDERS = [
  { name: "Google", id: "google" as const },
  { name: "Apple", id: "apple" as const },
] as const;

export const OTP_LENGTH = 6;
export const RESEND_TIMER_SECONDS = 60;
