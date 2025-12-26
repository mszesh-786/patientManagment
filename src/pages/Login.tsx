import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/material/Button";
import { Input } from "@/components/material/Input";
import { Label } from "@/components/material/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/material/Card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { FormControl, FormHelperText } from "@mui/material";
import { showSuccess, showError } from "@/utils/toast"; // Import standardized toast functions

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      showError(error.message); // Use standardized error toast
    } else {
      showSuccess("Login Successful! Welcome back."); // Use standardized success toast
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Clinic MVP Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <Label htmlFor="email" required>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <Label htmlFor="password" required>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                  />
                </FormControl>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Login;