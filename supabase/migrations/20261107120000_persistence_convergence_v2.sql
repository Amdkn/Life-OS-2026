-- ============================================================
-- Persistence Convergence v2 — M4 Canonical Bootstrap
-- Adds complete replication contract columns to all LD/FW tables
-- Implements run_adr003_migration as a server RPC
-- ============================================================

-- 1. Add missing columns to LD tables (ld01_business through ld08_impact)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
        'ld05_relations', 'ld06_habitat', 'ld07_creativity', 'ld08_impact'
    ])
    LOOP
        -- user_id for tenant/user scoping
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE', t);

        -- type for table multiplexing (where needed)
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "type" TEXT', t);

        -- version for optimistic concurrency
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0', t);

        -- _deleted tombstone for soft deletes
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false', t);

        -- created_at for ordering
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()', t);

        -- updated_at for idempotency timestamp
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()', t);

        -- idempotency_key for deduplication
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "idempotency_key" UUID', t);

        -- RLS policies
        EXECUTE format('ALTER TABLE "public".%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "user_isolation" ON "public".%I', t);
        EXECUTE format('CREATE POLICY "user_isolation" ON "public".%I USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);

        -- Indexes for common queries
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_user_id ON "public".%I (user_id)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_type ON "public".%I (type)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_version ON "public".%I (version)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_updated_at ON "public".%I (updated_at)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_idempotency_key ON "public".%I (idempotency_key)', split_part(t, '_', 1), t);
    END LOOP;
END $$;

-- 2. Add missing columns to FW tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'fw_para', 'fw_ikigai', 'fw_life_wheel', 'fw_12wy', 'fw_gtd', 'fw_deal'
    ])
    LOOP
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "type" TEXT', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "idempotency_key" UUID', t);

        EXECUTE format('ALTER TABLE "public".%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "user_isolation" ON "public".%I', t);
        EXECUTE format('CREATE POLICY "user_isolation" ON "public".%I USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);

        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_user_id ON "public".%I (user_id)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_type ON "public".%I (type)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_version ON "public".%I (version)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_updated_at ON "public".%I (updated_at)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_idempotency_key ON "public".%I (idempotency_key)', split_part(t, '_', 1), t);
    END LOOP;
END $$;

-- 3. System tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['sys_agent_veto', 'sys_shell_routing'])
    LOOP
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "type" TEXT', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()', t);
        EXECUTE format('ALTER TABLE "public".%I ADD COLUMN IF NOT EXISTS "idempotency_key" UUID', t);

        EXECUTE format('ALTER TABLE "public".%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "user_isolation" ON "public".%I', t);
        EXECUTE format('CREATE POLICY "user_isolation" ON "public".%I USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())', t);

        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_user_id ON "public".%I (user_id)', split_part(t, '_', 1), t);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_version ON "public".%I (version)', split_part(t, '_', 1), t);
    END LOOP;
END $$;

-- 4. Create run_adr003_migration RPC function
-- This replaces the manual SQL script with a versioned, callable server function
CREATE OR REPLACE FUNCTION public.run_adr003_migration()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admiral_id UUID;
    total_migrated BIGINT := 0;
    rows_migrated BIGINT;
    table_name TEXT;
    migration_tables TEXT[] := ARRAY[
        'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
        'ld05_relations', 'ld06_habitat', 'ld07_creativity', 'ld08_impact',
        'fw_para', 'fw_ikigai', 'fw_life_wheel', 'fw_12wy', 'fw_gtd', 'fw_deal',
        'sys_agent_veto', 'sys_shell_routing'
    ];
    result JSONB := jsonb_build_object(
        'success', false,
        'admiral_id', null::text,
        'tables_updated', 0,
        'total_rows_migrated', 0,
        'error', null::text
    );
