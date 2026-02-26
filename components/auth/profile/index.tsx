"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { resetOtpState, sendUpdateContactOtp, verifyUpdateContactOtp } from "@/store/auth-store";
import { useLogout } from "@/hooks/useLogout";
import { ProfileHeader } from "./shared/profile-header";
import { ProfileSidebar } from "./shared/profile-sidebar";
import { ProfileTabs } from "./shared/profile-tabs";
import { ProfileOtpModal } from "./shared/profile-otp-modal";
import { PersonalDetailsForm } from "./forms/personal-details-form";
import { ContactForm } from "./forms/contact-form";
import { SubscriptionForm } from "./forms/subscription-form";
import { PreferenceManager } from "./preferences/preference-manager";
import { ProfileSkeleton } from "./profile-skeleton";
import { RESEND_TIMER_SECONDS } from "@/components/auth/utils/constants";
import type { ProfileTab, OtpContactType } from "./utils/types";

export default function ProfilePageClient() {
  const dispatch = useAppDispatch();
  const { otp, user } = useAppSelector((state) => state.newAuth);

  // Use shared logout hook
  const handleSignOut = useLogout();

  // Active tab state
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpContext, setOtpContext] = useState<{
    type: OtpContactType;
    value: string;
  } | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Contact form errors from API
  const [contactErrors, setContactErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});

  // Handle tab changes
  const handleTabChange = useCallback((tab: ProfileTab) => {
    setActiveTab(tab);
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle clearing errors when user edits fields
  const handleClearError = useCallback((type: OtpContactType) => {
    setContactErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });
  }, []);

  // Handle verify click from contact form
  const handleVerifyClick = useCallback(
    async (type: OtpContactType, value: string) => {
      // Clear previous errors
      setContactErrors({});

      // Set context for OTP modal
      setOtpContext({ type, value });

      // Send OTP
      try {
        await dispatch(
          sendUpdateContactOtp({
            [type]: value,
          })
        ).unwrap();

        // Show modal and start timer
        setShowOtpModal(true);
        setResendTimer(RESEND_TIMER_SECONDS);
      } catch (error: any) {
        // Redux thunk errors come directly as the rejected value (string)
        // If it's an object, try to get the message property
        const errorMessage = typeof error === 'string' ? error : (error?.message || error?.error || "Failed to send OTP");

        // Set error based on type (email or phone)
        if (type === "phone") {
          setContactErrors({ phone: errorMessage });
        } else if (type === "email") {
          setContactErrors({ email: errorMessage });
        }
      }
    },
    [dispatch]
  );

  // Handle OTP verification
  const handleVerifyOtp = useCallback(async () => {
    if (!otpContext || otp.value.length !== 6) return;

    try {
      await dispatch(
        verifyUpdateContactOtp({
          otp: otp.value,
          [otpContext.type]: otpContext.value,
        })
      ).unwrap();

      // Close modal and reset
      setShowOtpModal(false);
      setOtpContext(null);
      dispatch(resetOtpState());
    } catch {
      // Failed to verify OTP
    }
  }, [otpContext, otp.value, dispatch]);

  // Handle resend OTP
  const handleResendOtp = useCallback(async () => {
    if (!otpContext || resendTimer > 0) return;

    try {
      await dispatch(
        sendUpdateContactOtp({
          [otpContext.type]: otpContext.value,
        })
      ).unwrap();

      setResendTimer(RESEND_TIMER_SECONDS);
    } catch {
      // Failed to resend OTP
    }
  }, [otpContext, resendTimer, dispatch]);

  // Handle OTP modal close
  const handleCloseOtpModal = useCallback(() => {
    setShowOtpModal(false);
    setOtpContext(null);
    dispatch(resetOtpState());
  }, [dispatch]);

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-start max-w-7xl mx-auto lg:gap-8 lg:px-8 lg:py-8">
        {/* Desktop Sidebar */}
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSignOut={handleSignOut}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Header */}
          <ProfileHeader />

          {/* Mobile Tabs */}
          <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Content Area */}
          <div className="p-1 md:p-6 lg:p-0 pt-0 bg-amber-100-">
            {activeTab === "profile" ? (
              <div className=" space-b-6 ">
                <div className="border rounded-xl p-4 md:p-6 bg-card shadow-sm divide-y divide-border">
                  <div className="pb-6">
                    <PersonalDetailsForm />
                  </div>
                  <div className="py-6">
                    <ContactForm
                      onVerifyClick={handleVerifyClick}
                      onClearError={handleClearError}
                      errors={contactErrors}
                    />
                  </div>
                  <div className="pt-6">
                    <SubscriptionForm />
                  </div>
                </div>

                {/* Sign Out Button (Mobile) */}
                <div className="lg:hidden pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <PreferenceManager />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && otpContext && (
        <ProfileOtpModal
          type={otpContext.type}
          contact={otpContext.value}
          resendTimer={resendTimer}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onClose={handleCloseOtpModal}
        />
      )}
    </div>
  );
}
