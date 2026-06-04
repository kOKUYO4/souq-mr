-- ============================================================
-- SOUQ.MR — Migration correctrice
-- À exécuter dans Supabase Dashboard > SQL Editor
--
-- Problème : la table profiles référence auth.users(id) mais
-- notre auth OTP custom ne crée pas d'entrée dans auth.users.
-- Le trigger handle_new_user ne se déclenche jamais.
-- Solution : supprimer la FK vers auth.users + corriger les RLS
--            pour permettre l'upsert via service_role.
-- ============================================================

-- 1. Recréer profiles SANS la FK vers auth.users
-- (si la table existe déjà avec la mauvaise contrainte)
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

-- Index téléphone
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON public.profiles(phone);

-- 2. RLS — activer
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lecture : profils actifs visibles par tous (y compris anonyme)
CREATE POLICY "Profils publics lisibles"
  ON public.profiles FOR SELECT
  USING (is_active = true);

-- Écriture : le service_role (backend) peut tout faire — pas de restriction
-- (le RLS ne s'applique pas au service_role par défaut dans Supabase)
-- Les lignes ci-dessous sont optionnelles mais explicites :
CREATE POLICY "Service role peut insérer"
  ON public.profiles FOR INSERT
  WITH CHECK (true);  -- service_role bypass RLS de toute façon

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

-- 4. Vérifier que la table listings référence bien profiles (pas auth.users)
-- Si listings a été créée avant ce fix :
ALTER TABLE IF EXISTS public.listings
  DROP CONSTRAINT IF EXISTS listings_seller_id_fkey;

ALTER TABLE IF EXISTS public.listings
  ADD CONSTRAINT listings_seller_id_fkey
  FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ============================================================
-- Test de vérification (doit retourner des données) :
-- SELECT * FROM public.profiles LIMIT 5;
-- ============================================================
