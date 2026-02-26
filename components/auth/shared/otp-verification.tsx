"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React, { useState, useCallback } from "react";
import type { LoginMethod } from "../utils/types";

interface OtpVerificationProps {
  variant?: "page" | "compact";
  loginMethod: LoginMethod;
  contact: string; // email or phone
  otp: string;
  isLoading: boolean;
  error: string | null;
  resendTimer: number;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  showConfirmation?: boolean;
}

export function OtpVerification({
  variant = "page",
  loginMethod,
  contact,
  otp,
  isLoading,
  error,
  resendTimer,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  showConfirmation = false,
}: OtpVerificationProps) {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  const handleChangeMethod = useCallback(() => {
    if (showConfirmation) {
      setShowCloseConfirmation(true);
    } else {
      onBack();
    }
  }, [showConfirmation, onBack]);

  const handleConfirmClose = useCallback(() => {
    setShowCloseConfirmation(false);
    onBack();
  }, [onBack]);

  const handleCancelClose = useCallback(() => {
    setShowCloseConfirmation(false);
  }, []);

  const isCompact = variant === "compact";

  return (
    <div className={isCompact ? "bg-background" : "min-h-screen bg-background flex flex-col items-center px-4 py-8"}>
      <div className="w-full max-w-md">
        {!isCompact && (
          <h1 className="text-xl font-bold text-center mb-8">
            Verify Your {loginMethod === "email" ? "Email" : "Mobile"}
          </h1>
        )}
        <div className={isCompact ? "text-center mb-6" : "text-center mb-8"}>
          <h2 className={isCompact ? "text-lg font-bold mb-2" : "text-2xl font-bold mb-2"}>
            Enter Verification Code
          </h2>
          <p className="text-muted-foreground text-sm">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">
              {loginMethod === "email" ? contact : `${contact}`}
            </span>
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="font-medium">Verification Code</Label>
            <div className="mt-2 flex justify-center">
              <InputOTP value={otp} onChange={onOtpChange} maxLength={6}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-12 h-12 text-lg border-border"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center mt-2">{error}</p>
            )}
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-green-600">Code sent!</span>
              <span className="text-muted-foreground">
                {resendTimer > 0 ? (
                  `Resend in ${resendTimer}s`
                ) : (
                  <button
                    onClick={onResend}
                    className="text-primary hover:underline cursor-pointer"
                    disabled={isLoading}
                  >
                    Resend Code
                  </button>
                )}
              </span>
            </div>
          </div>
          <Button
            onClick={onVerify}
            disabled={isLoading || otp.length !== 6}
            className="w-full h-12 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
          <button
            onClick={handleChangeMethod}
            className="w-full text-center text-primary text-sm hover:underline cursor-pointer"
          >
            Change {loginMethod === "email" ? "Email Address" : "Mobile Number"}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
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
    </div>
  );
}
