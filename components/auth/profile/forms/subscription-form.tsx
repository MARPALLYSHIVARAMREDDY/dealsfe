"use client";

import { useState, useEffect } from "react";
import { SwitchField } from "@/components/auth/forms/form-fields";
import { updateProfile } from "@/data/authentication/auth-server-action";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth-store";

export function SubscriptionForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.newAuth);

  const [form, setForm] = useState({
    mobileNotifications: false,
    newsletterSubscription: false,
  });

  // Initialize form values when user data is available
  useEffect(() => {
    if (user) {
      setForm({
        mobileNotifications: user.mobileNotifications ?? false,
        newsletterSubscription: user.newsletterSubscription ?? false,
      });
    }
  }, [user]);

  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});

  const handleToggle = async (field: "mobileNotifications" | "newsletterSubscription", value: boolean) => {
    // Optimistic update
    setForm((prev) => ({ ...prev, [field]: value }));

    // Update via API
    setLoadingFields((prev) => ({ ...prev, [field]: true }));
    try {
      const result = await updateProfile({
        [field]: value,
      });

      if (result.success && result.data) {
        dispatch(setUser(result.data));
      } else {
        throw new Error(result.error || "Failed to update");
      }
    } catch {
      // Revert to original value
      setForm((prev) => ({
        ...prev,
        [field]: user?.[field] ?? false,
      }));
    } finally {
      setLoadingFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="md:max-w-[50%]">
        <SwitchField
          id="mobileNotifications"
          label="Mobile Notifications"
          checked={form.mobileNotifications}
          onChange={(checked) => handleToggle("mobileNotifications", checked)}
          disabled={loadingFields.mobileNotifications}
        />
      </div>

      <div className="md:max-w-[50%]">
        <SwitchField
          id="newsletterSubscription"
          label="Newsletter Subscription"
          checked={form.newsletterSubscription}
          onChange={(checked) => handleToggle("newsletterSubscription", checked)}
          disabled={loadingFields.newsletterSubscription}
        />
      </div>
    </div>
  );
}
