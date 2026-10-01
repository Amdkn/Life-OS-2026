-- Add version and _deleted columns to ld01_business
ALTER TABLE "public"."ld01_business" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld01_business" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld02_finance
ALTER TABLE "public"."ld02_finance" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld02_finance" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld03_health
ALTER TABLE "public"."ld03_health" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld03_health" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld04_cognition
ALTER TABLE "public"."ld04_cognition" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld04_cognition" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld05_relations
ALTER TABLE "public"."ld05_relations" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld05_relations" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld06_habitat
ALTER TABLE "public"."ld06_habitat" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld06_habitat" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld07_creativity
ALTER TABLE "public"."ld07_creativity" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld07_creativity" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;

-- Add version and _deleted columns to ld08_impact
ALTER TABLE "public"."ld08_impact" ADD COLUMN IF NOT EXISTS "version" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "public"."ld08_impact" ADD COLUMN IF NOT EXISTS "_deleted" BOOLEAN NOT NULL DEFAULT false;
