
-- Add EPD hash field and verifier role support
ALTER TABLE epd_records ADD COLUMN IF NOT EXISTS epd_hash TEXT;
ALTER TABLE epd_records ADD COLUMN IF NOT EXISTS verified_by TEXT;

-- Create verifiers table for role-based access
CREATE TABLE IF NOT EXISTS verifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on verifiers table
ALTER TABLE verifiers ENABLE ROW LEVEL SECURITY;

-- Create policy for verifiers to view their own records
CREATE POLICY "Verifiers can view verifier records" ON verifiers
FOR SELECT USING (true);

-- Insert default verifier
INSERT INTO verifiers (email, name) VALUES 
('verifier@carbonconstruct.com.au', 'CarbonConstruct Verifier')
ON CONFLICT (email) DO NOTHING;

-- Create EPD verification history table
CREATE TABLE IF NOT EXISTS epd_verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epd_record_id UUID REFERENCES epd_records(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'submitted', 'approved', 'rejected'
  verified_by TEXT,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on verification history
ALTER TABLE epd_verification_history ENABLE ROW LEVEL SECURITY;

-- Create policy for verification history
CREATE POLICY "Anyone can view verification history" ON epd_verification_history
FOR SELECT USING (true);

-- Create trigger for auto-updating EPD updated_at
CREATE OR REPLACE FUNCTION update_epd_verification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to epd_records
DROP TRIGGER IF EXISTS update_epd_verification_updated_at ON epd_records;
CREATE TRIGGER update_epd_verification_updated_at
  BEFORE UPDATE ON epd_records
  FOR EACH ROW
  EXECUTE FUNCTION update_epd_verification_timestamp();
