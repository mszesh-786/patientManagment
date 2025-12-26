-- Enable Row Level Security (RLS) for all relevant tables
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Staff Profiles RLS Policies
-- Admins can manage all staff profiles
DROP POLICY IF EXISTS "Admins can manage all staff profiles" ON public.staff_profiles;
CREATE POLICY "Admins can manage all staff profiles" ON public.staff_profiles
  FOR ALL USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');

-- Practitioners can view and update their own profile
DROP POLICY IF EXISTS "Practitioners can view and update their own profile" ON public.staff_profiles;
CREATE POLICY "Practitioners can view and update their own profile" ON public.staff_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Practitioners can update their own profile" ON public.staff_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Patients RLS Policies
-- Staff (admin/practitioner) can view all patients
DROP POLICY IF EXISTS "Staff can view all patients" ON public.patients;
CREATE POLICY "Staff can view all patients" ON public.patients
  FOR SELECT USING (public.get_user_role() IN ('admin', 'practitioner'));

-- Staff can create patients
DROP POLICY IF EXISTS "Staff can create patients" ON public.patients;
CREATE POLICY "Staff can create patients" ON public.patients
  FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'practitioner'));

-- Staff can update patients
DROP POLICY IF EXISTS "Staff can update patients" ON public.patients;
CREATE POLICY "Staff can update patients" ON public.patients
  FOR UPDATE USING (public.get_user_role() IN ('admin', 'practitioner'))
  WITH CHECK (public.get_user_role() IN ('admin', 'practitioner'));

-- Admins can delete patients
DROP POLICY IF EXISTS "Admins can delete patients" ON public.patients;
CREATE POLICY "Admins can delete patients" ON public.patients
  FOR DELETE USING (public.get_user_role() = 'admin');

-- Appointments RLS Policies
-- Admins can manage all appointments
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
CREATE POLICY "Admins can manage all appointments" ON public.appointments
  FOR ALL USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');

-- Practitioners can view their own appointments
DROP POLICY IF EXISTS "Practitioners can view their own appointments" ON public.appointments;
CREATE POLICY "Practitioners can view their own appointments" ON public.appointments
  FOR SELECT USING (public.get_user_role() = 'practitioner' AND staff_id = auth.uid());

-- Practitioners can create/update their own appointments
DROP POLICY IF EXISTS "Practitioners can create/update their own appointments" ON public.appointments;
CREATE POLICY "Practitioners can create/update their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (public.get_user_role() = 'practitioner' AND staff_id = auth.uid());
CREATE POLICY "Practitioners can update their own appointments" ON public.appointments
  FOR UPDATE USING (public.get_user_role() = 'practitioner' AND staff_id = auth.uid())
  WITH CHECK (public.get_user_role() = 'practitioner' AND staff_id = auth.uid());

-- Reminders RLS Policies
-- Admins can manage all reminders
DROP POLICY IF EXISTS "Admins can manage all reminders" ON public.reminders;
CREATE POLICY "Admins can manage all reminders" ON public.reminders
  FOR ALL USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');

-- Practitioners can view reminders for their appointments
DROP POLICY IF EXISTS "Practitioners can view reminders for their appointments" ON public.reminders;
CREATE POLICY "Practitioners can view reminders for their appointments" ON public.reminders
  FOR SELECT USING (
    public.get_user_role() = 'practitioner' AND
    EXISTS (SELECT 1 FROM public.appointments WHERE id = appointment_id AND staff_id = auth.uid())
  );

-- Audit Log RLS Policies
-- Only Admins can view audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_log;
CREATE POLICY "Admins can view audit logs" ON public.audit_log
  FOR SELECT USING (public.get_user_role() = 'admin');
-- Audit logs are inserted by the system, not directly by users, so no INSERT/UPDATE/DELETE policies are needed for users.