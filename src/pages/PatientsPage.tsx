"use client";

import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/material/Button"; // Changed to Material UI Button
import CreatePatientDialog from "@/components/patients/CreatePatientDialog";
import { format } from "date-fns";
import { logAudit } from "@/lib/audit";
import { showSuccess, showError } from "@/utils/toast";

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
  const { patients, isLoading, isError, error, createPatient } = usePatients();

  React.useEffect(() => {
    logAudit("PATIENT_VIEW");
  }, []);

  const generateDummyPatients = () => {
    const dummyData = [
      {
        full_name: "Alice Smith",
        email: "alice.smith@example.com",
        phone: "555-111-2222",
        date_of_birth: "1985-03-15",
        address: "123 Oak Ave",
      },
      {
        full_name: "Bob Johnson",
        email: "bob.j@example.com",
        phone: "555-333-4444",
        date_of_birth: "1992-07-22",
        address: "456 Pine St",
      },
      {
        full_name: "Charlie Brown",
        email: "charlie.b@example.com",
        phone: "555-555-6666",
        date_of_birth: "1978-11-01",
        address: "789 Maple Dr",
      },
    ];

    dummyData.forEach((patient) => {
      createPatient(patient, {
        onError: (err) => showError(`Failed to add dummy patient ${patient.full_name}: ${err.message}`),
      });
    });
    showSuccess("Generating dummy patients...");
  };

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
        <div className="flex space-x-4">
          <Button onClick={generateDummyPatients} variant="secondary">
            Generate Test Patients
          </Button>
          <CreatePatientDialog>
            <Button>Add New Patient</Button>
          </CreatePatientDialog>
        </div>
      </div>
      <DataTable columns={columns} data={patients || []} />
    </div>
  );
};

export default PatientsPage;