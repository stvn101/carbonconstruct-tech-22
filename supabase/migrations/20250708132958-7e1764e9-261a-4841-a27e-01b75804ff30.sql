-- Create EPD Generator tables and storage setup

-- Create enum for EPD status
CREATE TYPE epd_status AS ENUM (
  'draft',
  'submitted_for_review', 
  'verified',
  'published',
  'archived'
);

-- Create enum for EPD lifecycle stages
CREATE TYPE epd_stage AS ENUM (
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
  'C1', 'C2', 'C3', 'C4',
  'D'
);

-- Create EPD records table
CREATE TABLE public.epd_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES public.unified_materials(id),
  company_id UUID,
  submitted_by UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Product information
  product_name TEXT NOT NULL,
  product_description TEXT,
  functional_unit TEXT NOT NULL DEFAULT '1 kg',
  manufacturer_name TEXT NOT NULL,
  manufacturer_location TEXT,
  manufacturer_abn TEXT,
  
  -- LCA data
  epd_stage_data JSONB NOT NULL DEFAULT '{}',
  total_co2e DOUBLE PRECISION,
  gwp_fossil DOUBLE PRECISION,
  gwp_biogenic DOUBLE PRECISION,
  gwp_total DOUBLE PRECISION,
  
  -- Metadata
  version_number INTEGER NOT NULL DEFAULT 1,
  status epd_status NOT NULL DEFAULT 'draft',
  iso_compliant BOOLEAN NOT NULL DEFAULT true,
  verification_status TEXT DEFAULT 'Not Third-Party Verified',
  data_sources JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create EPD stage emissions table for detailed tracking
CREATE TABLE public.epd_stage_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  epd_record_id UUID REFERENCES public.epd_records(id) ON DELETE CASCADE,
  stage epd_stage NOT NULL,
  co2e_value DOUBLE PRECISION NOT NULL,
  description TEXT,
  data_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on EPD tables
ALTER TABLE public.epd_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_stage_emissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for EPD records
CREATE POLICY "Users can view their own EPD records"
  ON public.epd_records
  FOR SELECT
  USING (submitted_by = auth.uid());

CREATE POLICY "Users can create EPD records"
  ON public.epd_records
  FOR INSERT
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Users can update their own draft EPD records"
  ON public.epd_records
  FOR UPDATE
  USING (submitted_by = auth.uid() AND status = 'draft');

-- Create RLS policies for EPD stage emissions
CREATE POLICY "Users can view their own EPD stage emissions"
  ON public.epd_stage_emissions
  FOR SELECT
  USING (
    epd_record_id IN (
      SELECT id FROM public.epd_records WHERE submitted_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own EPD stage emissions"
  ON public.epd_stage_emissions
  FOR ALL
  USING (
    epd_record_id IN (
      SELECT id FROM public.epd_records WHERE submitted_by = auth.uid()
    )
  );

-- Create function to update EPD updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_epd_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for EPD records
CREATE TRIGGER update_epd_records_updated_at
  BEFORE UPDATE ON public.epd_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_epd_updated_at();

-- Create storage bucket for EPD exports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'epd-exports',
  'epd-exports', 
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/json', 'text/csv']
);

-- Create storage policies for EPD exports
CREATE POLICY "Users can upload their own EPD exports"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'epd-exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own EPD exports"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'epd-exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own EPD exports"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'epd-exports' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );