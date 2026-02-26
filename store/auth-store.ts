// Clean Authentication Redux Store
// Focused on signup/signin only - no preferences or other unrelated state
// OTP state kept in store for Redux DevTools debugging

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authClient } from '@/data/authentication/auth-client';
import { signOutAction } from '@/data/authentication/auth-server-action';
import type { UserProfile } from '@/types/profile.types';
import type {
  SignupSendOtpRequest,
  SignupVerifyOtpRequest,
  SignupCreateAccountRequest,
  LoginSendOtpRequest,
  LoginVerifyOtpRequest,
} from '@/data/authentication/types';

// ==================== STATE TYPES ====================

export type OtpType = 'signup' | 'signin_email' | 'signin_mobile' | 'update_email' | 'update_phone';

interface OtpState {
  value: string;                    // 6-digit input
  isLoading: boolean;               // API call state
  error: string | null;             // OTP-specific errors
  type: OtpType | null;             // Current OTP flow type
  contact: string;                  // Email/phone for this session
}

interface AuthState {
  // User & Session
  user: UserProfile | null;
  isAuthenticated: boolean;

  // Operations
  isLoading: boolean;
  error: string | null;

  // OTP State (for Redux DevTools)
  otp: OtpState;
}

// ==================== INITIAL STATE ====================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otp: {
    value: '',
    isLoading: false,
    error: null,
    type: null,
    contact: '',
  },
};

// ==================== ASYNC THUNKS ====================

/**
 * SIGNUP FLOW - Step 1: Send OTP
 * Calls auth-client.sendSignupOtp()
 */
export const sendSignupOtp = createAsyncThunk(
  'auth/sendSignupOtp',
  async (payload: SignupSendOtpRequest, { rejectWithValue }) => {
    const result = await authClient.sendSignupOtp(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to send OTP');
    }

    return { email: payload.email, message: result.message };
  }
);

/**
 * SIGNUP FLOW - Step 2: Verify OTP
 * Calls auth-client.verifySignupOtp()
 */
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async (payload: SignupVerifyOtpRequest, { rejectWithValue }) => {
    const result = await authClient.verifySignupOtp(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to verify OTP');
    }

    return { verified: true, email: payload.email };
  }
);

/**
 * SIGNUP FLOW - Step 3: Create Account
 * Calls auth-client.createAccount() and sets user in store
 */
export const createAccount = createAsyncThunk(
  'auth/createAccount',
  async (payload: SignupCreateAccountRequest, { rejectWithValue }) => {
    const result = await authClient.createAccount(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to create account');
    }

    // Return user data from successful account creation
    return result.data?.data?.user || null;
  }
);

/**
 * SIGNIN FLOW - Step 1: Send OTP
 * Calls auth-client.sendSigninOtp()
 */
export const sendSigninOtp = createAsyncThunk(
  'auth/sendSigninOtp',
  async (payload: LoginSendOtpRequest, { rejectWithValue }) => {
    const result = await authClient.sendSigninOtp(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to send OTP');
    }

    return {
      contact: payload.email || payload.phone || '',
      type: payload.email ? 'signin_email' : 'signin_mobile',
      message: result.message
    };
  }
);

/**
 * SIGNIN FLOW - Step 2: Verify OTP
 * Calls auth-client.verifySigninOtp() and sets user in store
 */
export const verifySigninOtp = createAsyncThunk(
  'auth/verifySigninOtp',
  async (payload: LoginVerifyOtpRequest, { rejectWithValue }) => {
    const result = await authClient.verifySigninOtp(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to verify OTP');
    }

    // Return user data from successful signin
    return result.data?.data?.user || null;
  }
);

/**
 * CONTACT UPDATE FLOW - Step 1: Send OTP
 * Calls auth-client.sendUpdateContactOtp()
 */
export const sendUpdateContactOtp = createAsyncThunk(
  'auth/sendUpdateContactOtp',
  async (payload: { email?: string; phone?: string }, { rejectWithValue }) => {
    const result = await authClient.sendUpdateContactOtp(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to send OTP');
    }

    return {
      contact: payload.email || payload.phone || '',
      type: payload.email ? 'update_email' : 'update_phone',
      message: result.message
    };
  }
);

/**
 * CONTACT UPDATE FLOW - Step 2: Verify OTP
 * Calls auth-client.verifyUpdateContactOtp() and updates user in store
 */
export const verifyUpdateContactOtp = createAsyncThunk(
  'auth/verifyUpdateContactOtp',
  async (payload: { email?: string; phone?: string; otp: string }, { rejectWithValue }) => {
    const result = await authClient.verifyUpdateContactOtp(payload);

    if (!result.success) {
      return rejectWithValue(result.error || 'Failed to verify OTP');
    }

    // Return updated user data
    return result.data?.data?.user || null;
  }
);

/**
 * Sign Out
 * Calls server action which handles logout and redirects
 * Server action throws NEXT_REDIRECT, so this never resolves normally
 */
export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      // Call server action - this will NEVER return normally
      // It will either redirect (throw NEXT_REDIRECT) or throw an error
      await signOutAction();

      // This line will never execute because signOutAction always redirects
      // But TypeScript needs a return statement
      return { message: 'Logged out successfully' };
    } catch (error: any) {
      console.log('[signOut thunk] Server action triggered redirect or error:', error.message);

      // If it's a NEXT_REDIRECT error, that's expected - still clear state
      if (error.message?.includes('NEXT_REDIRECT')) {
        console.log('[signOut thunk] Redirect initiated, clearing state');
        return { message: 'Logged out, redirecting' };
      }

      // For other errors, log but still proceed with cleanup
      console.error('[signOut thunk] Unexpected error:', error);
      return {
        message: 'Logged out locally',
        warning: error.message || 'Server logout failed'
      };
    }
  }
);

