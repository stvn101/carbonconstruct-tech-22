
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Rate limiting store (in production, this should be server-side)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number }>();

/**
 * Rate limiting for authentication attempts
 */
export const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if window has passed
  if (now - record.lastAttempt > windowMs) {
    rateLimitStore.set(identifier, { attempts: 1, lastAttempt: now });
    return true;
  }
  
  // Increment attempts
  record.attempts += 1;
  record.lastAttempt = now;
  
  if (record.attempts > maxAttempts) {
    toast.error(`Too many attempts. Please wait ${Math.ceil(windowMs / 60000)} minutes before trying again.`);
    return false;
  }
  
  return true;
};

/**
 * Enhanced password validation with security requirements
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 12) {
    return { valid: false, message: 'Password must be at least 12 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  // Check for consecutive repeated characters
  if (/(.)\1{2,}/.test(password)) {
    return { valid: false, message: 'Password must not contain more than 2 consecutive identical characters' };
  }
  
  // Enhanced common pattern detection
  const commonPatterns = [
    'password', 'qwerty', 'admin', 'welcome', 'abc123', '111111', '123123', 
    'dragon', 'baseball', 'football', 'letmein', 'monkey', 'superman',
    '123456789', 'iloveyou', 'trustno1', 'sunshine', 'master', 'hello'
  ];
  
  const lowercasePassword = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowercasePassword.includes(pattern)) {
      return { valid: false, message: 'Password contains a common pattern and is too predictable' };
    }
  }
  
  // Check for keyboard patterns
  const keyboardPatterns = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];
  for (const pattern of keyboardPatterns) {
    if (lowercasePassword.includes(pattern.substring(0, 4))) {
      return { valid: false, message: 'Password contains keyboard patterns' };
    }
  }
  
  return { valid: true, message: 'Password meets all security requirements' };
};

/**
 * Enhanced error handling with security considerations
 */
export const handleAuthError = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  // Log security events (in production, send to security monitoring)
  console.warn('Authentication error:', {
    message: errorMessage,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
  
  // Generic error messages to prevent information disclosure
  if (errorMessage.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in';
  }
  
  if (errorMessage.includes('Invalid login credentials') || 
      errorMessage.includes('Invalid email') || 
      errorMessage.includes('Invalid password')) {
    return 'Invalid credentials. Please check your email and password.';
  }
  
  if (errorMessage.includes('User already registered')) {
    return 'An account with this email already exists';
  }
  
  if (errorMessage.includes('Email rate limit exceeded')) {
    return 'Too many email requests. Please wait before requesting another.';
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Generic fallback to prevent information leakage
  return 'Authentication failed. Please try again or contact support if the problem persists.';
};

/**
 * Secure session refresh with error handling
 */
export const refreshSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.warn('Session refresh failed:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Session refresh error:', error);
    return null;
  }
};

/**
 * Enhanced role checking with caching
 */
const roleCache = new Map<string, { role: string; timestamp: number }>();
const ROLE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    // Check cache first
    const cached = roleCache.get(userId);
    if (cached && Date.now() - cached.timestamp < ROLE_CACHE_TTL) {
      return cached.role === role;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.warn('Role check failed:', error.message);
      return false;
    }
    
    // Cache the result
    roleCache.set(userId, { role: data?.role || '', timestamp: Date.now() });
    
    return data?.role === role;
  } catch (error) {
    console.error('Role check error:', error);
    return false;
  }
};

/**
 * Secure input sanitization
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML chars
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Password strength scoring (0-4)
 */
export const getPasswordStrength = (password: string): { score: number; label: string } => {
  let score = 0;
  
  // Length scoring
  if (password.length >= 8) score += 0.5;
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;
  
  // Character type scoring
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
  
  // Complexity bonus
  if (/[A-Z].*[A-Z]/.test(password)) score += 0.25;
  if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) score += 0.25;
  if (password.length >= 20) score += 0.25;
  
  // Pattern penalties
  if (/(.)\1{2,}/.test(password)) score -= 0.5;
  if (/123|abc|qwerty|password/i.test(password)) score -= 1;
  
  score = Math.max(0, Math.min(4, score));
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  return { score, label: labels[Math.floor(score)] };
};

/**
 * Secure URL validation for redirects
 */
export const validateRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    
    // Only allow same origin redirects
    if (parsedUrl.origin !== window.location.origin) {
      return false;
    }
    
    // Block suspicious paths
    const suspiciousPaths = ['/admin', '/api', '//'];
    if (suspiciousPaths.some(path => parsedUrl.pathname.includes(path))) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};
