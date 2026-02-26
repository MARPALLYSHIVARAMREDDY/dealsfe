"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled,
}: InputFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export function CheckboxField({
  id,
  checked,
  onChange,
  error,
  label,
  disabled,
}: CheckboxFieldProps) {
  return (
    <div>
      <div className="flex items-start space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className={error ? "border-red-500" : ""}
        />
        <Label
          htmlFor={id}
          className="text-muted-foreground"
        >
          {label}
        </Label>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function TermsCheckbox({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <CheckboxField
      id="terms"
      checked={checked}
      onChange={onChange}
      error={error}
      label={
        <>
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms and Conditions
          </Link>
        </>
      }
    />
  );
}

interface SwitchFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export function SwitchField({
  id,
  checked,
  onChange,
  error,
  label,
  disabled,
}: SwitchFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-muted-foreground cursor-pointer"
        >
          {label}
        </Label>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className={error ? "border-red-500" : ""}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
