# 🗄️ Supabase Core — Life OS Persistence Layer

This directory contains the database schema, migrations, and local development configuration for the **A'Space Life OS**.

## 📊 Database Schema

The database is structured around the **Domain-Driven Design (DDD)** of the Life OS, with tables mirroring the 8 Life Domains (LD01-LD08) and the 6 Frameworks (FW).

### Core Tables
- **LD Tables**: `ld01_business`, `ld02_finance`, `ld03_health`, etc.
- **FW Tables**: `fw_para`, `fw_gtd`, `fw_ikigai`, etc.
- **System**: `sys_agent_veto`, `sys_shell_routing`.

## 🛠️ Management via Supabase CLI

This project uses the [Supabase CLI](https://supabase.com/docs/guides/cli) for local development and migrations.

### Commands
- **Initialize**: `supabase start`
- **Deploy Migrations**: `supabase db push`
- **Generate Types**: `supabase gen types typescript local > ../the-bridge-__-life-os/src/types/supabase.ts`
- **Studio Interface**: Accessible at [http://localhost:54323](http://localhost:54323) when started.

## 🚢 VPS Deployment
For Dokploy deployment:
1.  Use the `config.toml` as a reference.
2.  Seed data is available in `seed.sql`.
3.  Ensure the `POSTGRES_PASSWORD` is injected securely.

---
<p align="center"><i>Data Sovereignty — L0 Core</i></p>