BEGIN
    -- Get the first user (Admiral) - this is a one-time bootstrap
    SELECT id INTO admiral_id
    FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;

    IF admiral_id IS NULL THEN
        result := result || jsonb_build_object('error', 'No users found. Sign up first, then run migration.');
        RETURN result;
    END IF;

    -- Migrate all tables: assign orphaned records (user_id IS NULL) to the Admiral
    FOREACH table_name IN ARRAY migration_tables
    LOOP
        EXECUTE format('UPDATE "public".%I SET user_id = $1, updated_at = NOW() WHERE user_id IS NULL', table_name)
        USING admiral_id;
        GET DIAGNOSTICS rows_migrated = ROW_COUNT;
        total_migrated := total_migrated + rows_migrated;
    END LOOP;

    result := result || jsonb_build_object(
        'success', true,
        'admiral_id', admiral_id::text,
        'tables_updated', array_length(migration_tables, 1),
        'total_rows_migrated', total_migrated
    );

    RETURN result;
END $$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.run_adr003_migration() TO authenticated;

-- 5. Create a validation function to check migration status
CREATE OR REPLACE FUNCTION public.validate_adr003_migration()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    table_name TEXT;
    orphan_count BIGINT;
    total_orphans BIGINT := 0;
    migration_tables TEXT[] := ARRAY[
        'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
        'ld05_relations', 'ld06_habitat', 'ld07_creativity', 'ld08_impact',
        'fw_para', 'fw_ikigai', 'fw_life_wheel', 'fw_12wy', 'fw_gtd', 'fw_deal',
        'sys_agent_veto', 'sys_shell_routing'
    ];
    orphan_counts JSONB := '{}'::jsonb;
BEGIN
    FOREACH table_name IN ARRAY migration_tables
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM "public".%I WHERE user_id IS NULL', table_name)
        INTO orphan_count;
        orphan_counts := orphan_counts || jsonb_build_object(table_name, orphan_count);
        total_orphans := total_orphans + orphan_count;
    END LOOP;

    RETURN jsonb_build_object(
        'valid', total_orphans = 0,
        'orphan_counts', orphan_counts,
        'total_orphans', total_orphans,
        'message', CASE
            WHEN total_orphans = 0 THEN 'Migration complete — 0 orphans'
            ELSE format('%s orphan records remain. Run run_adr003_migration().', total_orphans)
        END
    );
END $$;

GRANT EXECUTE ON FUNCTION public.validate_adr003_migration() TO authenticated;

-- 6. Update user_profiles table to match expected schema
ALTER TABLE "public"."user_profiles"
    ADD COLUMN IF NOT EXISTS "tenant_id" UUID,
    ADD COLUMN IF NOT EXISTS "settings" JSONB DEFAULT '{}'::jsonb;

-- 7. Ensure created_at/updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END $$;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'ld01_business', 'ld02_finance', 'ld03_health', 'ld04_cognition',
        'ld05_relations', 'ld06_habitat', 'ld07_creativity', 'ld08_impact',
        'fw_para', 'fw_ikigai', 'fw_life_wheel', 'fw_12wy', 'fw_gtd', 'fw_deal',
        'sys_agent_veto', 'sys_shell_routing'
    ])
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON "public".%I', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON "public".%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- 8. Create outbox table for server-side replication tracking
CREATE TABLE IF NOT EXISTS "public"."replication_outbox" (
    id BIGSERIAL PRIMARY KEY,
    idempotency_key UUID NOT NULL UNIQUE,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- 'upsert' | 'delete'
    payload JSONB NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    version BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'synced' | 'conflict' | 'error'
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

ALTER TABLE "public"."replication_outbox" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_isolation" ON "public"."replication_outbox";
CREATE POLICY "user_isolation" ON "public"."replication_outbox"
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_replication_outbox_user_status ON "public"."replication_outbox" (user_id, status);
CREATE INDEX IF NOT EXISTS idx_replication_outbox_idempotency ON "public"."replication_outbox" (idempotency_key);