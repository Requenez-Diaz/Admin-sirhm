-- ============================================
-- POLÍTICAS DE SUPABASE STORAGE
-- ============================================
-- Ejecuta este script en: Supabase Dashboard > SQL Editor
-- 
-- Esto permitirá:
-- 1. Subir archivos (INSERT)
-- 2. Leer archivos públicos (SELECT)
-- 3. Eliminar archivos propios (DELETE)
-- ============================================

-- 1. Permitir a cualquier usuario autenticado SUBIR archivos
CREATE POLICY "Usuarios autenticados pueden subir archivos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 2. Permitir a TODOS (público) LEER archivos
CREATE POLICY "Archivos públicos son visibles para todos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- 3. Permitir a usuarios autenticados ELIMINAR sus propios archivos
CREATE POLICY "Usuarios pueden eliminar sus propios archivos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = owner);

-- ============================================
-- OPCIONAL: Política más permisiva para desarrollo
-- ============================================
-- Si necesitas permitir subidas sin autenticación (para testing):

-- CREATE POLICY "Permitir subidas públicas (solo desarrollo)"
-- ON storage.objects
-- FOR INSERT
-- TO public
-- WITH CHECK (bucket_id = 'images');