"use client";

import { useState, useEffect } from "react";
import { InputField } from "@/components/auth/forms/form-fields";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateProfile } from "@/data/authentication/auth-server-action";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth-store";
import { GENDER_OPTIONS } from "../utils/constants";

export function PersonalDetailsForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.newAuth);
  console.log({user})
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  const [originalValues, setOriginalValues] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  // Initialize form values when user data is available
  useEffect(() => {
    if (user) {
      const initialValues = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
      };
      setForm(initialValues);
      setOriginalValues(initialValues);
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});

  const updateField = (field: keyof typeof form, value: string) => {
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


  const handleNameBlur = async (field: "firstName" | "lastName") => {
    const currentValue = form[field];

    // If value is empty or unchanged, skip
    if (!currentValue || currentValue === originalValues[field]) return;

    // Update via API
    setLoadingFields((prev) => ({ ...prev, [field]: true }));
    try {
      const result = await updateProfile({
        [field]: currentValue,
      });

      if (result.success && result.data) {
        dispatch(setUser(result.data));
        setOriginalValues((prev) => ({ ...prev, [field]: currentValue }));
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch {
      // Revert to original value
      setForm((prev) => ({ ...prev, [field]: originalValues[field] }));
    } finally {
      setLoadingFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleGenderChange = async (value: string) => {
    // Update local state
    updateField("gender", value);

    // If value unchanged, skip
    if (value === originalValues.gender) return;

    // Update via API
    setLoadingFields((prev) => ({ ...prev, gender: true }));
    try {
      const result = await updateProfile({
        gender: value,
      });

      if (result.success && result.data) {
        dispatch(setUser(result.data));
        setOriginalValues((prev) => ({ ...prev, gender: value }));
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch {
      // Revert to original value
      setForm((prev) => ({ ...prev, gender: originalValues.gender }));
    } finally {
      setLoadingFields((prev) => ({ ...prev, gender: false }));
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="firstName"
          label="First Name"
          type="text"
          value={form.firstName}
          onChange={(value) => updateField("firstName", value)}
          onBlur={() => handleNameBlur("firstName")}
          error={errors.firstName}
          disabled={loadingFields.firstName}
          placeholder="John"
        />

        <InputField
          id="lastName"
          label="Last Name"
          type="text"
          value={form.lastName}
          onChange={(value) => updateField("lastName", value)}
          onBlur={() => handleNameBlur("lastName")}
          error={errors.lastName}
          disabled={loadingFields.lastName}
          placeholder="Doe"
        />

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={form.gender}
            onValueChange={handleGenderChange}
            disabled={loadingFields.gender}
            className="flex gap-4"
          >
            {GENDER_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
