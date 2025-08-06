// src/utils/authHelpers.ts

// Type to track request counts in memory for basic rate limiting
export type RateLimitStore = {
  [key: string]: {
    count: number;
    timestamp: number;
  };
};

// In-memory rate limit store (resets on reload)
const rateLimitStore: RateLimitStore = {};

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'%;()&+]/g, '').trim();
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one number' };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      valid: false,
      message: 'Password must include at least one special character (!@#$%^&*)'
    };
  }
  return { valid: true };
}

/**
 * Handle common auth-related errors safely
 */
export function handleAuthError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if ((error as any)?.message) return (error as any).message;
  return 'An unknown error occurred during authentication';
}

/**
 * Very basic memory-based rate limiter
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore[identifier];

  if (!entry) {
    rateLimitStore[identifier] = { count: 1, timestamp: now };
    return true;
  }

  if (now - entry.timestamp > windowMs) {
    rateLimitStore[identifier] = { count: 1, timestamp: now };
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get password strength score and label
 */
export function getPasswordStrength(password: string): { score: number; label: string } {
  if (!password) {
    return { score: 0, label: 'Very Weak' };
  }

  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Penalty for repeated characters
  if (/(.)\1\1/.test(password)) score -= 1;
  
  // Ensure score is between 0-4
  score = Math.max(0, Math.min(4, score));
  
  const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  return { score, label: labels[score] };
}

/**
 * Validate redirect URLs are on the same origin (prevent phishing)
 */
export function validateRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}
