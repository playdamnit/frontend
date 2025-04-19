-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-images', 'game-images', true);

-- Set up storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() = owner AND
  (LOWER(storage.extension(name)) = 'png' OR
   LOWER(storage.extension(name)) = 'jpg' OR
   LOWER(storage.extension(name)) = 'jpeg' OR
   LOWER(storage.extension(name)) = 'gif' OR
   LOWER(storage.extension(name)) = 'webp')
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Set up storage policies for game-images
CREATE POLICY "Game images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'game-images');

CREATE POLICY "Authenticated users can upload game images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL AND
  (LOWER(storage.extension(name)) = 'png' OR
   LOWER(storage.extension(name)) = 'jpg' OR
   LOWER(storage.extension(name)) = 'jpeg' OR
   LOWER(storage.extension(name)) = 'gif' OR
   LOWER(storage.extension(name)) = 'webp')
);

CREATE POLICY "Authenticated users can update game images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete game images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL
);

