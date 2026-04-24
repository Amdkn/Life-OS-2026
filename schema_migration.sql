-- ============================================================
-- A'Space OS V1.0 - Auth Strategy Migration
-- Layer: Persistence (L1)
-- Companion: Rory (Sentinel)
-- ============================================================

-- 1. Ajouter user_id sur toutes les tables LD et FW
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'ld01_business','ld02_finance','ld03_health','ld04_cognition',
        'ld05_environment','ld06_relationships','ld07_emotions','ld08_purpose',
        'fw_para','fw_ikigai','fw_life_wheel','fw_12wy','fw_gtd','fw_deal',
        'sys_agent_veto','sys_shell_routing'
    ])
    LOOP
        -- Ajouter la colonne user_id si elle n'existe pas
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE', t);
        
        -- Activer RLS
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        
        -- Supprimer l'ancienne policy si elle existe
        EXECUTE format('DROP POLICY IF EXISTS "user_isolation" ON %I', t);
        
        -- Créer la nouvelle policy d'isolation par utilisateur
        EXECUTE format('CREATE POLICY "user_isolation" ON %I USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);
    END LOOP;
END $$;

-- 2. Création de la table profil utilisateur
CREATE TABLE IF NOT EXISTS user_profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  settings     JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_own_profile" ON user_profiles;
CREATE POLICY "user_own_profile" ON user_profiles
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 3. Trigger pour la création automatique du profil au signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
