-- Migration SQL pour Life OS 2026
-- Source : Reality Map

-- 1. Tables de Domaines (LD01 - LD08)
CREATE TABLE IF NOT EXISTS ld01_business (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld02_finance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld03_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld04_cognition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld05_environment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld06_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld07_emotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ld08_purpose (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tables de Frameworks (FW)
CREATE TABLE IF NOT EXISTS fw_para (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fw_ikigai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fw_life_wheel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fw_12wy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fw_gtd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fw_deal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tables Système
CREATE TABLE IF NOT EXISTS sys_agent_veto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sys_shell_routing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    type TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for all tables (Optionnel)
ALTER PUBLICATION supabase_realtime ADD TABLE 
ld01_business, ld02_finance, ld03_health, ld04_cognition,
ld05_environment, ld06_relationships, ld07_emotions, ld08_purpose,
fw_para, fw_ikigai, fw_life_wheel, fw_12wy, fw_gtd, fw_deal,
sys_agent_veto, sys_shell_routing;
