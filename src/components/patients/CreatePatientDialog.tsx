"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/material/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/material/Dialog";
import { Input } from "@/components/material/Input";
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/types";

const patientFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional().or(z.literal("")),
  date_of_birth: z.string().nullable().optional().or(z.literal("")), // YYYY-MM-DD format
  address: z.string().nullable().optional().or(z.literal("")),
});

type PatientFormInputs = z.infer<typeof patientFormSchema>;

interface CreatePatientDialogProps {
  children: React.ReactNode;
}

const CreatePatientDialog: React.FC<CreatePatientDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { createPatient } = usePatients();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientFormInputs>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
    },
  });

  const onSubmit = async (data: PatientFormInputs) => {
    const newPatient: Omit<Patient, "id" | "created_at"> = {
      full_name: data.full_name,
      email: data.email || null,
      phone: data.phone || null,
      date_of_birth: data.date_of_birth || null,
      address: data.address || null,
    };
    createPatient(newPatient, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new patient.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Controller
            name="full_name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="full_name"
                label="Full Name"
                placeholder="John Doe"
                {...field}
                error={!!error}
                helperText={error?.message}
                required
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="phone"
                label="Phone"
                placeholder="123-456-7890"
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="date_of_birth"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="date_of_birth"
                label="Date of Birth"
                type="date"
                {...field}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }} // Ensures label is always shrunk for date input
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="address"
                label="Address"
                placeholder="123 Main St"
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePatientDialog;