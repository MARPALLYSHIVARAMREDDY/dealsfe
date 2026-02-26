import React, { useState, useImperativeHandle, forwardRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { validatePhoneNumber } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, country: any, isValid?: boolean) => void;
  country?: string;
  inputClass?: string;
  containerClass?: string;
  buttonClass?: string;
  disabled?: boolean;
  error?: string | null;
  validateOnChange?: boolean; // Enable internal validation
  showErrorOnEmpty?: boolean; // Show error when field is empty and touched
  label?: string; // Optional label text
  id?: string; // Optional id for label's htmlFor
}

export interface PhoneInputRef {
  validate: () => boolean;
  setError: (error: string | null) => void;
}

const CustomPhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(({
  value,
  onChange,
  country = "us",
  inputClass = "w-full",
  containerClass = "w-full",
  buttonClass = "border-input",
  disabled = false,
  error: externalError,
  validateOnChange = false,
  showErrorOnEmpty = false,
  label,
  id,
}, ref) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [currentCountry, setCurrentCountry] = useState<any>(null);
  const [touched, setTouched] = useState(false);

  // Expose validate and setError methods to parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!value || !currentCountry) {
        setInternalError('Phone number is required');
        return false;
      }
      const validationResult = validatePhoneNumber(value, currentCountry);
      if (validationResult !== true) {
        setInternalError(typeof validationResult === 'string' ? validationResult : 'The phone number is invalid');
        return false;
      }
      setInternalError(null);
      return true;
    },
    setError: (error: string | null) => {
      setInternalError(error);
    }
  }));

  // Use external error if provided, otherwise use internal error
  const error = externalError || internalError;
  const hasError = !!error;

  const handleChange = (phone: string, country: any) => {
    console.log({phone, country});

    setCurrentCountry(country);
    setTouched(true);

    // Clear internal error when user types
    if (internalError) {
      setInternalError(null);
    }

    // Ensure phone number has + prefix for E.164 format
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = `+${phone}`;
    }

    let isValid = true;
    // Perform validation if enabled and field has value
    if (validateOnChange) {
      if (!formattedPhone) {
        // Empty field
        if (showErrorOnEmpty && touched) {
          setInternalError('Phone number is required');
          isValid = false;
        }
      } else {
        // Validate phone number
        const validationResult = validatePhoneNumber(formattedPhone, country);

        if (validationResult !== true) {
          setInternalError(typeof validationResult === 'string' ? validationResult : 'The phone number is invalid');
          isValid = false;
        }
      }
    }

    // Call parent onChange with E.164 formatted phone (with + prefix)
    onChange(formattedPhone, country, isValid);
  };

  const handleBlur = () => {
    setTouched(true);
    // Validate on blur if enabled
    if (validateOnChange && !value && showErrorOnEmpty) {
      setInternalError('Phone number is required');
      onChange(value, currentCountry, false);
    }
  };

  return (
    <div>
      {label && (
        <Label htmlFor={id} className="mb-2 block">
          {label}
        </Label>
      )}
      <div className="w-full">
        <div className="relative ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-md transition-all">
          <PhoneInput
            country={country}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            enableSearch={true}
            disableSearchIcon={true}
            searchPlaceholder="Search country"
            inputClass={inputClass}
            containerClass={containerClass}
            buttonClass={buttonClass}
            countryCodeEditable={false}
            inputStyle={{
              width: "100%",
              height: "40px",
              fontSize: "14px",
              paddingLeft: "48px",
              paddingRight: "12px",
              borderRadius: "6px",
              border: hasError
                ? "1px solid var(--destructive)"
                : "1px solid var(--input)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "text",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            buttonStyle={{
              height: "40px",
              borderRadius: "6px 0 0 6px",
              gap: "8px",
              border: hasError
                ? "1px solid var(--destructive)"
                : "1px solid var(--input)",
              backgroundColor: "var(--background)",
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "border-color 0.2s",
            }}
            dropdownStyle={{
              backgroundColor: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-md)",
              maxHeight: "300px",
              width: "330px",
              marginTop: "4px",
              padding: "0px",
              zIndex: 50,
            }}
            searchStyle={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--input)",
              borderRadius: "calc(var(--radius) - 2px)",
              padding: "8px 12px",
              margin: "4px",
              width: "calc(100% - 8px)",
              fontSize: "14px",
              outline: "none",
            }}
            dropdownClass="custom-phone-dropdown"
            searchClass="custom-phone-search"
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
});

CustomPhoneInput.displayName = 'CustomPhoneInput';

export default CustomPhoneInput;
