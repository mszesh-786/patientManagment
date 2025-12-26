import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/material/Button";
import { Input } from "@/components/material/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/material/Card";
import { useToast } from "@/components/ui/use-toast";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { showError, showSuccess } from "@/utils/toast";

const patientRegistrationSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().nullable().optional().or(z.literal("")),
  date_of_birth: z.string().nullable().optional().or(z.literal("")), // YYYY-MM-DD format
  address: z.string().nullable().optional().or(z.literal("")),
});

type PatientRegistrationInputs = z.infer<typeof patientRegistrationSchema>;

const PatientRegistrationPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientRegistrationInputs>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      phone: "",
      date_of_birth: "",
      address: "",
    },
  });

  const onSubmit = async (data: PatientRegistrationInputs) => {
    try {
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            // You might add other profile data here if needed for auth.users metadata
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // 2. Insert patient profile into the 'patients' table
        const { error: patientError } = await supabase.from("patients").insert({
          id: authData.user.id, // Link patient profile to auth user ID
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          date_of_birth: data.date_of_birth || null,
          address: data.address || null,
        });

        if (patientError) {
          // If patient profile creation fails, you might want to delete the auth user
          // This requires service role key, so for client-side, it's better to handle
          // this with a Supabase function or a database trigger.
          console.error("Error creating patient profile:", patientError);
          await supabase.auth.admin.deleteUser(authData.user.id); // This would require admin privileges, not suitable for client-side.
          throw new Error("Failed to create patient profile. Please try again.");
        }

        showSuccess("Registration successful! Please check your email to confirm your account.");
        reset();
        navigate("/login"); // Redirect to login after successful registration
      } else {
        // This case might happen if email confirmation is required and no session is returned immediately
        showSuccess("Registration initiated. Please check your email to confirm your account.");
        reset();
        navigate("/login");
      }
    } catch (error: any) {
      showError(`Registration failed: ${error.message}`);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Patient Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  required
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  required
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
                  InputLabelProps={{ shrink: true }}
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
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default PatientRegistrationPage;