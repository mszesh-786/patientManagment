-- Create enums
CREATE TYPE public.staff_role AS ENUM ('admin', 'practitioner');
CREATE TYPE public.appointment_status AS ENUM ('booked', 'cancelled', 'completed', 'no_show');
CREATE TYPE public.reminder_channel AS ENUM ('email', 'sms');
CREATE TYPE public.reminder_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');

-- Create staff_profiles table
CREATE TABLE public.staff_profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    role public.staff_role NOT NULL DEFAULT 'practitioner',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.staff_profiles IS 'User profiles for clinic staff, linked to auth.users.';

-- Create patients table
CREATE TABLE public.patients (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    full_name text NOT NULL,
    email text,
    phone text,
    gdpr_consent boolean DEFAULT false NOT NULL,
    consent_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE public.patients IS 'Patient records with GDPR consent.';
CREATE INDEX patients_created_by_idx ON public.patients (created_by);

-- Create appointments table
CREATE TABLE public.appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    patient_id uuid REFERENCES public.patients ON DELETE CASCADE NOT NULL,
    practitioner_id uuid REFERENCES auth.users ON DELETE SET NULL,
    start_at timestamptz NOT NULL,
    end_at timestamptz NOT NULL,
    status public.appointment_status DEFAULT 'booked' NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    updated_by uuid REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE public.appointments IS 'Appointment scheduling records.';
CREATE INDEX appointments_patient_id_idx ON public.appointments (patient_id);
CREATE INDEX appointments_practitioner_id_idx ON public.appointments (practitioner_id);
CREATE INDEX appointments_start_at_idx ON public.appointments (start_at);

-- Create reminders table
CREATE TABLE public.reminders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    appointment_id uuid REFERENCES public.appointments ON DELETE CASCADE NOT NULL,
    channel public.reminder_channel NOT NULL,
    scheduled_for timestamptz NOT NULL,
    sent_at timestamptz,
    status public.reminder_status DEFAULT 'pending' NOT NULL,
    provider_message_id text,
    error text,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.reminders IS 'Automated appointment reminders.';
CREATE INDEX reminders_appointment_id_idx ON public.reminders (appointment_id);
CREATE INDEX reminders_scheduled_for_status_idx ON public.reminders (scheduled_for, status);

-- Create audit_log table
CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    actor_user_id uuid REFERENCES auth.users ON DELETE SET NULL,
    action text NOT NULL,
    patient_id uuid REFERENCES public.patients ON DELETE SET NULL,
    appointment_id uuid REFERENCES public.appointments ON DELETE SET NULL,
    metadata jsonb,
    created_at timestamptz DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.audit_log IS 'Audit trail for GDPR and security.';
CREATE INDEX audit_log_actor_user_id_idx ON public.audit_log (actor_user_id);
CREATE INDEX audit_log_patient_id_idx ON public.audit_log (patient_id);
CREATE INDEX audit_log_appointment_id_idx ON public.audit_log (appointment_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;