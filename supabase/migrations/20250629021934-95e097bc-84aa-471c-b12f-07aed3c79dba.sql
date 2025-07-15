
-- Create enum types for Green Star specific values
CREATE TYPE public.building_layer AS ENUM (
  'Structure',
  'Envelope', 
  'Systems',
  'Finishes'
);

CREATE TYPE public.achievement_level AS ENUM (
  'None',
  'Good Practice',
  'Best Practice'
);

CREATE TYPE public.category_type AS ENUM (
  'Responsible',
  'Healthy',
  'Positive',
  'Circular',
  'Leadership'
);

-- Create Green Star projects table
CREATE TABLE public.green_star_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  project_name TEXT NOT NULL,
  project_type TEXT DEFAULT 'Commercial',
  location TEXT DEFAULT 'Australia',
  target_rating achievement_level DEFAULT 'Good Practice',
  total_project_cost DECIMAL(12,2),
  building_layer_costs JSONB DEFAULT '{}',
  products JSONB DEFAULT '[]',
  compliance_results JSONB DEFAULT '[]',
  overall_score DECIMAL(5,2) DEFAULT 0,
  achieved_credits INTEGER DEFAULT 0,
  total_possible_credits INTEGER DEFAULT 0,
  achievement_level achievement_level DEFAULT 'None',
  recommendations TEXT[],
  submission_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Green Star certifications/initiatives table
CREATE TABLE public.green_star_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id TEXT UNIQUE NOT NULL,
  initiative_name TEXT NOT NULL,
  rpv_score INTEGER NOT NULL CHECK (rpv_score >= 0 AND rpv_score <= 100),
  categories JSONB NOT NULL DEFAULT '[]',
  recognition_date DATE NOT NULL,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Green Star product certifications table
CREATE TABLE public.green_star_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES public.unified_materials(id),
  initiative_id TEXT REFERENCES public.green_star_initiatives(initiative_id),
  certificate_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  verification_status verification_status DEFAULT 'pending_verification',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Green Star specific columns to unified_materials
ALTER TABLE public.unified_materials 
ADD COLUMN IF NOT EXISTS green_star_compliant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS building_layers building_layer[],
ADD COLUMN IF NOT EXISTS green_star_rpv_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS green_star_categories TEXT[];

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_green_star_projects_user_id ON public.green_star_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_green_star_projects_created_at ON public.green_star_projects(created_at);
CREATE INDEX IF NOT EXISTS idx_green_star_initiatives_active ON public.green_star_initiatives(is_active);
CREATE INDEX IF NOT EXISTS idx_green_star_certifications_material_id ON public.green_star_certifications(material_id);
CREATE INDEX IF NOT EXISTS idx_unified_materials_green_star ON public.unified_materials(green_star_compliant);

-- Enable RLS on new tables
ALTER TABLE public.green_star_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_star_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_star_certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for green_star_projects
CREATE POLICY "Users can view their own Green Star projects"
  ON public.green_star_projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Green Star projects"
  ON public.green_star_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Green Star projects"
  ON public.green_star_projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Green Star projects"
  ON public.green_star_projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for initiatives (public read access)
CREATE POLICY "Anyone can view active Green Star initiatives"
  ON public.green_star_initiatives
  FOR SELECT
  USING (is_active = true);

-- Create RLS policies for certifications (public read access)
CREATE POLICY "Anyone can view Green Star certifications"
  ON public.green_star_certifications
  FOR SELECT
  USING (true);

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_green_star_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_green_star_projects_updated_at
    BEFORE UPDATE ON public.green_star_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_green_star_updated_at();

CREATE TRIGGER update_green_star_initiatives_updated_at
    BEFORE UPDATE ON public.green_star_initiatives
    FOR EACH ROW
    EXECUTE FUNCTION public.update_green_star_updated_at();

-- Insert sample Green Star initiatives from the provided data
INSERT INTO public.green_star_initiatives (initiative_id, initiative_name, rpv_score, categories, recognition_date, description) VALUES
('GBCA-001', 'Green Building Materials Certification', 85, 
 '[
   {
     "categoryName": "Responsible",
     "credits": [
       {"creditName": "Corporate Commitment on Climate", "achieved": true, "score": 3},
       {"creditName": "Environmental Management", "achieved": true, "score": 3},
       {"creditName": "Transparent Chain of Custody", "achieved": true, "score": 2}
     ],
     "categoryWeight": 0.25,
     "totalPossibleScore": 15,
     "achievedScore": 12
   }
 ]'::jsonb, 
 '2024-01-15', 'Comprehensive green building materials certification program'),

('CRADLE-002', 'Cradle to Cradle Certified', 92,
 '[
   {
     "categoryName": "Circular",
     "credits": [
       {"creditName": "Material Extraction Impact Reduction", "achieved": true, "score": 3},
       {"creditName": "Waste Generation Reduction", "achieved": true, "score": 3}
     ],
     "categoryWeight": 0.3,
     "totalPossibleScore": 12,
     "achievedScore": 11
   }
 ]'::jsonb,
 '2024-02-01', 'Leading circular economy certification for building products'),

('ENERGY-003', 'Energy Efficient Products Initiative', 78,
 '[
   {
     "categoryName": "Positive",
     "credits": [
       {"creditName": "Energy Use Reduction", "achieved": true, "score": 3},
       {"creditName": "Energy Source", "achieved": true, "score": 2}
     ],
     "categoryWeight": 0.2,
     "totalPossibleScore": 8,
     "achievedScore": 7
   }
 ]'::jsonb,
 '2024-03-10', 'Certification for energy-efficient building products and systems');
