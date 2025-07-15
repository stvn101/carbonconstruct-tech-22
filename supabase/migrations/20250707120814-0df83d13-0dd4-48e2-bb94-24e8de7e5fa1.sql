-- Add enhanced profile fields for personalization and carbon compliance workflows
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_experience TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS project_size_preference TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS focus_areas TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_browser BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_reports BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_units TEXT DEFAULT 'metric';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_region TEXT DEFAULT 'Australia';

-- Add carbon compliance and personalization features
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_materials UUID[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS compliance_thresholds JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS carbon_footprint_goals JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS calculator_preferences JSONB DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS quick_access_tools TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievement_badges TEXT[] DEFAULT '{}';

-- Create user calculation history table for tracking and learning
CREATE TABLE IF NOT EXISTS public.user_calculation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  calculator_type TEXT NOT NULL,
  calculation_data JSONB NOT NULL,
  results JSONB NOT NULL,
  carbon_footprint DOUBLE PRECISION,
  compliance_status TEXT,
  improvement_suggestions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on calculation history
ALTER TABLE public.user_calculation_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own calculation history
CREATE POLICY "Users can view their own calculation history"
ON public.user_calculation_history
FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own calculation history"
ON public.user_calculation_history
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own calculation history"
ON public.user_calculation_history
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- Create material favorites table
CREATE TABLE IF NOT EXISTS public.user_material_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES public.unified_materials(id) ON DELETE CASCADE NOT NULL,
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, material_id)
);

-- Enable RLS on material favorites
ALTER TABLE public.user_material_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for material favorites
CREATE POLICY "Users can manage their own material favorites"
ON public.user_material_favorites
FOR ALL
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Create compliance alerts table
CREATE TABLE IF NOT EXISTS public.user_compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL, -- 'carbon_threshold', 'regulation_change', 'deadline'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
  is_read BOOLEAN DEFAULT false,
  action_required BOOLEAN DEFAULT false,
  related_standard TEXT, -- 'ncc', 'nabers', 'green_star', etc.
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on compliance alerts
ALTER TABLE public.user_compliance_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for compliance alerts
CREATE POLICY "Users can view their own compliance alerts"
ON public.user_compliance_alerts
FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own compliance alerts"
ON public.user_compliance_alerts
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- Create auto-update trigger for calculation history
CREATE OR REPLACE FUNCTION update_calculation_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calculation_history_updated_at
  BEFORE UPDATE ON public.user_calculation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_calculation_history_timestamp();