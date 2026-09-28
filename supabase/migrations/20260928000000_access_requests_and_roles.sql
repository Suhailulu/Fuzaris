-- Phase 1 & 2: Access Requests, Roles, and Expedition Assignments

-- 1. Update Profile Roles constraint
-- The existing profiles table has a check constraint for role IN ('ADMIN', 'EXPEDITION_MANAGER', 'STATION_OFFICER', 'VIEWER').
-- We need to drop that constraint and add a new one, or just alter the table to not restrict strictly since we have dynamic roles.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN (
    'Expedition Manager', 
    'Logistics Officer', 
    'Inventory & Asset Officer', 
    'Personnel Officer', 
    'Emergency Response Officer',
    'ADMIN',
    'PENDING'
));

-- Also add a status column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS designation TEXT;

-- 2. Access Requests Table
CREATE TABLE IF NOT EXISTS access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    organization TEXT NOT NULL,
    designation TEXT,
    requested_role TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Expedition Assignments
CREATE TABLE IF NOT EXISTS expedition_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    permissions JSONB,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, expedition_id)
);

-- RLS POLICIES FOR NEW TABLES

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedition_assignments ENABLE ROW LEVEL SECURITY;

-- Access Requests Policies:
-- Users can read their own requests.
CREATE POLICY access_requests_read_own ON access_requests 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- Managers can read all requests.
CREATE POLICY access_requests_read_all ON access_requests 
FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Expedition Manager', 'ADMIN')));

-- Users can insert their own requests.
CREATE POLICY access_requests_insert ON access_requests 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Managers can update requests.
CREATE POLICY access_requests_update ON access_requests 
FOR UPDATE TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Expedition Manager', 'ADMIN')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Expedition Manager', 'ADMIN')));

-- Expedition Assignments Policies:
-- Users can read their own assignments.
CREATE POLICY exp_assign_read_own ON expedition_assignments 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- Managers can read all assignments.
CREATE POLICY exp_assign_read_all ON expedition_assignments 
FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Expedition Manager', 'ADMIN')));

-- Managers can assign users.
CREATE POLICY exp_assign_insert ON expedition_assignments 
FOR INSERT TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Expedition Manager', 'ADMIN')));

CREATE POLICY exp_assign_update ON expedition_assignments 
FOR UPDATE TO authenticated 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Expedition Manager', 'ADMIN')));
