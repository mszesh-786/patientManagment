import React from "react";
import { useAuth, StaffRole } from "@/contexts/AuthContext";

interface RoleGateProps {
  allowedRoles: StaffRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { role, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default RoleGate;