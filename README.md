# POLAR-IMS: Polar Operations Platform

An integrated operations platform for coordinating extreme environment missions, encompassing personnel, cargo, inventory, assets, and emergency response.

## Database Setup

This project uses Supabase / PostgreSQL for its backend.

1. **Create/open the Supabase project**
   Navigate to the Supabase dashboard and create a new project.

2. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in your Supabase connection strings:
   ```bash
   cp .env.example .env
   ```
   Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3. **Run/apply migrations**
   Apply the initial schema migration located in `supabase/migrations/20260927000000_initial_schema.sql` by running it in the Supabase SQL Editor.
   This will create all required tables: `organizations`, `profiles`, `expeditions`, `cargo`, `inventory_items`, `assets`, `personnel`, `alerts`, etc.
   It also sets up Row Level Security (RLS) automatically isolating data per organization.

4. **Apply seed data if required**
   (If you have a seed.sql file, run it in the SQL Editor to populate initial demo data.)

5. **Start the application**
   ```bash
   npm install
   npm run dev
   ```

## Architecture

- **Frontend**: React + Vite + TypeScript
- **State/API**: Real-time Supabase integrations via `src/lib/api.ts`
- **Auth**: Supabase Auth (integrated in `AuthContext.tsx`)
- **Map**: Leaflet + React Leaflet

## Database Schema Highlights
- **organizations & profiles**: Foundational auth and tenancy separation.
- **expeditions**: Tracking core mission details.
- **cargo / inventory / assets / personnel**: Core logistical entities, complete with movement and history tracking tables.
- **alerts & emergencies**: Critical operations tracking with associated tasks and resolutions.
