"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/material/Button"; // Changed to Material UI Button
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/material/Dialog"; // Changed to Material UI Dialog components
import { Input } from "@/components/material/Input"; // Changed to Material UI Input
import { Label } from "@/components/material/Label"; // Changed to Material UI Label
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/types";
import { FormControl, FormHelperText } from "@mui/material"; // For Material UI form control and error messages

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

  const form = useForm<PatientFormInputs>({
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
        form.reset();
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormControl error={!!form.formState.errors.full_name}>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="John Doe"
              {...form.register("full_name")}
              helperText={form.formState.errors.full_name?.message}
            />
          </FormControl>
          <FormControl error={!!form.formState.errors.email}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...form.register("email")}
              helperText={form.formState.errors.email?.message}
            />
          </FormControl>
          <FormControl error={!!form.formState.errors.phone}>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="123-456-7890"
              {...form.register("phone")}
              helperText={form.formState.errors.phone?.message}
            />
          </FormControl>
          <FormControl error={!!form.formState.errors.date_of_birth}>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...form.register("date_of_birth")}
              helperText={form.formState.errors.date_of_birth?.message}
            />
          </FormControl>
          <FormControl error={!!form.formState.errors.address}>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              {...form.register("address")}
              helperText={form.formState.errors.address?.message}
            />
          </FormControl>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePatientDialog;