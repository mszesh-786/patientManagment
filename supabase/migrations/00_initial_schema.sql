-- Function to get the user's role from staff_profiles (moved here to ensure it's created first)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.staff_role AS $$
  SELECT role FROM public.staff_profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Create ENUM for staff roles
DO $$ BEGIN
  CREATE TYPE public.staff_role AS ENUM ('admin', 'practitioner');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create staff_profiles table
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role public.staff_role NOT NULL DEFAULT 'practitioner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff_profiles(id) ON DELETE CASCADE,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- e.g., 'scheduled', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  channel TEXT NOT NULL, -- e.g., 'email', 'sms'
  status TEXT NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  provider_message_id TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'LOGIN', 'PATIENT_CREATE', 'APPOINTMENT_UPDATE'
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON public.patients (full_name);
CREATE INDEX IF NOT EXISTS idx_appointments_start_at ON public.appointments (start_at);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_for_status ON public.reminders (scheduled_for, status);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log (created_at DESC);