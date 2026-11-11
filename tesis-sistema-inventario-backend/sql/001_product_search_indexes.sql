-- Ejecutar manualmente sobre una copia de seguridad verificada y en una ventana de mantenimiento.
-- La regla de normalización depende del diccionario de unaccent: reconstruir los índices si cambia.
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE OR REPLACE FUNCTION public.inventory_search_normalize(text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
AS $$ SELECT lower(public.unaccent('public.unaccent', $1)) $$;
CREATE INDEX IF NOT EXISTS products_search_name_trgm ON products USING gin (public.inventory_search_normalize(name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_search_brand_trgm ON products USING gin (public.inventory_search_normalize(brand) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_search_model_trgm ON products USING gin (public.inventory_search_normalize(model) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_search_serial_trgm ON products USING gin (public.inventory_search_normalize(serial_number) gin_trgm_ops);
