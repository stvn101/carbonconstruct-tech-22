
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (updatedProfile: UserProfile) => Promise<void>;
  signUp: (email: string, password: string, captchaToken: string | null) => Promise<void>;
  signIn: (email: string, password: string, captchaToken: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthActions;
