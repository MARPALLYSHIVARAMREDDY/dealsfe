"use client";

import { useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { markProfileCompleted } from "@/store/auth-store";
import { completeProfile } from "@/data/authentication/auth-server-action";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { PhoneInput, type PhoneInputRef } from "@/components/phone-input";
import { SwitchField } from "@/components/auth/forms/form-fields";
import { detectUserCountry } from "@/lib/country-utils";

export function AddMobilePopup() {
  const { user } = useAppSelector((state) => state.newAuth);
  const dispatch = useAppDispatch();
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNotifications, setMobileNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    notifications?: string;
    general?: string;
  }>({});

  const isOpen = !!(user && !user.profileCompleted);


  const handlePhoneChange = (phone: string) => {
    setMobileNumber(phone);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = async () => {
    // Use ref validation for final check
    if (phoneInputRef.current && !phoneInputRef.current.validate()) {
      // Error is set internally by ref.validate()
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await completeProfile({
        phoneNumber: mobileNumber,
        mobileNotifications: mobileNotifications,
      });

      if (response.success) {
        toast.success(response.message || "Profile updated successfully");
        // Manually mark profile as completed in Redux store
        dispatch(markProfileCompleted());
      } else {
        // Check if error is related to phone number
        const errorMessage = response.error || "Failed to update profile";
        if (errorMessage.toLowerCase().includes("phone") ||
            errorMessage.toLowerCase().includes("mobile") ||
            errorMessage.toLowerCase().includes("number")) {
          setErrors({ phone: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      setErrors({
        general: "An error occurred while updating your profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md max-sm:fixed max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-full max-sm:max-w-full max-sm:h-[65dvh] max-sm:rounded-t-[20px] max-sm:rounded-b-none max-sm:content-start"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Add Your Mobile Number
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            We need your mobile number to complete your registration and send
            you deal alerts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="font-medium">Mobile Number</Label>
            <div className="mt-1">
              <PhoneInput
                ref={phoneInputRef}
                value={mobileNumber}
                onChange={handlePhoneChange}
                defaultCountry={detectUserCountry()}
                error={errors.phone}
              />
            </div>
          </div>
        </div>

        <div>
          <SwitchField
            id="mobileNotifications"
            checked={mobileNotifications}
            onChange={(checked) => {
              setMobileNotifications(checked);
              if (errors.notifications) {
                setErrors((prev) => ({ ...prev, notifications: undefined }));
              }
            }}
            label="I agree to receive deal notifications and messages from Deals Mocktail"
            error={errors.notifications}
          />
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full h-12 cursor-pointer"
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
