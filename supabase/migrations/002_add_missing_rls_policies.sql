-- Allow students to update their own submissions.
-- Without this, the video_urls update after upload silently fails (0 rows updated, no error).
CREATE POLICY "Students can update their own submissions"
  ON public.golf_intake_forms FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage RLS: allow authenticated users to upload to swing-videos
CREATE POLICY "Authenticated users can upload to swing-videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'swing-videos');

-- Storage RLS: students can read files from their own submissions;
-- admins can read all files in the bucket.
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

CREATE POLICY "Admins can read all videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'swing-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Storage RLS: allow users to delete their own files (needed for submission deletion)
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

CREATE POLICY "Admins can delete all videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'swing-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );
