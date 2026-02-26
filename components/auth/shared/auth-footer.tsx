"use client";

import type { AuthMode } from "../utils/types";

interface AuthFooterProps {
  mode: AuthMode;
  onSwitch: () => void;
}

export function AuthFooter({ mode, onSwitch }: AuthFooterProps) {
  if (mode === "otp") return null;

  const text = mode === "signin"
    ? { question: "Don't have an account? ", actionText: "Sign up" }
    : { question: "Already have an account? ", actionText: "Sign in" };

  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {text.question}
      <button
        onClick={onSwitch}
        className="font-semibold text-primary hover:underline"
      >
        {text.actionText}
      </button>
    </p>
  );
}
