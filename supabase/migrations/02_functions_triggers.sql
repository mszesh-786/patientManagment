-- Function to update `updated_at` columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for staff_profiles updated_at
CREATE TRIGGER update_staff_profiles_updated_at
BEFORE UPDATE ON public.staff_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for appointments updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to set consent_at when gdpr_consent becomes true
CREATE OR REPLACE FUNCTION public.set_consent_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.gdpr_consent IS TRUE AND OLD.gdpr_consent IS DISTINCT FROM NEW.gdpr_consent THEN
        NEW.consent_at = now();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to set consent_at on patients table
CREATE TRIGGER set_patient_consent_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.set_consent_at();

-- Function to manage reminders on appointment changes
CREATE OR REPLACE FUNCTION public.manage_appointment_reminders()
RETURNS TRIGGER AS $$
DECLARE
    email_reminder_time timestamptz;
    sms_reminder_time timestamptz;
BEGIN
    -- Cancel existing pending reminders for this appointment
    UPDATE public.reminders
    SET status = 'cancelled'
    WHERE appointment_id = NEW.id AND status = 'pending';

    -- Only create new reminders if the appointment is 'booked'
    IF NEW.status = 'booked' THEN
        -- Email reminder 24 hours before start_at
        email_reminder_time := NEW.start_at - INTERVAL '24 hours';
        IF email_reminder_time > now() THEN
            INSERT INTO public.reminders (appointment_id, channel, scheduled_for, status)
            VALUES (NEW.id, 'email', email_reminder_time, 'pending');
        END IF;

        -- SMS reminder 2 hours before start_at (optional, can be enabled later)
        sms_reminder_time := NEW.start_at - INTERVAL '2 hours';
        IF sms_reminder_time > now() THEN
            INSERT INTO public.reminders (appointment_id, channel, scheduled_for, status)
            VALUES (NEW.id, 'sms', sms_reminder_time, 'pending');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to manage reminders after an appointment is inserted or updated
CREATE TRIGGER manage_reminders_on_appointment_change
AFTER INSERT OR UPDATE OF start_at, status ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.manage_appointment_reminders();

-- Function to create a staff profile for new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff_profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users inserts
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();