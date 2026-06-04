-- ============================================================
-- SOUQ.MR — Schéma Supabase complet
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- recherche full-text rapide

-- ============================================================
-- 1. UTILISATEURS (profiles)
-- Étend auth.users de Supabase Auth
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  phone         text unique not null,
  name          text not null default '',
  name_ar       text not null default '',
  avatar        text,
  badge         text not null default 'regular' check (badge in ('regular','verified','pro')),
  bio           text,
  bio_ar        text,
  rating        numeric(3,2) not null default 0,
  reviews_count int not null default 0,
  listings_count int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index téléphone (connexion OTP)
create index if not exists profiles_phone_idx on public.profiles(phone);

-- RLS : chaque utilisateur voit son profil + profils publics
alter table public.profiles enable row level security;

create policy "Profils publics visibles par tous"
  on public.profiles for select using (is_active = true);

create policy "Utilisateur modifie son propre profil"
  on public.profiles for update using (auth.uid() = id);

create policy "Insertion du profil à la création du compte"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================================
-- 2. ANNONCES (listings)
-- ============================================================
create table if not exists public.listings (
  id            uuid primary key default uuid_generate_v4(),
  seller_id     uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  title_ar      text not null default '',
  description   text,
  description_ar text,
  price         numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2),
  category      text not null,
  subcategory   text,
  condition     text not null default 'used' check (condition in ('new','used','tbh')),
  location      text not null default 'Nouakchott',
  location_ar   text not null default 'نواكشوط',
  latitude      double precision,
  longitude     double precision,
  images        text[] not null default '{}',
  negotiable    boolean not null default true,
  cod           boolean not null default false,  -- paiement à la livraison
  featured      boolean not null default false,
  status        text not null default 'active' check (status in ('active','sold','paused','deleted')),
  views         int not null default 0,
  attributes    jsonb default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index performance
create index if not exists listings_seller_idx   on public.listings(seller_id);
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_status_idx   on public.listings(status);
create index if not exists listings_price_idx    on public.listings(price);
create index if not exists listings_created_idx  on public.listings(created_at desc);
create index if not exists listings_featured_idx on public.listings(featured) where featured = true;
-- Recherche full-text FR + AR
create index if not exists listings_search_idx   on public.listings using gin(
  (to_tsvector('french', coalesce(title,'') || ' ' || coalesce(description,'')))
);
create index if not exists listings_trgm_idx     on public.listings using gin(title gin_trgm_ops);

-- RLS
alter table public.listings enable row level security;

create policy "Annonces actives visibles par tous"
  on public.listings for select using (status = 'active');

create policy "Vendeur voit toutes ses annonces"
  on public.listings for select using (auth.uid() = seller_id);

create policy "Vendeur crée ses annonces"
  on public.listings for insert with check (auth.uid() = seller_id);

create policy "Vendeur modifie ses annonces"
  on public.listings for update using (auth.uid() = seller_id);

create policy "Vendeur supprime ses annonces"
  on public.listings for delete using (auth.uid() = seller_id);

-- ============================================================
-- 3. MESSAGES (conversations)
-- ============================================================
create table if not exists public.conversations (
  id            uuid primary key default uuid_generate_v4(),
  listing_id    uuid references public.listings(id) on delete set null,
  buyer_id      uuid not null references public.profiles(id) on delete cascade,
  seller_id     uuid not null references public.profiles(id) on delete cascade,
  last_message  text,
  last_at       timestamptz default now(),
  buyer_unread  int not null default 0,
  seller_unread int not null default 0,
  created_at    timestamptz not null default now(),
  unique(listing_id, buyer_id, seller_id)
);

create index if not exists conv_buyer_idx  on public.conversations(buyer_id, last_at desc);
create index if not exists conv_seller_idx on public.conversations(seller_id, last_at desc);

alter table public.conversations enable row level security;

create policy "Participants voient leur conversation"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Acheteur crée une conversation"
  on public.conversations for insert with check (auth.uid() = buyer_id);

create policy "Participants mettent à jour la conversation"
  on public.conversations for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);


