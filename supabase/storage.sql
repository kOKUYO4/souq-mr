-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('listings', 'listings', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read public images
DROP POLICY IF EXISTS "Public read listings images" ON storage.objects;
CREATE POLICY "Public read listings images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

-- Allow authenticated uploads
DROP POLICY IF EXISTS "Service role upload" ON storage.objects;
CREATE POLICY "Service role upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listings');

DROP POLICY IF EXISTS "Service role delete" ON storage.objects;
CREATE POLICY "Service role delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listings');
