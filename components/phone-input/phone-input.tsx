"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { validatePhoneNumber } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { InputGroup } from '@/components/ui/input-group';

export interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  error?: string;
  shouldValidate?: boolean;
  placeholder?: string;
  disabled?: boolean;
  defaultCountry?: string;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
}

export interface PhoneInputRef {
  validate: () => boolean;
  focus: () => void;
  getValue: () => string;
  clear: () => void;
}

export const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  (
    {
      value,
      onChange,
      error,
      shouldValidate = false,
      placeholder = "Enter phone number",
      disabled = false,
      defaultCountry = "us",
      label,
      id,
      name,
      required = false,
      className,
    },
    ref
  ) => {
    // State management
    const [internalError, setInternalError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const [hasBeenValidated, setHasBeenValidated] = useState(false);
    const [currentCountry, setCurrentCountry] = useState<any>(null);
    const inputRef = useRef<any>(null);

    // Initialize currentCountry from the react-phone-input-2 component
    useEffect(() => {
      if (inputRef.current && !currentCountry) {
        // Get country data from the react-phone-input-2 instance
        const countryData = inputRef.current.state?.selectedCountry;
        if (countryData) {
          setCurrentCountry(countryData);
        }
      }
    }, [value, currentCountry]);

    // Perform validation
    const performValidation = (phone: string, country: any): boolean => {
      if (!phone || !country) {
        setInternalError('Phone number is required');
        return false;
      }

      const validationResult = validatePhoneNumber(phone, country);
      if (validationResult !== true) {
        setInternalError(
          typeof validationResult === 'string'
            ? validationResult
            : 'The phone number is invalid'
        );
        return false;
      }

      setInternalError(null);
      return true;
    };

    // Handle phone number change
    const handleChange = (phone: string, country: any) => {
      setCurrentCountry(country);

      // Clear internal error when user types (external errors persist)
      if (internalError) {
        setInternalError(null);
      }

      // Ensure E.164 format with + prefix
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

      // Validate only if already touched or hasBeenValidated
      if (touched || hasBeenValidated) {
        performValidation(formattedPhone, country);
      }

      // Always return E.164 format to parent
      onChange(formattedPhone);
    };

    // Handle blur event
    const handleBlur = () => {
      if (!touched) {
        setTouched(true);
        // Validate on first blur
        performValidation(value, currentCountry);
      }
    };

    // Monitor shouldValidate prop changes
    useEffect(() => {
      if (shouldValidate && !hasBeenValidated) {
        setHasBeenValidated(true);
        performValidation(value, currentCountry);
      }
    }, [shouldValidate]);

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      validate: () => {
        setHasBeenValidated(true);
        setTouched(true);

        if (!value || !currentCountry) {
          setInternalError('Phone number is required');
          return false;
        }

        return performValidation(value, currentCountry);
      },

      focus: () => {
        inputRef.current?.numberInputRef?.focus();
      },

      getValue: () => {
        return value.startsWith('+') ? value : `+${value}`;
      },

      clear: () => {
        onChange('');
        setInternalError(null);
        setTouched(false);
        setHasBeenValidated(false);
      },
    }));

    // Determine which error to show (external takes precedence)
    const displayError = error || (touched || hasBeenValidated ? internalError : null);
    const hasError = !!displayError;

    // Styling to match shadcn/ui Input component
    const inputStyle: React.CSSProperties = {
      width: "100%",
      height: "38px", // Reduced to fit within InputGroup's h-10 (40px) with border
      paddingLeft: "48px",
      paddingRight: "12px",
      borderRadius: "calc(var(--radius) * 1px)",
      border: "none",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "text",
      transition: "color 0.2s, box-shadow 0.2s, border-color 0.2s",
    };

    const buttonStyle: React.CSSProperties = {
      height: "38px", // Reduced to fit within InputGroup's h-10
      borderRadius: "calc(var(--radius) * 1px) 0 0 calc(var(--radius) * 1px)",
      border: "none",
      backgroundColor: "transparent",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "border-color 0.2s",
    };

    const dropdownStyle: React.CSSProperties = {
      // Positioning - fixed to center on screen
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -60%)",

      // Sizing
      width: "400px",
      maxWidth: "90vw",
      maxHeight: "600px",

      // Appearance
      backgroundColor: "white",
      color: "hsl(var(--popover-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "calc(var(--radius))",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",

      // Layout
      padding: "8px",
      zIndex: 9999,
      overflowY: "auto",

    };

    const searchStyle: React.CSSProperties = {
      width: "100%",
      padding: "8px 12px",
      margin: "0",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--input))",
      borderRadius: "calc(var(--radius) * 1px)",
      outline: "none",
    };

    return (
      <div className={cn("space-y-2", className)}>
          {label && (
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}

          <InputGroup className={cn("h-10 overflow-hidden", hasError ? "border border-destructive" : "border-ring border-zinc shadow-xs")}>
            <ReactPhoneInput
              country={defaultCountry}
              value={value.replace(/^\+/, '')}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              placeholder={placeholder}
              inputProps={{
                id,
                name,
                required,
                'aria-invalid': hasError,
                'data-slot': 'input-group-control',
              } as any}
              inputStyle={inputStyle}
              buttonStyle={buttonStyle}
              dropdownStyle={dropdownStyle}
              searchStyle={searchStyle}
              containerClass="phone-input-container !border-0 !w-full"
              inputClass={cn("phone-input-field !border-0 !shadow-none !text-base md:!text-sm dark:!bg-input/30 !placeholder:text-muted-foreground focus-visible:!ring-0", hasError && "focus:!border-destructive")}
              buttonClass="phone-input-button !border-0 !bg-transparent"
              dropdownClass="phone-input-dropdown"
              {...({ ref: inputRef } as any)}
              enableSearch
              disableSearchIcon
            />
          </InputGroup>

          {displayError && (
            <p className="mt-1.5 text-sm text-destructive flex items-center gap-1.5">
              <span>{displayError}</span>
            </p>
          )}
        </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
