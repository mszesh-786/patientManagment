export interface Patient {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null; // ISO date string
  address: string | null;
  created_at: string;
}