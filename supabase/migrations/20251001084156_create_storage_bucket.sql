/*
  # Create Storage Bucket for Company Assets

  1. Storage
    - Create `company-assets` bucket for storing company logos
    - Set bucket to public for easy access
    - Add RLS policies for user file uploads
  
  2. Security
    - Users can upload files to their own folder
    - All files are publicly readable
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets' AND
    (storage.foldername(name))[1] = 'logos'
  );

CREATE POLICY "Anyone can view company logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'company-assets');

CREATE POLICY "Users can update their own logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'company-assets')
  WITH CHECK (bucket_id = 'company-assets');

CREATE POLICY "Users can delete their own logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'company-assets');
