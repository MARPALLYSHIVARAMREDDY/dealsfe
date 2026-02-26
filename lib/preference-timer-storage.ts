/**
 * LocalStorage utilities for preference popup timer management
 * Handles persistence of timer data across page refreshes and sessions
 */

export interface PreferenceTimerData {
  lastDismissedAt: number | null;      // Unix timestamp (ms) when user last dismissed popup
  lastProfileExitAt: number | null;    // Unix timestamp (ms) when user last exited /profile
  lastOtpLoginAt: number | null;       // Unix timestamp (ms) when user last logged in via OTP
  dismissCount: number;                // Track total dismissals for analytics
}

const STORAGE_KEY = 'preference_popup_timer';

export const TIMERS = {
  DISMISS_COOLDOWN: 5 * 60 * 1000,    // 5 minutes in milliseconds
  PROFILE_COOLDOWN: 30 * 1000,         // 30 seconds in milliseconds
  OTP_LOGIN_COOLDOWN: 5 * 60 * 1000,   // 5 minutes in milliseconds
} as const;

/**
 * Load timer data from localStorage
 * Returns default values if data doesn't exist or is invalid
 */
export function loadTimerData(): PreferenceTimerData {
  if (typeof window === 'undefined') {
    return getDefaultTimerData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultTimerData();
    }

    const parsed = JSON.parse(stored) as PreferenceTimerData;

    // Validate structure
    if (
      typeof parsed === 'object' &&
      (parsed.lastDismissedAt === null || typeof parsed.lastDismissedAt === 'number') &&
      (parsed.lastProfileExitAt === null || typeof parsed.lastProfileExitAt === 'number') &&
      (parsed.lastOtpLoginAt === null || typeof parsed.lastOtpLoginAt === 'number') &&
      typeof parsed.dismissCount === 'number'
    ) {
      return parsed;
    }

    // Invalid structure - return defaults
    return getDefaultTimerData();
  } catch (error) {
    console.error('Failed to load preference timer data:', error);
    return getDefaultTimerData();
  }
}

/**
 * Save timer data to localStorage
 */
export function saveTimerData(data: PreferenceTimerData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save preference timer data:', error);
  }
}

/**
 * Clear all timer data from localStorage
 */
export function clearTimerData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear preference timer data:', error);
  }
}

/**
 * Update only the dismiss timestamp
 */
export function saveDismissTimestamp(): void {
  const data = loadTimerData();
  data.lastDismissedAt = Date.now();
  data.dismissCount += 1;
  saveTimerData(data);
}

/**
 * Update only the profile exit timestamp
 */
export function saveProfileExitTimestamp(): void {
  const data = loadTimerData();
  data.lastProfileExitAt = Date.now();
  saveTimerData(data);
}

/**
 * Check if dismiss cooldown is active
 */
export function isDismissCooldownActive(): boolean {
  const data = loadTimerData();
  if (data.lastDismissedAt === null) {
    return false;
  }

  const elapsed = Date.now() - data.lastDismissedAt;
  return elapsed < TIMERS.DISMISS_COOLDOWN;
}

/**
 * Check if profile exit cooldown is active
 */
export function isProfileCooldownActive(): boolean {
  const data = loadTimerData();
  if (data.lastProfileExitAt === null) {
    return false;
  }

  const elapsed = Date.now() - data.lastProfileExitAt;
  return elapsed < TIMERS.PROFILE_COOLDOWN;
}

/**
 * Update only the OTP login timestamp
 */
export function saveOtpLoginTimestamp(): void {
  const data = loadTimerData();
  data.lastOtpLoginAt = Date.now();
  saveTimerData(data);
}

/**
 * Check if OTP login cooldown is active
 */
export function isOtpLoginCooldownActive(): boolean {
  const data = loadTimerData();
  if (data.lastOtpLoginAt === null) {
    return false;
  }

  const elapsed = Date.now() - data.lastOtpLoginAt;
  return elapsed < TIMERS.OTP_LOGIN_COOLDOWN;
}

/**
 * Get remaining time for OTP login cooldown (in milliseconds)
 */
export function getRemainingOtpLoginCooldown(): number {
  const data = loadTimerData();
  if (data.lastOtpLoginAt === null) {
    return 0;
  }

  const elapsed = Date.now() - data.lastOtpLoginAt;
  const remaining = TIMERS.OTP_LOGIN_COOLDOWN - elapsed;
  return Math.max(0, remaining);
}

/**
 * Get remaining time for dismiss cooldown (in milliseconds)
 */
export function getRemainingDismissCooldown(): number {
  const data = loadTimerData();
  if (data.lastDismissedAt === null) {
    return 0;
  }

  const elapsed = Date.now() - data.lastDismissedAt;
  const remaining = TIMERS.DISMISS_COOLDOWN - elapsed;
  return Math.max(0, remaining);
}

/**
 * Get remaining time for profile cooldown (in milliseconds)
 */
export function getRemainingProfileCooldown(): number {
  const data = loadTimerData();
  if (data.lastProfileExitAt === null) {
    return 0;
  }

  const elapsed = Date.now() - data.lastProfileExitAt;
  const remaining = TIMERS.PROFILE_COOLDOWN - elapsed;
  return Math.max(0, remaining);
}

/**
 * Get default timer data structure
 */
function getDefaultTimerData(): PreferenceTimerData {
  return {
    lastDismissedAt: null,
    lastProfileExitAt: null,
    lastOtpLoginAt: null,
    dismissCount: 0,
  };
}
