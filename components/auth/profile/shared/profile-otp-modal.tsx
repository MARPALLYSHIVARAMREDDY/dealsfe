"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OtpVerification } from "@/components/auth/shared/otp-verification";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateOtp } from "@/store/auth-store";
import { sanitizeOtp } from "../utils/validators";
import type { OtpContactType } from "../utils/types";

interface ProfileOtpModalProps {
  type: OtpContactType;
  contact: string;
  resendTimer: number;
  onVerify: () => void;
  onResend: () => void;
  onClose: () => void;
}

export function ProfileOtpModal({
  type,
  contact,
  resendTimer,
  onVerify,
  onResend,
  onClose,
}: ProfileOtpModalProps) {
  const dispatch = useAppDispatch();
  const { otp } = useAppSelector((state) => state.newAuth);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  const handleOtpChange = useCallback(
    (value: string) => {
      const sanitized = sanitizeOtp(value);
      dispatch(updateOtp(sanitized));
    },
    [dispatch]
  );

  const handleBack = useCallback(() => {
    // Show confirmation dialog when user clicks "Change Email/Mobile"
    setShowCloseConfirmation(true);
  }, []);

  const handleCloseAttempt = useCallback(() => {
    setShowCloseConfirmation(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setShowCloseConfirmation(false);
    dispatch(updateOtp(""));
    onClose();
  }, [dispatch, onClose]);

  const handleCancelClose = useCallback(() => {
    setShowCloseConfirmation(false);
  }, []);

  const handleInteractOutside = useCallback((e: Event) => {
    e.preventDefault();
    setShowCloseConfirmation(true);
  }, []);

  const handleEscapeKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setShowCloseConfirmation(true);
  }, []);

  // Convert OtpContactType to LoginMethod
  const loginMethod = type === "email" ? "email" : "mobile";

  return (
    <>
      <Dialog open modal onOpenChange={handleCloseAttempt}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          onPointerDownOutside={handleInteractOutside}
        >
          <DialogTitle className="sr-only">
            Verify {type === "email" ? "Email" : "Phone Number"}
          </DialogTitle>
          <OtpVerification
            variant="compact"
            loginMethod={loginMethod}
            contact={contact}
            otp={otp.value}
            isLoading={otp.isLoading}
            error={otp.error}
            resendTimer={resendTimer}
            onOtpChange={handleOtpChange}
            onVerify={onVerify}
            onResend={onResend}
            onBack={handleBack}
            showConfirmation={false}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for closing */}
      <Dialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Cancel Verification?</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel? You'll need to request a new OTP to continue.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelClose}>
              Continue Verifying
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Cancel Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
