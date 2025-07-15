
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: string | null;
  subscription_tier: string | null;
  had_trial: boolean;
  stripe_customer_id?: string | null;
  job_title?: string | null;
  industry?: string | null;
  years_experience?: string | null;
  project_size_preference?: string | null;
  focus_areas?: string[];
  notification_email?: boolean;
  notification_browser?: boolean;
  notification_reports?: boolean;
  preferred_units?: string;
  default_region?: string;
  favorite_materials?: string[];
  compliance_thresholds?: Record<string, any>;
  carbon_footprint_goals?: Record<string, any>;
  calculator_preferences?: Record<string, any>;
  quick_access_tools?: string[];
  achievement_badges?: string[];
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (updatedProfile: UserProfile) => Promise<void>;
  signUp: (email: string, password: string, captchaToken: string | null) => Promise<void>;
  signIn: (email: string, password: string, captchaToken: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}
