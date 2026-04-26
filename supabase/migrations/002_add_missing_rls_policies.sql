-- Idempotent: drop each policy before recreating so this migration can be re-run safely.

-- golf_intake_forms: allow students to update their own submissions.
-- Without this, the video_urls update after upload silently fails (0 rows updated, no error).
DROP POLICY IF EXISTS "Students can update their own submissions" ON public.golf_intake_forms;
CREATE POLICY "Students can update their own submissions"
  ON public.golf_intake_forms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage: allow authenticated users to upload to swing-videos
DROP POLICY IF EXISTS "Authenticated users can upload to swing-videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload to swing-videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'swing-videos');

-- Storage: students can read files from their own submissions
DROP POLICY IF EXISTS "Students can read own videos" ON storage.objects;
CREATE POLICY "Students can read own videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'swing-videos' AND (
      (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.golf_intake_forms WHERE user_id = auth.uid()
      )
    )
  );

-- Storage: admins can read all videos
DROP POLICY IF EXISTS "Admins can read all videos" ON storage.objects;
CREATE POLICY "Admins can read all videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'swing-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Storage: students can delete their own files (needed for submission deletion)
DROP POLICY IF EXISTS "Students can delete own videos" ON storage.objects;
CREATE POLICY "Students can delete own videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'swing-videos' AND (
      (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.golf_intake_forms WHERE user_id = auth.uid()
      )
    )
  );

-- Storage: admins can delete all videos
DROP POLICY IF EXISTS "Admins can delete all videos" ON storage.objects;
CREATE POLICY "Admins can delete all videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'swing-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );
