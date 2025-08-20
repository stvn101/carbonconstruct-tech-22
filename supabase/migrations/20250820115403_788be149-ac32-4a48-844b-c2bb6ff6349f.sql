-- Security Fix 1: Force RLS on all user-data tables
ALTER TABLE public.admins FORCE ROW LEVEL SECURITY;
ALTER TABLE public.epd_claude_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.epd_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.epd_stage_emissions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;
ALTER TABLE public.verifiers FORCE ROW LEVEL SECURITY;

-- Security Fix 2: Harden is_current_user_admin function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admins 
    WHERE email = (
      SELECT email 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );
$function$;

-- Security Fix 3: Update RLS policies to use authenticated role instead of public
DROP POLICY IF EXISTS "Users can view their own Claude logs" ON public.epd_claude_logs;
CREATE POLICY "Users can view their own Claude logs" 
ON public.epd_claude_logs 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own Claude logs" ON public.epd_claude_logs;
CREATE POLICY "Users can create their own Claude logs" 
ON public.epd_claude_logs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own EPD records" ON public.epd_records;
CREATE POLICY "Users can view their own EPD records" 
ON public.epd_records 
FOR SELECT 
TO authenticated
USING (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Users can create their own EPD records" ON public.epd_records;
CREATE POLICY "Users can create their own EPD records" 
ON public.epd_records 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Users can update their own EPD records" ON public.epd_records;
CREATE POLICY "Users can update their own EPD records" 
ON public.epd_records 
FOR UPDATE 
TO authenticated
USING (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Users can view stage emissions for their EPDs" ON public.epd_stage_emissions;
CREATE POLICY "Users can view stage emissions for their EPDs" 
ON public.epd_stage_emissions 
FOR SELECT 
TO authenticated
USING (EXISTS ( SELECT 1
   FROM epd_records
  WHERE ((epd_records.id = epd_stage_emissions.epd_record_id) AND (epd_records.submitted_by = auth.uid()))));

DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Security Fix 4: Tighten verifiers table access
DROP POLICY IF EXISTS "Admins and verifiers can view verifiers" ON public.verifiers;

-- Admin policy: Only admins can view all verifiers
CREATE POLICY "Admins can view all verifiers" 
ON public.verifiers 
FOR SELECT 
TO authenticated
USING (public.is_current_user_admin());

-- Verifier self-access: Verifiers can only view their own record
CREATE POLICY "Verifiers can view their own record" 
ON public.verifiers 
FOR SELECT 
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Security Fix 5: Add missing policies for verifiers modifications
CREATE POLICY "Only admins can insert verifiers" 
ON public.verifiers 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Only admins can update verifiers" 
ON public.verifiers 
FOR UPDATE 
TO authenticated
USING (public.is_current_user_admin());

CREATE POLICY "Only admins can delete verifiers" 
ON public.verifiers 
FOR DELETE 
TO authenticated
USING (public.is_current_user_admin());