// ==================== SLICE ====================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authenticated user
     */
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      console.log(action.payload)
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    /**
     * Update OTP input value (sanitize to 6 digits)
     */
    updateOtp: (state, action: PayloadAction<string>) => {
      const sanitized = action.payload.replace(/\D/g, '').slice(0, 6);
      state.otp.value = sanitized;
    },

    /**
     * Reset OTP state (clear session)
     */
    resetOtpState: (state) => {
      state.otp = {
        value: '',
        isLoading: false,
        error: null,
        type: null,
        contact: '',
      };
    },

    /**
     * Clear general error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear OTP error
     */
    clearOtpError: (state) => {
      state.otp.error = null;
    },

    /**
     * Mark profile as completed
     */
    markProfileCompleted: (state) => {
      if (state.user) {
        state.user.profileCompleted = true;
      }
    },

    /**
     * Logout - Reset entire store
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.otp = {
        value: '',
        isLoading: false,
        error: null,
        type: null,
        contact: '',
      };
    },
  },
  extraReducers: (builder) => {
    // ========== SEND SIGNUP OTP ==========
    builder
      .addCase(sendSignupOtp.pending, (state) => {
        state.otp.isLoading = true;
        state.otp.error = null;
      })
      .addCase(sendSignupOtp.fulfilled, (state, action) => {
        state.otp.isLoading = false;
        state.otp.type = 'signup';
        state.otp.contact = action.payload.email;
      })
      .addCase(sendSignupOtp.rejected, (state, action) => {
        state.otp.isLoading = false;
        state.otp.error = action.payload as string;
      });

    // ========== VERIFY SIGNUP OTP ==========
    builder
      .addCase(verifySignupOtp.pending, (state) => {
        state.otp.isLoading = true;
        state.otp.error = null;
      })
      .addCase(verifySignupOtp.fulfilled, (state) => {
        state.otp.isLoading = false;
      })
      .addCase(verifySignupOtp.rejected, (state, action) => {
        state.otp.isLoading = false;
        state.otp.error = action.payload as string;
      });

    // ========== CREATE ACCOUNT ==========
    builder
      .addCase(createAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as UserProfile;
        state.isAuthenticated = true;
        // Reset OTP state after successful account creation
        state.otp = {
          value: '',
          isLoading: false,
          error: null,
          type: null,
          contact: '',
        };
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ========== SEND SIGNIN OTP ==========
    builder
      .addCase(sendSigninOtp.pending, (state) => {
        state.otp.isLoading = true;
        state.otp.error = null;
      })
      .addCase(sendSigninOtp.fulfilled, (state, action) => {
        state.otp.isLoading = false;
        state.otp.type = action.payload.type as OtpType;
        state.otp.contact = action.payload.contact;
      })
      .addCase(sendSigninOtp.rejected, (state, action) => {
        state.otp.isLoading = false;
        state.otp.error = action.payload as string;
      });

    // ========== VERIFY SIGNIN OTP ==========
    builder
      .addCase(verifySigninOtp.pending, (state) => {
        state.otp.isLoading = true;
        state.otp.error = null;
      })
      .addCase(verifySigninOtp.fulfilled, (state, action) => {
        state.otp.isLoading = false;
        state.user = action.payload as UserProfile;
        state.isAuthenticated = true;
        // Reset OTP state after successful signin
        state.otp = {
          value: '',
          isLoading: false,
          error: null,
          type: null,
          contact: '',
        };
      })
      .addCase(verifySigninOtp.rejected, (state, action) => {
        state.otp.isLoading = false;
        state.otp.error = action.payload as string;
      });

    // ========== SEND UPDATE CONTACT OTP ==========
    builder
      .addCase(sendUpdateContactOtp.pending, (state) => {
        state.otp.isLoading = true;
        state.otp.error = null;
      })
      .addCase(sendUpdateContactOtp.fulfilled, (state, action) => {
        state.otp.isLoading = false;
        state.otp.type = action.payload.type as OtpType;
        state.otp.contact = action.payload.contact;
      })
      .addCase(sendUpdateContactOtp.rejected, (state, action) => {
        state.otp.isLoading = false;
        state.otp.error = action.payload as string;
      });

    // ========== VERIFY UPDATE CONTACT OTP ==========
    builder
      .addCase(verifyUpdateContactOtp.pending, (state) => {
        state.otp.isLoading = true;
        state.otp.error = null;
      })
      .addCase(verifyUpdateContactOtp.fulfilled, (state, action) => {
        state.otp.isLoading = false;
        // Update user with new contact info
        if (state.user && action.payload) {
          state.user = { ...state.user, ...action.payload };
        }
        // Reset OTP state after successful update
        state.otp = {
          value: '',
          isLoading: false,
          error: null,
          type: null,
          contact: '',
        };
      })
      .addCase(verifyUpdateContactOtp.rejected, (state, action) => {
        state.otp.isLoading = false;
        state.otp.error = action.payload as string;
      });

    // ========== SIGN OUT ==========
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state, action) => {
        // Reset entire state
        console.log("sign out start")

        // Log any warnings from server action
        if (action.payload.warning) {
          console.warn('[signOut] Warning:', action.payload.warning);
        }

        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.otp = {
          value: '',
          isLoading: false,
          error: null,
          type: null,
          contact: '',
        };

        console.log("sign out complete")
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ==================== EXPORTS ====================

export const {
  setUser,
  updateOtp,
  resetOtpState,
  clearError,
  clearOtpError,
  markProfileCompleted,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
