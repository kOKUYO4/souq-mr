-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('listings', 'listings', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read public images
CREATE POLICY "Public read listings images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

-- Allow authenticated uploads (we use service_role from API so this covers it)
CREATE POLICY "Service role upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listings');

CREATE POLICY "Service role delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listings');
