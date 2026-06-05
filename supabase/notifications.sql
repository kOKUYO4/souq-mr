CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL,
  type        text NOT NULL CHECK (type IN ('message','offer','order','review','system')),
  title       text NOT NULL DEFAULT '',
  title_ar    text NOT NULL DEFAULT '',
  body        text NOT NULL DEFAULT '',
  body_ar     text NOT NULL DEFAULT '',
  link        text,
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notif_user_idx ON public.notifications(user_id, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "notif_insert" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notif_update" ON public.notifications FOR UPDATE USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
