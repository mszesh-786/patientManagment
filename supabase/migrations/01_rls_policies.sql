-- RLS for staff_profiles
CREATE POLICY "Staff can view their own profile" ON public.staff_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all staff profiles" ON public.staff_profiles FOR SELECT USING ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Staff can update their own profile" ON public.staff_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all staff profiles" ON public.staff_profiles FOR UPDATE USING ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin');

-- RLS for patients
CREATE POLICY "Admins can manage all patients" ON public.patients FOR ALL USING ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Practitioners can create patients" ON public.patients FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Practitioners can view patients with their appointments" ON public.patients FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.appointments
        WHERE appointments.patient_id = patients.id
        AND appointments.practitioner_id = auth.uid()
    ) OR ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin')
);
CREATE POLICY "Practitioners can update patients with their appointments" ON public.patients FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.appointments
        WHERE appointments.patient_id = patients.id
        AND appointments.practitioner_id = auth.uid()
    ) OR ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin')
);

-- RLS for appointments
CREATE POLICY "Admins can manage all appointments" ON public.appointments FOR ALL USING ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Practitioners can manage their own appointments" ON public.appointments FOR ALL USING (auth.uid() = practitioner_id);

-- RLS for reminders
CREATE POLICY "Admins can view all reminders" ON public.reminders FOR SELECT USING ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Practitioners can view reminders for their appointments" ON public.reminders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.appointments
        WHERE appointments.id = reminders.appointment_id
        AND appointments.practitioner_id = auth.uid()
    )
);
-- Edge function will use service role to update reminders, so no RLS for update/insert/delete needed for authenticated users.

-- RLS for audit_log
CREATE POLICY "Admins can view all audit logs" ON public.audit_log FOR SELECT USING ((SELECT role FROM public.staff_profiles WHERE id = auth.uid()) = 'admin');
-- Deny practitioners from viewing audit logs for enhanced security.
CREATE POLICY "Practitioners cannot view audit logs" ON public.audit_log FOR SELECT WITH CHECK (false);
-- Allow authenticated users to insert audit logs (e.g., from edge functions or specific app actions)
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_log FOR INSERT WITH CHECK (auth.role() = 'authenticated');