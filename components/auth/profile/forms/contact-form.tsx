"use client";

import { useState, useRef, useEffect } from "react";
import { InputField } from "@/components/auth/forms/form-fields";
import { PhoneInput, type PhoneInputRef } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { validateEmail, validatePhone } from "../utils/validators";
import type { OtpContactType } from "../utils/types";
import { detectUserCountry } from "@/lib/country-utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";

interface ContactFormProps {
  onVerifyClick: (type: OtpContactType, value: string) => void;
  onClearError: (type: OtpContactType) => void;
  errors?: {
    email?: string;
    phone?: string;
  };
}

export function ContactForm({ onVerifyClick, onClearError, errors: externalErrors }: ContactFormProps) {
  const { user } = useAppSelector((state) => state.newAuth);
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const [form, setForm] = useState({
    email: "",
    phone: "",
  });

  const [serverValues, setServerValues] = useState({
    email: "",
    phone: "",
  });

  // Initialize form values when user data is available
  useEffect(() => {
    if (user) {
      const initialValues = {
        email: user.email || "",
        phone: user.phoneNumber || user.phone || "",
      };
      setForm(initialValues);
      setServerValues({
        email: user.email || "",
        phone: user.phoneNumber || user.phone || "",
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Merge external errors (from API) with internal errors (from validation)
  const displayErrors = {
    email: externalErrors?.email || errors.email,
    phone: externalErrors?.phone || errors.phone,
  };

  const updateField = (field: keyof typeof form, value: string | any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear internal error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Clear external error for this field
    if (field === "email" && externalErrors?.email) {
      onClearError("email");
    }
  };

  const handlePhoneChange = (phone: string) => {
    setForm((prev) => ({ ...prev, phone }));
    // Clear internal error for phone field
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
    // Clear external error for phone field
    if (externalErrors?.phone) {
      onClearError("phone");
    }
  };

  const handleEmailVerify = () => {
    const validation = validateEmail(form.email);
    if (!validation.isValid) {
      setErrors({ email: validation.error || "Invalid email" });
      return;
    }
    onVerifyClick("email", form.email);
  };

  const handlePhoneVerify = () => {
    // Use ref validation for phone
    if (phoneInputRef.current && !phoneInputRef.current.validate()) {
      return; // Error shown by component
    }

    // All validations passed
    onVerifyClick("phone", form.phone);
  };

  const emailChanged = form.email.trim() !== serverValues.email;
  const emailUnverified = !user?.emailVerified;
  const showEmailVerify = emailChanged || emailUnverified;

  const phoneChanged = form.phone.trim() !== serverValues.phone;
  const phoneUnverified = !user?.phoneNumberVerified;
  const showPhoneVerify = phoneChanged || phoneUnverified;

  return (
    <div className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Email Address
        </label>
        <div className="flex items-center md:items-start gap-2">
          <InputGroup className={`flex-1 md:flex-none md:w-1/2 ${displayErrors.email ? "border-destructive" : ""}`}>
            <InputGroupInput
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john.doe@example.com"
              aria-invalid={!!displayErrors.email}
            />
            <InputGroupAddon align="inline-end">
              {user?.emailVerified && !emailChanged && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {(emailUnverified || emailChanged) && (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </InputGroupAddon>
          </InputGroup>
          {showEmailVerify && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEmailVerify}
              className="whitespace-nowrap self-center md:self-start md:mt-1"
            >
              Verify
            </Button>
          )}
        </div>
        {displayErrors.email && <p className="text-sm text-destructive">{displayErrors.email}</p>}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Phone Number
        </label>
        <div className="flex items-start gap-2">
          <div className="flex-1 md:flex-none md:w-1/2 relative">
            <PhoneInput
              ref={phoneInputRef}
              id="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              error={displayErrors.phone}
              defaultCountry={detectUserCountry()}
            />
            <div className="absolute right-3 top-[20px] -translate-y-1/2 flex items-center pointer-events-none z-10">
              {user?.phoneNumberVerified && !phoneChanged && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {(phoneUnverified || phoneChanged) && (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>
          {showPhoneVerify && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePhoneVerify}
              className="whitespace-nowrap mt-1"
            >
              Verify
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
