import { useAuth } from "@/contexts/AuthContext";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/material/Card"; // New imports
import { Button } from "@/components/material/Button"; // New import

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
        <MadeWithDyad />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome to Clinic MVP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please log in to access the application.
            </p>
            <Button asChild to="/login">
              Go to Login
            </Button>
          </CardContent>
        </Card>
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4">
            Welcome, {profile?.full_name || user.email}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xl text-gray-700 dark:text-gray-300">
            You are logged in as a {profile?.role || "staff member"}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild to="/patients" size="lg">
              Manage Patients
            </Button>
            <Button asChild to="/calendar" size="lg">
              View Calendar
            </Button>
            {profile?.role === "admin" && (
              <Button asChild to="/audit" size="lg">
                View Audit Log
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Index;