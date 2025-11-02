-- ============================================
-- Supabase Storage Setup for Blog Images (CORRETTO)
-- ============================================
-- 1. CREA IL BUCKET (se non esiste)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,  -- Pubblico per la lettura
  5242880,  -- 5MB limite
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RIMUOVI POLITICHE PRECEDENTI (per evitare duplicati)
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own blog images" ON storage.objects;

-- 3. PERMETTI AGLI UTENTI AUTENTICATI DI CARICARE FILE
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- 4. PERMETTI A TUTTI DI VISUALIZZARE (ACCESSO PUBBLICO)
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 5. PERMETTI AGLI UTENTI DI ELIMINARE SOLO I LORO FILE
CREATE POLICY "Users can delete own blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = auth.uid()::text
);

-- 6. PERMETTI AGLI UTENTI DI MODIFICARE SOLO I LORO FILE
CREATE POLICY "Users can update own blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND split_part(name, '/', 1) = auth.uid()::text
);

-- ============================================
-- ✅ FINE – Storage configurato correttamente!
-- ============================================
-- IMPORTANTE: I file devono essere salvati come:
--   /user_id/nome-file.jpg
-- Esempio:
--   f7aec5a7-f88b-4247-82ba-210b40c29884/photo1.png
-- ============================================
