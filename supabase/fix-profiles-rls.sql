-- ============================================================
-- SOUQ.MR — Migration correctrice (profiles uniquement)
-- À exécuter dans Supabase Dashboard > SQL Editor
--
-- Problème : la table profiles référence auth.users(id) mais
-- notre auth OTP custom ne crée pas d'entrée dans auth.users.
-- Solution : recréer profiles SANS la FK vers auth.users.
-- ============================================================

-- 1. Recréer profiles SANS la FK vers auth.users
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         text UNIQUE NOT NULL,
  name          text NOT NULL DEFAULT '',
  name_ar       text NOT NULL DEFAULT '',
  avatar        text,
  badge         text NOT NULL DEFAULT 'regular' CHECK (badge IN ('regular','verified','pro')),
  bio           text,
  bio_ar        text,
  rating        numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0,
  listings_count int NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_phone_idx ON public.profiles(phone);

-- 2. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profils publics lisibles"
  ON public.profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role peut insérer"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role peut modifier"
  ON public.profiles FOR UPDATE
  USING (true);

-- 3. Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN new.updated_at = now(); RETURN new; END; $$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Vérification :
-- SELECT count(*) FROM public.profiles;
-- ============================================================
