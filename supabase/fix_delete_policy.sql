-- Add DELETE RLS policy for admins if it doesn't exist
-- Run this in your Supabase SQL Editor if the delete button still doesn't work

CREATE POLICY "Admins can delete submissions"
  ON public.golf_intake_forms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
