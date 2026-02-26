"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendSigninOtp } from "@/store/auth-store";
import { notification } from "@/lib/notification-service";
import { InputField } from "./form-fields";
import { PhoneInput, type PhoneInputRef } from "@/components/phone-input";
import { validateSigninEmailForm, validateSigninMobileForm } from "../utils/validators";
import { AUTH_CONFIG, LOGIN_METHOD_TABS } from "../utils/constants";
import type { LoginMethod, SigninFormData } from "../utils/types";
import { detectUserCountry } from "@/lib/country-utils";

interface SigninFormProps {
  onSuccess: (contact: string, loginMethod: LoginMethod, formData: { email: string; phone: string }) => void;
  initialValues?: { email: string; phone: string };
  initialLoginMethod?: LoginMethod;
}

export function SigninForm({ onSuccess, initialValues, initialLoginMethod }: SigninFormProps) {
  const dispatch = useAppDispatch();
  const { otp } = useAppSelector((state) => state.newAuth);
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const [loginMethod, setLoginMethod] = useState<LoginMethod>(initialLoginMethod || "email");
  const [form, setForm] = useState<SigninFormData>({
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    phoneCountry: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const config = AUTH_CONFIG.signin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on login method
    let validation;
    if (loginMethod === "email") {
      validation = validateSigninEmailForm({ email: form.email });

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
    } else {
      // Mobile validation - use ref.validate() for phone input
      if (phoneInputRef.current && !phoneInputRef.current.validate()) {
        return; // Errors shown by component internally
      }
    }

    // Clear errors
    setErrors({});

    try {
      // Prepare payload
      const payload = loginMethod === "email"
        ? { email: form.email }
        : { phone: form.phone };

      // Call Redux action
      await dispatch(sendSigninOtp(payload)).unwrap();

      // Success - notify and switch to OTP screen
      notification.success("OTP Sent", `Please check your ${loginMethod} for the verification code`);
      onSuccess(
        loginMethod === "email" ? form.email : form.phone,
        loginMethod,
        { email: form.email, phone: form.phone }
      );
    } catch (error) {
      const errorMessage = error as string;

      // Check for "User not found" error (404 from API)
      if (errorMessage.includes("User not found")) {
        // Set field error based on login method - NO notification
        if (loginMethod === "email") {
          setErrors({ email: errorMessage });
        } else {
          setErrors({ phone: errorMessage });
        }
      } else {
        // Show notification for all other errors
        notification.error("Error", errorMessage);
      }
    }
  };

  const updateField = (field: keyof SigninFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (phone: string) => {
    setForm((prev) => ({ ...prev, phone }));
    // Clear error for phone field when user types
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
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

        {/* Login Method Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
          {LOGIN_METHOD_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setLoginMethod(tab.id);
                setErrors({});
              }}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                loginMethod === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {loginMethod === "email" ? (
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
          ) : (
            <PhoneInput
              ref={phoneInputRef}
              id="phone"
              label="Mobile Number"
              value={form.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              disabled={otp.isLoading}
              defaultCountry={detectUserCountry()}
            />
          )}

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
              config.getButtonText(loginMethod)
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
