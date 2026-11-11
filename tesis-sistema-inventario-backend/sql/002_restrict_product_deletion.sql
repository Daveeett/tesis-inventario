-- Ejecutar en mantenimiento tras respaldo; preserva el historial existente.
DO $$
DECLARE fk record;
BEGIN
  FOR fk IN SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.inventory_movements'::regclass
      AND confrelid = 'public.products'::regclass AND contype = 'f'
  LOOP
    EXECUTE format('ALTER TABLE public.inventory_movements DROP CONSTRAINT %I', fk.conname);
  END LOOP;
  ALTER TABLE public.inventory_movements ADD CONSTRAINT inventory_movements_product_restrict
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;
END $$;
