"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form"; // Import Controller
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
import { Label } from "@/components/material/Label";
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/types";
import { FormControl, FormHelperText } from "@mui/material";

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
    control, // Get control from useForm
    formState: { errors, isSubmitting },
    reset, // Get reset from useForm
  } = useForm<PatientFormInputs>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: { // Add default values for controlled components
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
        reset(); // Reset form fields on success
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
              <FormControl fullWidth error={!!error}>
                <Label htmlFor="full_name" required>Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                />
              </FormControl>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                />
              </FormControl>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="123-456-7890"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                />
              </FormControl>
            )}
          />
          <Controller
            name="date_of_birth"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                />
              </FormControl>
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                />
              </FormControl>
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