-- Create golf_intake_forms table for student intake form submissions
CREATE TABLE IF NOT EXISTS public.golf_intake_forms (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  measurements JSONB NOT NULL DEFAULT '{}'::jsonb,
  movement_tests JSONB NOT NULL DEFAULT '{}'::jsonb,
  video_count JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending_review',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_golf_intake_forms_user_id ON public.golf_intake_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_golf_intake_forms_submitted_at ON public.golf_intake_forms(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_golf_intake_forms_status ON public.golf_intake_forms(status);

-- Enable Row Level Security
ALTER TABLE public.golf_intake_forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow students to see their own submissions
CREATE POLICY "Students can view their own submissions"
  ON public.golf_intake_forms FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy to allow admins to see all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.golf_intake_forms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create RLS policy to allow students to insert their own submissions
CREATE POLICY "Students can insert their own submissions"
  ON public.golf_intake_forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow admins to update submissions
CREATE POLICY "Admins can update submissions"
  ON public.golf_intake_forms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_golf_intake_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_golf_intake_forms_updated_at
  BEFORE UPDATE ON public.golf_intake_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_golf_intake_forms_updated_at();
