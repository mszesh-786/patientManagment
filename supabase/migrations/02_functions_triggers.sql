-- Function to get the user's role from staff_profiles
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.staff_role AS $$
  SELECT role FROM public.staff_profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

-- Trigger to create a staff_profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff_profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update staff_profile when user email changes in auth.users
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.staff_profiles
    SET email = NEW.email
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

-- Trigger to create a reminder for new appointments
CREATE OR REPLACE FUNCTION public.create_appointment_reminders()
RETURNS TRIGGER AS $$
BEGIN
  -- Create an email reminder 24 hours before the appointment
  INSERT INTO public.reminders (appointment_id, scheduled_for, channel)
  VALUES (NEW.id, NEW.start_at - INTERVAL '24 hours', 'email');

  -- Optionally, create an SMS reminder 1 hour before the appointment
  -- INSERT INTO public.reminders (appointment_id, scheduled_for, channel)
  -- VALUES (NEW.id, NEW.start_at - INTERVAL '1 hour', 'sms');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_appointment_created ON public.appointments;
CREATE TRIGGER on_appointment_created
  AFTER INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.create_appointment_reminders();