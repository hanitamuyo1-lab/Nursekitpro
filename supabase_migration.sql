-- ============================================================
-- Confident RN — Supabase migration
-- Run this once in your Supabase dashboard → SQL Editor
-- ============================================================

-- 1. Profiles table (one row per user, auto-created on signup)
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT,
  full_name        TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free'
                   CHECK (subscription_tier IN ('free', 'pro', 'lifetime')),
  subscription_start TIMESTAMPTZ,
  subscription_end   TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row-level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service-role can do everything (needed for the trigger + admin upgrades)
CREATE POLICY "Service role full access"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Updated_at auto-refresh
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- To manually upgrade a user to Pro or Lifetime:
--
--   UPDATE public.profiles
--   SET subscription_tier = 'pro',         -- or 'lifetime'
--       subscription_start = NOW(),
--       subscription_end = NOW() + INTERVAL '1 month'  -- omit for lifetime
--   WHERE email = 'user@example.com';
--
-- ============================================================
