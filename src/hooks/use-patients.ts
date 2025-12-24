"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Patient } from "@/types";
import { logAudit } from "@/lib/audit";
import { showSuccess, showError } from "@/utils/toast";

// Fetch all patients
const fetchPatients = async (): Promise<Patient[]> => {
  const { data, error } = await supabase.from("patients").select("*").order("full_name", { ascending: true });
  if (error) throw error;
  return data;
};

// Create a new patient
const createPatient = async (newPatient: Omit<Patient, "id" | "created_at">): Promise<Patient> => {
  const { data, error } = await supabase.from("patients").insert(newPatient).select().single();
  if (error) throw error;
  await logAudit("PATIENT_CREATE", { patient_id: data.id, metadata: newPatient });
  return data;
};

// Update an existing patient
const updatePatient = async (updatedPatient: Partial<Patient> & { id: string }): Promise<Patient> => {
  const { data, error } = await supabase.from("patients").update(updatedPatient).eq("id", updatedPatient.id).select().single();
  if (error) throw error;
  await logAudit("PATIENT_UPDATE", { patient_id: updatedPatient.id, metadata: updatedPatient });
  return data;
};

// Delete a patient
const deletePatient = async (id: string): Promise<void> => {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw error;
  await logAudit("PATIENT_UPDATE", { patient_id: id, metadata: { status: "deleted" } });
};

export const usePatients = () => {
  const queryClient = useQueryClient();

  const patientsQuery = useQuery<Patient[], Error>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const createPatientMutation = useMutation<Patient, Error, Omit<Patient, "id" | "created_at">>({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      showSuccess("Patient created successfully!");
    },
    onError: (error) => {
      showError(`Failed to create patient: ${error.message}`);
    },
  });

  const updatePatientMutation = useMutation<Patient, Error, Partial<Patient> & { id: string }>({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      showSuccess("Patient updated successfully!");
    },
    onError: (error) => {
      showError(`Failed to update patient: ${error.message}`);
    },
  });

  const deletePatientMutation = useMutation<void, Error, string>({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      showSuccess("Patient deleted successfully!");
    },
    onError: (error) => {
      showError(`Failed to delete patient: ${error.message}`);
    },
  });

  return {
    patients: patientsQuery.data,
    isLoading: patientsQuery.isLoading,
    isError: patientsQuery.isError,
    error: patientsQuery.error,
    createPatient: createPatientMutation.mutate,
    updatePatient: updatePatientMutation.mutate,
    deletePatient: deletePatientMutation.mutate,
  };
};