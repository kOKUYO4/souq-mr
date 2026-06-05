-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  buyer_id      uuid NOT NULL,
  seller_id     uuid NOT NULL,
  driver_id     uuid,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','picked_up','en_route','delivered','cancelled')),
  amount        numeric(10,2) NOT NULL DEFAULT 0,
  address       text NOT NULL DEFAULT '',
  address_lat   float,
  address_lng   float,
  notes         text,
  tracking_code text UNIQUE NOT NULL DEFAULT upper(substring(gen_random_uuid()::text, 1, 8)),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update" ON public.orders FOR UPDATE USING (true);

-- Delivery locations table (driver GPS updates)
CREATE TABLE IF NOT EXISTS public.delivery_locations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id     uuid NOT NULL,
  lat           float NOT NULL,
  lng           float NOT NULL,
  heading       float,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "locations_select" ON public.delivery_locations FOR SELECT USING (true);
CREATE POLICY "locations_insert" ON public.delivery_locations FOR INSERT WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_locations;

-- Trigger updated_at for orders
DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
