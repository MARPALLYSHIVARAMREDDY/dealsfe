"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendSignupOtp } from "@/store/auth-store";
import { notification } from "@/lib/notification-service";
import { InputField, TermsCheckbox } from "./form-fields";
import { validateSignupForm } from "../utils/validators";
import { AUTH_CONFIG } from "../utils/constants";
import type { SignupFormData } from "../utils/types";

interface SignupFormProps {
  onSuccess: (email: string, formData: SignupFormData) => void;
  initialValues?: SignupFormData | null;
}

export function SignupForm({ onSuccess, initialValues }: SignupFormProps) {
  const dispatch = useAppDispatch();
  const { otp } = useAppSelector((state) => state.newAuth);

  const [form, setForm] = useState<SignupFormData>({
    firstName: initialValues?.firstName || "",
    lastName: initialValues?.lastName || "",
    email: initialValues?.email || "",
    termsAccepted: initialValues?.termsAccepted || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const config = AUTH_CONFIG.signup;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateSignupForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors
    setErrors({});

    try {
      // Call Redux action (which calls auth-client API)
      await dispatch(sendSignupOtp({ email: form.email })).unwrap();

      // Success - notify and switch to OTP screen
      notification.success("OTP Sent", "Please check your email for the verification code");
      onSuccess(form.email, form);
    } catch (error) {
      // Handle errors
      const errorMessage = error as string;
      if (errorMessage.includes("already exists")) {
        setErrors({ email: errorMessage });
      } else {
        notification.error("Error", errorMessage);
      }
    }
  };

  const updateField = (field: keyof SignupFormData, value: any) => {
    let sanitizedValue = value;
    if (field === "firstName" || field === "lastName") {
      // Allow only alphabets and spaces
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setForm((prev) => ({ ...prev, [field]: sanitizedValue }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-background flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{config.heading}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              label="First Name"
              value={form.firstName}
              onChange={(value) => updateField("firstName", value)}
              error={errors.firstName}
              placeholder="John"
              disabled={otp.isLoading}
            />

            <InputField
              id="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={(value) => updateField("lastName", value)}
              error={errors.lastName}
              placeholder="Doe"
              disabled={otp.isLoading}
            />
          </div>

          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            error={errors.email}
            placeholder="john.doe@example.com"
            disabled={otp.isLoading}
          />

          <TermsCheckbox
            checked={form.termsAccepted}
            onChange={(checked) => updateField("termsAccepted", checked)}
            error={errors.termsAccepted}
          />

          <Button
            type="submit"
            className="w-full h-12"
            disabled={otp.isLoading}
          >
            {otp.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              config.getButtonText()
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
