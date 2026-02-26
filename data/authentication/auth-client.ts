// Authentication Client Service Layer
// Handles all client-side authentication-related API calls
// CRITICAL: All methods should be called ONLY from Redux store for DevTools tracking

import axiosClient from '@/lib/axios-client';
import type {
  SignupSendOtpRequest,
  SignupSendOtpResponse,
  SignupVerifyOtpRequest,
  SignupVerifyOtpResponse,
  SignupCreateAccountRequest,
  SignupCreateAccountResponse,
  SignupServiceResponse,
  LoginSendOtpRequest,
  LoginSendOtpResponse,
  LoginVerifyOtpRequest,
  LoginVerifyOtpResponse,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
} from "./types";

class AuthClient {
  private readonly authURL = '/api/v1/auth';
  private readonly profileURL = '/api/v1/profile';

  // ==================== SIGNUP FLOW ====================

  /**
   * SIGNUP FLOW - Step 1: Send OTP
   * POST /auth/signup/send-otp
   */
  async sendSignupOtp(
    payload: SignupSendOtpRequest
  ): Promise<SignupServiceResponse<SignupSendOtpResponse>> {
    try {
      const response = await axiosClient.post<SignupSendOtpResponse>(
        `${this.authURL}/signup/send-otp`,
        payload
      );

      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message,
        status: response.data.status,
      };
    } catch (error: any) {
      if (error.status === 409) {
        return {
          success: false,
          error: error.message || 'Email already exists. Please login instead.',
          status: 409,
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to send OTP. Please try again.',
      };
    }
  }

  /**
   * SIGNUP FLOW - Step 2: Verify OTP
   * POST /auth/signup/verify-otp
   */
  async verifySignupOtp(
    payload: SignupVerifyOtpRequest
  ): Promise<SignupServiceResponse<SignupVerifyOtpResponse>> {
    try {
      const response = await axiosClient.post<SignupVerifyOtpResponse>(
        `${this.authURL}/signup/verify-otp`,
        payload
      );

      if (response.data.status === 200 && response.data.data?.verified) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || 'OTP verification failed',
        status: response.data.status,
      };
    } catch (error: any) {
      if (error.status === 400) {
        return {
          success: false,
          error: error.message || 'No OTP request found or OTP expired.',
          status: 400,
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to verify OTP. Please try again.',
      };
    }
  }

  /**
   * SIGNUP FLOW - Step 3: Create Account
   * POST /auth/signup/create-account
   */
  async createAccount(
    payload: SignupCreateAccountRequest
  ): Promise<SignupServiceResponse<SignupCreateAccountResponse>> {
    try {
      const response = await axiosClient.post<SignupCreateAccountResponse>(
        `${this.authURL}/signup/create-account`,
        payload
      );

      if (response.data.status === 201) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: 'Account creation failed',
        status: response.data.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create account. Please try again.',
      };
    }
  }

  // ==================== SIGNIN FLOW ====================

  /**
   * LOGIN FLOW - Step 1: Send OTP
   * POST /auth/login/send-otp
   */
  async sendSigninOtp(
    payload: LoginSendOtpRequest
  ): Promise<SignupServiceResponse<LoginSendOtpResponse>> {
    try {
      const response = await axiosClient.post<LoginSendOtpResponse>(
        `${this.authURL}/login/send-otp`,
        payload
      );

      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message,
        status: response.data.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send OTP. Please try again.',
      };
    }
  }

  /**
   * LOGIN FLOW - Step 2: Verify OTP
   * POST /auth/login/verify-otp
   */
  async verifySigninOtp(
    payload: LoginVerifyOtpRequest
  ): Promise<SignupServiceResponse<LoginVerifyOtpResponse>> {
    try {
      const response = await axiosClient.post<LoginVerifyOtpResponse>(
        `${this.authURL}/login/verify-otp`,
        payload
      );

      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || 'OTP verification failed',
        status: response.data.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to verify OTP. Please try again.',
      };
    }
  }

  // ==================== CONTACT UPDATE FLOW ====================

  /**
   * UPDATE CONTACT - Step 1: Send OTP
   * POST /api/v1/profile/update-contact/send-otp
   */
  async sendUpdateContactOtp(
    payload: { email?: string; phone?: string }
  ): Promise<SignupServiceResponse<{ status: number; message: string; data?: any }>> {
    try {
      const response = await axiosClient.post<{ status: number; message: string; data?: any }>(
        `${this.profileURL}/update-contact/send-otp`,
        payload
      );

      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message,
        status: response.data.status,
      };
    } catch (error: any) {
      // Check if it's a 409 conflict error from axios interceptor
      if (error.status === 409) {
        return {
          success: false,
          error: error.message || 'This contact is already associated with another account',
          status: 409,
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to send OTP. Please try again.',
        status: error.status,
      };
    }
  }

  /**
   * UPDATE CONTACT - Step 2: Verify OTP
   * POST /api/v1/profile/update-contact/verify-otp
   */
  async verifyUpdateContactOtp(
    payload: { email?: string; phone?: string; otp: string }
  ): Promise<SignupServiceResponse<{
    status: number;
    message: string;
    data: {
      user: {
        id: string;
        email?: string;
        emailVerified?: boolean;
        phoneNumber?: string;
        phoneNumberVerified?: boolean;
      };
    };
  }>> {
    try {
      const response = await axiosClient.post<{
        status: number;
        message: string;
        data: {
          user: {
            id: string;
            email?: string;
            emailVerified?: boolean;
            phoneNumber?: string;
            phoneNumberVerified?: boolean;
          };
        };
      }>(`${this.profileURL}/update-contact/verify-otp`, payload);

      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: response.data.message || 'OTP verification failed',
        status: response.data.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to verify OTP. Please try again.',
      };
    }
  }

  // ==================== SIGN OUT ====================

  /**
   * Sign out
   * POST /api/v1/auth/logout
   */
  async signOut(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await axiosClient.post<{
        status: number;
        message: string;
      }>('/api/v1/auth/logout');

      return {
        success: response.data.status === 200,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign out',
      };
    }
  }

}

// Export singleton instance
export const authClient = new AuthClient();