create table if not exists public.messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  text            text not null check (length(text) between 1 and 4000),
  image_url       text,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conv_idx on public.messages(conversation_id, created_at);

alter table public.messages enable row level security;

create policy "Participants voient les messages"
  on public.messages for select
  using (
    auth.uid() in (
      select buyer_id  from public.conversations where id = conversation_id
      union
      select seller_id from public.conversations where id = conversation_id
    )
  );

create policy "Participants envoient des messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    auth.uid() in (
      select buyer_id  from public.conversations where id = conversation_id
      union
      select seller_id from public.conversations where id = conversation_id
    )
  );

-- ============================================================
-- 4. FAVORIS (favorites)
-- ============================================================
create table if not exists public.favorites (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, listing_id)
);

create index if not exists favorites_user_idx on public.favorites(user_id, created_at desc);

alter table public.favorites enable row level security;

create policy "Utilisateur voit ses favoris"
  on public.favorites for select using (auth.uid() = user_id);

create policy "Utilisateur ajoute un favori"
  on public.favorites for insert with check (auth.uid() = user_id);

create policy "Utilisateur supprime un favori"
  on public.favorites for delete using (auth.uid() = user_id);

-- ============================================================
-- 5. OFFRES / NÉGOCIATION (offers)
-- ============================================================
create table if not exists public.offers (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  buyer_id    uuid not null references public.profiles(id) on delete cascade,
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  amount      numeric(12,2) not null check (amount > 0),
  status      text not null default 'pending'
                check (status in ('pending','accepted','declined','countered','expired')),
  counter_amount numeric(12,2),
  message     text,
  expires_at  timestamptz not null default (now() + interval '48 hours'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists offers_listing_idx on public.offers(listing_id);
create index if not exists offers_buyer_idx   on public.offers(buyer_id, created_at desc);
create index if not exists offers_seller_idx  on public.offers(seller_id, created_at desc);

alter table public.offers enable row level security;

create policy "Participants voient leurs offres"
  on public.offers for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Acheteur crée une offre"
  on public.offers for insert with check (auth.uid() = buyer_id);

create policy "Participants mettent à jour l'offre"
  on public.offers for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- ============================================================
-- 6. AVIS (reviews)
-- ============================================================
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid references public.listings(id) on delete set null,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  comment_ar  text,
  created_at  timestamptz not null default now(),
  unique(reviewer_id, listing_id) -- un avis par transaction
);

create index if not exists reviews_seller_idx on public.reviews(seller_id, created_at desc);

alter table public.reviews enable row level security;

create policy "Avis publics visibles par tous"
  on public.reviews for select using (true);

create policy "Utilisateur laisse un avis"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

-- ============================================================
-- 7. ALERTES PRIX (price_alerts)
-- ============================================================
create table if not exists public.price_alerts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  keyword     text not null,
  category    text,
  max_price   numeric(12,2),
  frequency   text not null default 'daily' check (frequency in ('instant','daily','weekly')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.price_alerts enable row level security;

create policy "Utilisateur gère ses alertes"
  on public.price_alerts for all using (auth.uid() = user_id);

-- ============================================================
-- 8. TRIGGERS — updated_at automatique
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger trg_offers_updated_at
  before update on public.offers
  for each row execute function public.set_updated_at();

-- ============================================================
-- 9. TRIGGER — créer le profil automatiquement à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, phone, name)
  values (
    new.id,
    coalesce(new.phone, new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'name', 'Utilisateur SOUQ.MR')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

create or replace trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 10. FONCTION — incrémenter les vues d'une annonce
-- ============================================================
create or replace function public.increment_listing_views(listing_uuid uuid)
returns void language sql security definer as $$
  update public.listings set views = views + 1 where id = listing_uuid;
$$;

-- ============================================================
-- 11. REALTIME — activer pour messages et conversations
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.notifications;

-- ============================================================
-- Tables créées :
--   profiles, listings, conversations, messages,
--   favorites, offers, reviews, price_alerts
-- ============================================================
