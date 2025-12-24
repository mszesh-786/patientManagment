import { supabase } from "@/lib/supabase";

type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "PATIENT_VIEW"
  | "PATIENT_CREATE"
  | "PATIENT_UPDATE"
  | "APPOINTMENT_VIEW"
  | "APPOINTMENT_CREATE"
  | "APPOINTMENT_UPDATE"
  | "APPOINTMENT_CANCEL"
  | "STAFF_PROFILE_VIEW"
  | "STAFF_PROFILE_UPDATE"
  | "AUDIT_LOG_VIEW";

interface AuditPayload {
  patient_id?: string;
  appointment_id?: string;
  metadata?: Record<string, any>;
}

export async function logAudit(action: AuditAction, payload: AuditPayload = {}) {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("audit_log").insert({
    actor_user_id: user?.id,
    action: action,
    patient_id: payload.patient_id,
    appointment_id: payload.appointment_id,
    metadata: payload.metadata,
  });

  if (error) {
    console.error("Error logging audit event:", error);
  }
}