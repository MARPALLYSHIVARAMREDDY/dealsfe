"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  verifySignupOtp,
  createAccount,
  verifySigninOtp,
  updateOtp,
  sendSignupOtp,
  sendSigninOtp,
  resetOtpState,
} from "@/store/auth-store";
import { notification } from "@/lib/notification-service";
import { saveOtpLoginTimestamp } from "@/lib/preference-timer-storage";
import { SignupForm } from "./forms/signup-form";
import { SigninForm } from "./forms/signin-form";
import { OtpVerification } from "./shared/otp-verification";
import { AuthFooter } from "./shared/auth-footer";
import { SocialLogin } from "./social/social-login";
import { sanitizeOtp } from "./utils/validators";
import { RESEND_TIMER_SECONDS } from "./utils/constants";
import type { AuthMode, LoginMethod, SignupFormData } from "./utils/types";

export default function AuthPageClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { otp, } = useAppSelector((state) => state.newAuth);

  const [mode, setMode] = useState<AuthMode>("signin");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [contact, setContact] = useState(""); // Email or phone
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Persist signin form state across mode changes
  const [signinFormData, setSigninFormData] = useState({
    email: "",
    phone: "",
  });

  // Persist signup form state across mode changes
  const [signupFormData, setSignupFormData] = useState<SignupFormData | null>(null);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle successful signup OTP send
  const handleSignupSuccess = useCallback(
    (email: string, formData: SignupFormData) => {
      setMode("otp");
      setLoginMethod("email");
      setContact(email);
      setSignupData(formData);
      setSignupFormData(formData); // Save form data to preserve state
      setResendTimer(RESEND_TIMER_SECONDS);
    },
    []
  );

  // Handle successful signin OTP send
  const handleSigninSuccess = useCallback(
    (contactInfo: string, method: LoginMethod, formData: { email: string; phone: string }) => {
      setMode("otp");
      setLoginMethod(method);
      setContact(contactInfo);
      setSigninFormData(formData); // Save form data to preserve state
      setResendTimer(RESEND_TIMER_SECONDS);
    },
    []
  );

  // Handle OTP change
  const handleOtpChange = useCallback(
    (value: string) => {
      const sanitized = sanitizeOtp(value);
      dispatch(updateOtp(sanitized));
    },
    [dispatch]
  );

  // Handle OTP verification
  const handleVerifyOtp = useCallback(async () => {
    if (otp.value.length !== 6) return;

    try {
      if (mode === "otp" && otp.type === "signup") {
        // Verify signup OTP
        await dispatch(
          verifySignupOtp({ email: contact, otp: otp.value })
        ).unwrap();

        // Create account with signup data
        if (signupData) {
          await dispatch(createAccount(signupData)).unwrap();

          // Start 5-minute delay for preference popup
          saveOtpLoginTimestamp();

          // Reset auth fields
          dispatch(resetOtpState());
          setMode("signin");
          setContact("");
          setSignupData(null);
          setResendTimer(0);

          // Set user and redirect
          notification.success(
            "Account Created",
            "Welcome to Deals Mocktail!"
          );

          // Use hard reload to ensure cookies are written and proxy sees them
          const searchParams = new URLSearchParams(window.location.search);
          const redirectTo = searchParams.get('redirect') || '/';
          window.location.href = redirectTo;
        }
      } else if (mode === "otp" && (otp.type === "signin_email" || otp.type === "signin_mobile")) {
        // Verify signin OTP
        const payload =
          loginMethod === "email"
            ? { email: contact, otp: otp.value }
            : { phone: contact, otp: otp.value };

        await dispatch(verifySigninOtp(payload)).unwrap();

        // Start 5-minute delay for preference popup
        saveOtpLoginTimestamp();

        // Reset auth fields
        dispatch(resetOtpState());
        setMode("signin");
        setContact("");
        setResendTimer(0);

        // Success - redirect
        notification.success("Signed In", "Welcome back!");

        // Use hard reload to ensure cookies are written and proxy sees them
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirect') || '/';
        window.location.href = redirectTo;
      }
    } catch (error) {
      const errorMessage = error as string;
      notification.error("Error", errorMessage);
    }
  }, [mode, otp.value, otp.type, contact, loginMethod, signupData, dispatch, router]);

  // Handle resend OTP
  const handleResendOtp = useCallback(async () => {
    if (resendTimer > 0) return;

    try {
      if (otp.type === "signup") {
        // Resend signup OTP
        await dispatch(sendSignupOtp({ email: contact })).unwrap();
      } else if (otp.type === "signin_email") {
        // Resend signin OTP for email
        await dispatch(sendSigninOtp({ email: contact })).unwrap();
      } else if (otp.type === "signin_mobile") {
        // Resend signin OTP for mobile
        await dispatch(sendSigninOtp({ phone: contact })).unwrap();
      }

      setResendTimer(RESEND_TIMER_SECONDS);
      notification.info("OTP Resent", "Please check your inbox");
    } catch (error: any) {
      notification.error("Error", error.message || "Failed to resend OTP");
    }
  }, [resendTimer, otp.type, contact, dispatch]);

  // Handle back from OTP screen
  const handleBackFromOtp = useCallback(() => {
    setMode(otp.type === "signup" ? "signup" : "signin");
    dispatch(updateOtp(""));
  }, [otp.type, dispatch]);

  // Handle mode switch (signin <-> signup)
  const handleModeSwitch = useCallback(() => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  }, []);

  // Render based on mode
  if (mode === "otp") {
    return (
      <OtpVerification
        loginMethod={loginMethod}
        contact={contact}
        otp={otp.value}
        isLoading={otp.isLoading}
        error={otp.error}
        resendTimer={resendTimer}
        onOtpChange={handleOtpChange}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackFromOtp}
        showConfirmation={true}
      />
    );
  }

  if (mode === "signup") {
    return (
      <div>
        <SignupForm
          onSuccess={handleSignupSuccess}
          initialValues={signupFormData}
        />
        <div className="w-full max-w-md mx-auto">
          <SocialLogin />
          <AuthFooter mode="signup" onSwitch={handleModeSwitch} />
        </div>
      </div>
    );
  }

  // Default: signin
  return (
    <div>
      <SigninForm
        onSuccess={handleSigninSuccess}
        initialValues={signinFormData}
        initialLoginMethod={loginMethod}
      />
      <div className="w-full max-w-md mx-auto">
        <SocialLogin />
        <AuthFooter mode="signin" onSwitch={handleModeSwitch} />
      </div>
    </div>
  );
}
