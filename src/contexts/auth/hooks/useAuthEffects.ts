
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, createUserProfile } from '@/services/authService';
import { AuthState } from '../types';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { LOADING_TIMEOUTS } from '@/utils/loadingTimeout';

export const useAuthEffects = (updateState: (updates: Partial<AuthState>) => void) => {
  useEffect(() => {
    // Track subscription for cleanup
    let authSubscription: { unsubscribe: () => void } | null = null;
    let mounted = true;
    let authTimeoutId: NodeJS.Timeout | null = null;
    
    // Set a safety timeout to prevent infinite loading
    const setAuthTimeout = () => {
      authTimeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('Auth state timeout reached, resolving loading state');
          updateState({ loading: false, isLoading: false });
        }
      }, LOADING_TIMEOUTS.AUTH);
    };
    
    const clearAuthTimeout = () => {
      if (authTimeoutId) {
        clearTimeout(authTimeoutId);
        authTimeoutId = null;
      }
    };
    
    const setupAuthListener = () => {
      // Set up auth state listener with optimized handling
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event);
          
          // First update the session state immediately (sync operation)
          if (mounted) {
            updateState({
              session,
              user: session?.user ?? null,
              loading: false,
              isLoading: false
            });
          }
          
          // Then handle profile fetching asynchronously to avoid blocking
          if (session?.user) {
            // Use setTimeout to avoid potential deadlocks with Supabase auth
            setTimeout(async () => {
              try {
                const profile = await fetchUserProfile(session.user.id);
                
                if (!profile) {
                  // Create a new profile if one doesn't exist
                  const newProfile: UserProfile = {
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || null,
                    company_name: null,
                    avatar_url: session.user.user_metadata?.avatar_url || null,
                    website: null,
                    role: 'user',
                    subscription_tier: 'free',
                    had_trial: false
                  };
                  
                  const createdProfile = await createUserProfile(newProfile);
                  if (createdProfile && mounted) {
                    updateState({ profile: createdProfile, loading: false, isLoading: false });
                  } else if (mounted) {
                    // If profile creation failed due to database issues, still use the profile data
                    // This allows the app to function in a degraded state
                    updateState({ 
                      profile: newProfile,
                      loading: false,
                      isLoading: false
                    });
                    
                    toast.warning("Limited functionality due to database connection issues", {
                      id: "limited-functionality-warning",
                      duration: 5000
                    });
                  }
                } else {
                  updateState({ 
                    profile,
                    loading: false,
                    isLoading: false
                  });
                }
              } catch (error) {
                console.error('Error processing user profile:', error);
                // Allow app to continue with limited functionality
                updateState({ 
                  loading: false, 
                  isLoading: false,
                  profile: session.user ? {
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || null,
                    company_name: null,
                    avatar_url: session.user.user_metadata?.avatar_url || null,
                    website: null,
                    role: 'user',
                    subscription_tier: 'free',
                    had_trial: false
                  } : null
                });
              }
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            updateState({ profile: null, loading: false, isLoading: false });
          }
        }
      );
      
      authSubscription = data.subscription;
    };

    const checkExistingSession = async () => {
      setAuthTimeout(); // Start timeout
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          clearAuthTimeout();
          updateState({
            loading: false,
            isLoading: false
          });
          return;
        }
        
        updateState({
          session: data.session,
          user: data.session?.user ?? null
        });
        
        if (data.session?.user) {
          try {
            const profile = await fetchUserProfile(data.session.user.id);
            
            if (!profile) {
              // Create a new profile if one doesn't exist
              const newProfile: UserProfile = {
                id: data.session.user.id,
                full_name: data.session.user.user_metadata?.full_name || null,
                company_name: null,
                avatar_url: data.session.user.user_metadata?.avatar_url || null,
                website: null,
                role: 'user',
                subscription_tier: 'free',
                had_trial: false
              };
              
              const createdProfile = await createUserProfile(newProfile);
              clearAuthTimeout();
              updateState({ 
                profile: createdProfile || newProfile, // Use newProfile if createdProfile is null
                loading: false,
                isLoading: false
              });
            } else {
              clearAuthTimeout();
              updateState({ 
                profile,
                loading: false,
                isLoading: false
              });
            }
          } catch (error) {
            console.error('Error processing user profile:', error);
            clearAuthTimeout();
            updateState({ loading: false, isLoading: false });
          }
        } else {
          clearAuthTimeout();
          updateState({ loading: false, isLoading: false });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        clearAuthTimeout();
        updateState({ loading: false, isLoading: false });
      }
    };

    // First set up the auth listener
    setupAuthListener();
    
    // Then check for existing session
    checkExistingSession();

    // Cleanup subscription when component unmounts
    return () => {
      mounted = false;
      clearAuthTimeout();
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [updateState]);
};
