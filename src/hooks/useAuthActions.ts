
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  handleAuthError, 
  validatePassword, 
  checkRateLimit, 
  sanitizeInput,
  validateRedirectUrl 
} from '@/utils/authHelpers';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Enhanced sign up with security measures
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Rate limiting check
      if (!checkRateLimit(`signup_${email}`, 3, 10 * 60 * 1000)) {
        throw new Error("Too many signup attempts. Please try again later.");
      }
      
      // Input sanitization
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      const sanitizedFullName = sanitizeInput(fullName);
      
      // Enhanced password validation
      const { valid, message } = validatePassword(password);
      if (!valid) {
        setErrorMessage(message);
        return { error: message, success: false };
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        setErrorMessage("Please enter a valid email address");
        return { error: "Invalid email format", success: false };
      }
      
      // Name validation
      if (sanitizedFullName.length < 2 || sanitizedFullName.length > 100) {
        setErrorMessage("Full name must be between 2 and 100 characters");
        return { error: "Invalid name length", success: false };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            full_name: sanitizedFullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Registration successful! Please check your email for verification instructions.");
        return { user: data.user, success: true };
      } else {
        throw new Error("User registration failed");
      }
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Enhanced sign in with rate limiting
   */
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Rate limiting check
      const clientIP = 'client'; // In production, get actual IP
      if (!checkRateLimit(`signin_${clientIP}`, 5, 15 * 60 * 1000)) {
        throw new Error("Too many login attempts. Please try again later.");
      }
      
      // Input sanitization
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      // Basic validation
      if (!sanitizedEmail || !password) {
        setErrorMessage("Email and password are required");
        return { error: "Missing credentials", success: false };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      if (error) throw error;
      
      toast.success(`Welcome back${data.user?.user_metadata?.full_name ? `, ${data.user.user_metadata.full_name}` : ''}!`);
      return { session: data.session, user: data.user, success: true };
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Enhanced sign out with cleanup
   */
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Clear any sensitive data from localStorage
      const keysToRemove = ['ai_service_configured', 'user_preferences'];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("You have been logged out successfully");
      return { success: true };
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Enhanced password reset with validation
   */
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Rate limiting for password reset
      if (!checkRateLimit(`reset_${email}`, 3, 60 * 60 * 1000)) {
        throw new Error("Too many password reset requests. Please try again later.");
      }
      
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        setErrorMessage("Please enter a valid email address");
        return { error: "Invalid email format", success: false };
      }
      
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
      return { success: true };
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    isLoading,
    errorMessage
  };
}
