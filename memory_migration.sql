-- ============================================================
-- ADR-003 : Migration Continuité de la Mémoire
-- A'Space OS V1.0 — Life Core L1
-- Companion: Clara (Skill Forge)
-- EXÉCUTER UNE SEULE FOIS, APRÈS PREMIER SIGNUP
-- ============================================================

DO $$
DECLARE
  admiral_id UUID;
  total_migrated INTEGER := 0;
  rows_migrated INTEGER;
BEGIN
  -- 1. Récupérer l'Amiral (Premier compte créé)
  SELECT id INTO admiral_id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;

  IF admiral_id IS NULL THEN
    RAISE NOTICE '⚠️ Aucun utilisateur trouvé. Annulation de la migration.';
    RETURN;
  END IF;

  RAISE NOTICE '🚀 Migration des données vers l''Amiral : %', admiral_id;

  -- 2. Migrer les 16 tables
  UPDATE ld01_business SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld02_finance SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld03_health SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld04_cognition SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld05_environment SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld06_relationships SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld07_emotions SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE ld08_purpose SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  
  UPDATE fw_para SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE fw_ikigai SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE fw_life_wheel SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE fw_12wy SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE fw_gtd SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE fw_deal SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  
  UPDATE sys_agent_veto SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;
  UPDATE sys_shell_routing SET user_id = admiral_id WHERE user_id IS NULL; GET DIAGNOSTICS rows_migrated = ROW_COUNT; total_migrated := total_migrated + rows_migrated;

  RAISE NOTICE '✅ Migration terminée. Total enregistrements migrés : %', total_migrated;
END $$;
