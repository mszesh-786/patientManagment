"use client";

import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import CreatePatientDialog from "@/components/patients/CreatePatientDialog";
import { format } from "date-fns";
import { logAudit } from "@/lib/audit";

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = row.getValue("date_of_birth") as string;
      return date ? format(new Date(date), "PPP") : "N/A";
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return format(new Date(date), "PPP p");
    },
  },
];

const PatientsPage: React.FC = () => {
  const { patients, isLoading, isError, error } = usePatients();

  React.useEffect(() => {
    logAudit("PATIENT_VIEW");
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading patients...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <h1 className="text-4xl font-bold mb-4 text-destructive">Error</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Failed to load patients: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <CreatePatientDialog>
          <Button>Add New Patient</Button>
        </CreatePatientDialog>
      </div>
      <DataTable columns={columns} data={patients || []} />
    </div>
  );
};

export default PatientsPage;