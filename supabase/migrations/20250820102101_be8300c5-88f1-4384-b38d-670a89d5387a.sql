-- Fix admin table RLS policy to prevent circular dependency and secure admin email access

-- Step 1: Create a security definer function to safely check admin status
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admins 
    WHERE email = (
      SELECT email 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );
$$;

-- Step 2: Drop the existing problematic RLS policy
DROP POLICY IF EXISTS "Only admins can access admin table" ON public.admins;

-- Step 3: Create new secure RLS policies using the security definer function
-- This prevents the circular dependency issue while maintaining security

-- Policy for viewing admin records (only by admins)
CREATE POLICY "Admins can view admin table"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_admin());

-- Policy for inserting admin records (only by admins)  
CREATE POLICY "Admins can insert admin records"
  ON public.admins
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_current_user_admin());

-- Policy for updating admin records (only by admins)
CREATE POLICY "Admins can update admin records"
  ON public.admins
  FOR UPDATE
  TO authenticated
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

-- Policy for deleting admin records (only by admins)
CREATE POLICY "Admins can delete admin records"
  ON public.admins
  FOR DELETE
  TO authenticated
  USING (public.is_current_user_admin());